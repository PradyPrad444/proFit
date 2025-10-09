import certifi
ca = certifi.where()
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import ssl
from pymongo import MongoClient

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://prady:Prady444@profit.s9amval.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(
    uri,
    server_api=ServerApi('1'),
    tls=True,                             
    tlsAllowInvalidCertificates=True     
)