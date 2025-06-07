import type { H3Event } from 'h3';
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const { email } = await getParams(event);

  try {
    if (email) {
      return await getOrdersByUserEmail(email);
    } else {
      return await getAllOrders();
    }
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
  const { email } = query as { email?: string };

  return { email };
}

async function getOrdersByUserEmail(email: string) {
  return await prisma.order.findMany({
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
      user: {
        select: {
          email: true,
          first_name: true,
          last_name: true,
        },
      },
    },
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

async function getAllOrders() {
  return await prisma.order.findMany({
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
      user: {
        select: {
          email: true,
          first_name: true,
          last_name: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}
