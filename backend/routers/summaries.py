from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from crud.meeting import get_meeting
from crud.summary import get_summary_for_meeting
from schemas.summary import SummaryRead

router = APIRouter(tags=["summary"])


@router.get("/meetings/{meeting_id}/summary", response_model=SummaryRead)
def read_summary(meeting_id: int, db: Session = Depends(get_db)) -> SummaryRead:
    if get_meeting(db, meeting_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    summary = get_summary_for_meeting(db, meeting_id)
    if summary is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Summary not found")
    return summary

