"use client";

import { BarChart3, CheckCircle2, MessageSquareText, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInsights } from "@/hooks/useMeetings";
import { formatDuration } from "@/lib/utils";

export function MeetingInsights({ meetingId }: { meetingId: number }) {
  const { data: insights, isLoading, isError } = useInsights(meetingId);

  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-lg border bg-card" />;
  }

  if (isError || !insights) {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">Insights unavailable.</CardContent>
      </Card>
    );
  }

  const metrics = [
    { label: "Duration", value: formatDuration(insights.duration), icon: BarChart3 },
    { label: "Participants", value: insights.participant_count, icon: Users },
    { label: "Lines", value: insights.transcript_line_count, icon: MessageSquareText },
    {
      label: "Done",
      value: `${insights.completed_action_item_count}/${insights.action_item_count}`,
      icon: CheckCircle2
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div key={metric.label} className="rounded-md border p-3">
                <Icon className="h-4 w-4 text-primary" />
                <p className="mt-3 text-lg font-semibold">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3">
          <p className="text-sm font-medium">Speaker balance</p>
          {insights.top_speakers.length > 0 ? (
            insights.top_speakers.map((speaker) => (
              <div key={speaker.speaker} className="grid gap-1">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span>{speaker.speaker}</span>
                  <span className="font-mono text-muted-foreground">{Math.round(speaker.talk_ratio * 100)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(speaker.talk_ratio * 100, 4)}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No speaker data yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

