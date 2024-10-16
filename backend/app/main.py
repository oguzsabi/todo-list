from fastapi import FastAPI
from app.api.endpoints import todos
from app.db.session import engine
from app.models import todo as models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

api_app = FastAPI()

api_app.include_router(todos.router, prefix="/todos", tags=["todos"])

app.mount("/api", api_app)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
