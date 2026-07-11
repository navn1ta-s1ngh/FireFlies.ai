from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from models.meeting import Meeting
from models.transcript import TranscriptSegment
from schemas.search import SearchResult


def search_all(db: Session, query: str, limit: int = 10) -> list[SearchResult]:
    term = f"%{query}%"
    results: list[SearchResult] = []

    meeting_statement = (
        select(Meeting)
        .where(or_(Meeting.title.ilike(term), Meeting.status.ilike(term)))
        .order_by(Meeting.date.desc())
        .limit(limit)
    )
    for meeting in db.scalars(meeting_statement).all():
        results.append(
            SearchResult(
                type="meeting",
                meeting_id=meeting.id,
                title=meeting.title,
                snippet=meeting.status,
            )
        )

    remaining = max(limit - len(results), 0)
    if remaining == 0:
        return results

    transcript_statement = (
        select(TranscriptSegment, Meeting.title)
        .join(Meeting, Meeting.id == TranscriptSegment.meeting_id)
        .where(TranscriptSegment.text.ilike(term))
        .order_by(TranscriptSegment.order_index.asc())
        .limit(remaining)
    )
    for segment, title in db.execute(transcript_statement).all():
        results.append(
            SearchResult(
                type="transcript",
                meeting_id=segment.meeting_id,
                title=title,
                snippet=segment.text,
                timestamp=segment.start_time_seconds,
            )
        )

    return results

