from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TaskCreate(BaseModel):
    title: str
    description: str
    due_date: Optional[datetime] = None
    status: Optional[str] = "Pending"


class TaskUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    due_date: Optional[datetime]
    status: Optional[str]


class TaskResponse(TaskCreate):
    id: str
    created_at: datetime

    class Config:
        orm_mode = True 