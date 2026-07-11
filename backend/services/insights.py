from collections import Counter, defaultdict

from models.meeting import Meeting
from schemas.insights import MeetingInsightsRead, SpeakerInsight


def build_meeting_insights(meeting: Meeting) -> MeetingInsightsRead:
    words_by_speaker: defaultdict[str, int] = defaultdict(int)
    lines_by_speaker: Counter[str] = Counter()

    for segment in meeting.transcript_segments:
        words_by_speaker[segment.speaker_name] += len(segment.text.split())
        lines_by_speaker[segment.speaker_name] += 1

    total_words = sum(words_by_speaker.values()) or 1
    top_speakers = [
        SpeakerInsight(
            speaker=speaker,
            line_count=lines_by_speaker[speaker],
            word_count=word_count,
            talk_ratio=round(word_count / total_words, 3),
        )
        for speaker, word_count in sorted(words_by_speaker.items(), key=lambda item: item[1], reverse=True)
    ]

    return MeetingInsightsRead(
        meeting_id=meeting.id,
        duration=meeting.duration_seconds,
        participant_count=len(meeting.participants),
        transcript_line_count=len(meeting.transcript_segments),
        action_item_count=len(meeting.action_items),
        completed_action_item_count=sum(1 for item in meeting.action_items if item.completed),
        top_speakers=top_speakers,
    )

