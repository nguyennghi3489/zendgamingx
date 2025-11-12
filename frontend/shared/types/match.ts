import type { Participant } from "./participant";

export interface Match {
  id: string | number;
  winner?: Participant;
  tournamentId: string | number;
  participant1?: Participant;
  participant2?: Participant;
  participant1Score?: number;
  participant2Score?: number;
  status: "pending" | "upcoming" | "in-progress" | "completed";
  scheduledTime?: string;
}
