from fastapi import FastAPI, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from bson.objectid import ObjectId
from typing import Optional
from mongoManager import MongoManager
import hashlib
import uvicorn

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"]) 
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


class Login(BaseModel):
    email: str
    password: str


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

    if result:
        return {"success": True, "message": "Candies fetched successfully", "user_data": result}
    
    else:
        raise HTTPException(status_code=404, detail="No candies found matching the search query")


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
        "password": encrypted_password
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
    print(user)
    if user:
        if user[0]["password"] == password:
            user_info = {
                "first_name": user[0]["first_name"],
                "last_name": user[0]["last_name"],
                "email": user[0]["email"],
                "username": user[0]["username"]
            }
            return {"success": True, "message": "Login successful", "user_info": user_info}    
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")



if __name__ == "__main__":
    uvicorn.run("api:app",  host="0.0.0.0", port=8084, log_level="debug", reload=True)