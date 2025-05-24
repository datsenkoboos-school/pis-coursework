<script setup lang="ts">
import type { Order } from '~/types/order';
import { cancelOrder, fetchOrders } from './api';

const { credentials } = useCredentials();
const orders = ref<Order[]>([]);
const isLoading = ref(false);
const error = ref<null | string>(null);

const isRefreshing = ref(false);

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

function formatDate(dateString: Date | string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}

async function loadOrders() {
  if (!credentials.value?.email) return;

  isLoading.value = true;
  error.value = null;

  try {
    orders.value = await fetchOrders(credentials.value.email);
  } catch (err) {
    console.error('Error fetching orders:', err);
    error.value = 'Не удалось загрузить заказы';
  } finally {
    isLoading.value = false;
  }
}

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
  console.log('OrderList refresh called');
  if (isRefreshing.value) return;
  isRefreshing.value = true;

  const startTime = Date.now();
  const minAnimationTime = 500;

  setTimeout(() => {
    loadOrders().then(() => {
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

watch(() => credentials.value?.email, (newEmail, oldEmail) => {
  if (newEmail && newEmail !== oldEmail) {
    loadOrders();
  } else if (!newEmail) {
    orders.value = [];
  }
});

onMounted(() => {
  loadOrders();
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
      v-if="orders.length > 0"
      class="mb-6"
    >
      <UCard
        v-for="order in orders"
        :key="order.id"
        class="mb-4"
      >
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
              @click="confirmCancel(order)"
            />
          </div>
        </div>
        <div class="mt-4">
          <p class="font-bold">
            Описание
          </p>
          <p>{{ order.description }}</p>
        </div>
        <div class="mt-2">
          <p class="font-bold">
            Адрес
          </p>
          <p>{{ order.address }}</p>
        </div>
      </UCard>
    </div>

    <div
      v-else-if="!isLoading"
      class="text-center py-8 border border-dashed rounded-lg"
    >
      <p class="text-gray-500">
        У вас пока нет заказов
      </p>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <Transition name="zoom">
          <div
            v-if="showConfirmModal"
            class="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md z-50"
            @click.stop
          >
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h3
                  id="modal-title"
                  class="text-xl font-bold"
                >
                  Подтверждение отмены
                </h3>
                <UButton
                  icon="i-heroicons-x-mark"
                  color="secondary"
                  variant="ghost"
                  class="-mr-2"
                  aria-label="Закрыть"
                  @click="closeConfirmModal"
                />
              </div>

              <p class="mb-4">
                Вы уверены, что хотите отменить этот заказ?
              </p>

              <div class="flex justify-end gap-3 mt-6">
                <UButton
                  color="secondary"
                  variant="ghost"
                  @click="closeConfirmModal"
                >
                  Нет
                </UButton>
                <UButton
                  color="error"
                  :loading="confirmLoading"
                  @click="proceedWithCancellation"
                >
                  Да, отменить
                </UButton>
              </div>
            </div>
          </div>
        </Transition>
        <button
          class="absolute inset-0 w-full h-full opacity-0 cursor-default"
          aria-label="Закрыть модальное окно"
          @click="closeConfirmModal"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.3s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

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
