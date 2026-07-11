from typing import List

from pydantic import BaseModel


class SpeakerInsight(BaseModel):
    speaker: str
    line_count: int
    word_count: int
    talk_ratio: float


class MeetingInsightsRead(BaseModel):
    meeting_id: int
    duration: int
    participant_count: int
    transcript_line_count: int
    action_item_count: int
    completed_action_item_count: int
    top_speakers: List[SpeakerInsight]
