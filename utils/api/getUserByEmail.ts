import prisma from '~/lib/prisma';

export default async function getUserByEmail(email: string, options: Options = { throwIfNotFound: true }) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user && options.throwIfNotFound) {
    throw createError({
      statusCode: options?.statusCode || 401,
      statusMessage: options?.statusMessage || 'Invalid credentials',
    });
  }

  return user;
}

interface Options {
  statusCode?: number;
  statusMessage?: string;
  throwIfNotFound?: boolean;
}
