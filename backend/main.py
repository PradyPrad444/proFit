from fastapi import Body, FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from config import client #used from config.py
from rembg import remove
import base64
import os, uuid

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

    encoded_string = base64.b64encode(output).decode()
    base64_image = f"data:image/png;base64,{encoded_string}"


    doc = {
        "item_id" : item_id,
        "file_path" : output_path,
        "url" : f"http://192.168.1.212:8000/media/{item_id}.png" # public static route to fetch image, later used in frontend
    }

    processedImageCollection.insert_one(doc)

    return JSONResponse({"item_id": item_id, "image_url": base64_image})

@app.post('/wardrobe/add')
async def uploadImage(data: dict = Body(...)):
    item_id = data.get("item_id")

    item = db["processed_images"].find_one({"item_id": item_id})
    if not item:
        return {"error": "Item not Found"}

    db["wardrobe"].insert_one({
        "item_id": item["item_id"],
        "url": item["url"],
    })

    return {"message": "Item added to Wardrobe!"}

@app.get('/wardrobe')
async def get_wardrobe():
    # find all items in wardrobe collection
    items = list(wardrobeCollection.find({}, {"_id": 0}))  # exclude _id as not needed in the frontend
    return {"items": items}


@app.post("/generate_outfits")
async def generate_outfits():
    # getting all the items in the wardrobe collection and we are excluding the id's of those items
    items = list(wardrobeCollection.find({}, {'_id': 0}))

    prompt = f"""
    You are a fashion stylist and you job is to generate and suggest the outfit given these wardrobe
    items (as image urls), create an outfit combination that look stylish and season-appropriate. 
    Items: {items}
    Respond in JSON as: 
    [
      {{"outfit_name": "...", "items": ["item_d1", "item_id2"], "description": "..."}}  
    ]
    """

    # doing a post request to Ollama 
    import requests, json
    r = requests.post(
        "http://localhost:11434/api/generate",
        json = {"model": "mistral", "prompt": prompt}
    )

    text = r.text
    return json.loads(text) #converts the JSON formatted string to a python list or dict and then we return it to the front
