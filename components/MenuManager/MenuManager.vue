<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import * as z from 'zod';

interface MenuItem {
  description: string;
  id: number;
  is_available: boolean;
  name: string;
  price: number;
}

const schema = z.object({
  description: z.string().min(1, 'Введите описание'),
  name: z.string().min(1, 'Введите название'),
  price: z.number().min(0.01, 'Цена должна быть больше 0'),
});

type Schema = z.output<typeof schema>;

const formData = reactive<Partial<Schema>>({
  description: '',
  name: '',
  price: undefined,
});

const menuItems = ref<MenuItem[]>([]);
const loading = ref(false);
const isAddingItem = ref(false);

async function fetchMenuItems() {
  try {
    loading.value = true;
    const data = await $fetch<MenuItem[]>('/api/menu');
    menuItems.value = data || [];
  } catch (error) {
    console.error('Error fetching menu items:', error);
  } finally {
    loading.value = false;
  }
}

async function handleAddItem(event: FormSubmitEvent<Schema>) {
  try {
    isAddingItem.value = true;
    await $fetch('/api/menu', {
      body: event.data,
      method: 'POST',
    });

    formData.description = '';
    formData.name = '';
    formData.price = undefined;

    await fetchMenuItems();
  } catch (error) {
    console.error('Error adding menu item:', error);
  } finally {
    isAddingItem.value = false;
  }
}

onMounted(() => {
  fetchMenuItems();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">
        Управление меню
      </h1>
    </div>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">
          Добавить новое блюдо
        </h2>
      </template>

      <UForm
        :schema="schema"
        :state="formData"
        class="space-y-4"
        @submit="handleAddItem"
      >
        <UFormField
          label="Название"
          name="name"
        >
          <UInput
            v-model="formData.name"
            placeholder="Введите название блюда"
          />
        </UFormField>

        <UFormField
          label="Описание"
          name="description"
        >
          <UTextarea
            v-model="formData.description"
            placeholder="Введите описание блюда"
            :rows="3"
          />
        </UFormField>

        <UFormField
          label="Цена (₽)"
          name="price"
        >
          <UInput
            v-model="formData.price"
            type="number"
            step="0.01"
            placeholder="0.00"
          />
        </UFormField>

        <UButton
          type="submit"
          :loading="isAddingItem"
          class="w-full"
        >
          Добавить блюдо
        </UButton>
      </UForm>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">
          Текущее меню
        </h2>
      </template>

      <div
        v-if="loading"
        class="text-center py-8"
      >
        <USkeleton class="h-20 w-full mb-4" />
        <USkeleton class="h-20 w-full mb-4" />
        <USkeleton class="h-20 w-full" />
      </div>

      <div
        v-else-if="menuItems.length === 0"
        class="text-center py-8 text-gray-500"
      >
        Меню пустое. Добавьте первое блюдо!
      </div>

      <div
        v-else
        class="space-y-4"
      >
        <div
          v-for="item in menuItems"
          :key="item.id"
          class="border rounded-lg p-4 flex justify-between items-start"
        >
          <div class="flex-1">
            <h3 class="font-semibold text-lg">
              {{ item.name }}
            </h3>
            <p class="text-gray-600 mt-1">
              {{ item.description }}
            </p>
            <p class="text-lg font-bold text-green-600 mt-2">
              {{ item.price }} ₽
            </p>
          </div>
          <div class="ml-4">
            <UBadge
              :color="item.is_available ? 'success' : 'error'"
              variant="subtle"
            >
              {{ item.is_available ? 'Доступно' : 'Недоступно' }}
            </UBadge>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
