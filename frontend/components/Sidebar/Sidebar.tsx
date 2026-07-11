"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, Home, ListChecks, Search, Settings, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Meetings", icon: Home },
  { href: "/", label: "Calendar", icon: CalendarDays },
  { href: "/", label: "Search", icon: Search },
  { href: "/", label: "Tasks", icon: ListChecks },
  { href: "/", label: "Insights", icon: BarChart3 },
  { href: "/", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-card/70 backdrop-blur lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-3 border-b px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">Minutes AI</p>
          <p className="text-xs text-muted-foreground">Meeting intelligence</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.label === "Meetings" && pathname === "/";

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                active && "bg-secondary text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="rounded-lg border bg-background p-3">
          <p className="text-sm font-medium">AI processing</p>
          <p className="mt-1 text-xs text-muted-foreground">Transcription, summaries, insights</p>
        </div>
      </div>
    </aside>
  );
}

