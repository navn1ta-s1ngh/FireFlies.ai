from typing import Optional

from pydantic import BaseModel, ConfigDict


class ActionItemBase(BaseModel):
    task: str
    assigned_to: Optional[str] = None
    completed: bool = False


class ActionItemCreate(ActionItemBase):
    pass


class ActionItemUpdate(BaseModel):
    task: Optional[str] = None
    assigned_to: Optional[str] = None
    completed: Optional[bool] = None


class ActionItemRead(ActionItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    meeting_id: int
