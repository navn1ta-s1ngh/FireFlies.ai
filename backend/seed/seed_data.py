from datetime import datetime, timezone

from app.database import SessionLocal, init_db
from models.meeting import Meeting
from models.participant import Participant
from models.summary import Summary
from models.action_item import ActionItem
from models.transcript import TranscriptLine


def seed() -> None:
    init_db()

    with SessionLocal() as db:
        existing = db.query(Meeting).first()
        if existing:
            return

        meeting = Meeting(
            title="Product Sync: Transcript Intelligence",
            description="Weekly product review covering search, summary quality, and follow-up workflows.",
            meeting_date=datetime(2026, 7, 10, 10, 30, tzinfo=timezone.utc),
            duration=2760
        )
        meeting.participants = [
            Participant(name="Ava Patel", email="ava@example.com"),
            Participant(name="Marcus Lee", email="marcus@example.com"),
            Participant(name="Nora Chen", email="nora@example.com")
        ]
        meeting.transcript_lines = [
            TranscriptLine(speaker="Ava Patel", timestamp=0, text="Let's start with transcript search and where users are getting stuck."),
            TranscriptLine(speaker="Marcus Lee", timestamp=42, text="The biggest request is jumping from a search result directly to playback."),
            TranscriptLine(speaker="Nora Chen", timestamp=89, text="Summary chapters should line up with meaningful topic shifts, not fixed time windows."),
            TranscriptLine(speaker="Ava Patel", timestamp=142, text="Great. Let's create a small action plan around sync, chapters, and task extraction.")
        ]
        meeting.summary = Summary(
            overview="The team aligned on improving transcript navigation, audio sync, and AI-generated chapters.",
            key_topics=["Transcript search", "Playback sync", "Summary chapters", "Action item extraction"],
            chapters=[
                {"title": "Search feedback", "start": 0, "end": 88},
                {"title": "Summary quality", "start": 89, "end": 141},
                {"title": "Next steps", "start": 142, "end": 2760}
            ]
        )
        meeting.tasks = [
            ActionItem(task="Prototype transcript-to-player seeking", assigned_to="Marcus Lee"),
            ActionItem(task="Review chapter generation prompts", assigned_to="Nora Chen")
        ]

        db.add(meeting)
        db.commit()


if __name__ == "__main__":
    seed()

