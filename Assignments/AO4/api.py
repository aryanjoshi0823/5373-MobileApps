# Libraries for FastAPI
from fastapi import FastAPI, Query, Path
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from pymongo import MongoClient
from typing import List
from pydantic import BaseModel
from mongoManager import MongoManager

# Builtin libraries
import os

from random import shuffle

"""
           _____ _____   _____ _   _ ______ ____
     /\   |  __ \_   _| |_   _| \ | |  ____/ __ \
    /  \  | |__) || |     | | |  \| | |__ | |  | |
   / /\ \ |  ___/ | |     | | | . ` |  __|| |  | |
  / ____ \| |    _| |_   _| |_| |\  | |   | |__| |
 /_/    \_\_|   |_____| |_____|_| \_|_|    \____/

The `description` is the information that gets displayed when the api is accessed from a browser and loads the base route.
Also the instance of `app` below description has info that gets displayed as well when the base route is accessed.
"""

description = """🤡
(This description is totally satirical and does not represent the views of any real person alive or deceased. 
And even though the topic is totally macabre, I would love to make anyone who abuses children very much deceased.
However, the shock factor of my stupid candy store keeps you listening to my lectures. If anyone is truly offended
please publicly or privately message me and I will take it down immediately.)🤡


## Description:
Sweet Nostalgia Candies brings you a delightful journey through time with its extensive collection of 
candies. From the vibrant, trendy flavors of today to the cherished, classic treats of yesteryear, 
our store is a haven for candy lovers of all ages (but mostly kids). Step into a world where every shelf and corner 
is adorned with jars and boxes filled with colors and tastes that evoke memories and create new ones. 
Whether you're seeking a rare, retro candy from your childhood or the latest sugary creation, Sweet 
Nostalgia Candies is your destination. Indulge in our handpicked selection and experience a sweet 
escape into the world of confectionery wonders! And don't worry! We will watch your kids!! (😉)

#### Contact Information:

- **Address:** 101 Candy Lane, Alcatraz Federal Penitentiary, San Francisco, CA 94123.
- **Phone:** (123) 968-7378 [or (123 you-perv)]
- **Email:** perv@kidsinvans.com
- **Website:** www.kidsinvans.fun

"""


app = FastAPI(
    title="KidsInVans.Fun🤡",
    description=description,
    version="0.0.1",
    terms_of_service="http://www.kidsinvans.fun/worldleterms/",
    contact={
        "name": "KidsInVans.Fun",
        "url": "http://www.kidsinvans.fun/worldle/contact/",
        "email": "perv@www.kidsinvans.fun",
    },
    license_info={
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
)

mongoManager = MongoManager(db="candy_store")



@app.get("/")
def getCandies():
    mongoManager.setCollection("candies")
    result = mongoManager.get(filter={"_id": 0})
    return result

@app.get("/categories")
def getCategories():
    mongoManager.setCollection("candies")
    categories = mongoManager.distinct("category")
    return categories

@app.get("/candies/category/{category}")
def getCandiesByCategory(category: str):
    mongoManager.setCollection("candies")
    result = mongoManager.get(
        query={"category": category}, 
        filter={"_id": 0, "name": 1, "price": 1, "category": 1},
    )
    return result

@app.get("/candies/description")
def getCandiesByDescription(keyword: str = Query(None, min_length=3)):
    mongoManager.setCollection("candies")
    result = mongoManager.get(
        query={"description": {"$regex": keyword, "$options": "i"}},
        filter={"_id": 0, "name": 1, "price": 1, "category": 1},
    )
    return result

@app.get("/candies/name")
def getCandiesByName(keyword: str = Query(None, min_length=3)):
    mongoManager.setCollection("candies")
    result = mongoManager.get(
        query={"name": {"$regex": keyword, "$options": "i"}},
        filter={"_id": 0, "name": 1, "price": 1, "category": 1},
    )
    return result

@app.get("/candies/priceRange")
def getCandiesByPriceRng(min_price: float = Query(None, ge=0), max_price: float = Query(None, ge=0)):
    mongoManager.setCollection("candies")
    result = mongoManager.get(
        query={"price": {"$gte": min_price, "$lte": max_price}},
        filter={"_id": 0, "name": 1, "price": 1, "category": 1},
    )
    return result

@app.get("/candies/id/{id}")
def getCandyById(id: str):
    mongoManager.setCollection("candies")
    result = mongoManager.get(
        query={"id": id}, filter={"_id": 0, "name": 1, "price": 1, "category": 1}
    )
    return result

@app.put("/candies/{candy_id}/updatePrice")
def putUpdateCandyPrice(candy_id: str, new_price: float):
    mongoManager.setCollection("candies")
    mongoManager.update(query={"id": candy_id}, update={"$set": {"price": new_price}})
    return {"message": "Candy price updated successfully"}

@app.put("/candies/{candy_id}/updateDetails")
def putUpdateCandyDetails(candy_id: str, updated_details: dict):
    mongoManager.setCollection("candies")
    mongoManager.update(query={"id": candy_id}, update={"$set": updated_details})
    return {"message": "Candy details updated successfully"}

@app.delete("/candies/{candy_id}")
def deleteCandy(candy_id: str):
    mongoManager.setCollection("candies")
    mongoManager.delete(query={"id": candy_id})
    return {"message": "Candy deleted successfully"}

if __name__ == "__main__":
    uvicorn.run("api:app", host="143.244.178.214", port=8084, log_level="debug", reload=True)
    

