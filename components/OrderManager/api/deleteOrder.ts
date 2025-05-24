interface DeleteResponse {
  message: string;
  success: boolean;
}

export async function deleteOrder(orderId: number) {
  return await $fetch<DeleteResponse>(`/api/orders/${orderId}`, {
    method: 'DELETE',
  });
}
