"use client";

import { useMemo, useState } from "react";

import { TranscriptLine } from "@/components/Transcript/TranscriptLine";
import { TranscriptSearch } from "@/components/Transcript/TranscriptSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranscript } from "@/hooks/useMeetings";

type TranscriptPanelProps = {
  meetingId: number;
  activeTimestamp: number;
  onSeek: (timestamp: number) => void;
};

export function TranscriptPanel({ meetingId, activeTimestamp, onSeek }: TranscriptPanelProps) {
  const [query, setQuery] = useState("");
  const { data: transcript = [], isLoading, isError } = useTranscript(meetingId);
  const normalizedQuery = query.trim().toLowerCase();

  const activeLineId = useMemo(() => {
    const line = transcript.find((item, index) => {
      const next = transcript[index + 1];
      return activeTimestamp >= item.timestamp && (!next || activeTimestamp < next.timestamp);
    });

    return line?.id;
  }, [activeTimestamp, transcript]);

  const filteredTranscript = useMemo(() => {
    if (!normalizedQuery) {
      return transcript;
    }

    return transcript.filter(
      (line) =>
        line.text.toLowerCase().includes(normalizedQuery) ||
        line.speaker.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery, transcript]);

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Transcript</CardTitle>
          <div className="w-full sm:w-80">
            <TranscriptSearch value={query} onChange={setQuery} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-md bg-secondary" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-muted-foreground">Transcript unavailable.</p>
        ) : filteredTranscript.length > 0 ? (
          <div className="max-h-[680px] overflow-auto pr-2">
            <div className="grid gap-2">
              {filteredTranscript.map((line) => (
                <TranscriptLine
                  key={line.id}
                  line={line}
                  active={line.id === activeLineId}
                  matched={Boolean(normalizedQuery)}
                  onSeek={onSeek}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No transcript lines match your search.</p>
        )}
      </CardContent>
    </Card>
  );
}

