import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import posts, users

# Keep the existing simple schema bootstrap. For a portfolio with a small schema,
# this is enough to initialize a fresh managed PostgreSQL database.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Portfolio API")

allowed_origins = ["http://localhost:5173"]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(posts.router)


@app.get("/api")
def root():
    return {"message": "Portfolio API is running"}
