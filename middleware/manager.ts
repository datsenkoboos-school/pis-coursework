export default defineNuxtRouteMiddleware(() => {
  const { credentials } = useCredentials();

  if (!credentials.value) {
    return '/';
  }

  if (credentials.value.role !== 'MANAGER') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Manager role required.',
    });
  }
}); 
