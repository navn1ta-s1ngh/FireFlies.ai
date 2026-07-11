from __future__ import annotations

from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from models.action_item import ActionItem
from models.meeting import Meeting
from schemas.action_item import ActionItemCreate, ActionItemUpdate


def create_task(db: Session, meeting: Meeting, task_in: ActionItemCreate) -> ActionItem:
    task = ActionItem(meeting_id=meeting.id, **task_in.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_task(db: Session, task_id: int) -> Optional[ActionItem]:
    statement = select(ActionItem).where(ActionItem.id == task_id)
    return db.scalars(statement).first()


def update_task(db: Session, task: ActionItem, task_in: ActionItemUpdate) -> ActionItem:
    for field, value in task_in.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: ActionItem) -> None:
    db.delete(task)
    db.commit()
