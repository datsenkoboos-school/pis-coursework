import type { CreateOrderPayload, Order } from '~/types/order';

export async function createOrder(payload: CreateOrderPayload) {
  return await $fetch<Order>('/api/orders', {
    body: payload,
    method: 'POST',
  });
}
