import bcrypt from 'bcrypt';

import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, first_name, last_name, password } = body || {};

  if (!email || !password || !first_name || !last_name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is already in use',
      });
    }

    const config = useRuntimeConfig(event);
    const userPasswordSalt = parseInt(config.userPasswordSalt as string, 10);

    const hashedPassword = await bcrypt.hash(password, userPasswordSalt);

    await createUser(email, first_name, last_name, hashedPassword);

    return {
      message: 'User created successfully',
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});

async function createUser(email: string, first_name: string, last_name: string, password_hash: string) {
  await prisma.user.create({
    data: {
      email,
      first_name,
      last_name,
      password_hash,
    },
  });
}
