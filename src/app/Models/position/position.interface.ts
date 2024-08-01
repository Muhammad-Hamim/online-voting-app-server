export type TPosition = {
  title: string;
  description: string;
  duration: string;
  status: "pending" | "ongoing" | "terminated" | "completed";
  terminationMessage?: string;
  maxVotes: number;
  maxCandidate: number;
};
