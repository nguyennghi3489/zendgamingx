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

definePageMeta({
  middleware: ["protected"],
});
const route = useRoute();
const tournamentId = route.params.id;

const { currentTournament, fetchTournamentDetail } = useTournamentDetail();

const loadTournament = async () => {
  fetchTournamentDetail(tournamentId as string);
};

onMounted(() => {
  loadTournament();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.fade-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}
</style>
