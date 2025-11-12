<template>
  <div class="bg-white rounded-lg shadow-lg border border-gray-200">
    <div class="p-2 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Icon name="heroicons:trophy" class="text-yellow-600" size="24" />
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Tournament Bracket</h2>
            <p class="text-sm text-gray-600">
              {{ bracketSize }}-Player Bracket
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4">
      <div class="overflow-x-auto">
        <div class="min-w-full">
          <div class="flex gap-3 relative">
            <TransitionGroup name="match-slide" appear>
              <div
                v-for="(round, roundIndex) in rounds"
                :key="`round-${roundIndex}`"
                class="flex-1 space-y-3 relative"
                :style="{ transitionDelay: `${roundIndex * 100}ms` }"
              >
                <TransitionGroup name="match-card" appear>
                  <div
                    v-for="(match, matchIndex) in round"
                    :key="`match-${roundIndex}-${matchIndex}`"
                    class="bg-gray-50 rounded border border-gray-200 p-2 transform transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer"
                    :style="{
                      transitionDelay: `${
                        (roundIndex * round.length + matchIndex) * 50
                      }ms`,
                    }"
                  >
                    <div class="space-y-1">
                      <div
                        class="flex items-center justify-between p-1.5 rounded text-xs"
                      >
                        <div class="flex items-center gap-1.5">
                          <div
                            class="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center"
                          >
                            <Icon
                              :name="
                                match.participant1
                                  ? 'heroicons:user'
                                  : 'heroicons:question-mark-circle'
                              "
                              size="10"
                              class="text-gray-600"
                            />
                          </div>
                          <span class="font-medium truncate max-w-20">
                            {{ match.participant1?.name || "TBD" }}
                          </span>
                        </div>
                        <span
                          v-if="match.participant1Score !== undefined"
                          class="font-bold text-xs"
                        >
                          {{ match.participant1Score }}
                        </span>
                      </div>

                      <div
                        class="flex items-center justify-between p-1.5 rounded text-xs"
                      >
                        <div class="flex items-center gap-1.5">
                          <div
                            class="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center"
                          >
                            <Icon
                              :name="
                                match.participant2
                                  ? 'heroicons:user'
                                  : 'heroicons:question-mark-circle'
                              "
                              size="10"
                              class="text-gray-600"
                            />
                          </div>
                          <span class="font-medium truncate max-w-20">
                            {{ match.participant2?.name || "TBD" }}
                          </span>
                        </div>
                        <span
                          v-if="match.participant2Score !== undefined"
                          class="font-bold text-xs"
                        >
                          {{ match.participant2Score }}
                        </span>
                      </div>
                    </div>
                  </div>
                </TransitionGroup>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  tournament: Tournament;
  bracketSize?: number;
  matches?: Match[];
}>();

const rounds = computed(() => {
  const size = props.bracketSize || 8;
  const numRounds = Math.log2(size);
  const rounds: Match[][] = [];

  for (let roundIndex = 0; roundIndex < numRounds; roundIndex++) {
    const matchesInRound = size / Math.pow(2, roundIndex + 1);
    const roundMatches: Match[] = [];

    for (let matchIndex = 0; matchIndex < matchesInRound; matchIndex++) {
      roundMatches.push({
        id: `round-${roundIndex + 1}-match-${matchIndex + 1}`,
        tournamentId: props.tournament.id,
        participant1: undefined,
        participant2: undefined,
        status: "pending",
      });
    }
    rounds.push(roundMatches);
  }

  return rounds;
});
</script>
