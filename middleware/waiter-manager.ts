export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return;

  const { credentials } = useCredentials();

  if (!credentials.value) {
    return navigateTo('/login');
  }

  try {
    if (credentials.value.role !== 'WAITER' && credentials.value.role !== 'MANAGER') {
      if (credentials.value.role === 'CUSTOMER') {
        return navigateTo('/customer');
      }

      return navigateTo('/');
    }
  } catch (error) {
    credentials.value = null;
    return navigateTo('/login');
  }
}); 
