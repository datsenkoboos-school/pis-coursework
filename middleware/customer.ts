export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return;

  const { credentials } = useCredentials();

  if (!credentials.value) {
    return navigateTo('/login');
  }

  try {
    if (credentials.value.role !== 'CUSTOMER') {
      if (credentials.value.role === 'WAITER') {
        return navigateTo('/waiter');
      }

      return navigateTo('/');
    }
  } catch (error) {
    credentials.value = null;
    return navigateTo('/login');
  }
});
