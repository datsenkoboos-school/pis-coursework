export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return;

  const credentials = sessionStorage.getItem('credentials');

  if (!credentials) {
    return navigateTo('/login');
  }
});
