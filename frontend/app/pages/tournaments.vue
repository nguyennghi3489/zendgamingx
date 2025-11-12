<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TournamentList />
    </div>
  </div>
</template>

<script setup lang="ts">
const { type, fetchTournaments } = useTournamentList();

definePageMeta({
  middleware: ["protected"],
});

watch(type, () => {
  fetchTournaments();
});
onMounted(() => {
  fetchTournaments();
});
</script>
