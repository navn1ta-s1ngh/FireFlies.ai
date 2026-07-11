from typing import Optional

from pydantic import BaseModel, ConfigDict


class ActionItemBase(BaseModel):
    text: str
    assignee: Optional[str] = None
    completed: bool = False


class ActionItemCreate(ActionItemBase):
    pass


class ActionItemUpdate(BaseModel):
    text: Optional[str] = None
    assignee: Optional[str] = None
    completed: Optional[bool] = None


class ActionItemRead(ActionItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    meeting_id: int
