import { getApiBaseUrl } from ".";

export const signupApi = async (credentials: {
  username: string;
  email: string;
}) => {
  const baseUrl = getApiBaseUrl();
  return await $fetch<{ access_token: string }>(`${baseUrl}/api/auth/signup`, {
    method: "POST",
    body: {
      name: credentials.username,
      email: credentials.email,
    },
  });
};
