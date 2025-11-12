export type TournamentStatus = "upcoming" | "active";

export interface Tournament {
  id: string | number;
  name: string;
  maxParticipants: number;
  startTime: string;
  status: TournamentStatus;
}

export interface IPaginated<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
