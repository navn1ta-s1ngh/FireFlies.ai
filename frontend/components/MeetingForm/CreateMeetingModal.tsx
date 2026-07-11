"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMeeting } from "@/hooks/useMeetings";

const createMeetingSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  meetingDate: z.string().min(1, "Meeting date is required"),
  durationMinutes: z.coerce.number().int().min(0),
  participants: z.string().optional()
});

type CreateMeetingForm = z.infer<typeof createMeetingSchema>;

function toDatetimeLocal(date: Date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

function parseParticipants(value?: string) {
  return (value ?? "")
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const [name, email] = row.split(",").map((part) => part.trim());
      return { name, email: email || null };
    })
    .filter((participant) => participant.name.length > 0);
}

type CreateMeetingModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
};

export function CreateMeetingModal({
  open: controlledOpen,
  onOpenChange,
  hideTrigger = false
}: CreateMeetingModalProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;

  function setOpen(nextOpen: boolean) {
    if (onOpenChange) {
      onOpenChange(nextOpen);
      return;
    }

    setInternalOpen(nextOpen);
  }
  const router = useRouter();
  const createMeeting = useCreateMeeting();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateMeetingForm>({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: {
      title: "",
      description: "",
      meetingDate: toDatetimeLocal(new Date()),
      durationMinutes: 45,
      participants: ""
    }
  });

  async function onSubmit(values: CreateMeetingForm) {
    const meeting = await createMeeting.mutateAsync({
      title: values.title,
      description: values.description || null,
      meeting_date: new Date(values.meetingDate).toISOString(),
      duration: values.durationMinutes * 60,
      participants: parseParticipants(values.participants)
    });

    reset();
    setOpen(false);
    router.push(`/meeting/${meeting.id}`);
  }

  return (
    <>
      {hideTrigger ? null : (
        <Button onClick={() => setOpen(true)}>
          <CalendarPlus className="h-4 w-4" />
          New meeting
        </Button>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur">
          <div
            aria-modal="true"
            role="dialog"
            className="w-full max-w-2xl rounded-lg border bg-card shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b p-5">
              <div>
                <h2 className="text-lg font-semibold">Create meeting</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Capture the core metadata now; transcripts and summaries can be attached later.
                </p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 p-5">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} placeholder="Product sync" />
                {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Weekly review of product decisions and follow-ups"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="meetingDate">Date</Label>
                  <Input id="meetingDate" type="datetime-local" {...register("meetingDate")} />
                  {errors.meetingDate ? (
                    <p className="text-xs text-destructive">{errors.meetingDate.message}</p>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="durationMinutes">Duration</Label>
                  <Input id="durationMinutes" type="number" min={0} {...register("durationMinutes")} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="participants">Participants</Label>
                <Textarea
                  id="participants"
                  {...register("participants")}
                  placeholder={"Ava Patel, ava@example.com\nMarcus Lee, marcus@example.com"}
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-5">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMeeting.isPending}>
                  {createMeeting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

