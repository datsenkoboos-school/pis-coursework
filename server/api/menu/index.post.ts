import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { description, name, price } = body || {};

  if (!name || !description || price === undefined || price === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: name, description, price',
    });
  }

  if (typeof price !== 'number' || price <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Price must be a positive number',
    });
  }

  try {
    const menuItem = await prisma.menuItem.create({
      data: {
        description,
        name,
        price,
      },
    });

    return menuItem;
  } catch (error) {
    console.error('Error creating menu item:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
