import type { Order } from '~/types/order';

export async function cancelOrder(orderId: number) {
  return await $fetch<Order>(`/api/orders/${orderId}`, {
    body: {
      status: 'CANCELLED',
    },
    method: 'PATCH',
  });
}
