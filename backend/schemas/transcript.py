from pydantic import BaseModel, ConfigDict, Field


class TranscriptSegmentBase(BaseModel):
    speaker_name: str
    start_time_seconds: int = Field(ge=0)
    end_time_seconds: int = Field(ge=0)
    text: str
    order_index: int = Field(ge=0)


class TranscriptSegmentCreate(TranscriptSegmentBase):
    pass


class TranscriptSegmentRead(TranscriptSegmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    meeting_id: int

