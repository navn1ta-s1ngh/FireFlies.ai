from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from crud.meeting import get_meeting
from crud.transcript import get_transcript_for_meeting
from schemas.transcript import TranscriptSegmentRead

router = APIRouter(tags=["transcript"])


@router.get("/meetings/{meeting_id}/transcript", response_model=list[TranscriptSegmentRead])
def read_transcript(meeting_id: int, db: Session = Depends(get_db)) -> list[TranscriptSegmentRead]:
    if get_meeting(db, meeting_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    return get_transcript_for_meeting(db, meeting_id)

