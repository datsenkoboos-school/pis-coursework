<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import * as z from 'zod';
import type { CreateOrderPayload, MenuItem, Order } from '~/types/order';
import { createOrder } from './api';

const props = defineProps({
  modelValue: {
    default: false,
    type: Boolean,
  },
});

const emit = defineEmits<{
  (e: 'success', order: Order): void;
  (e: 'error', message: string): void;
  (e: 'update:modelValue', value: boolean): void;
}>();

function closeModal() {
  emit('update:modelValue', false);
}

const schema = z.object({
  address: z.string().min(1, 'Укажите адрес доставки'),
  date: z.string().min(1, 'Выберите дату доставки'),
  orderItems: z.array(z.object({
    menuItemId: z.number(),
    quantity: z.number().min(1, 'Количество должно быть больше 0'),
  })).min(1, 'Добавьте хотя бы одно блюдо'),
});
type Schema = z.output<typeof schema>;

const formData = reactive<Partial<Schema>>({
  address: '',
  date: '',
  orderItems: [],
});

const { credentials } = useCredentials();
const minDate = computed(() => {
  const now = new Date();
  return now.toISOString().split('T')[0];
});

const isLoading = ref(false);
const isSubmitting = ref(false);
const menuItems = ref<MenuItem[]>([]);

const selectedItems = ref<{ menuItem: MenuItem; quantity: number }[]>([]);

async function fetchMenuItems() {
  try {
    const data = await $fetch<MenuItem[]>('/api/menu');
    menuItems.value = data || [];
  } catch (error) {
    console.error('Error fetching menu items:', error);
  }
}

function addMenuItem(menuItem: MenuItem) {
  const existingItem = selectedItems.value.find(item => item.menuItem.id === menuItem.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    selectedItems.value.push({ menuItem, quantity: 1 });
  }
  updateFormData();
}

function removeMenuItem(menuItemId: number) {
  selectedItems.value = selectedItems.value.filter(item => item.menuItem.id !== menuItemId);
  updateFormData();
}

function updateQuantity(menuItemId: number, quantity: number) {
  const item = selectedItems.value.find(item => item.menuItem.id === menuItemId);
  if (item) {
    item.quantity = quantity;
    if (quantity <= 0) {
      removeMenuItem(menuItemId);
    }
  }
  updateFormData();
}

function updateFormData() {
  formData.orderItems = selectedItems.value.map(item => ({
    menuItemId: item.menuItem.id,
    quantity: item.quantity,
  }));
}

const totalPrice = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    return total + (item.menuItem.price * item.quantity);
  }, 0);
});

async function handleCreateOrder(event: FormSubmitEvent<Schema>) {
  if (isSubmitting.value || isLoading.value) return;

  isSubmitting.value = true;
  isLoading.value = true;

  try {
    const payload: CreateOrderPayload = {
      address: event.data.address,
      date: event.data.date,
      email: credentials.value!.email,
      orderItems: event.data.orderItems,
    };

    const order = await createOrder(payload);

    formData.address = '';
    formData.date = '';
    formData.orderItems = [];
    selectedItems.value = [];

    emit('success', order);
    closeModal();
  } catch (error) {
    console.error('Error creating order:', error);
    emit('error', 'Произошла ошибка при создании заказа');
  } finally {
    isLoading.value = false;
    isSubmitting.value = false;
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue) {
    closeModal();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
  fetchMenuItems();
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <Transition name="zoom">
          <div
            v-if="modelValue"
            class="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl z-50 max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h3
                  id="modal-title"
                  class="text-xl font-bold"
                >
                  Новый заказ
                </h3>
                <UButton
                  icon="i-heroicons-x-mark"
                  color="secondary"
                  variant="ghost"
                  class="-mr-2"
                  aria-label="Закрыть"
                  @click="closeModal"
                />
              </div>

              <UForm
                :schema="schema"
                :state="formData"
                class="space-y-4"
                @submit="handleCreateOrder"
              >
                <UFormField
                  label="Блюда"
                  name="orderItems"
                >
                  <div class="space-y-4">
                    <div class="max-h-60 overflow-y-auto space-y-2">
                      <div
                        v-for="menuItem in menuItems"
                        :key="menuItem.id"
                        class="border rounded-lg p-3 flex justify-between items-center"
                      >
                        <div class="flex-1">
                          <h4 class="font-medium">
                            {{ menuItem.name }}
                          </h4>
                          <p class="text-sm text-gray-600">
                            {{ menuItem.description }}
                          </p>
                          <p class="text-sm font-bold text-green-600">
                            {{ menuItem.price }} ₽
                          </p>
                        </div>
                        <UButton
                          size="sm"
                          @click="addMenuItem(menuItem)"
                        >
                          Добавить
                        </UButton>
                      </div>
                    </div>

                    <div
                      v-if="selectedItems.length > 0"
                      class="border-t pt-4"
                    >
                      <h4 class="font-medium mb-2">
                        Выбранные блюда:
                      </h4>
                      <div class="space-y-2">
                        <div
                          v-for="item in selectedItems"
                          :key="item.menuItem.id"
                          class="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded p-2"
                        >
                          <div class="flex-1">
                            <span class="font-medium">{{ item.menuItem.name }}</span>
                            <span class="text-sm text-gray-600 ml-2">{{ item.menuItem.price }} ₽</span>
                          </div>
                          <div class="flex items-center space-x-2">
                            <UInput
                              :model-value="item.quantity"
                              type="number"
                              min="1"
                              class="w-16"
                              size="sm"
                              @update:model-value="(value) => updateQuantity(item.menuItem.id, Number(value))"
                            />
                            <UButton
                              size="sm"
                              color="error"
                              variant="ghost"
                              icon="i-heroicons-trash"
                              @click="removeMenuItem(item.menuItem.id)"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="mt-3 pt-3 border-t">
                        <div class="flex justify-between items-center font-bold">
                          <span>Итого:</span>
                          <span>{{ totalPrice }} ₽</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </UFormField>

                <UFormField
                  label="Адрес доставки"
                  name="address"
                >
                  <UInput
                    v-model="formData.address"
                    placeholder="Введите адрес"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  label="Дата доставки"
                  name="date"
                >
                  <UInput
                    v-model="formData.date"
                    type="date"
                    :min="minDate"
                    class="w-full"
                  />
                </UFormField>

                <UButton
                  type="submit"
                  block
                  :loading="isLoading"
                  :disabled="isLoading || selectedItems.length === 0"
                >
                  Оформить заказ ({{ totalPrice }} ₽)
                </UButton>
              </UForm>
            </div>
          </div>
        </Transition>
        <button
          class="absolute inset-0 w-full h-full opacity-0 cursor-default"
          aria-label="Закрыть модальное окно"
          @click="closeModal"
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
</style>
