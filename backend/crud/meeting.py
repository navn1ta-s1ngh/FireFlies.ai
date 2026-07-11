from __future__ import annotations

from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from models.action_item import ActionItem
from models.meeting import Meeting
from models.participant import Participant
from models.summary import Summary
from models.topic import Topic
from models.transcript import TranscriptSegment
from schemas.meeting import MeetingCreate, MeetingUpdate


def list_meetings(
    db: Session,
    search: str | None = None,
    participant: str | None = None,
    sort: str | None = None,
) -> list[Meeting]:
    statement = select(Meeting)

    if search:
        statement = statement.where(Meeting.title.ilike(f"%{search}%"))

    if participant:
        statement = statement.join(Meeting.participants).where(Participant.name.ilike(f"%{participant}%"))

    if sort == "recent":
        statement = statement.order_by(Meeting.date.desc())
    else:
        statement = statement.order_by(Meeting.date.desc())

    statement = statement.options(selectinload(Meeting.participants))
    return list(db.scalars(statement).all())


def get_meeting(db: Session, meeting_id: int) -> Optional[Meeting]:
    statement = (
        select(Meeting)
        .where(Meeting.id == meeting_id)
        .options(
            selectinload(Meeting.participants),
            selectinload(Meeting.transcript_segments),
            selectinload(Meeting.summary),
            selectinload(Meeting.topics),
            selectinload(Meeting.action_items),
        )
    )
    return db.scalars(statement).first()


def create_meeting(db: Session, meeting_in: MeetingCreate) -> Meeting:
    data = meeting_in.model_dump(exclude={"participants"})
    meeting = Meeting(**data)

    if meeting_in.participants:
        participants = [Participant(**participant.model_dump()) for participant in meeting_in.participants]
        meeting.participants = participants

    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return get_meeting(db, meeting.id) or meeting


def update_meeting(db: Session, meeting: Meeting, meeting_in: MeetingUpdate) -> Meeting:
    for field, value in meeting_in.model_dump(exclude_unset=True).items():
        setattr(meeting, field, value)
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return get_meeting(db, meeting.id) or meeting


def delete_meeting(db: Session, meeting: Meeting) -> None:
    db.delete(meeting)
    db.commit()


def create_transcript_segment(db: Session, meeting: Meeting, payload: dict) -> TranscriptSegment:
    segment = TranscriptSegment(meeting_id=meeting.id, **payload)
    db.add(segment)
    db.commit()
    db.refresh(segment)
    return segment


def create_summary(db: Session, meeting: Meeting, overview_text: str) -> Summary:
    summary = Summary(meeting_id=meeting.id, overview_text=overview_text)
    db.add(summary)
    db.commit()
    db.refresh(summary)
    return summary


def create_topic(db: Session, meeting: Meeting, payload: dict) -> Topic:
    topic = Topic(meeting_id=meeting.id, **payload)
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic


def create_action_item(db: Session, meeting: Meeting, payload: dict) -> ActionItem:
    action_item = ActionItem(meeting_id=meeting.id, **payload)
    db.add(action_item)
    db.commit()
    db.refresh(action_item)
    return action_item
