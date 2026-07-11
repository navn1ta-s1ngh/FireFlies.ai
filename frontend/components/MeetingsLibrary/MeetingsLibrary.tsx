"use client";

import Link from "next/link";
import { CalendarPlus, Search } from "lucide-react";
import { useState } from "react";

import { CreateMeetingModal } from "@/components/MeetingForm/CreateMeetingModal";
import { useMeetingsFilter } from "@/hooks/useMeetingsFilter";
import { mockMeetings, type MockMeeting } from "@/lib/mockMeetings";
import { cn, formatDuration } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("en", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit"
});

const controlClassName =
  "h-10 rounded-md border border-border bg-button-dark px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/30";

function MeetingRow({ meeting }: { meeting: MockMeeting }) {
  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="group block rounded-lg border border-border bg-navbar p-4 transition-colors hover:border-primary-purple sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-medium text-text-primary">{meeting.title}</h2>
          <p className="mt-1 text-sm text-text-secondary">{dateFormatter.format(new Date(meeting.date))}</p>
          <p className="mt-2 text-sm text-text-secondary">{meeting.participants.join(", ")}</p>
        </div>
        <p className="shrink-0 text-sm text-text-secondary">{formatDuration(meeting.duration_seconds)}</p>
      </div>
    </Link>
  );
}

export function MeetingsLibrary() {
  const [createOpen, setCreateOpen] = useState(false);
  const { filters, updateFilters, filteredMeetings, participantOptions, hasActiveFilters } =
    useMeetingsFilter(mockMeetings);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-normal text-text-primary">My meetings</h1>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-purple px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-secondary-purple"
        >
          <CalendarPlus className="h-4 w-4" />
          New meeting
        </button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <input
          aria-label="Search meetings by title"
          value={filters.search}
          onChange={(event) => updateFilters({ search: event.target.value })}
          placeholder="Search meetings"
          className="h-10 w-full rounded-md border border-border bg-button-dark pl-9 pr-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/30"
        />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <label className="flex flex-col gap-1.5 text-sm text-text-secondary sm:min-w-[180px]">
          <span>Participant</span>
          <select
            value={filters.participant}
            onChange={(event) => updateFilters({ participant: event.target.value })}
            className={controlClassName}
          >
            <option value="">All participants</option>
            {participantOptions.map((participant) => (
              <option key={participant} value={participant}>
                {participant}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-text-secondary sm:min-w-[160px]">
          <span>From</span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(event) => updateFilters({ dateFrom: event.target.value })}
            className={cn(controlClassName, "scheme-dark")}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-text-secondary sm:min-w-[160px]">
          <span>To</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(event) => updateFilters({ dateTo: event.target.value })}
            className={cn(controlClassName, "scheme-dark")}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-text-secondary sm:min-w-[180px] lg:ml-auto">
          <span>Sort</span>
          <select
            value={filters.sort}
            onChange={(event) => updateFilters({ sort: event.target.value as "recent" | "oldest" })}
            className={controlClassName}
          >
            <option value="recent">Most recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </label>
      </div>

      {filteredMeetings.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredMeetings.map((meeting) => (
            <MeetingRow key={meeting.id} meeting={meeting} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-lg border border-border bg-navbar p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-button-dark text-text-secondary">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-text-primary">No meetings found</h2>
            <p className="mt-1 max-w-md text-sm text-text-secondary">
              {hasActiveFilters
                ? "Try adjusting your search or filters to find a meeting."
                : "Create a meeting to start building transcripts, summaries, and action items."}
            </p>
          </div>
        </div>
      )}

      <CreateMeetingModal open={createOpen} onOpenChange={setCreateOpen} hideTrigger />
    </div>
  );
}
