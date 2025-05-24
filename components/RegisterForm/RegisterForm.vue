<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import * as z from 'zod';
import { register } from '~/components/RegisterForm/api';

const schema = z.object({
  confirmPassword: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
  email: z.string().email('Неверный email'),
  first_name: z.string().min(1, 'Введите имя'),
  last_name: z.string().min(1, 'Введите фамилию'),
  password: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
  role: z.enum(['CUSTOMER', 'WAITER']),
  waiterPassphrase: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

type Schema = z.output<typeof schema>;

const formData = reactive<Partial<Schema>>({
  confirmPassword: undefined,
  email: undefined,
  first_name: undefined,
  last_name: undefined,
  password: undefined,
  role: 'CUSTOMER',
  waiterPassphrase: undefined,
});

const UModal = resolveComponent('UModal');

const errorTitle = ref('Email уже используется');
const overlay = useOverlay();
const modal = overlay.create(UModal as Component, {
  props: {
    title: errorTitle,
  },
});

async function handleRegister(event: FormSubmitEvent<Schema>) {
  try {
    await register(
      event.data.email,
      event.data.first_name,
      event.data.last_name,
      event.data.password,
      event.data.role,
      event.data.waiterPassphrase
    );

    navigateTo('/login');
  } catch (error: unknown) {
    const apiError = error as { statusCode?: number };
    if (apiError.statusCode === 403) {
      errorTitle.value = 'Неверный код официанта';
    } else {
      errorTitle.value = 'Email уже используется';
    }
    modal.open();
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="formData"
    class="space-y-6"
    @submit="handleRegister"
  >
    <div class="grid grid-cols-2 gap-4">
      <UFormField
        label="Имя"
        name="first_name"
      >
        <UInput
          v-model="formData.first_name"
          class="w-full"
          placeholder="Введите имя"
          size="xl"
        />
      </UFormField>

      <UFormField
        label="Фамилия"
        name="last_name"
      >
        <UInput
          v-model="formData.last_name"
          class="w-full"
          placeholder="Введите фамилию"
          size="xl"
        />
      </UFormField>

      <UFormField
        label="Email"
        name="email"
        class="col-span-2"
      >
        <UInput
          v-model="formData.email"
          class="w-full"
          placeholder="Введите email"
          size="xl"
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
          placeholder="Введите пароль"
        />
      </UFormField>

      <UFormField
        label="Подтвердите пароль"
        name="confirmPassword"
      >
        <PasswordInput
          v-model="formData.confirmPassword"
          size="xl"
          class="w-full"
          placeholder="Подтвердите пароль"
        />
      </UFormField>

      <UFormField
        label="Роль"
        name="role"
      >
        <URadioGroup
          v-model="formData.role"
          :items="[
            { label: 'Клиент', value: 'CUSTOMER' },
            { label: 'Официант', value: 'WAITER' }
          ]"
          size="xl"
        />
      </UFormField>

      <Transition name="fade">
        <UFormField
          v-if="formData.role === 'WAITER'"
          label="Код официанта"
          name="waiterPassphrase"
        >
          <PasswordInput
            v-model="formData.waiterPassphrase"
            class="w-full"
            placeholder="Введите код официанта"
            size="xl"
          />
        </UFormField>
      </Transition>
    </div>

    <UButton
      type="submit"
      class="w-full justify-center"
      size="xl"
    >
      Зарегистрироваться
    </UButton>

    <UButton
      variant="link"
      class="w-full justify-center"
      to="/login"
    >
      Вход
    </UButton>
  </UForm>
</template>
