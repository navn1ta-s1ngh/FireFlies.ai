from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from crud.meeting import get_meeting
from schemas.insights import MeetingInsightsRead
from services.insights import build_meeting_insights

router = APIRouter(tags=["insights"])


@router.get("/meetings/{meeting_id}/insights", response_model=MeetingInsightsRead)
def read_meeting_insights(meeting_id: int, db: Session = Depends(get_db)) -> MeetingInsightsRead:
    meeting = get_meeting(db, meeting_id)
    if meeting is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    return build_meeting_insights(meeting)

