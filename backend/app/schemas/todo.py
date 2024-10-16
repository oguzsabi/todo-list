from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ToDoItemBase(BaseModel):
    title: str = Field(..., min_length=1)
    completed: bool = Field(default=False)
    description: str | None = None
    due_date: Optional[datetime] = None


class ToDoItemCreate(ToDoItemBase):
    pass


class ToDoItem(ToDoItemBase):
    id: int

    class Config:
        orm_mode = True
