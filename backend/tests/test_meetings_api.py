import os
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_fireflies.db")

from app import database
from app import main


class MeetingsApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        db_file = Path("test_fireflies.db")
        if db_file.exists():
            db_file.unlink()
        database.Base.metadata.drop_all(bind=database.engine)
        database.init_db()
        cls.client = TestClient(main.app)

    def test_create_and_fetch_meeting(self) -> None:
        response = self.client.post(
            "/meetings",
            json={
                "title": "Sprint planning",
                "date": "2026-07-11T10:30:00Z",
                "duration_seconds": 1800,
                "status": "scheduled",
                "participants": [
                    {"name": "Ava", "email": "ava@example.com"},
                    {"name": "Ben", "email": "ben@example.com"},
                ],
            },
        )

        self.assertEqual(response.status_code, 201)
        payload = response.json()
        self.assertEqual(payload["title"], "Sprint planning")
        self.assertEqual(len(payload["participants"]), 2)

        meeting_id = payload["id"]
        fetch_response = self.client.get(f"/meetings/{meeting_id}")
        self.assertEqual(fetch_response.status_code, 200)
        self.assertEqual(fetch_response.json()["id"], meeting_id)


if __name__ == "__main__":
    unittest.main()
