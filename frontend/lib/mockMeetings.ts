export type MockMeeting = {
  id: number;
  title: string;
  date: string;
  duration_seconds: number;
  participants: string[];
};

export const mockMeetings: MockMeeting[] = [
  {
    id: 1,
    title: "Q2 Product Roadmap Review",
    date: "2026-07-10T14:00:00.000Z",
    duration_seconds: 3420,
    participants: ["Ava Patel", "Marcus Lee", "Jordan Kim"]
  },
  {
    id: 2,
    title: "Customer Success Weekly Sync",
    date: "2026-07-08T16:30:00.000Z",
    duration_seconds: 2700,
    participants: ["Sofia Nguyen", "Eli Brooks", "Ava Patel"]
  },
  {
    id: 3,
    title: "Engineering Sprint Planning",
    date: "2026-07-05T10:00:00.000Z",
    duration_seconds: 4500,
    participants: ["Jordan Kim", "Priya Shah", "Marcus Lee", "Eli Brooks"]
  },
  {
    id: 4,
    title: "Sales Pipeline Deep Dive",
    date: "2026-06-28T13:15:00.000Z",
    duration_seconds: 1980,
    participants: ["Marcus Lee", "Sofia Nguyen"]
  },
  {
    id: 5,
    title: "Design Critique: Onboarding Flow",
    date: "2026-06-22T11:45:00.000Z",
    duration_seconds: 3120,
    participants: ["Priya Shah", "Ava Patel", "Jordan Kim"]
  },
  {
    id: 6,
    title: "All-Hands: Company Updates",
    date: "2026-06-15T17:00:00.000Z",
    duration_seconds: 5400,
    participants: ["Ava Patel", "Marcus Lee", "Sofia Nguyen", "Eli Brooks", "Priya Shah", "Jordan Kim"]
  }
];
