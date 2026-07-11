"use client";

import { Loader2, Plus } from "lucide-react";
import { FormEvent, useState } from "react";

import { ActionItem } from "@/components/ActionItems/ActionItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateTask, useDeleteTask, useMeeting, useUpdateTask } from "@/hooks/useMeetings";

export function ActionItemList({ meetingId }: { meetingId: number }) {
  const [task, setTask] = useState("");
  const { data: meeting, isLoading } = useMeeting(meetingId);
  const createTask = useCreateTask(meetingId);
  const updateTask = useUpdateTask(meetingId);
  const deleteTask = useDeleteTask(meetingId);
  const pending = createTask.isPending || updateTask.isPending || deleteTask.isPending;

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTask = task.trim();
    if (!trimmedTask) {
      return;
    }

    await createTask.mutateAsync({ task: trimmedTask });
    setTask("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action items</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleCreate} className="flex gap-2">
          <Input value={task} onChange={(event) => setTask(event.target.value)} placeholder="Add follow-up" />
          <Button size="icon" type="submit" disabled={pending} aria-label="Add action item">
            {createTask.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </form>

        {isLoading ? (
          <div className="grid gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-md bg-secondary" />
            ))}
          </div>
        ) : meeting?.tasks.length ? (
          <div className="grid gap-2">
            {meeting.tasks.map((item) => (
              <ActionItem
                key={item.id}
                item={item}
                disabled={pending}
                onToggle={(completed) =>
                  updateTask.mutate({ taskId: item.id, payload: { completed } })
                }
                onDelete={() => deleteTask.mutate(item.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No action items yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

