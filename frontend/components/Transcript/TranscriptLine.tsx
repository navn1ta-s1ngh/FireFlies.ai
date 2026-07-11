"use client";

import { Badge } from "@/components/ui/badge";
import { cn, formatTimestamp, speakerColor } from "@/lib/utils";
import type { TranscriptLine as TranscriptLineType } from "@/types/meeting";

type TranscriptLineProps = {
  line: TranscriptLineType;
  active?: boolean;
  matched?: boolean;
  onSeek?: (timestamp: number) => void;
};

export function TranscriptLine({ line, active = false, matched = false, onSeek }: TranscriptLineProps) {
  return (
    <button
      type="button"
      onClick={() => onSeek?.(line.timestamp)}
      className={cn(
        "grid w-full grid-cols-[56px_minmax(0,1fr)] gap-3 rounded-md border border-transparent p-3 text-left transition-colors hover:bg-secondary",
        active && "border-primary/40 bg-primary/10",
        matched && !active && "bg-accent/20"
      )}
    >
      <span className="font-mono text-xs text-muted-foreground">{formatTimestamp(line.timestamp)}</span>
      <span className="min-w-0">
        <Badge className={cn("mb-2 border", speakerColor(line.speaker))} variant="outline">
          {line.speaker}
        </Badge>
        <span className="block text-sm leading-6 text-foreground">{line.text}</span>
      </span>
    </button>
  );
}

