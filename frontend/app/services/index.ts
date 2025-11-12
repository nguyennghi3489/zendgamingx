export const getApiBaseUrl = (): string => {
  const config = useRuntimeConfig();
  return config.public.apiBaseUrl as string;
};
