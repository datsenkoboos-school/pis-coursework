<script setup lang="ts">
const { credentials } = useCredentials();

onMounted(() => {
  if (credentials.value) {
    try {
      if (credentials.value.role === 'CUSTOMER') {
        navigateTo('/customer');
      } else if (credentials.value.role === 'WAITER') {
        navigateTo('/waiter');
      }
    } catch (error) {
      sessionStorage.removeItem('credentials');
    }
  }
});
</script>

<template>
  <div class="p-6 flex flex-col items-center">
    <h1 class="text-3xl font-bold mb-6">
      Ресторанная система
    </h1>
    <p class="mb-8 text-center max-w-md">
      Добро пожаловать в информационную систему ресторана.
      Пожалуйста, войдите или зарегистрируйтесь.
    </p>
  </div>
</template>
