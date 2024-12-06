from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt  # Using PyJWT
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError  # Correct import for exceptions
from datetime import datetime, timedelta
import os
from pydantic import BaseModel
from fastapi import FastAPI

app = FastAPI()

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default_secret_key")  # Replace with actual secret key in environment
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# User models
class User(BaseModel):
    username: str

class UserInDB(User):
    hashed_password: str

# Fake user database
fake_users_db = {
    "testuser": {
        "username": "test",
        "hashed_password": "password"  # Replace with hashed password in real applications
    }
}

# Utility functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Replace with a secure hash comparison in real applications
    return plain_password == hashed_password

def get_user(db: dict, username: str) -> UserInDB | None:
    user_dict = db.get(username)
    if user_dict:
        return UserInDB(**user_dict)
    return None

def authenticate_user(username: str, password: str) -> UserInDB | None:
    user = get_user(fake_users_db, username)
    if user and verify_password(password, user.hashed_password):
        return user
    return None

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Routes
@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Could not validate credentials",
            )
        return User(username=username)
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Token has expired",
        )
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token",
        )

@app.get("/protected")
async def protected_route(current_user: User = Depends(get_current_user)):
    return {"message": f"Welcome, {current_user.username}!"}
