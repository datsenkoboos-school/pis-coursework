import type { OrderWithUser } from '~/types/order';

export async function fetchAllOrders() {
  return await $fetch<OrderWithUser[]>('/api/orders');
}
