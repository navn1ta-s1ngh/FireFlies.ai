"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { ActionItemList } from "@/components/ActionItems/ActionItemList";
import { MeetingHeader } from "@/components/MeetingHeader/MeetingHeader";
import { MeetingInsights } from "@/components/MeetingInsights/MeetingInsights";
import { MediaPlayer } from "@/components/Player/MediaPlayer";
import { SummaryCard } from "@/components/Summary/SummaryCard";
import { TranscriptPanel } from "@/components/Transcript/TranscriptPanel";

export default function MeetingDetailsPage() {
  const params = useParams<{ id: string }>();
  const meetingId = Number(params.id);
  const [currentTime, setCurrentTime] = useState(0);
  const stableMeetingId = useMemo(() => (Number.isFinite(meetingId) ? meetingId : 0), [meetingId]);

  return (
    <div className="flex flex-col gap-6">
      <MeetingHeader meetingId={stableMeetingId} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="flex min-w-0 flex-col gap-6">
          <MediaPlayer currentTime={currentTime} onTimeChange={setCurrentTime} />
          <TranscriptPanel
            meetingId={stableMeetingId}
            activeTimestamp={currentTime}
            onSeek={setCurrentTime}
          />
        </section>

        <aside className="flex min-w-0 flex-col gap-6">
          <SummaryCard meetingId={stableMeetingId} />
          <MeetingInsights meetingId={stableMeetingId} />
          <ActionItemList meetingId={stableMeetingId} />
        </aside>
      </div>
    </div>
  );
}

