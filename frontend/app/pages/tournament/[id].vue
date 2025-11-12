<template>
  <div class="min-h-screen bg-gray-50">
    <Transition name="fade" mode="out-in">
      <TournamentDetail
        v-if="currentTournament"
        key="content"
        :tournament="currentTournament"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { BASE_DATETIME_FORMAT } from "~/constants/date";

definePageMeta({
  middleware: ["protected"],
});
const route = useRoute();
const tournamentId = route.params.id;

const { currentTournament, fetchTournamentDetail, loading } =
  useTournamentDetail();

const loadTournament = async () => {
  fetchTournamentDetail(tournamentId as string);
};

onMounted(() => {
  loadTournament();
});
</script>
