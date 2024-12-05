from pydantic import BaseModel
from bson import ObjectId
from enum import Enum
from datetime import datetime
from typing import Optional

class User(BaseModel):
    email: str
    password: str

class UserInDB(User):
    id: str


class TaskStatus(str, Enum):
    todo = "To Do"
    in_progress = "In Progress"
    done = "Done"

class TaskBase(BaseModel):
    title: str
    description: str
    status: TaskStatus
    due_date: datetime

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: str 


