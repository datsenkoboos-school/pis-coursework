import { H3Error, type H3Event } from 'h3';
import prisma from '~/lib/prisma';
import { getOrderById } from '~/utils/api';

export default defineEventHandler(async (event) => {
  const { id } = await getParams(event);

  try {
    await getOrderById(id);
    return await deleteOrder(id);
  } catch (error) {
    if (error instanceof H3Error && error.statusCode === 404) {
      throw error;
    }

    console.error(`Error deleting order ${id}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});

async function getParams(event: H3Event) {
  const id = parseInt(event.context.params?.id as string, 10);

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid order ID',
    });
  }

  return { id };
}

async function deleteOrder(id: number) {
  await prisma.order.delete({
    where: { id },
  });

  return { message: 'Order deleted successfully', success: true };
}
