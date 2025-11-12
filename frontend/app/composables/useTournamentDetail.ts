import { getTournamentById } from "~/services/tournaments";

export const useTournamentDetail = () => {
  const store = useTournamentDetailStore();
  const { currentTournament, loading, error } = storeToRefs(store);

  const fetchTournamentDetail = async (id: string) => {
    try {
      store.loading = true;
      store.error = null;

      const tournamentsDetail = await getTournamentById(id);

      store.currentTournament = tournamentsDetail;
    } catch (err: unknown) {
      store.error = (err as Error).message || "Failed to fetch tournaments";
    } finally {
      store.loading = false;
    }
  };

  return {
    currentTournament,
    loading,
    error,
    fetchTournamentDetail,
  };
};
