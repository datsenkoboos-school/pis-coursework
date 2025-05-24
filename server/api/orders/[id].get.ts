import { H3Error, type H3Event } from 'h3';
import { getOrderById } from '~/server/utils/api';

export default defineEventHandler(async (event) => {
  const { id } = await getParams(event);
  try {
    return await getOrderById(id);
  } catch (error) {
    if (error instanceof H3Error && error.statusCode === 404) {
      throw error;
    }

    console.error(`Error fetching order ${id}:`, error);
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
