from fastapi_filter.contrib.sqlalchemy import Filter
from app.models.todo import ToDoItemDB
from typing import Optional, List


class TodoFilter(Filter):
    title: Optional[str] = None
    completed: Optional[bool] = None
    order_by: Optional[List[str]] = None

    class Constants(Filter.Constants):
        model = ToDoItemDB
        search_field_name = "title"
        search_model_fields = ["title"]
