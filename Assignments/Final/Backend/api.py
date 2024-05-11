from fastapi import FastAPI, HTTPException, status, Query, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from bson.objectid import ObjectId
from typing import Optional
from mongoManager import MongoManager
import hashlib
import uvicorn
from datetime import datetime, timezone
from typing import List, Dict


app = FastAPI()
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"]
) 
mongoManager = MongoManager(db="candy_store")


class Candy(BaseModel):
    name: str
    description: str
    category_id: str
    price: float
    image: str


class Category(BaseModel):
    category_id: str
    name: str
    candies: Optional[list[Candy]] = None


class User(BaseModel):
    first_name: str
    last_name: str
    username: Optional[str] = None
    email: str
    password: str
    pic: Optional[str] = None

class Login(BaseModel):
    email: str
    password: str

class RecieveLocation(BaseModel):
    latitude: float
    longitude: float

class ImageUpload(BaseModel):
    user_id: str
    username: str
    pic: str

@app.get("/")
def getCandies():
    mongoManager.set_collection("candies")
    result = mongoManager.get(filter={"_id": 0})
    return RedirectResponse(url="/docs")


@app.post("/candies")
def search_candies(
    search_query: str = Query(...),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100)
):
    mongoManager.set_collection("candies")
    regex_query = {"$regex": f".*{search_query}.*", "$options": "i"}  # Case-insensitive regex

    # Calculate skip value to skip records for pagination
    skip = (page - 1) * page_size

    # Query MongoDB with pagination
    result = mongoManager.get(
        query={"$or": [{"name": regex_query}, {"category": regex_query}]}, 
        filter={"_id": 0},
        skip=skip,
        limit=page_size
    )
    unique_results = remove_duplicates(result)
    if unique_results:
        return {"success": True, "message": "Candies fetched successfully", "user_data": unique_results}
    
    else:
        raise HTTPException(status_code=404, detail="No candies found matching the search query")
    
def remove_duplicates(results: List[Dict]) -> List[Dict]:
    unique_results = []
    unique_ids = set()
    for result in results:
        if result.get('id') not in unique_ids:
            unique_results.append(result)
            unique_ids.add(result.get('id'))
    return unique_results

@app.post("/register")
async def post_user(user: User):
    mongoManager.set_collection("users")

    # Check if username already exists
    existing_user = mongoManager.get({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

    # Check if email already exists
    existing_email = mongoManager.get({"email": user.email})
    if existing_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    encrypted_password = hashlib.sha256(user.password.encode()).hexdigest()
    user_data = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username": user.username or "",
        "email": user.email,
        "password": encrypted_password,
    }
    result = mongoManager.post(user_data)
    print(result)
    if not result:
      raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to register user")
    return {"success": True, "message": "User registered successfully"}

@app.post("/login")
async def post_login(login: Login):
    mongoManager.set_collection("users")
    password = hashlib.sha256(login.password.encode()).hexdigest()
    query = {}
    if login.email:
        query["email"] = login.email

    user = mongoManager.get(query=query) 
    if user:
        if user[0]["password"] == password:
            user_info = {
                "user_id": str(user[0]["_id"]),
                "first_name": user[0]["first_name"],
                "last_name": user[0]["last_name"],
                "email": user[0]["email"],
                "username": user[0]["username"],
            }

            # Check if user ID exists in ImageUpload collection
            mongoManager.set_collection("ImageUpload")
            user_pic = mongoManager.get({"user_id": user_info["user_id"]})
            if user_pic:
                user_info["pic"] = user_pic[0]["pic"]

            print (user_info)
            return {"success": True, "message": "Login successful", "user_info": user_info}    
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

@app.post("/addlocation/{username}")
async def add_location(username: str, location: RecieveLocation):
    mongoManager.set_collection("users")
    user_data = mongoManager.get({"username": username}, filter={"_id": 1})
    if user_data:
        user_id = user_data[0]["_id"]
        mongoManager.set_collection("locations")
        location_data = {
            "user_id": user_id,
            "location": {
                "latitude": location.latitude,
                "longitude": location.longitude
            },
            "timestamp": datetime.now(timezone.utc)
        }
        result = mongoManager.post(location_data)
        if result:
            return {"success": True, "message": "Location added successfully"}
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to add location")
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

@app.get("/getLocation/{username}")
async def get_location(username: str):
    mongoManager.set_collection("users")
    user_data = mongoManager.get({"username": username}, filter={"_id": 1, "first_name": 1, "last_name": 1, "email": 1})

    print("User data:", user_data) 
    if user_data:
        user_info = {
            "id": str(user_data[0]["_id"]),
            "firstName": user_data[0]["first_name"],
            "lastName": user_data[0]["last_name"],
            "email": user_data[0]["email"],
        }

        user_id = str(user_data[0]["_id"])

        mongoManager.set_collection("locations")
        location_data = mongoManager.get({"user_id": ObjectId(user_id)}, filter={"_id": 0})
        print(location_data)
        if location_data:
            location = {
                "latitude": location_data[0]["location"]["latitude"],
                "longitude": location_data[0]["location"]["longitude"]
            }
            timestamp = location_data[0]["timestamp"]
            id = str(location_data[0]["user_id"])

            return {"success": True, "id": id, "user_info": user_info, "location":location, "timestamp":timestamp}
        else:
            return {"success": False, "detail": "No location data found for the user"}
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

@app.get("/users")
async def list_users(page: int = Query(1, ge=1), page_size: int = Query(10, ge=1, le=50)):
    mongoManager.set_collection("users")
    users = mongoManager.get(filter={}, skip=(page - 1) * page_size, limit=page_size)
    for user in users:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string
        user.pop("password", None)  # Remove password field from each user

          # Check if user ID exists in ImageUpload collection
        mongoManager.set_collection("ImageUpload")
        user_pic = mongoManager.get({"user_id": user["_id"]})
        if user_pic:
            user["pic"] = user_pic[0]["pic"]
    return {"users": users}

@app.delete("/users/{user_id}")
async def delete_user(user_id: str):
    mongoManager.set_collection("users")
    user = mongoManager.get({"_id": ObjectId(user_id)})

    if user:
        result = mongoManager.delete({"_id": ObjectId(user_id)})
        if result.deleted_count == 1:
            return {"success": True, "message": "User deleted successfully"}
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete user")
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

@app.post("/upload/profile-pic")
async def upload_profile_pic(user_id:str, username:str, profile_pic:str):

    mongoManager.set_collection("ImageUpload")
    user_data = mongoManager.get({"username": username}, filter={"_id": 1})

    if user_data:
        result =  mongoManager.put({"user_id": user_id}, {"$set": {"pic": profile_pic}})
        if result:
            return {"success": True, "message": "Picture uploaded successfully"}
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload picture.")
        
    else:
        userPicInfo = {
            "user_id": user_id,
            "username": username,
            "pic":profile_pic
        }
        result = mongoManager.post(userPicInfo)
        if result:
            return {"success": True, "message": "Picture uploaded successfully"}
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload picture.")


@app.get("/get/profile-pic/{username}")
async def get_profile_pic(username: str):

    mongoManager.set_collection("ImageUpload")
    user_data = mongoManager.get({"username": username}, filter={"user_id": 1, "username": 1, "pic": 1 })

    if user_data:

        username = user_data[0]["username"]
        user_id = str(user_data[0]["user_id"])
        profile_pic = user_data[0]["pic"]

        return {"success": True, "user_id": user_id, "username": username,  "pic": profile_pic}
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Username not found.")



if __name__ == "__main__":
    uvicorn.run("api:app",  host="0.0.0.0", port=8083, log_level="debug", reload=True)