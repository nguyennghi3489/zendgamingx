export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.client) return;
  const authStore = useAuth();

  if (!authStore.checkAuth()) {
    return navigateTo("/signup", { external: true });
  }
});
