<script setup lang="ts">
definePageMeta({
  middleware: ['waiter-manager'],
});
</script>

<template>
  <div class="p-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h1 class="text-2xl font-bold mb-2 sm:mb-0">
        Управление заказами
      </h1>
    </div>

    <UCard>
      <OrderManager ref="orderManagerRef" />
    </UCard>
  </div>
</template>
