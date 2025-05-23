export default function login(email: string, password: string) {
  return $fetch('/api/auth/login', {
    body: {
      email,
      password,
    },
    method: 'POST',
  });
}
