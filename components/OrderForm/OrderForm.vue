<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import * as z from 'zod';
import type { CreateOrderPayload, Order } from '~/types/order';
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
  description: z.string().min(1, 'Укажите описание заказа'),
});
type Schema = z.output<typeof schema>;

const formData = reactive<Partial<Schema>>({
  address: '',
  date: '',
  description: '',
});

const { credentials } = useCredentials();
const minDate = computed(() => {
  const now = new Date();
  return now.toISOString().split('T')[0];
});

const isLoading = ref(false);
const isSubmitting = ref(false);

async function handleCreateOrder(event: FormSubmitEvent<Schema>) {
  // Prevent multiple submissions
  if (isSubmitting.value || isLoading.value) return;

  isSubmitting.value = true;
  isLoading.value = true;

  try {
    const payload: CreateOrderPayload = {
      address: event.data.address,
      date: event.data.date,
      description: event.data.description,
      email: credentials.value!.email,
    };

    const order = await createOrder(payload);

    // Reset form
    formData.address = '';
    formData.date = '';
    formData.description = '';

    // Emit success and close modal
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

// Handle ESC key press to close modal
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue) {
    closeModal();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
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
            class="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md z-50"
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
                  label="Описание заказа"
                  name="description"
                >
                  <UTextarea
                    v-model="formData.description"
                    placeholder="Опишите ваш заказ"
                    :rows="3"
                    class="w-full"
                  />
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
                  :disabled="isLoading"
                >
                  Оформить заказ
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
