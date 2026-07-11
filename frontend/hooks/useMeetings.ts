"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { meetingService } from "@/services/meetingService";
import type {
  ActionItemCreateInput,
  ActionItemUpdateInput,
  MeetingCreateInput,
  MeetingUpdateInput
} from "@/types/meeting";

export const meetingKeys = {
  all: ["meetings"] as const,
  detail: (id: number) => ["meetings", id] as const,
  transcript: (id: number) => ["meetings", id, "transcript"] as const,
  summary: (id: number) => ["meetings", id, "summary"] as const,
  insights: (id: number) => ["meetings", id, "insights"] as const,
  search: (query: string) => ["search", query] as const
};

export function useMeetings() {
  return useQuery({
    queryKey: meetingKeys.all,
    queryFn: meetingService.listMeetings
  });
}

export function useMeeting(id: number) {
  return useQuery({
    queryKey: meetingKeys.detail(id),
    queryFn: () => meetingService.getMeeting(id),
    enabled: Number.isFinite(id)
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MeetingCreateInput) => meetingService.createMeeting(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
    }
  });
}

export function useUpdateMeeting(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MeetingUpdateInput) => meetingService.updateMeeting(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(id) });
    }
  });
}

export function useDeleteMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => meetingService.deleteMeeting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
    }
  });
}

export function useTranscript(meetingId: number) {
  return useQuery({
    queryKey: meetingKeys.transcript(meetingId),
    queryFn: () => meetingService.getTranscript(meetingId),
    enabled: Number.isFinite(meetingId)
  });
}

export function useSummary(meetingId: number) {
  return useQuery({
    queryKey: meetingKeys.summary(meetingId),
    queryFn: () => meetingService.getSummary(meetingId),
    enabled: Number.isFinite(meetingId),
    retry: false
  });
}

export function useCreateTask(meetingId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ActionItemCreateInput) => meetingService.createTask(meetingId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.insights(meetingId) });
    }
  });
}

export function useUpdateTask(meetingId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: number; payload: ActionItemUpdateInput }) =>
      meetingService.updateTask(taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.insights(meetingId) });
    }
  });
}

export function useDeleteTask(meetingId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: number) => meetingService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.insights(meetingId) });
    }
  });
}

export function useInsights(meetingId: number) {
  return useQuery({
    queryKey: meetingKeys.insights(meetingId),
    queryFn: () => meetingService.getInsights(meetingId),
    enabled: Number.isFinite(meetingId)
  });
}

export function useGlobalSearch(query: string) {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: meetingKeys.search(normalizedQuery),
    queryFn: () => meetingService.search(normalizedQuery),
    enabled: normalizedQuery.length > 1
  });
}

