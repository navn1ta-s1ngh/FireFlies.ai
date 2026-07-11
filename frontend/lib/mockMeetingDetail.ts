export type TranscriptSegment = {
  id: number;
  speaker: string;
  start_time_seconds: number;
  end_time_seconds: number;
  text: string;
};

export type MockActionItem = {
  id: number;
  task: string;
  assigned_to: string;
  completed: boolean;
};

export type MeetingTopic = {
  id: number;
  title: string;
  start_time_seconds: number;
};

export type MockMeetingDetail = {
  id: number;
  title: string;
  date: string;
  duration_seconds: number;
  media_url: string;
  media_type: "audio" | "video";
  transcript_segments: TranscriptSegment[];
  summary: string;
  topics: MeetingTopic[];
  action_items: MockActionItem[];
};

export const mockMeetingDetail: MockMeetingDetail = {
  id: 1,
  title: "Q2 Product Roadmap Review",
  date: "2026-07-10T14:00:00.000Z",
  duration_seconds: 312,
  media_url: "",
  media_type: "audio",
  summary:
    "The team aligned on Q2 priorities: shipping the onboarding redesign, improving transcript search latency, and rolling out action-item automations. Engineering flagged integration work as the main risk, while design proposed a phased rollout for the new meeting library experience.",
  topics: [
    { id: 1, title: "Roadmap", start_time_seconds: 0 },
    { id: 2, title: "Onboarding", start_time_seconds: 42 },
    { id: 3, title: "Transcript search", start_time_seconds: 118 },
    { id: 4, title: "Action items", start_time_seconds: 194 },
    { id: 5, title: "Integrations", start_time_seconds: 220 }
  ],
  action_items: [
    {
      id: 1,
      task: "Draft onboarding rollout plan with phased milestones",
      assigned_to: "Priya Shah",
      completed: false
    },
    {
      id: 2,
      task: "Benchmark transcript search latency against current baseline",
      assigned_to: "Jordan Kim",
      completed: false
    },
    {
      id: 3,
      task: "Share integration risk assessment with leadership",
      assigned_to: "Marcus Lee",
      completed: true
    },
    {
      id: 4,
      task: "Schedule design review for meeting library cards",
      assigned_to: "Ava Patel",
      completed: false
    }
  ],
  transcript_segments: [
    {
      id: 1,
      speaker: "Ava Patel",
      start_time_seconds: 0,
      end_time_seconds: 18,
      text: "Thanks everyone for joining. Today we're reviewing the Q2 roadmap and deciding what ships before the end of the quarter."
    },
    {
      id: 2,
      speaker: "Marcus Lee",
      start_time_seconds: 18,
      end_time_seconds: 42,
      text: "From a sales perspective, customers keep asking for faster transcript search and clearer action-item follow-up inside the meeting view."
    },
    {
      id: 3,
      speaker: "Jordan Kim",
      start_time_seconds: 42,
      end_time_seconds: 68,
      text: "On the engineering side, the onboarding redesign is mostly ready, but the integrations work is still the biggest schedule risk."
    },
    {
      id: 4,
      speaker: "Priya Shah",
      start_time_seconds: 68,
      end_time_seconds: 96,
      text: "Design wants to roll out the new meeting library first, then layer in the detail page improvements once the navigation flow feels solid."
    },
    {
      id: 5,
      speaker: "Ava Patel",
      start_time_seconds: 96,
      end_time_seconds: 118,
      text: "That sequencing makes sense. Let's treat the library and detail experience as one cohesive release, not two separate launches."
    },
    {
      id: 6,
      speaker: "Marcus Lee",
      start_time_seconds: 118,
      end_time_seconds: 142,
      text: "If we can highlight transcript matches and sync playback with segments, that alone would solve a lot of customer pain."
    },
    {
      id: 7,
      speaker: "Jordan Kim",
      start_time_seconds: 142,
      end_time_seconds: 168,
      text: "We can support segment click-to-seek and active-line highlighting with client-side state. The mock data structure already maps cleanly to an API later."
    },
    {
      id: 8,
      speaker: "Priya Shah",
      start_time_seconds: 168,
      end_time_seconds: 194,
      text: "Visually, I want speaker names in purple, timestamps subdued, and a subtle highlight on the active transcript segment."
    },
    {
      id: 9,
      speaker: "Ava Patel",
      start_time_seconds: 194,
      end_time_seconds: 220,
      text: "Let's also keep the summary, topics, and action items in a right-hand sidebar on desktop so the transcript stays primary."
    },
    {
      id: 10,
      speaker: "Marcus Lee",
      start_time_seconds: 220,
      end_time_seconds: 248,
      text: "Agreed. I'll follow up with leadership on integration risk, and we should benchmark search latency before committing to the date."
    },
    {
      id: 11,
      speaker: "Jordan Kim",
      start_time_seconds: 248,
      end_time_seconds: 276,
      text: "I'll own the latency benchmark and share numbers by end of week. We should be able to ship the library view with mock data immediately."
    },
    {
      id: 12,
      speaker: "Ava Patel",
      start_time_seconds: 276,
      end_time_seconds: 312,
      text: "Great. I'll capture these action items and schedule the design review for the meeting detail layout next Tuesday."
    }
  ]
};

export function getMockMeetingDetail(id: number): MockMeetingDetail {
  return { ...mockMeetingDetail, id };
}
