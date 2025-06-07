<script setup lang="ts">
definePageMeta({
  middleware: ['manager'],
});

const { credentials } = useCredentials();

const stats = ref({
  menuItems: 0,
  pendingOrders: 0,
  todayOrders: 0,
  totalOrders: 0,
});

const isLoading = ref(true);

interface Order {
  created_at: string;
  status: string;
}

interface MenuItem {
  id: number;
}

async function loadStats() {
  try {
    isLoading.value = true;

    const [orders, menuItems] = await Promise.all([
      $fetch<Order[]>('/api/orders'),
      $fetch<MenuItem[]>('/api/menu'),
    ]);

    const today = new Date().toDateString();
    const todayOrders = orders.filter((order: Order) =>
      new Date(order.created_at).toDateString() === today
    );

    stats.value = {
      menuItems: menuItems.length,
      pendingOrders: orders.filter((order: Order) => order.status === 'PENDING').length,
      todayOrders: todayOrders.length,
      totalOrders: orders.length,
    };
  } catch (error) {
    console.error('Error loading stats:', error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadStats();
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">
      Панель управления, {{ credentials?.first_name }}
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <UCard class="border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">
              Всего заказов
            </p>
            <p class="text-2xl font-bold text-blue-600">
              {{ isLoading ? '...' : stats.totalOrders }}
            </p>
          </div>
          <UIcon
            name="i-heroicons-clipboard-document-list"
            class="w-8 h-8 text-blue-500"
          />
        </div>
      </UCard>

      <UCard class="border-yellow-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">
              Заказы в ожидании
            </p>
            <p class="text-2xl font-bold text-yellow-600">
              {{ isLoading ? '...' : stats.pendingOrders }}
            </p>
          </div>
          <UIcon
            name="i-heroicons-clock"
            class="w-8 h-8 text-yellow-500"
          />
        </div>
      </UCard>

      <UCard class="border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">
              Заказы сегодня
            </p>
            <p class="text-2xl font-bold text-green-600">
              {{ isLoading ? '...' : stats.todayOrders }}
            </p>
          </div>
          <UIcon
            name="i-heroicons-calendar-days"
            class="w-8 h-8 text-green-500"
          />
        </div>
      </UCard>

      <UCard class="border-purple-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">
              Блюд в меню
            </p>
            <p class="text-2xl font-bold text-purple-600">
              {{ isLoading ? '...' : stats.menuItems }}
            </p>
          </div>
          <UIcon
            name="i-heroicons-book-open"
            class="w-8 h-8 text-purple-500"
          />
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UCard class="border-primary-200">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">
              Управление заказами
            </h2>
          </div>
        </template>

        <div class="space-y-4">
          <p>Просматривайте все заказы, изменяйте их статусы и управляйте рабочим процессом.</p>

          <div class="space-y-2">
            <h4 class="font-medium">
              Возможности:
            </h4>
            <ul class="list-disc pl-6 space-y-1 text-sm text-gray-600">
              <li>Просмотр всех заказов в системе</li>
              <li>Изменение статусов заказов</li>
              <li>Удаление заказов</li>
              <li>Мониторинг рабочего процесса</li>
            </ul>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              color="primary"
              to="/orders"
              icon="i-heroicons-clipboard-document-list"
            >
              Управление заказами
            </UButton>
          </div>
        </template>
      </UCard>

      <UCard class="border-green-200">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">
              Управление меню
            </h2>
          </div>
        </template>

        <div class="space-y-4">
          <p>Добавляйте новые блюда, обновляйте цены и управляйте доступностью позиций в меню.</p>

          <div class="space-y-2">
            <h4 class="font-medium">
              Возможности:
            </h4>
            <ul class="list-disc pl-6 space-y-1 text-sm text-gray-600">
              <li>Добавление новых блюд</li>
              <li>Редактирование описаний и цен</li>
              <li>Управление доступностью</li>
              <li>Просмотр всего меню</li>
            </ul>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              color="success"
              to="/menu-management"
              icon="i-heroicons-book-open"
            >
              Управление меню
            </UButton>
          </div>
        </template>
      </UCard>

      <UCard class="border-info-200">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">
              Аналитика и отчеты
            </h2>
          </div>
        </template>

        <div class="space-y-4">
          <p>Просматривайте статистику продаж, популярные блюда и общую производительность ресторана.</p>

          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 class="font-medium mb-2">
              Быстрая статистика:
            </h4>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span>Заказы за сегодня:</span>
                <span class="font-medium">{{ stats.todayOrders }}</span>
              </div>
              <div class="flex justify-between">
                <span>В ожидании:</span>
                <span class="font-medium text-yellow-600">{{ stats.pendingOrders }}</span>
              </div>
              <div class="flex justify-between">
                <span>Всего блюд:</span>
                <span class="font-medium">{{ stats.menuItems }}</span>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              color="info"
              variant="soft"
              disabled
              icon="i-heroicons-chart-bar"
            >
              Скоро доступно
            </UButton>
          </div>
        </template>
      </UCard>

      <UCard class="border-warning-200">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">
              Настройки системы
            </h2>
          </div>
        </template>

        <div class="space-y-4">
          <p>Управляйте настройками ресторана, пользователями и системными параметрами.</p>

          <div class="space-y-2">
            <h4 class="font-medium">
              Доступные настройки:
            </h4>
            <ul class="list-disc pl-6 space-y-1 text-sm text-gray-600">
              <li>Настройки ресторана</li>
              <li>Управление пользователями</li>
              <li>Системные параметры</li>
              <li>Резервное копирование</li>
            </ul>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              color="warning"
              variant="soft"
              disabled
              icon="i-heroicons-cog-6-tooth"
            >
              Скоро доступно
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <div class="mt-8">
      <UCard class="border-gray-200">
        <template #header>
          <h2 class="text-xl font-bold">
            Быстрые действия
          </h2>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UButton
            color="primary"
            block
            icon="i-heroicons-plus"
            to="/menu-management"
          >
            Добавить блюдо
          </UButton>

          <UButton
            color="success"
            block
            icon="i-heroicons-eye"
            to="/orders"
          >
            Просмотреть заказы
          </UButton>

          <UButton
            color="info"
            block
            icon="i-heroicons-arrow-path"
            :loading="isLoading"
            @click="loadStats"
          >
            Обновить статистику
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>
