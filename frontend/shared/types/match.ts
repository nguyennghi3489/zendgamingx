import type { Participant } from "./participant";

export interface Match {
  id: string | number;
  winner?: number;
  tournamentId: string | number;
  participant1Id?: number;
  participant2Id?: number;
  status: "pending" | "upcoming" | "in-progress" | "completed";
  scheduledTime?: string;
}
