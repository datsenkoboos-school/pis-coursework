import prisma from '~/lib/prisma';

export default async function getOrderById(id: number) {
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Order not found',
    });
  }

  return order;
}
