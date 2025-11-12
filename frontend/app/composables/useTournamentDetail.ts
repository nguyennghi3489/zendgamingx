import { getTournamentById, joinTournamentApi } from "~/services/tournaments";

export const useTournamentDetail = () => {
  const store = useTournamentDetailStore();
  const { user } = useAuth();
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

  const joinTournament = async (tournamentId: string | number) => {
    try {
      store.joining = true;
      const participant = await joinTournamentApi(tournamentId);
      let lastParticipant = store.currentTournament?.participants.slice(-1)[0];
      store.currentTournament?.participants.push({
        ...participant,
        user: user.value,
      });

      if (
        lastParticipant &&
        store.currentTournament?.participants &&
        store.currentTournament?.participants.length % 2 === 0
      ) {
        const newMatch: Match = {
          id: Date.now(),
          tournamentId: currentTournament.value!.id,
          participant1Id: Number(lastParticipant.id),
          participant2Id: participant.id,
          status: "pending",
        };
        store.currentTournament?.matches.push(newMatch);
      }
    } catch (err: any) {
      throw Error(err.response._data.message || "Failed to join tournament");
    } finally {
      store.joining = false;
    }
  };

  return {
    currentTournament,
    loading,
    error,
    fetchTournamentDetail,
    joinTournament,
  };
};
