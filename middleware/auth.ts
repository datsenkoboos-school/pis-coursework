export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return;

  const { credentials } = useCredentials();

  if (!credentials.value) {
    return navigateTo('/login');
  }
});
