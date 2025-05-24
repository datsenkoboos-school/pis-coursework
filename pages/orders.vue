<script setup lang="ts">
definePageMeta({
  middleware: ['waiter'],
});

const toast = useToast();
const orderManagerRef = useTemplateRef('orderManagerRef');

function handleRefresh() {
  if (orderManagerRef.value) {
    orderManagerRef.value.refresh();
    toast.add({
      color: 'info',
      description: 'Список заказов обновлен',
      title: 'Обновлено',
    });
  }
}
</script>

<template>
  <div class="p-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h1 class="text-2xl font-bold mb-2 sm:mb-0">
        Управление заказами
      </h1>
      <UButton
        color="primary"
        variant="solid"
        icon="i-heroicons-arrow-path"
        @click="handleRefresh"
      >
        Обновить список
      </UButton>
    </div>

    <UCard>
      <OrderManager ref="orderManagerRef" />
    </UCard>
  </div>
</template>
