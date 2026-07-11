import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
}

export function formatTimestamp(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

export function speakerColor(speaker: string) {
  const palette = [
    "bg-teal-500/15 text-teal-200 border-teal-500/30",
    "bg-amber-500/15 text-amber-200 border-amber-500/30",
    "bg-rose-500/15 text-rose-200 border-rose-500/30",
    "bg-sky-500/15 text-sky-200 border-sky-500/30",
    "bg-lime-500/15 text-lime-200 border-lime-500/30"
  ];
  const hash = speaker.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return palette[hash % palette.length];
}

