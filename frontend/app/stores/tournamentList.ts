import { defineStore } from "pinia";
import type { Tournament } from "~~/shared/types/tournament";

interface State {
  tournaments: Tournament[];
  loading: boolean;
  error: string | null;
  type: "all" | "upcoming";
}

export const useTournamentListStore = defineStore("tournaments", {
  state: (): State => ({
    tournaments: [],
    loading: false,
    error: null,
    type: "upcoming",
  }),
});
