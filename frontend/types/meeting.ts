export type Participant = {
  id: number;
  meeting_id: number;
  name: string;
  email?: string | null;
};

export type TranscriptLine = {
  id: number;
  meeting_id: number;
  speaker: string;
  timestamp: number;
  text: string;
};

export type SummaryChapter = {
  title: string;
  start: number;
  end: number;
};

export type Summary = {
  id: number;
  meeting_id: number;
  overview?: string | null;
  key_topics: string[];
  chapters: SummaryChapter[];
};

export type ActionItem = {
  id: number;
  meeting_id: number;
  task: string;
  assigned_to?: string | null;
  completed: boolean;
};

export type Meeting = {
  id: number;
  title: string;
  description?: string | null;
  meeting_date: string;
  duration: number;
  created_at: string;
  updated_at: string;
  participants: Participant[];
  tasks: ActionItem[];
};

export type MeetingDetail = Meeting & {
  transcript_lines: TranscriptLine[];
  summary?: Summary | null;
};

export type MeetingCreateInput = {
  title: string;
  description?: string | null;
  meeting_date: string;
  duration: number;
  participants?: Array<{
    name: string;
    email?: string | null;
  }>;
};

export type MeetingUpdateInput = Partial<Omit<MeetingCreateInput, "participants">>;

export type ActionItemCreateInput = {
  task: string;
  assigned_to?: string | null;
  completed?: boolean;
};

export type ActionItemUpdateInput = Partial<ActionItemCreateInput>;

export type SpeakerInsight = {
  speaker: string;
  line_count: number;
  word_count: number;
  talk_ratio: number;
};

export type MeetingInsights = {
  meeting_id: number;
  duration: number;
  participant_count: number;
  transcript_line_count: number;
  action_item_count: number;
  completed_action_item_count: number;
  top_speakers: SpeakerInsight[];
};

export type SearchResult = {
  type: "meeting" | "transcript";
  meeting_id: number;
  title: string;
  snippet?: string | null;
  timestamp?: number | null;
};

