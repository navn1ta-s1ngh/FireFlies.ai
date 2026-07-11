from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class SummaryChapter(BaseModel):
    title: str
    start: int = Field(ge=0)
    end: int = Field(ge=0)


class SummaryBase(BaseModel):
    overview: Optional[str] = None
    key_topics: List[str] = Field(default_factory=list)
    chapters: List[SummaryChapter] = Field(default_factory=list)


class SummaryCreate(SummaryBase):
    pass


class SummaryRead(SummaryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    meeting_id: int
