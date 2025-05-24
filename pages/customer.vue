<script setup lang="ts">
definePageMeta({
  middleware: ['customer'],
});

const { credentials } = useCredentials();
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      Добро пожаловать, {{ credentials?.first_name }}
    </h1>
    <UCard class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">
            Панель клиента
          </h2>
        </div>
      </template>

      <div>
        <p>Здесь вы можете просматривать меню и делать заказы в нашем ресторане.</p>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton
            color="primary"
            to="/menu"
          >
            Просмотреть меню
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
