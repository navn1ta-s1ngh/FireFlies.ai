import Link from "next/link";
import { CalendarDays, Clock, ListChecks, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";
import type { Meeting } from "@/types/meeting";

export function MeetingCard({ meeting }: { meeting: Meeting }) {
  const date = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(meeting.meeting_date));
  const incompleteTasks = meeting.tasks.filter((task) => !task.completed).length;

  return (
    <Link href={`/meeting/${meeting.id}`} className="group block">
      <Card className="h-full transition-colors hover:border-primary/60">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="line-clamp-2 text-base leading-6">{meeting.title}</CardTitle>
            <Badge variant="secondary">{formatDuration(meeting.duration)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex h-full flex-col gap-5">
          <p className="line-clamp-3 min-h-14 text-sm text-muted-foreground">
            {meeting.description ?? "No description added."}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {date}
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {meeting.participants.length}
            </span>
            <span className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              {incompleteTasks} open
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Updated
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

