from pydantic import BaseModel
from bson import ObjectId

class User(BaseModel):
    email: str
    password: str

class UserInDB(User):
    id: str
