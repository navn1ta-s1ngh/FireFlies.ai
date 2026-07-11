"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatTimestamp } from "@/lib/utils";

type MediaPlayerProps = {
  currentTime: number;
  duration?: number;
  onTimeChange: (time: number) => void;
};

export function MediaPlayer({ currentTime, duration = 2760, onTimeChange }: MediaPlayerProps) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) {
      return;
    }

    const interval = window.setInterval(() => {
      onTimeChange(Math.min(currentTime + 1, duration));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [currentTime, duration, onTimeChange, playing]);

  function seek(delta: number) {
    onTimeChange(Math.min(Math.max(currentTime + delta, 0), duration));
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Audio playback</p>
            <p className="mt-1 text-xs text-muted-foreground">Transcript sync ready</p>
          </div>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={() => seek(-15)} aria-label="Back 15 seconds">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={() => setPlaying((value) => !value)} aria-label="Play or pause">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => seek(15)} aria-label="Forward 15 seconds">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-2">
          <input
            aria-label="Playback position"
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(event) => onTimeChange(Number(event.target.value))}
            className="h-2 w-full accent-primary"
          />
          <div className="flex justify-between font-mono text-xs text-muted-foreground">
            <span>{formatTimestamp(currentTime)}</span>
            <span>{formatTimestamp(duration)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

