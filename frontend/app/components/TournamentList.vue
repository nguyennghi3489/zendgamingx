<template>
  <div>
    <div class="mb-8 flex justify-between">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <Icon name="heroicons:trophy" class="text-blue-600" size="32" />
          <h2 class="text-3xl font-bold text-gray-900">Tournaments</h2>
        </div>
        <p class="text-gray-600">Browse and join exciting gaming tournaments</p>
      </div>
      <div>
        <USelectMenu
          v-model="selectedFilter"
          :items="filterOptions"
          option-attribute="label"
          value-attribute="value"
          class="w-48"
          :search-input="false"
        />
      </div>
    </div>

    <div v-if="loading" class="flex flex-col justify-center items-center py-12">
      <Icon
        name="heroicons:arrow-path"
        class="text-blue-600 animate-spin mb-4"
        size="48"
      />
      <p class="text-gray-600">Loading tournaments...</p>
    </div>

    <TransitionGroup
      name="tournament-card"
      appear
      tag="div"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <TournamentCard
        v-for="tournament in tournaments"
        :key="tournament.id"
        :tournament="tournament"
        @view-tournament="handleViewTournament"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const filterOptions = [
  {
    label: "All Tournaments",
    value: "all",
    icon: "heroicons:squares-2x2",
  },
  {
    label: "Upcoming",
    value: "upcoming",
    icon: "heroicons:clock",
  },
];

const selectedFilter = ref(filterOptions[0]);
watch(selectedFilter, (newFilter) => {
  if (newFilter) {
    setFilter(newFilter.value as "all" | "upcoming");
  }
});

const { setFilter, type, tournaments, loading } = useTournamentList();
const handleViewTournament = (tournamentId: string | number) => {
  navigateTo(`/tournament/${tournamentId}`);
};

onMounted(() => {
  const foundOption = filterOptions.find(
    (option) => option.value === type.value
  );
  if (foundOption) {
    selectedFilter.value = foundOption;
  }
});
</script>

<style scoped>
.tournament-card-enter-active {
  transition: all 0.6s ease-in;
}

.tournament-card-enter-from {
  opacity: 0;
}

.tournament-card-leave-active {
  transition: all 0.4s ease-in-out;
}

.tournament-card-leave-to {
  opacity: 0;
}

.tournament-card-move {
  transition: transform ease-in;
}
</style>
