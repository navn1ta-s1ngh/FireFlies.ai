"use client";

import { Loader2, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useDeleteMeeting } from "@/hooks/useMeetings";

type DeleteMeetingModalProps = {
  meetingId: number;
  meetingTitle: string;
};

export function DeleteMeetingModal({ meetingId, meetingTitle }: DeleteMeetingModalProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const deleteMeeting = useDeleteMeeting();

  async function handleDelete() {
    await deleteMeeting.mutateAsync(meetingId);
    setOpen(false);
    router.push("/");
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur">
          <div aria-modal="true" role="alertdialog" className="w-full max-w-md rounded-lg border bg-card shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b p-5">
              <div>
                <h2 className="text-lg font-semibold">Delete meeting</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This removes <span className="font-medium text-foreground">{meetingTitle}</span> and its transcript,
                  summary, and action items.
                </p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex justify-end gap-2 p-5">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteMeeting.isPending}>
                {deleteMeeting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
