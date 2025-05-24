import type { Order } from '~/types/order';

export async function fetchOrders(email: string) {
  return await $fetch<Order[]>(`/api/orders?email=${email}`);
}
