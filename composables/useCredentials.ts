import type { UserCredentials } from '~/types/user';

export function useCredentials() {
  const credentials = useCookie<null | UserCredentials>('credentials', {
    maxAge: 60 * 60 * 24 * 30,
  });

  function clearCredentials() {
    credentials.value = null;
  }

  function saveCredentials(newCredentials: UserCredentials) {
    credentials.value = newCredentials;
  }

  return {
    clearCredentials,
    credentials,
    saveCredentials,
  };
}
