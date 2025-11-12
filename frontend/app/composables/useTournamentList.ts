import { storeToRefs } from "pinia";
import { getAllTournaments } from "~/services/api";

export const useTournamentList = () => {
  const store = useTournamentListStore();
  const { tournaments, loading, error, type } = storeToRefs(store);

  const fetchTournaments = async () => {
    try {
      store.loading = true;
      store.error = null;

      const tournamentsData = await getAllTournaments(type.value);
      store.tournaments = tournamentsData.data;
      return tournamentsData;
    } catch (err: unknown) {
      store.error = (err as Error).message || "Failed to fetch tournaments";
    } finally {
      store.loading = false;
    }
  };

  const setFilter = (filterType: "all" | "upcoming") => {
    store.type = filterType;
  };

  return {
    tournaments,
    loading,
    error,
    fetchTournaments,
    setFilter,
    type,
  };
};
