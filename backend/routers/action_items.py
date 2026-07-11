from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from crud.meeting import get_meeting
from crud.task import delete_task, get_task, update_task
from schemas.action_item import ActionItemRead, ActionItemUpdate

router = APIRouter(prefix="/action-items", tags=["action-items"])


@router.patch("/{action_item_id}", response_model=ActionItemRead)
def update_existing_action_item(
    action_item_id: int,
    payload: ActionItemUpdate,
    db: Session = Depends(get_db),
) -> ActionItemRead:
    action_item = get_task(db, action_item_id)
    if action_item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Action item not found")
    return ActionItemRead.model_validate(update_task(db, action_item, payload))


@router.delete("/{action_item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_action_item(action_item_id: int, db: Session = Depends(get_db)) -> Response:
    action_item = get_task(db, action_item_id)
    if action_item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Action item not found")
    delete_task(db, action_item)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
