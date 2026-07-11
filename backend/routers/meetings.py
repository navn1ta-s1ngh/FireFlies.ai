from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Response, UploadFile, status
from sqlalchemy.orm import Session

from app.database import get_db
from crud.meeting import (
    create_meeting,
    create_transcript_segment,
    delete_meeting,
    get_meeting,
    list_meetings,
    update_meeting,
)
from schemas.action_item import ActionItemCreate, ActionItemRead
from schemas.meeting import MeetingCreate, MeetingDetail, MeetingListItem, MeetingUpdate
from schemas.summary import SummaryRead
from schemas.transcript import TranscriptSegmentRead

router = APIRouter(prefix="/meetings", tags=["meetings"])


@router.get("", response_model=list[MeetingListItem])
def read_meetings(
    search: Optional[str] = None,
    participant: Optional[str] = None,
    sort: Optional[str] = None,
    db: Session = Depends(get_db),
) -> list[MeetingListItem]:
    meetings = list_meetings(db, search=search, participant=participant, sort=sort)
    return [MeetingListItem.model_validate(meeting) for meeting in meetings]


@router.post("", response_model=MeetingDetail, status_code=status.HTTP_201_CREATED)
def create_new_meeting(meeting_in: MeetingCreate, db: Session = Depends(get_db)) -> MeetingDetail:
    return create_meeting(db, meeting_in)


@router.get("/{meeting_id}", response_model=MeetingDetail)
def read_meeting(meeting_id: int, db: Session = Depends(get_db)) -> MeetingDetail:
    meeting = get_meeting(db, meeting_id)
    if meeting is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    return meeting


@router.patch("/{meeting_id}", response_model=MeetingDetail)
def update_existing_meeting(
    meeting_id: int,
    meeting_in: MeetingUpdate,
    db: Session = Depends(get_db)
) -> MeetingDetail:
    meeting = get_meeting(db, meeting_id)
    if meeting is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    return update_meeting(db, meeting, meeting_in)


@router.delete("/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_meeting(meeting_id: int, db: Session = Depends(get_db)) -> Response:
    meeting = get_meeting(db, meeting_id)
    if meeting is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    delete_meeting(db, meeting)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{meeting_id}/transcript", response_model=list[TranscriptSegmentRead])
def read_transcript(meeting_id: int, db: Session = Depends(get_db)) -> list[TranscriptSegmentRead]:
    meeting = get_meeting(db, meeting_id)
    if meeting is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    return [TranscriptSegmentRead.model_validate(segment) for segment in meeting.transcript_segments]


@router.get("/{meeting_id}/transcript/search", response_model=list[TranscriptSegmentRead])
def search_transcript(meeting_id: int, q: str, db: Session = Depends(get_db)) -> list[TranscriptSegmentRead]:
    meeting = get_meeting(db, meeting_id)
    if meeting is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")

    filtered = [segment for segment in meeting.transcript_segments if q.lower() in segment.text.lower()]
    return [TranscriptSegmentRead.model_validate(segment) for segment in filtered]


@router.get("/{meeting_id}/summary", response_model=SummaryRead)
def read_summary(meeting_id: int, db: Session = Depends(get_db)) -> SummaryRead:
    meeting = get_meeting(db, meeting_id)
    if meeting is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    if meeting.summary is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Summary not found")
    return SummaryRead.model_validate(meeting.summary)


@router.get("/{meeting_id}/action-items", response_model=list[ActionItemRead])
def read_action_items(meeting_id: int, db: Session = Depends(get_db)) -> list[ActionItemRead]:
    meeting = get_meeting(db, meeting_id)
    if meeting is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    return [ActionItemRead.model_validate(item) for item in meeting.action_items]


@router.post("/{meeting_id}/action-items", response_model=ActionItemRead, status_code=status.HTTP_201_CREATED)
def create_action_item(meeting_id: int, payload: ActionItemCreate, db: Session = Depends(get_db)) -> ActionItemRead:
    meeting = get_meeting(db, meeting_id)
    if meeting is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    from crud.meeting import create_action_item

    return ActionItemRead.model_validate(create_action_item(db, meeting, payload.model_dump()))


@router.post("/upload", response_model=list[TranscriptSegmentRead], status_code=status.HTTP_201_CREATED)
def upload_transcript_file(file: UploadFile, meeting_id: Optional[int] = None, db: Session = Depends(get_db)) -> list[TranscriptSegmentRead]:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")

    content = file.file.read().decode("utf-8")
    segments: list[dict] = []

    if file.filename.endswith(".json"):
        import json

        data = json.loads(content)
        for item in data.get("segments", []):
            segments.append(
                {
                    "speaker_name": item.get("speaker_name", "Speaker"),
                    "start_time_seconds": item.get("start_time_seconds", 0),
                    "end_time_seconds": item.get("end_time_seconds", 0),
                    "text": item.get("text", ""),
                    "order_index": item.get("order_index", len(segments)),
                }
            )
    else:
        for index, line in enumerate(content.splitlines()):
            if line.strip():
                segments.append(
                    {
                        "speaker_name": "Speaker",
                        "start_time_seconds": index * 5,
                        "end_time_seconds": (index + 1) * 5,
                        "text": line.strip(),
                        "order_index": index,
                    }
                )

    if meeting_id is None:
        meeting = create_meeting(
            db,
            MeetingCreate(
                title=file.filename,
                date=datetime.now(timezone.utc),
                duration_seconds=0,
                status="uploaded",
            ),
        )
    else:
        meeting = get_meeting(db, meeting_id)
        if meeting is None:
            raise HTTPException(status_code=404, detail="Meeting not found")

    created_segments = []
    for segment in segments:
        created_segments.append(create_transcript_segment(db, meeting, segment))

    return [TranscriptSegmentRead.model_validate(segment) for segment in created_segments]

