from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from models.transcript import TranscriptSegment


def get_transcript_for_meeting(db: Session, meeting_id: int) -> list[TranscriptSegment]:
    statement = (
        select(TranscriptSegment)
        .where(TranscriptSegment.meeting_id == meeting_id)
        .order_by(TranscriptSegment.order_index.asc())
    )
    return list(db.scalars(statement).all())

