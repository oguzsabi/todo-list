import pytest
from sqlalchemy.orm import Session
from app.crud import todos as crud
from app.schemas.todo import ToDoItemCreate
from app.models.todo import ToDoItemDB
from datetime import datetime, timedelta


def test_create_todo(db: Session):
    todo_data = ToDoItemCreate(title="Test Todo", description="Test Description")
    todo = crud.create_todo(db, todo_data)
    assert todo.title == "Test Todo"
    assert todo.description == "Test Description"
    assert todo.completed == False
    assert todo.id is not None


def test_get_todo(db: Session):
    todo_data = ToDoItemCreate(title="Get Todo Test", description="Test Description")
    created_todo = crud.create_todo(db, todo_data)

    retrieved_todo = crud.get_todo(db, created_todo.id)
    assert retrieved_todo is not None
    assert retrieved_todo.id == created_todo.id
    assert retrieved_todo.title == "Get Todo Test"


def test_update_todo(db: Session):
    todo_data = ToDoItemCreate(
        title="Update Todo Test", description="Initial Description"
    )
    created_todo = crud.create_todo(db, todo_data)

    updated_data = ToDoItemCreate(
        title="Updated Todo", description="Updated Description", completed=True
    )
    updated_todo = crud.update_todo(db, created_todo.id, updated_data)

    assert updated_todo is not None
    assert updated_todo.id == created_todo.id
    assert updated_todo.title == "Updated Todo"
    assert updated_todo.description == "Updated Description"
    assert updated_todo.completed == True


def test_delete_todo(db: Session):
    todo_data = ToDoItemCreate(title="Delete Todo Test", description="Test Description")
    created_todo = crud.create_todo(db, todo_data)

    deleted_todo = crud.delete_todo(db, created_todo.id)
    assert deleted_todo is not None
    assert deleted_todo.id == created_todo.id

    retrieved_todo = crud.get_todo(db, created_todo.id)
    assert retrieved_todo is None


def test_get_todos(db: Session):
    crud.create_todo(db, ToDoItemCreate(title="Todo 1"))
    crud.create_todo(db, ToDoItemCreate(title="Todo 2"))
    crud.create_todo(db, ToDoItemCreate(title="Todo 3"))

    todos = crud.get_todos(db)
    assert len(todos) >= 3


@pytest.fixture
def sample_todos(db: Session):
    todos = [
        ToDoItemCreate(
            title="Important Task",
            completed=False,
            due_date=datetime.now() + timedelta(days=1),
        ),
        ToDoItemCreate(title="Completed Task", completed=True),
        ToDoItemCreate(
            title="Future Task",
            completed=False,
            due_date=datetime.now() + timedelta(days=7),
        ),
    ]
    return [crud.create_todo(db, todo) for todo in todos]


def test_todo_filter(db: Session, sample_todos):
    from app.filters.todo import TodoFilter

    title_filter = TodoFilter(title="Important")
    filtered_todos = title_filter.filter(db.query(ToDoItemDB)).all()
    assert len(filtered_todos) == 1
    assert filtered_todos[0].title == "Important Task"

    completed_filter = TodoFilter(completed=True)
    completed_todos = completed_filter.filter(db.query(ToDoItemDB)).all()
    assert len(completed_todos) == 1
    assert completed_todos[0].title == "Completed Task"

    order_filter = TodoFilter(order_by=["due_date"])
    ordered_todos = order_filter.sort(db.query(ToDoItemDB)).all()

    assert ordered_todos[0].title == "Completed Task"
    assert ordered_todos[-1].title == "Future Task"


def test_todo_due_dates(db: Session, sample_todos):
    todos = db.query(ToDoItemDB).all()
    for todo in todos:
        print(f"Title: {todo.title}, Due Date: {todo.due_date}")

    important_task = (
        db.query(ToDoItemDB).filter(ToDoItemDB.title == "Important Task").first()
    )
    future_task = db.query(ToDoItemDB).filter(ToDoItemDB.title == "Future Task").first()
    completed_task = (
        db.query(ToDoItemDB).filter(ToDoItemDB.title == "Completed Task").first()
    )

    assert important_task.due_date is not None, "Important Task should have a due date"
    assert future_task.due_date is not None, "Future Task should have a due date"
    assert completed_task.due_date is None, "Completed Task should not have a due date"

    assert (
        important_task.due_date < future_task.due_date
    ), "Important Task should be due before Future Task"
