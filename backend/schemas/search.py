from typing import Literal, Optional

from pydantic import BaseModel


class SearchResult(BaseModel):
    type: Literal["meeting", "transcript"]
    meeting_id: int
    title: str
    snippet: Optional[str] = None
    timestamp: Optional[int] = None
