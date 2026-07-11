from pydantic import BaseModel, ConfigDict, Field


class TopicBase(BaseModel):
    title: str
    start_time_seconds: int = Field(ge=0)
    order_index: int = Field(ge=0)


class TopicCreate(TopicBase):
    pass


class TopicRead(TopicBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    meeting_id: int
