import type { IPaginated, Tournament } from "~~/shared/types/tournament";
import { getApiBaseUrl, getAuthHeaders } from ".";

export const getAllTournaments = async (
  type: string
): Promise<IPaginated<Tournament>> => {
  const baseUrl = getApiBaseUrl();
  return await $fetch<IPaginated<Tournament>>(
    `${baseUrl}/api/tournaments?type=${type}`,
    { headers: getAuthHeaders(true) }
  );
};

export const getTournamentById = async (
  id: string | number
): Promise<Tournament> => {
  const baseUrl = getApiBaseUrl();
  return await $fetch<Tournament>(`${baseUrl}/api/tournaments/${id}`, {
    headers: getAuthHeaders(true),
  });
};

export const joinTournamentApi = async (id: string | number): Promise<any> => {
  const baseUrl = getApiBaseUrl();
  return await $fetch(`${baseUrl}/api/tournaments/${id}/join`, {
    method: "POST",
    headers: getAuthHeaders(true),
  });
};
