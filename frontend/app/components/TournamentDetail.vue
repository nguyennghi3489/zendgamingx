<template>
  <div class="mx-auto px-2 sm:px-3 lg:px-4 py-4">
    <nav class="mb-3">
      <ol class="flex items-center space-x-2">
        <li>
          <NuxtLink
            to="/tournaments"
            class="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors duration-200"
          >
            <Icon name="heroicons:chevron-left" size="16" />
            Tournaments
          </NuxtLink>
        </li>
        <li class="text-gray-500">/</li>
        <li class="text-gray-900 font-medium">
          {{ tournament?.name || "Tournament" }}
        </li>
      </ol>
    </nav>

    <div class="mx-auto">
      <div
        class="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8 transform transition-all duration-300 hover:shadow-xl"
      >
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-bold text-gray-900">
            {{ tournament?.name || "Tournament" }}
          </h1>

          <UButton
            key="join-button"
            color="primary"
            size="lg"
            icon="heroicons:user-plus"
            @click="handleJoinTournament"
            class="px-6 transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            Join Tournament
          </UButton>
        </div>

        <div class="flex flex-start gap-20">
          <div class="flex items-center gap-3">
            <Icon
              name="heroicons:calendar-days"
              class="text-blue-600"
              size="24"
            />
            <div>
              <span class="text-sm font-medium text-gray-600">Start Time</span>
              <p class="text-lg text-gray-900 font-semibold">
                {{
                  $dayjs(tournament?.startTime || "").format(
                    BASE_DATETIME_FORMAT
                  )
                }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Icon name="heroicons:users" class="text-purple-600" size="24" />
            <div>
              <span class="text-sm font-medium text-gray-600"
                >Participants</span
              >
              <p class="text-lg text-gray-900 font-semibold">
                {{ tournament?.participants.length || 0 }} /
                {{ tournament?.maxParticipants || 0 }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <TournamentBracket
        :tournament="tournament"
        :matches="[]"
        :bracket-size="tournament.maxParticipants"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BASE_DATETIME_FORMAT } from "~/constants/date";

defineProps<{
  tournament: Tournament;
}>();

const { joinTournament, currentTournament } = useTournamentDetail();
const handleJoinTournament = async () => {
  const toast = useToast();

  try {
    await joinTournament(currentTournament.value!.id);
    toast.add({
      title: "Successfully Joined Tournament",
      description: `You have successfully joined the tournament "${currentTournament.value?.name}".`,
      icon: "i-heroicons-check-circle",
      color: "success",
    });
  } catch (error: any) {
    // Extract error message with fallback
    let errorMessage =
      "An error occurred while joining the tournament. Please try again.";

    if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    // Show error toast
    toast.add({
      title: "Failed to Join Tournament",
      description: errorMessage,
      icon: "i-heroicons-exclamation-triangle",
      color: "error",
    });
  }
};
</script>
