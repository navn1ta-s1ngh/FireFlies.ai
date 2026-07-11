from __future__ import annotations

from typing import List, Optional

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from models.meeting import meeting_participants


class Participant(Base):
    __tablename__ = "participants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    meetings: Mapped[List["Meeting"]] = relationship(
        "Meeting",
        secondary=meeting_participants,
        back_populates="participants"
    )
