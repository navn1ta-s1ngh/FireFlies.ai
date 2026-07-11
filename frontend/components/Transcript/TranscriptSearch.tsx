"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type TranscriptSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TranscriptSearch({ value, onChange }: TranscriptSearchProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        aria-label="Search transcript"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search transcript"
        className="pl-9"
      />
    </div>
  );
}

