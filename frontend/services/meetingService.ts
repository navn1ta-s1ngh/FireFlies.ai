import { api } from "@/services/api";
import type {
  ActionItem,
  ActionItemCreateInput,
  ActionItemUpdateInput,
  Meeting,
  MeetingCreateInput,
  MeetingDetail,
  MeetingInsights,
  MeetingUpdateInput,
  SearchResult,
  Summary,
  TranscriptLine
} from "@/types/meeting";

export const meetingService = {
  async listMeetings() {
    const { data } = await api.get<Meeting[]>("/meetings");
    return data;
  },

  async getMeeting(id: number) {
    const { data } = await api.get<MeetingDetail>(`/meetings/${id}`);
    return data;
  },

  async createMeeting(payload: MeetingCreateInput) {
    const { data } = await api.post<MeetingDetail>("/meetings", payload);
    return data;
  },

  async updateMeeting(id: number, payload: MeetingUpdateInput) {
    const { data } = await api.put<MeetingDetail>(`/meetings/${id}`, payload);
    return data;
  },

  async deleteMeeting(id: number) {
    await api.delete(`/meetings/${id}`);
  },

  async getTranscript(meetingId: number) {
    const { data } = await api.get<TranscriptLine[]>(`/meetings/${meetingId}/transcript`);
    return data;
  },

  async getSummary(meetingId: number) {
    const { data } = await api.get<Summary>(`/meetings/${meetingId}/summary`);
    return data;
  },

  async createTask(meetingId: number, payload: ActionItemCreateInput) {
    const { data } = await api.post<ActionItem>(`/meetings/${meetingId}/tasks`, payload);
    return data;
  },

  async updateTask(taskId: number, payload: ActionItemUpdateInput) {
    const { data } = await api.put<ActionItem>(`/tasks/${taskId}`, payload);
    return data;
  },

  async deleteTask(taskId: number) {
    await api.delete(`/tasks/${taskId}`);
  },

  async getInsights(meetingId: number) {
    const { data } = await api.get<MeetingInsights>(`/meetings/${meetingId}/insights`);
    return data;
  },

  async search(query: string) {
    const { data } = await api.get<SearchResult[]>("/search", {
      params: { q: query }
    });
    return data;
  }
};

