import type { OrderStatus } from '@prisma/client';
import { H3Error, type H3Event } from 'h3';
import prisma from '~/lib/prisma';
import { getOrderById } from '~/utils/api';

export default defineEventHandler(async (event) => {
  const { id, status } = await getParams(event);
  try {
    await getOrderById(id);
    return await updateOrderStatus(id, status);
  } catch (error) {
    if (error instanceof H3Error && error.statusCode === 404) {
      throw error;
    }

    console.error(`Error updating order ${id}:`, error);
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

  const body = await readBody(event);
  const { status } = body;

  if (!status || !['CANCELLED', 'COMPLETED', 'CONFIRMED', 'IN_PROGRESS', 'PENDING'].includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid status',
    });
  }

  return { id, status: status as OrderStatus };
}

async function updateOrderStatus(id: number, status: OrderStatus) {
  return await prisma.order.update({
    data: { status },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
    where: { id },
  });
}
