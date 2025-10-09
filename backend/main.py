from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from config import client #used from config.py
from rembg import remove
import os, uuid

app = FastAPI()

@app.get("/")
def home():
    return "This is the home page"

# choosing the client -> creating the database -> creating the collection
db = client["profit"]
collection = db["wardrobe"]

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
        f.write(output)


    doc = {
        "item_id" : item_id,
        "file_path" : output_path,
        "url" : f"http://127.0.0.1:8000/media/{item_id}.png"
    }

    collection.insert_one(doc)

    return JSONResponse({"id": item_id, "image_url": doc["url"]})