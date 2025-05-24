export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return;

  const credentialsStr = sessionStorage.getItem('credentials');

  if (!credentialsStr) {
    return navigateTo('/login');
  }

  try {
    const credentials = JSON.parse(credentialsStr);

    if (credentials.role !== 'CUSTOMER') {
      if (credentials.role === 'WAITER') {
        return navigateTo('/waiter');
      }

      return navigateTo('/');
    }
  } catch (error) {
    sessionStorage.removeItem('credentials');
    return navigateTo('/login');
  }
});
