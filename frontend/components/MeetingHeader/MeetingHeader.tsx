"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, Users } from "lucide-react";

import { DeleteMeetingModal } from "@/components/MeetingForm/DeleteMeetingModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMeeting } from "@/hooks/useMeetings";
import { formatDuration } from "@/lib/utils";

export function MeetingHeader({ meetingId }: { meetingId: number }) {
  const { data: meeting, isLoading } = useMeeting(meetingId);

  if (isLoading || !meeting) {
    return <div className="h-36 animate-pulse rounded-lg border bg-card" />;
  }

  const meetingDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(meeting.meeting_date));

  return (
    <section className="flex flex-col gap-5 rounded-lg border bg-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Button asChild variant="ghost" className="mb-3 -ml-3 text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Meetings
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">{meeting.title}</h1>
          {meeting.description ? (
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{meeting.description}</p>
          ) : null}
        </div>

        <DeleteMeetingModal meetingId={meeting.id} meetingTitle={meeting.title} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge className="gap-1.5" variant="outline">
          <CalendarDays className="h-3.5 w-3.5" />
          {meetingDate}
        </Badge>
        <Badge className="gap-1.5" variant="outline">
          <Clock className="h-3.5 w-3.5" />
          {formatDuration(meeting.duration)}
        </Badge>
        <Badge className="gap-1.5" variant="outline">
          <Users className="h-3.5 w-3.5" />
          {meeting.participants.length} participants
        </Badge>
      </div>
    </section>
  );
}

