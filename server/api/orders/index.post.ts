import type { H3Event } from 'h3';
import prisma from '~/lib/prisma';
import { getUserByEmail } from '~/server/utils/api';

export default defineEventHandler(async (event) => {
  const { address, date, description, email } = await getParams(event);

  try {
    const user = await getUserByEmail(email);

    const order = await createOrder(address, date, description, user!.id);

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
  const { address, date, description, email } = body;

  if (!email || !description || !address || !date) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    });
  }

  return { address, date, description, email };
}

async function createOrder(address: string, date: string, description: string, userId: number) {
  return await prisma.order.create({
    data: {
      address,
      date: new Date(date),
      description,
      status: 'PENDING',
      userId,
    },
  });
}
