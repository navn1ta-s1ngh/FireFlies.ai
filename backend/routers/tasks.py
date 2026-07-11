from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from crud.meeting import get_meeting
from crud.task import create_task, delete_task, get_task, update_task
from schemas.action_item import ActionItemCreate, ActionItemRead, ActionItemUpdate

router = APIRouter(tags=["tasks"])


@router.post("/meetings/{meeting_id}/tasks", response_model=ActionItemRead, status_code=status.HTTP_201_CREATED)
def create_meeting_task(
    meeting_id: int,
    task_in: ActionItemCreate,
    db: Session = Depends(get_db)
) -> ActionItemRead:
    meeting = get_meeting(db, meeting_id)
    if meeting is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    return create_task(db, meeting, task_in)


@router.put("/tasks/{task_id}", response_model=ActionItemRead)
def update_existing_task(
    task_id: int,
    task_in: ActionItemUpdate,
    db: Session = Depends(get_db)
) -> ActionItemRead:
    task = get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return update_task(db, task, task_in)


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_task(task_id: int, db: Session = Depends(get_db)) -> Response:
    task = get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    delete_task(db, task)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

