import type { H3Event } from 'h3';
import prisma from '~/lib/prisma';
import { getUserByEmail } from '~/utils/api';

export default defineEventHandler(async (event) => {
  const { address, date, email, orderItems } = await getParams(event);

  try {
    const user = await getUserByEmail(email);

    const order = await createOrder(address, date, orderItems, user!.id);

    return order;
  } catch (error) {
    console.error('Error creating order:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});

async function getParams(event: H3Event) {
  const body = await readBody(event);
  const { address, date, email, orderItems } = body;

  if (!email || !address || !date || !orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: email, address, date, orderItems',
    });
  }

  for (const item of orderItems) {
    if (!item.menuItemId || !item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Each order item must have menuItemId and positive quantity',
      });
    }
  }

  return { address, date, email, orderItems };
}

async function createOrder(address: string, date: string, orderItems: { menuItemId: number; quantity: number }[], userId: number) {
  const order = await prisma.order.create({
    data: {
      address,
      date: new Date(date),
      status: 'PENDING',
      userId,
    },
  });

  await prisma.orderItem.createMany({
    data: orderItems.map(item => ({
      menuItemId: item.menuItemId,
      orderId: order.id,
      quantity: item.quantity,
    })),
  });

  return await prisma.order.findUnique({
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
    where: { id: order.id },
  });
}
