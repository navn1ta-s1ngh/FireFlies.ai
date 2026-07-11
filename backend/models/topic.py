from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Topic(Base):
    __tablename__ = "topics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    meeting_id: Mapped[int] = mapped_column(
        ForeignKey("meetings.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    start_time_seconds: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    meeting: Mapped["Meeting"] = relationship(back_populates="topics")
