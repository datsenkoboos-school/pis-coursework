<script setup lang="ts">
defineProps<{
  loading: boolean;
  show: boolean;
}>();

defineEmits(['close', 'confirm']);
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <Transition name="zoom">
          <div
            v-if="show"
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
                  @click="$emit('close')"
                />
              </div>

              <p class="mb-4">
                Вы уверены, что хотите отменить этот заказ?
              </p>

              <div class="flex justify-end gap-3 mt-6">
                <UButton
                  color="secondary"
                  variant="ghost"
                  @click="$emit('close')"
                >
                  Нет
                </UButton>
                <UButton
                  color="error"
                  :loading="loading"
                  @click="$emit('confirm')"
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
          @click="$emit('close')"
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
