export interface UserCredentials {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export function useCredentials() {
  const credentials = ref<null | UserCredentials>(null);

  function loadCredentials() {
    if (import.meta.client) {
      const storedCredentials = sessionStorage.getItem('credentials');
      if (storedCredentials) {
        try {
          credentials.value = JSON.parse(storedCredentials);
        } catch (error) {
          console.error('Error parsing credentials:', error);
          sessionStorage.removeItem('credentials');
        }
      }
    }
  }

  function clearCredentials() {
    if (import.meta.client) {
      sessionStorage.removeItem('credentials');
      credentials.value = null;
    }
  }

  function saveCredentials(newCredentials: UserCredentials) {
    if (import.meta.client) {
      sessionStorage.setItem('credentials', JSON.stringify(newCredentials));
      credentials.value = newCredentials;
    }
  }

  onMounted(() => {
    loadCredentials();
  });

  return {
    clearCredentials,
    credentials: readonly(credentials),
    loadCredentials,
    saveCredentials,
  };
}
