import bcrypt from 'bcrypt';

import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body || {};

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    });
  }

  const user = await getUserByEmail(email);

  await compareUserPassword(password, user.password_hash);

  return {
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  };
});

async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }

  return user;
}

async function compareUserPassword(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }
}
