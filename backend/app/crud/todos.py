from sqlalchemy.orm import Session
from app.models.todo import ToDoItemDB
from app.schemas.todo import ToDoItemCreate


def create_todo(db: Session, todo: ToDoItemCreate):
    db_todo = ToDoItemDB(**todo.model_dump())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


def get_todos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ToDoItemDB).offset(skip).limit(limit).all()


def get_todo(db: Session, todo_id: int):
    return db.query(ToDoItemDB).filter(ToDoItemDB.id == todo_id).first()


def update_todo(db: Session, todo_id: int, todo: ToDoItemCreate):
    db_todo = db.query(ToDoItemDB).filter(ToDoItemDB.id == todo_id).first()
    if db_todo:
        for key, value in todo.dict().items():
            setattr(db_todo, key, value)
        db.commit()
        db.refresh(db_todo)
    return db_todo


def delete_todo(db: Session, todo_id: int):
    todo = db.query(ToDoItemDB).filter(ToDoItemDB.id == todo_id).first()
    if todo:
        db.delete(todo)
        db.commit()
    return todo
