from __future__ import annotations

from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from models.summary import Summary


def get_summary_for_meeting(db: Session, meeting_id: int) -> Optional[Summary]:
    statement = select(Summary).where(Summary.meeting_id == meeting_id)
    return db.scalars(statement).first()
