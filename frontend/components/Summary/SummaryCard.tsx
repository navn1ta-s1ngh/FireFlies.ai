"use client";

import { Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSummary } from "@/hooks/useMeetings";
import { formatTimestamp } from "@/lib/utils";

export function SummaryCard({ meetingId }: { meetingId: number }) {
  const { data: summary, isLoading, isError } = useSummary(meetingId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        {isLoading ? (
          <div className="grid gap-3">
            <div className="h-16 animate-pulse rounded-md bg-secondary" />
            <div className="h-8 animate-pulse rounded-md bg-secondary" />
          </div>
        ) : isError || !summary ? (
          <p className="text-sm text-muted-foreground">Summary unavailable.</p>
        ) : (
          <>
            <p className="text-sm leading-6 text-muted-foreground">{summary.overview}</p>

            <div className="flex flex-wrap gap-2">
              {summary.key_topics.map((topic) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>

            <div className="grid gap-2">
              {summary.chapters.map((chapter) => (
                <div key={`${chapter.title}-${chapter.start}`} className="rounded-md border p-3">
                  <p className="text-sm font-medium">{chapter.title}</p>
                  <p className="mt-1 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatTimestamp(chapter.start)} - {formatTimestamp(chapter.end)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

