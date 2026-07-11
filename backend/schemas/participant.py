from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


class ParticipantBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None


class ParticipantCreate(ParticipantBase):
    pass


class ParticipantRead(ParticipantBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
