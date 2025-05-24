export async function register(
  email: string,
  first_name: string,
  last_name: string,
  password: string,
  role: string,
  waiterPassphrase?: string
) {
  return $fetch('/api/auth/register', {
    body: {
      email,
      first_name,
      last_name,
      password,
      role,
      waiterPassphrase,
    },
    method: 'POST',
  });
}
