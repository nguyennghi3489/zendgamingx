import type { IPaginated, Tournament } from "~~/shared/types/tournament";
import { getApiBaseUrl } from ".";

export const getAllTournaments = async (
  type: string
): Promise<IPaginated<Tournament>> => {
  const baseUrl = getApiBaseUrl();
  return await $fetch<IPaginated<Tournament>>(
    `${baseUrl}/api/tournaments?type=${type}`
  );
};

export const getTournamentById = async (
  id: string | number
): Promise<Tournament> => {
  const baseUrl = getApiBaseUrl();
  return await $fetch<Tournament>(`${baseUrl}/api/tournaments/${id}`);
};
