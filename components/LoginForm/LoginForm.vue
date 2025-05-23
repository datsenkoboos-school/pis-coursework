<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import * as z from 'zod';
import { login } from './api';

const schema = z.object({
  email: z.string().email('Неверный email'),
  password: z.string(),
});
type Schema = z.output<typeof schema>;

const formData = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

const UModal = resolveComponent('UModal');

const overlay = useOverlay();
const modal = overlay.create(UModal as Component, {
  props: {
    title: 'Неверный email или пароль',
  },
});

async function handleLogin(event: FormSubmitEvent<Schema>) {
  try {
    const credentials = await login(event.data.email, event.data.password);

    sessionStorage.setItem('credentials', JSON.stringify(credentials));

    navigateTo('/');
  } catch (error) {
    modal.open();
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="formData"
    class="space-y-4"
    @submit="handleLogin"
  >
    <UFormField
      label="Email"
      name="email"
    >
      <UInput
        v-model="formData.email"
        placeholder="Введите email"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Пароль"
      name="password"
    >
      <PasswordInput
        v-model="formData.password"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UButton
      type="submit"
      size="xl"
      class="w-full justify-center"
    >
      Войти
    </UButton>

    <UButton
      variant="link"
      class="w-full justify-center"
      to="/register"
    >
      Зарегистрироваться
    </UButton>
  </UForm>
</template>
