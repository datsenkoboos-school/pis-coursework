<script setup lang="ts">
import type { Order } from '~/types/order';

definePageMeta({
  middleware: ['customer'],
});

interface OrderListInstance {
  refresh: () => void;
}

const { credentials } = useCredentials();
const isOrderFormOpen = ref(false);
const orderListRef = ref<null | OrderListInstance>(null);

function toggleOrderForm() {
  isOrderFormOpen.value = !isOrderFormOpen.value;
}

const toast = useToast();

function handleOrderSuccess(order: Order) {
  console.log('Order success handler called', order);

  toast.add({
    color: 'success',
    description: 'Ваш заказ успешно создан и обрабатывается',
    title: 'Заказ создан',
  });

  console.log('Attempting to refresh order list');
  if (orderListRef.value) {
    console.log('OrderList ref found, calling refresh');
    orderListRef.value.refresh();
  } else {
    console.warn('OrderList ref not found');
  }
}

function handleOrderError(message: string) {
  console.log('Order error handler called', message);

  toast.add({
    color: 'error',
    description: message,
    title: 'Ошибка',
  });
}
</script>

<template>
  <div class="w-[min(100vw,35rem)]">
    <h1 class="text-2xl font-bold mb-6">
      Добро пожаловать, {{ credentials?.first_name }}
    </h1>

    <div class="flex flex-col gap-6">
      <UCard
        class="border-primary-200"
      >
        <div class="text-center">
          <h3 class="font-semibold text-xl mb-2">
            Сделать новый заказ
          </h3>
          <p class="text-gray-500 mb-4">
            Оформите заказ, указав все необходимые детали
          </p>
          <UButton
            block
            color="primary"
            icon="i-heroicons-plus"
            @click="toggleOrderForm"
          >
            Оформить заказ
          </UButton>
        </div>
      </UCard>

      <OrderForm
        v-model="isOrderFormOpen"
        @success="handleOrderSuccess"
        @error="handleOrderError"
      />

      <OrderList ref="orderListRef" />
    </div>
  </div>
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
</style>
