from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from routers import insights, meetings, search, summaries, tasks, transcripts


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    init_db()
    yield


app = FastAPI(
    title="Meeting Notes & Transcription API",
    version="0.1.0",
    lifespan=lifespan
)

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
deployed_frontend_origin = os.getenv("DEPLOYED_FRONTEND_ORIGIN", "https://your-frontend-url.example")
allowed_origins = [origin for origin in [frontend_origin, deployed_frontend_origin] if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meetings.router)
app.include_router(transcripts.router)
app.include_router(summaries.router)
app.include_router(tasks.router)
app.include_router(insights.router)
app.include_router(search.router)


@app.get("/health", tags=["system"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}

