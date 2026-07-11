"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";

import { useGlobalSearch } from "@/hooks/useMeetings";
import { formatTimestamp } from "@/lib/utils";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const { data: results = [], isFetching } = useGlobalSearch(query);
  const showResults = query.trim().length > 1;

  return (
    <div className="relative w-full max-w-2xl">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        aria-label="Search meetings"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search meetings, transcripts, action items"
        className="h-10 w-full rounded-md border bg-card pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring"
      />

      {showResults ? (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-lg border bg-popover shadow-xl">
          <div className="max-h-80 overflow-auto p-2">
            {isFetching ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">Searching...</p>
            ) : results.length > 0 ? (
              results.map((result) => (
                <Link
                  key={`${result.type}-${result.meeting_id}-${result.timestamp ?? "meeting"}`}
                  href={`/meeting/${result.meeting_id}`}
                  onClick={() => setQuery("")}
                  className="block rounded-md px-3 py-2 transition-colors hover:bg-secondary"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium">{result.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {result.type === "transcript" && result.timestamp !== null && result.timestamp !== undefined
                        ? formatTimestamp(result.timestamp)
                        : "Meeting"}
                    </span>
                  </div>
                  {result.snippet ? (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{result.snippet}</p>
                  ) : null}
                </Link>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-muted-foreground">No results found</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

