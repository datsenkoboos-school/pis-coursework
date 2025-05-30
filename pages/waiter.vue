<script setup lang="ts">
definePageMeta({
  middleware: ['waiter'],
});

const { credentials } = useCredentials();
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">
      Рабочая панель официанта, {{ credentials?.first_name }}
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UCard class="border-primary-200">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">
              Управление заказами
            </h2>
          </div>
        </template>

        <div>
          <p>Здесь вы можете просматривать все заказы, изменять их статусы и удалять при необходимости.</p>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              color="primary"
              to="/orders"
              icon="i-heroicons-clipboard-document-list"
            >
              Просмотр заказов
            </UButton>
          </div>
        </template>
      </UCard>

      <UCard class="border-info-200">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">
              Информация
            </h2>
          </div>
        </template>

        <div>
          <p>Как официант, вы можете:</p>
          <ul class="list-disc pl-6 mt-2 space-y-1">
            <li>Просматривать все заказы в системе</li>
            <li>Изменять статусы заказов (Подтверждено, В работе, Выполнено)</li>
            <li>Удалять заказы при необходимости</li>
          </ul>
        </div>
      </UCard>
    </div>
  </div>
</template>
