from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from crud.search import search_all
from schemas.search import SearchResult

router = APIRouter(tags=["search"])


@router.get("/search", response_model=list[SearchResult])
def global_search(
    q: str = Query(min_length=1),
    limit: int = Query(default=10, ge=1, le=25),
    db: Session = Depends(get_db)
) -> list[SearchResult]:
    return search_all(db, q, limit=limit)

