from fastapi import Body, FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from config import client #used from config.py
from rembg import remove
import base64
import os, uuid
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch

clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

CLOTHING_LABELS = [
    "white t-shirt", "black t-shirt", "pink t-shirt",
    "blue jeans", "black jeans", "grey jeans",
    "hoodie", "sweatshirt", "jacket", "shirt", "white shirt"
]

# clip backend code to analyse images
def classify_image_clip(image_path):
    image = Image.open(image_path)

    inputs = clip_processor(
        text = CLOTHING_LABELS,
        images = image,
        return_tensors = "pt",
        padding = True
    )

    outputs = clip_model (**inputs)

    probability = outputs.logits_per_image.softmax(dim=1)

    best_index = probability.argmax().item()
    best_label = CLOTHING_LABELS[best_index]

    return best_label


app = FastAPI()

@app.get("/")
def home():
    return "This is the home page"

# choosing the client -> creating the database -> creating the collection
db = client["profit"]
wardrobeCollection = db["wardrobe"]
processedImageCollection = db["processed_images"]

# create a new folder/directory called media if it does not exit
MEDIA_DIR = "media"
os.makedirs(MEDIA_DIR, exist_ok=True)

# mounting the fastAPI with this media folder so that this folder can be an end point
app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")

@app.post('/upload')
async def uploadImage(file: UploadFile = File(...)): #the File() it expects a multiform data to be received that must include the field name as file
    contents = await file.read()
    output = remove(contents)
    item_id = str (uuid.uuid4())
    output_path = os.path.join(MEDIA_DIR, f"{item_id}.png")

    with open(output_path, 'wb') as f:
        f.write(output) # raw binary data. Need to convert this to base64 encoded so that iPhone can read it

    label = classify_image_clip(output_path)

    encoded_string = base64.b64encode(output).decode()
    base64_image = f"data:image/png;base64,{encoded_string}"


    doc = {
        "item_id" : item_id,
        "file_path" : output_path,
        "url" : f"http://192.168.1.212:8000/media/{item_id}.png", # public static route to fetch image, later used in frontend
        "label" : label   
    }

    processedImageCollection.insert_one(doc)

    return JSONResponse({"item_id": item_id, "image_url": base64_image, "label" : label})

@app.post('/wardrobe/add')
async def uploadImage(data: dict = Body(...)):
    item_id = data.get("item_id")

    item = db["processed_images"].find_one({"item_id": item_id})
    if not item:
        return {"error": "Item not Found"}

    db["wardrobe"].insert_one({
        "item_id": item["item_id"],
        "url": item["url"],
        "label" : item["label"]
    })

    return {"message": "Item added to Wardrobe!"}

@app.get('/wardrobe')
async def get_wardrobe():
    # find all items in wardrobe collection
    items = list(wardrobeCollection.find({}, {"_id": 0}))  # exclude _id as not needed in the frontend
    return {"items": items}


@app.post("/generate_outfits")
async def generate_outfits():
    # fetching all the approved wardrobe section
    wardrobe_items = list(wardrobeCollection.find({}, {'_id': 0, 'item_id': 1, 'label' : 1, 'url' : 1}))

    # if empty, just throw an error
    if not wardrobe_items:
        return JSONResponse(content={"error": "Wardrobe is empty. Add items first."}, status_code=400)
    
    id_to_url = {item["item_id"]: item.get("url") for item in wardrobe_items}
    id_to_label = {item["item_id"]: item.get("label", "unknown") for item in wardrobe_items}
    valid_ids = set(id_to_url.keys())

    # 3) Create prompt for Mistral (only IDs + labels)
    readable_items = "\n".join(
        [f"- {item['item_id']}: {item['label']}" for item in wardrobe_items]
    )

    prompt = f"""
    You are a fashion stylist. You will create outfit combinations using ONLY the items listed below.
    Each item has an ID and a label (generated using CLIP). DO NOT invent items. DO NOT use clothing that is not in the list.

    Wardrobe Items:
    {readable_items}

    Rules:
    - ONLY use the exact items from the list.
    - Suggest 1 good outfit.
    - An outfit MUST have at least 2 items.
    - Outfits must be realistic and fashion-coordinated.
    - Output MUST be valid JSON ONLY. No commentary outside JSON.

    Output Format (strict):
    [
    {{
        "outfit_name": "string",
        "description": "string",
        "items": ["item_id1", "item_id2"]
    }}
    ]
"""
    import requests, json

    # Stream the Ollama response
    r = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "mistral", "prompt": prompt},
        stream=True
    )

    # Collect all "response" chunks
    response_text = ""
    for line in r.iter_lines():
        if line:
            data = json.loads(line.decode("utf-8"))
            if "response" in data:
                response_text += data["response"]

    print(" Raw Mistral output:", response_text[:500])

    # Try to parse the model's JSON output
    try:
        start = response_text.find("[")
        end = response_text.rfind("]") + 1
        cleaned = response_text[start:end]
        result = json.loads(cleaned)
    except Exception as e:
        print("Parsing error:", e)
        result = {"error": "Invalid JSON", "raw": response_text}


    for outfit in result:
        # keep only IDs that exist in wardrobe
        outfit_ids = [i for i in outfit.get("items", []) if i in valid_ids]
        outfit["items"] = outfit_ids

        # add urls + labels for rendering
        outfit["image_urls"] = [id_to_url[i] for i in outfit_ids if id_to_url.get(i)]
        outfit["item_labels"] = [id_to_label[i] for i in outfit_ids]
    return JSONResponse(content=result)


