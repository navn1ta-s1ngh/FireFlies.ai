"use client";

import Link from "next/link";
import { ArrowLeft, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";

import { MeetingSidebar } from "@/components/MeetingSidebar";
import { getMockMeetingDetail, type TranscriptSegment } from "@/lib/mockMeetingDetail";
import { cn, formatDuration, formatTimestamp } from "@/lib/utils";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatches(text: string, query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return text;
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(trimmedQuery)})`, "gi"));

  return parts.map((part, index) =>
    part.toLowerCase() === trimmedQuery.toLowerCase() ? (
      <mark key={`${part}-${index}`} className="rounded bg-primary-purple/25 px-0.5 text-text-primary">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function findActiveSegment(segments: TranscriptSegment[], currentTime: number) {
  return segments.find(
    (segment) =>
      currentTime >= segment.start_time_seconds && currentTime < segment.end_time_seconds
  );
}

function segmentMatchesQuery(segment: TranscriptSegment, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return (
    segment.text.toLowerCase().includes(normalizedQuery) ||
    segment.speaker.toLowerCase().includes(normalizedQuery)
  );
}

export default function MeetingDetailPage() {
  const params = useParams<{ id: string }>();
  const meetingId = Number(params.id);
  const meeting = useMemo(
    () => getMockMeetingDetail(Number.isFinite(meetingId) ? meetingId : 1),
    [meetingId]
  );

  const audioRef = useRef<HTMLAudioElement>(null);
  const segmentRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const duration = meeting.duration_seconds;
  const activeSegment = useMemo(
    () => findActiveSegment(meeting.transcript_segments, currentTime),
    [currentTime, meeting.transcript_segments]
  );

  const filteredSegments = useMemo(
    () => meeting.transcript_segments.filter((segment) => segmentMatchesQuery(segment, searchQuery)),
    [meeting.transcript_segments, searchQuery]
  );

  const meetingDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(meeting.date));

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentTime((time) => {
        const nextTime = Math.min(time + 0.25, duration);

        if (audioRef.current) {
          audioRef.current.currentTime = nextTime;
        }

        if (nextTime >= duration) {
          setIsPlaying(false);
        }

        return nextTime;
      });
    }, 250);

    return () => window.clearInterval(interval);
  }, [duration, isPlaying]);

  useEffect(() => {
    if (!activeSegment) {
      return;
    }

    segmentRefs.current[activeSegment.id]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }, [activeSegment?.id]);

  function handleSeek(time: number) {
    const nextTime = Math.min(Math.max(time, 0), duration);
    setCurrentTime(nextTime);

    if (audioRef.current) {
      audioRef.current.currentTime = nextTime;
    }
  }

  function handlePlayPause() {
    if (currentTime >= duration) {
      handleSeek(0);
      setIsPlaying(true);
      return;
    }

    setIsPlaying((playing) => !playing);
  }

  function handleSegmentClick(segment: TranscriptSegment) {
    handleSeek(segment.start_time_seconds);
    setIsPlaying(false);
  }

  function handleTimeUpdate() {
    if (!audioRef.current || !meeting.media_url) {
      return;
    }

    setCurrentTime(audioRef.current.currentTime);
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border border-border bg-navbar p-5">
        <Link
          href="/"
          className="mb-3 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          My meetings
        </Link>
        <h1 className="text-2xl font-semibold tracking-normal text-text-primary sm:text-3xl">
          {meeting.title}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {meetingDate} · {formatDuration(meeting.duration_seconds)}
        </p>
      </section>

      <section className="rounded-lg border border-border bg-navbar p-4 sm:p-5">
        <audio
          ref={audioRef}
          src={meeting.media_url || undefined}
          className="hidden"
          onTimeUpdate={handleTimeUpdate}
        />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-primary">Meeting playback</p>
              <p className="mt-1 text-xs text-text-secondary">
                {meeting.media_url ? "Synced to transcript" : "Placeholder media — simulated playback"}
              </p>
            </div>
            <button
              type="button"
              onClick={handlePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-purple text-white transition-colors hover:bg-secondary-purple"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          </div>

          <div className="grid gap-2">
            <input
              aria-label="Playback position"
              type="range"
              min={0}
              max={duration}
              step={0.25}
              value={currentTime}
              onChange={(event) => handleSeek(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-button-dark accent-primary-purple"
            />
            <div className="flex justify-between font-mono text-xs text-text-secondary">
              <span>{formatTimestamp(Math.floor(currentTime))}</span>
              <span>{formatTimestamp(duration)}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <section className="min-w-0 flex-1 rounded-lg border border-border bg-navbar">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <h2 className="text-lg font-semibold text-text-primary">Transcript</h2>
            <input
              aria-label="Search transcript"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search transcript"
              className="h-10 w-full rounded-md border border-border bg-button-dark px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/30 sm:max-w-xs"
            />
          </div>

          <div className="max-h-[640px] overflow-y-auto p-4 sm:p-5">
            {filteredSegments.length > 0 ? (
              <div className="flex flex-col gap-2">
                {filteredSegments.map((segment) => {
                  const isActive = activeSegment?.id === segment.id;

                  return (
                    <button
                      key={segment.id}
                      type="button"
                      ref={(element) => {
                        segmentRefs.current[segment.id] = element;
                      }}
                      onClick={() => handleSegmentClick(segment)}
                      className={cn(
                        "w-full rounded-lg border border-transparent p-3 text-left transition-colors hover:bg-button-dark/60",
                        isActive && "border-primary-purple/30 bg-primary-purple/10"
                      )}
                    >
                      <div className="mb-1 flex items-center gap-3">
                        <span className="font-medium text-primary-purple">
                          {highlightMatches(segment.speaker, searchQuery)}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {formatTimestamp(segment.start_time_seconds)}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-text-primary">
                        {highlightMatches(segment.text, searchQuery)}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-text-secondary">No transcript segments match your search.</p>
            )}
          </div>
        </section>

        <MeetingSidebar
          summary={meeting.summary}
          topics={meeting.topics}
          action_items={meeting.action_items}
          onSeek={(time) => {
            handleSeek(time);
            setIsPlaying(false);
          }}
        />
      </div>
    </div>
  );
}
