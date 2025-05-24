<script setup lang="ts">
import type { Order } from '~/types/order';
import { cancelOrder, fetchOrders } from './api';

const { credentials } = useCredentials();
const isRefreshing = ref(false);
const error = ref<null | string>(null);

const showConfirmModal = ref(false);
const orderToCancel = ref<null | Order>(null);
const confirmLoading = ref(false);

const statusMap: Record<Order['status'], { color: 'error' | 'info' | 'primary' | 'success' | 'warning'; label: string }> = {
  CANCELLED: {
    color: 'error',
    label: 'Отменен',
  },
  COMPLETED: {
    color: 'success',
    label: 'Выполнен',
  },
  CONFIRMED: {
    color: 'info',
    label: 'Подтвержден',
  },
  IN_PROGRESS: {
    color: 'primary',
    label: 'В работе',
  },
  PENDING: {
    color: 'warning',
    label: 'В ожидании',
  },
};

async function getOrders() {
  if (!credentials.value?.email) return [];
  return await fetchOrders(credentials.value.email);
};

const { data: orders, pending: isLoading, refresh: refreshOrders } = useAsyncData(
  'orders',
  getOrders,
  {
    default: () => [] as Order[],
    watch: [() => credentials.value?.email],
  }
);

function confirmCancel(order: Order) {
  orderToCancel.value = order;
  showConfirmModal.value = true;
}

async function proceedWithCancellation() {
  if (!orderToCancel.value) return;

  confirmLoading.value = true;
  error.value = null;

  try {
    const updatedOrder = await cancelOrder(orderToCancel.value.id);

    const index = orders.value.findIndex(o => o.id === orderToCancel.value?.id);
    if (index !== -1) {
      orders.value[index] = updatedOrder;
    }
  } catch (err) {
    console.error('Error cancelling order:', err);
    error.value = 'Не удалось отменить заказ';
  } finally {
    confirmLoading.value = false;
    showConfirmModal.value = false;
    orderToCancel.value = null;
  }
}

function closeConfirmModal() {
  showConfirmModal.value = false;
  orderToCancel.value = null;
}

function refresh() {
  if (isRefreshing.value) return;
  isRefreshing.value = true;

  const startTime = Date.now();
  const minAnimationTime = 500;

  setTimeout(() => {
    refreshOrders().then(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minAnimationTime - elapsedTime);

      setTimeout(() => {
        isRefreshing.value = false;
      }, remainingTime);
    });
  }, 300);
}

defineExpose({
  refresh,
});

onMounted(() => {
  showConfirmModal.value = false;
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">
        Мои заказы
      </h2>
      <UButton
        icon="i-heroicons-arrow-path"
        color="primary"
        variant="ghost"
        :loading="isRefreshing"
        :disabled="isLoading || isRefreshing"
        class="refresh-button"
        @click="refresh"
      />
    </div>

    <div
      v-if="error"
      class="text-red-500 mb-4"
    >
      {{ error }}
    </div>

    <div
      class="mb-6"
    >
      <OrderItem
        v-for="order in orders"
        :key="order.id"
        :order="order"
        :status-map="statusMap"
        @cancel="confirmCancel"
      />
    </div>

    <EmptyState v-if="!isLoading && orders.length === 0" />
  </div>

  <OrderCancelModal
    :show="showConfirmModal"
    :loading="confirmLoading"
    @close="closeConfirmModal"
    @confirm="proceedWithCancellation"
  />
</template>

<style scoped>
.refresh-button[loading] svg {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
