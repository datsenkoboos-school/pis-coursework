<script setup lang="ts">
import type { Order } from '~/types/order';

defineProps<{
  order: Order;
  statusMap: Record<Order['status'], { color: 'error' | 'info' | 'primary' | 'success' | 'warning'; label: string }>;
}>();

const emit = defineEmits(['cancel']);

function formatDate(dateString: Date | string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}
</script>

<template>
  <UCard class="mb-4">
    <div class="flex justify-between">
      <div>
        <p class="font-medium">
          {{ formatDate(order.created_at) }}
        </p>
        <p class="text-sm text-gray-500">
          Доставка: {{ formatDate(order.date) }}
        </p>
      </div>
      <div class="flex items-center">
        <UBadge :color="statusMap[order.status].color">
          {{ statusMap[order.status].label }}
        </UBadge>
        <UButton
          v-if="order.status === 'PENDING'"
          icon="i-heroicons-x-mark"
          color="error"
          variant="ghost"
          size="xs"
          class="ml-2"
          @click="$emit('cancel', order)"
        />
      </div>
    </div>
    <div class="mt-4">
      <p class="font-bold">
        Заказанные блюда
      </p>
      <div class="space-y-1">
        <div
          v-for="item in order.items"
          :key="item.id"
          class="flex justify-between text-sm"
        >
          <span>{{ item.menuItem.name }} x{{ item.quantity }}</span>
          <span>{{ item.menuItem.price * item.quantity }} ₽</span>
        </div>
      </div>
      <div class="border-t mt-2 pt-2">
        <div class="flex justify-between font-bold">
          <span>Итого:</span>
          <span>{{ order.items.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0) }} ₽</span>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <p class="font-bold">
        Адрес
      </p>
      <p>{{ order.address }}</p>
    </div>
  </UCard>
</template>
