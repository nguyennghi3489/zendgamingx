import { defineStore } from "pinia";

interface State {
  currentTournament: Tournament | null;
  joining: boolean;
  matches: Match[];
  loading: boolean;
  error: string | null;
}

export const useTournamentDetailStore = defineStore("tournamentDetail", {
  state: (): State => ({
    currentTournament: null,
    matches: [],
    loading: false,
    error: null,
    joining: false,
  }),
});
