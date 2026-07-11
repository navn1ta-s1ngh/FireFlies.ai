"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-07-10 00:00:00.000000
"""

from typing import Optional, Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0001_initial"
down_revision: Optional[str] = None
branch_labels: Optional[Union[str, Sequence[str]]] = None
depends_on: Optional[Union[str, Sequence[str]]] = None


def upgrade() -> None:
    op.create_table(
        "meetings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("meeting_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("duration", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id")
    )
    op.create_index(op.f("ix_meetings_id"), "meetings", ["id"], unique=False)
    op.create_index(op.f("ix_meetings_title"), "meetings", ["title"], unique=False)

    op.create_table(
        "participants",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("meeting_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.ForeignKeyConstraint(["meeting_id"], ["meetings.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id")
    )
    op.create_index(op.f("ix_participants_id"), "participants", ["id"], unique=False)
    op.create_index(op.f("ix_participants_meeting_id"), "participants", ["meeting_id"], unique=False)

    op.create_table(
        "transcript_lines",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("meeting_id", sa.Integer(), nullable=False),
        sa.Column("speaker", sa.String(length=120), nullable=False),
        sa.Column("timestamp", sa.Integer(), nullable=False),
        sa.Column("text", sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(["meeting_id"], ["meetings.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id")
    )
    op.create_index(op.f("ix_transcript_lines_id"), "transcript_lines", ["id"], unique=False)
    op.create_index(op.f("ix_transcript_lines_meeting_id"), "transcript_lines", ["meeting_id"], unique=False)
    op.create_index(op.f("ix_transcript_lines_timestamp"), "transcript_lines", ["timestamp"], unique=False)

    op.create_table(
        "summaries",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("meeting_id", sa.Integer(), nullable=False),
        sa.Column("overview", sa.Text(), nullable=True),
        sa.Column("key_topics", sa.JSON(), nullable=False),
        sa.Column("chapters", sa.JSON(), nullable=False),
        sa.ForeignKeyConstraint(["meeting_id"], ["meetings.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("meeting_id")
    )
    op.create_index(op.f("ix_summaries_id"), "summaries", ["id"], unique=False)
    op.create_index(op.f("ix_summaries_meeting_id"), "summaries", ["meeting_id"], unique=False)

    op.create_table(
        "action_items",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("meeting_id", sa.Integer(), nullable=False),
        sa.Column("task", sa.Text(), nullable=False),
        sa.Column("assigned_to", sa.String(length=120), nullable=True),
        sa.Column("completed", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(["meeting_id"], ["meetings.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id")
    )
    op.create_index(op.f("ix_action_items_id"), "action_items", ["id"], unique=False)
    op.create_index(op.f("ix_action_items_meeting_id"), "action_items", ["meeting_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_action_items_meeting_id"), table_name="action_items")
    op.drop_index(op.f("ix_action_items_id"), table_name="action_items")
    op.drop_table("action_items")
    op.drop_index(op.f("ix_summaries_meeting_id"), table_name="summaries")
    op.drop_index(op.f("ix_summaries_id"), table_name="summaries")
    op.drop_table("summaries")
    op.drop_index(op.f("ix_transcript_lines_timestamp"), table_name="transcript_lines")
    op.drop_index(op.f("ix_transcript_lines_meeting_id"), table_name="transcript_lines")
    op.drop_index(op.f("ix_transcript_lines_id"), table_name="transcript_lines")
    op.drop_table("transcript_lines")
    op.drop_index(op.f("ix_participants_meeting_id"), table_name="participants")
    op.drop_index(op.f("ix_participants_id"), table_name="participants")
    op.drop_table("participants")
    op.drop_index(op.f("ix_meetings_title"), table_name="meetings")
    op.drop_index(op.f("ix_meetings_id"), table_name="meetings")
    op.drop_table("meetings")
