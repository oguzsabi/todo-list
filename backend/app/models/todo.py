from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.db.session import Base


class ToDoItemDB(Base):
    __tablename__ = "todo_items"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    completed = Column(Boolean, default=False)
    due_date = Column(DateTime, nullable=True)
