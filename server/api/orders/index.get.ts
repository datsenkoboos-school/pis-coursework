import type { H3Event } from 'h3';
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const { email } = await getParams(event);

  try {
    return await getOrdersByUserEmail(email);
  } catch (error) {
    console.error('Error fetching orders:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});

async function getParams(event: H3Event) {
  const query = getQuery(event);
  const { email } = query as { email: string };

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required parameters',
    });
  }

  return { email };
}

async function getOrdersByUserEmail(email: string) {
  return await prisma.order.findMany({
    orderBy: {
      created_at: 'desc',
    },
    where: {
      user: {
        email,
      },
    },
  });
}
