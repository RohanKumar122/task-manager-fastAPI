from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TaskCreate(BaseModel):
    title: str
    description: str
    due_date: Optional[datetime] = None
    status: Optional[str] = "Pending"


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None  
    due_date: Optional[str] = None 

class TaskResponse(TaskCreate):
    id: str
    created_at: datetime

    class Config:
        orm_mode = True 