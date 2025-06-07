<script setup lang="ts">
import { deleteOrder, fetchAllOrders, type OrderStatus, type OrderWithUser, updateOrderStatus } from './api';

const isRefreshing = ref(false);
const error = ref<null | string>(null);

const showDeleteModal = ref(false);
const orderToDelete = ref<null | OrderWithUser>(null);
const deleteLoading = ref(false);

const showStatusModal = ref(false);
const orderToUpdate = ref<null | OrderWithUser>(null);
const statusUpdateLoading = ref(false);
const selectedStatus = ref<null | OrderStatus>(null);

const statusMap: Record<OrderStatus, { color: 'error' | 'info' | 'primary' | 'success' | 'warning'; label: string }> = {
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

const statusOptions = Object.entries(statusMap).map(([value, data]) => ({
  label: data.label,
  value: value as OrderStatus,
}));

function formatDate(dateString: Date | string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}

async function getOrders() {
  return await fetchAllOrders();
}

const { data: orders, pending: isLoading, refresh: refreshOrders } = useAsyncData(
  'all-orders',
  getOrders,
  {
    default: () => [] as OrderWithUser[],
  }
);

function confirmDelete(order: OrderWithUser) {
  orderToDelete.value = order;
  showDeleteModal.value = true;
}

async function proceedWithDeletion() {
  if (!orderToDelete.value) return;

  deleteLoading.value = true;
  error.value = null;

  try {
    await deleteOrder(orderToDelete.value.id);

    orders.value = orders.value.filter(o => o.id !== orderToDelete.value?.id);
  } catch (err) {
    console.error('Error deleting order:', err);
    error.value = 'Не удалось удалить заказ';
  } finally {
    deleteLoading.value = false;
    showDeleteModal.value = false;
    orderToDelete.value = null;
  }
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  orderToDelete.value = null;
}

function openStatusModal(order: OrderWithUser) {
  orderToUpdate.value = order;
  selectedStatus.value = order.status as OrderStatus;
  showStatusModal.value = true;
}

async function proceedWithStatusUpdate() {
  if (!orderToUpdate.value || !selectedStatus.value) return;

  statusUpdateLoading.value = true;
  error.value = null;

  try {
    const updatedOrder = await updateOrderStatus(
      orderToUpdate.value.id,
      selectedStatus.value
    );

    const index = orders.value.findIndex(o => o.id === orderToUpdate.value?.id);
    if (index !== -1) {
      orders.value[index] = {
        ...orders.value[index],
        status: updatedOrder.status,
        updated_at: updatedOrder.updated_at,
      };
    }
  } catch (err) {
    console.error('Error updating order status:', err);
    error.value = 'Не удалось обновить статус заказа';
  } finally {
    statusUpdateLoading.value = false;
    showStatusModal.value = false;
    orderToUpdate.value = null;
    selectedStatus.value = null;
  }
}

function closeStatusModal() {
  showStatusModal.value = false;
  orderToUpdate.value = null;
  selectedStatus.value = null;
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
  showDeleteModal.value = false;
  showStatusModal.value = false;
});
</script>

<template>
  <div class="w-[min(100vw,35rem)]">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">
        Все заказы
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
      v-else-if="orders.length > 0"
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
              ID: {{ order.id }} | {{ formatDate(order.created_at) }}
            </p>
            <p class="text-sm text-gray-500">
              Доставка: {{ formatDate(order.date) }}
            </p>
            <p class="text-sm mt-1">
              <span class="font-medium">Клиент:</span> {{ order.user.first_name }} {{ order.user.last_name }} ({{ order.user.email }})
            </p>
          </div>
          <div class="flex items-center">
            <UBadge :color="statusMap[order.status as OrderStatus].color">
              {{ statusMap[order.status as OrderStatus].label }}
            </UBadge>
            <UButton
              icon="i-heroicons-pencil-square"
              color="primary"
              variant="ghost"
              size="xs"
              class="ml-2"
              @click="openStatusModal(order)"
            />
            <UButton
              icon="i-heroicons-trash"
              color="error"
              variant="ghost"
              size="xs"
              class="ml-2"
              @click="confirmDelete(order)"
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
    </div>

    <div
      v-else-if="!isLoading"
      class="text-center py-8 border border-dashed rounded-lg"
    >
      <p class="text-gray-500">
        Нет заказов в системе
      </p>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <Transition name="zoom">
          <div
            v-if="showDeleteModal"
            class="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md z-50"
            @click.stop
          >
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h3
                  id="delete-modal-title"
                  class="text-xl font-bold"
                >
                  Подтверждение удаления
                </h3>
                <UButton
                  icon="i-heroicons-x-mark"
                  color="secondary"
                  variant="ghost"
                  class="-mr-2"
                  aria-label="Закрыть"
                  @click="closeDeleteModal"
                />
              </div>

              <p class="mb-4">
                Вы уверены, что хотите удалить этот заказ? Это действие нельзя отменить.
              </p>

              <div class="flex justify-end gap-3 mt-6">
                <UButton
                  color="secondary"
                  variant="ghost"
                  @click="closeDeleteModal"
                >
                  Отмена
                </UButton>
                <UButton
                  color="error"
                  :loading="deleteLoading"
                  @click="proceedWithDeletion"
                >
                  Удалить
                </UButton>
              </div>
            </div>
          </div>
        </Transition>
        <button
          class="absolute inset-0 w-full h-full opacity-0 cursor-default"
          aria-label="Закрыть модальное окно"
          @click="closeDeleteModal"
        />
      </div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showStatusModal"
        class="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-modal-title"
      >
        <Transition name="zoom">
          <div
            v-if="showStatusModal"
            class="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md z-50"
            @click.stop
          >
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h3
                  id="status-modal-title"
                  class="text-xl font-bold"
                >
                  Изменение статуса заказа
                </h3>
                <UButton
                  icon="i-heroicons-x-mark"
                  color="secondary"
                  variant="ghost"
                  class="-mr-2"
                  aria-label="Закрыть"
                  @click="closeStatusModal"
                />
              </div>

              <div class="mb-4">
                <p class="mb-2">
                  Выберите новый статус заказа:
                </p>
                <URadioGroup
                  v-model="selectedStatus"
                  :items="statusOptions"
                  size="lg"
                />
              </div>

              <div class="flex justify-end gap-3 mt-6">
                <UButton
                  color="secondary"
                  variant="ghost"
                  @click="closeStatusModal"
                >
                  Отмена
                </UButton>
                <UButton
                  color="primary"
                  :loading="statusUpdateLoading"
                  :disabled="!selectedStatus"
                  @click="proceedWithStatusUpdate"
                >
                  Обновить статус
                </UButton>
              </div>
            </div>
          </div>
        </Transition>
        <button
          class="absolute inset-0 w-full h-full opacity-0 cursor-default"
          aria-label="Закрыть модальное окно"
          @click="closeStatusModal"
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
