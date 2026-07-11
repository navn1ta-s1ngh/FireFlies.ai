from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field

from schemas.action_item import ActionItemRead
from schemas.participant import ParticipantCreate, ParticipantRead
from schemas.summary import SummaryRead
from schemas.topic import TopicRead
from schemas.transcript import TranscriptSegmentRead


class MeetingBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    date: datetime
    duration_seconds: int = Field(default=0, ge=0)
    audio_url: Optional[str] = None
    status: str = "scheduled"


class MeetingCreate(MeetingBase):
    participants: List[ParticipantCreate] = Field(default_factory=list)


class MeetingUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    date: Optional[datetime] = None
    duration_seconds: Optional[int] = Field(default=None, ge=0)
    audio_url: Optional[str] = None
    status: Optional[str] = None


class MeetingListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    date: datetime
    duration_seconds: int
    status: str
    participant_names: List[str] = Field(default_factory=list)


class MeetingRead(MeetingBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    participants: List[ParticipantRead] = Field(default_factory=list)
    action_items: List[ActionItemRead] = Field(default_factory=list)


class MeetingDetail(MeetingRead):
    transcript_segments: List[TranscriptSegmentRead] = Field(default_factory=list)
    summary: Optional[SummaryRead] = None
    topics: List[TopicRead] = Field(default_factory=list)
