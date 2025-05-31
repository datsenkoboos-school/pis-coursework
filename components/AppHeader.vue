<script setup lang="ts">
const { clearCredentials, credentials } = useCredentials();

function logout() {
  clearCredentials();
  navigateTo('/');
}

const route = useRoute();

const path = computed(() => {
  return route.path;
});

const formattedRole = computed(() => {
  switch (credentials.value?.role) {
    case 'MANAGER':
      return 'Менеджер';
    case 'WAITER':
      return 'Официант';
    default:
      return 'Клиент';
  }
});
</script>

<template>
  <header class="border-b border-gray-200 py-3 px-6">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-6">
        <NuxtLink
          to="/"
          class="text-xl font-bold"
        >
          Ресторан
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3">
        <template v-if="credentials">
          <div
            class="text-sm mr-2"
          >
            {{ credentials.first_name }} {{ credentials.last_name }}
            <span class="text-xs text-gray-500 ml-1">({{ formattedRole }})</span>
          </div>
          <UButton
            size="sm"
            variant="soft"
            color="secondary"
            @click="logout"
          >
            Выйти
          </UButton>
        </template>

        <template v-else-if="path !== '/login' && path !== '/register'">
          <UButton
            size="sm"
            to="/login"
          >
            Войти
          </UButton>

          <UButton
            size="sm"
            variant="outline"
            to="/register"
          >
            Регистрация
          </UButton>
        </template>
      </div>
    </div>
  </header>
</template>
