export default defineNuxtRouteMiddleware(() => {
  const { credentials } = useCredentials();

  if (!credentials.value) return;

  if (credentials.value.role === 'CUSTOMER') {
    return '/customer';
  } else if (credentials.value.role === 'WAITER') {
    return '/waiter';
  } else if (credentials.value.role === 'MANAGER') {
    return '/manager';
  }
});
