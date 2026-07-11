"use client";

import { CalendarPlus } from "lucide-react";

import { MeetingCard } from "@/components/MeetingCard/MeetingCard";
import { Card, CardContent } from "@/components/ui/card";
import { useMeetings } from "@/hooks/useMeetings";

export function MeetingList() {
  const { data: meetings = [], isLoading, isError } = useMeetings();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-52 animate-pulse rounded-lg border bg-card" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Unable to load meetings. Check that the API is running.
        </CardContent>
      </Card>
    );
  }

  if (meetings.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-72 flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary text-muted-foreground">
            <CalendarPlus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">No meetings yet</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Create a meeting to start building transcripts, summaries, insights, and action items.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
}

