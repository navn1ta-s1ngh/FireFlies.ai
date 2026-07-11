"use client";

import { useMemo, useState } from "react";

import type { MockMeeting } from "@/lib/mockMeetings";

export type MeetingSort = "recent" | "oldest";

export type MeetingsFilterState = {
  search: string;
  participant: string;
  dateFrom: string;
  dateTo: string;
  sort: MeetingSort;
};

const defaultFilters: MeetingsFilterState = {
  search: "",
  participant: "",
  dateFrom: "",
  dateTo: "",
  sort: "recent"
};

function filterMeetings(meetings: MockMeeting[], filters: MeetingsFilterState) {
  const searchQuery = filters.search.trim().toLowerCase();

  return meetings.filter((meeting) => {
    if (searchQuery && !meeting.title.toLowerCase().includes(searchQuery)) {
      return false;
    }

    if (filters.participant && !meeting.participants.includes(filters.participant)) {
      return false;
    }

    const meetingDate = new Date(meeting.date);

    if (filters.dateFrom) {
      const fromDate = new Date(`${filters.dateFrom}T00:00:00`);

      if (meetingDate < fromDate) {
        return false;
      }
    }

    if (filters.dateTo) {
      const toDate = new Date(`${filters.dateTo}T23:59:59.999`);

      if (meetingDate > toDate) {
        return false;
      }
    }

    return true;
  });
}

function sortMeetings(meetings: MockMeeting[], sort: MeetingSort) {
  return [...meetings].sort((left, right) => {
    const leftTime = new Date(left.date).getTime();
    const rightTime = new Date(right.date).getTime();

    return sort === "recent" ? rightTime - leftTime : leftTime - rightTime;
  });
}

export function useMeetingsFilter(meetings: MockMeeting[]) {
  const [filters, setFilters] = useState<MeetingsFilterState>(defaultFilters);

  const participantOptions = useMemo(
    () => [...new Set(meetings.flatMap((meeting) => meeting.participants))].sort(),
    [meetings]
  );

  const filteredMeetings = useMemo(() => {
    const filtered = filterMeetings(meetings, filters);
    return sortMeetings(filtered, filters.sort);
  }, [meetings, filters]);

  function updateFilters(partial: Partial<MeetingsFilterState>) {
    setFilters((current) => ({ ...current, ...partial }));
  }

  function resetFilters() {
    setFilters(defaultFilters);
  }

  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.participant.length > 0 ||
    filters.dateFrom.length > 0 ||
    filters.dateTo.length > 0;

  return {
    filters,
    updateFilters,
    resetFilters,
    filteredMeetings,
    participantOptions,
    hasActiveFilters
  };
}
