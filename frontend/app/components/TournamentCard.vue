<template>
  <div
    class="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 cursor-pointer group"
    @click="handleViewTournament"
  >
    <div class="p-6">
      <h3
        class="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600"
      >
        {{ tournament.name }}
      </h3>

      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-600">Status:</span>
          <div class="flex items-center gap-1">
            <span
              class="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
            >
              {{ formatStatus(tournament.status) }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <Icon name="heroicons:clock" class="text-gray-500" size="16" />
            <span class="text-sm font-medium text-gray-600">Start Time:</span>
          </div>
          <span class="text-sm text-gray-900">
            {{ $dayjs(tournament.startTime).format(BASE_DATETIME_FORMAT) }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <Icon name="heroicons:users" class="text-gray-500" size="16" />
            <span class="text-sm font-medium text-gray-600"
              >Max Participants:</span
            >
          </div>
          <span class="text-sm text-gray-900 font-medium">
            {{ tournament.maxParticipants }}
          </span>
        </div>
      </div>

      <div class="mt-6">
        <button
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2"
          @click.stop="$emit('view-tournament', tournament.id)"
        >
          <Icon name="heroicons:eye" size="16" />
          <span class="transition-all duration-200">View Details</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BASE_DATETIME_FORMAT } from "~/constants/date";
import type { Tournament, TournamentStatus } from "~~/shared/types/tournament";

const props = defineProps<{
  tournament: Tournament;
}>();

const emit = defineEmits<{
  "view-tournament": [id: string | number];
}>();

const formatStatus = (status: TournamentStatus): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const handleViewTournament = () => {
  emit("view-tournament", props.tournament.id);
};
</script>
