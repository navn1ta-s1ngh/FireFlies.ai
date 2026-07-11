"use client";

import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import type { MeetingTopic, MockActionItem } from "@/lib/mockMeetingDetail";
import { cn, formatTimestamp } from "@/lib/utils";

type MeetingSidebarProps = {
  summary: string;
  topics: MeetingTopic[];
  action_items: MockActionItem[];
  onSeek: (time: number) => void;
};

export function MeetingSidebar({ summary, topics, action_items, onSeek }: MeetingSidebarProps) {
  const [items, setItems] = useState(action_items);

  function toggleItem(id: number) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  }

  return (
    <aside className="flex w-full flex-col gap-4 lg:w-80 lg:shrink-0 xl:w-96">
      <section className="rounded-lg border border-border bg-navbar p-5">
        <h2 className="text-lg font-semibold text-text-primary">Summary</h2>
        <p className="mt-3 text-sm leading-6 text-text-secondary">{summary}</p>
      </section>

      <section className="rounded-lg border border-border bg-navbar p-5">
        <h2 className="text-lg font-semibold text-text-primary">Topics</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {topics.map((topic) => (
            <li key={topic.id}>
              <button
                type="button"
                onClick={() => onSeek(topic.start_time_seconds)}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-button-dark/40 px-3 py-2.5 text-left transition-colors hover:border-primary-purple hover:bg-button-dark"
              >
                <span className="text-sm font-medium text-text-primary">{topic.title}</span>
                <span className="shrink-0 rounded-full bg-button-dark px-2.5 py-1 text-xs text-text-secondary">
                  {formatTimestamp(topic.start_time_seconds)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-border bg-navbar p-5">
        <h2 className="text-lg font-semibold text-text-primary">Action items</h2>
        <ul className="mt-3 flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-button-dark/40 p-3"
            >
              <Checkbox
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
                aria-label={`Mark "${item.task}" as ${item.completed ? "incomplete" : "complete"}`}
                className="mt-0.5"
              />
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm text-text-primary",
                    item.completed && "text-text-secondary line-through"
                  )}
                >
                  {item.task}
                </p>
                <span className="mt-2 inline-block rounded-full border border-border bg-button-dark px-2 py-0.5 text-xs text-text-secondary">
                  {item.assigned_to}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
