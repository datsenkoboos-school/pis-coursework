import type { Order, OrderStatus } from '~/types/order';

export async function updateOrderStatus(orderId: number, status: OrderStatus) {
  return await $fetch<Order>(`/api/orders/${orderId}`, {
    body: { status },
    method: 'PATCH',
  });
}
