<template>
  <div class="min-h-screen bg-gray-50">
    <Transition name="fade" mode="out-in">
      <div
        v-if="loading"
        key="loading"
        class="flex justify-center items-center min-h-screen"
      >
        <div class="text-center">
          <Icon
            name="heroicons:arrow-path"
            class="text-blue-600 animate-spin mx-auto mb-4"
            size="48"
          />
          <p class="text-gray-600">Loading tournament details...</p>
        </div>
      </div>

      <div v-else key="content" class="mx-auto px-2 sm:px-3 lg:px-4 py-4">
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
              {{ currentTournament?.name || "Tournament" }}
            </li>
          </ol>
        </nav>

        <div class="mx-auto">
          <div
            class="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8 transform transition-all duration-300 hover:shadow-xl"
          >
            <div class="flex items-center justify-between mb-6">
              <h1 class="text-3xl font-bold text-gray-900">
                {{ currentTournament?.name || "Tournament" }}
              </h1>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex items-center gap-3">
                <Icon
                  name="heroicons:calendar-days"
                  class="text-blue-600"
                  size="24"
                />
                <div>
                  <span class="text-sm font-medium text-gray-600"
                    >Start Time</span
                  >
                  <p class="text-lg text-gray-900 font-semibold">
                    {{
                      $dayjs(currentTournament?.startTime || "").format(
                        BASE_DATETIME_FORMAT
                      )
                    }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <Icon
                  name="heroicons:users"
                  class="text-purple-600"
                  size="24"
                />
                <div>
                  <span class="text-sm font-medium text-gray-600"
                    >Participants</span
                  >
                  <p class="text-lg text-gray-900 font-semibold">
                    {{ currentTournament?.participants.length || 0 }} /
                    {{ currentTournament?.maxParticipants || 0 }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Transition name="slide-up" appear delay="200">
            <div v-if="currentTournament">
              <TournamentBracket
                :tournament="currentTournament"
                :matches="[]"
                :bracket-size="currentTournament.maxParticipants"
              />
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useTournamentDetail } from "~/composables/useTournamentDetail";
import { BASE_DATETIME_FORMAT } from "~/constants/date";

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
