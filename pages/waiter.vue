<script setup lang="ts">
definePageMeta({
  middleware: ['waiter'],
});

const { credentials } = useCredentials();
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      Рабочая панель официанта, {{ credentials?.first_name }}
    </h1>
    <UCard class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">
            Панель управления
          </h2>
        </div>
      </template>

      <div>
        <p>Здесь вы можете управлять заказами, обрабатывать платежи и организовывать работу с клиентами.</p>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton
            color="primary"
            to="/orders"
          >
            Просмотреть заказы
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
