from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.crud import todos as crud
from app.schemas.todo import ToDoItem, ToDoItemCreate
from app.db.session import get_db
from app.models.todo import ToDoItemDB
from fastapi_filter import FilterDepends

from app.filters.todo import TodoFilter

router = APIRouter()


@router.post("/", response_model=ToDoItem)
def create_todo(todo: ToDoItemCreate, db: Session = Depends(get_db)):
    return crud.create_todo(db=db, todo=todo)


@router.get("/", response_model=List[ToDoItem])
def read_todos(
    todo_filter: TodoFilter = FilterDepends(TodoFilter),
    db: Session = Depends(get_db),
):
    query = db.query(ToDoItemDB)
    filtered_todos = todo_filter.filter(query)
    ordered_todos = todo_filter.sort(filtered_todos)
    return ordered_todos.all()


@router.get("/{todo_id}", response_model=ToDoItem)
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = crud.get_todo(db, todo_id=todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.put("/{todo_id}", response_model=ToDoItem)
def update_todo(todo_id: int, todo: ToDoItemCreate, db: Session = Depends(get_db)):
    updated_todo = crud.update_todo(db, todo_id=todo_id, todo=todo)
    if updated_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return updated_todo


@router.delete("/{todo_id}", response_model=ToDoItem)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = crud.delete_todo(db, todo_id=todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo
