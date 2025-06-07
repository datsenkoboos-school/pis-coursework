import prisma from '~/lib/prisma';

export default defineEventHandler(async () => {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: {
        name: 'asc',
      },
      where: {
        is_available: true,
      },
    });

    return menuItems;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
