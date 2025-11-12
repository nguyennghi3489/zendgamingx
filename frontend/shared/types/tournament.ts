import type { Match } from "./match";
import type { Participant } from "./participant";

export type TournamentStatus = "upcoming" | "active";

export interface Tournament {
  id: string | number;
  name: string;
  maxParticipants: number;
  startTime: string;
  status: TournamentStatus;
  participants: Participant[];
  currentParticipants?: number;
  matches: Match[];
}

export interface IPaginated<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
