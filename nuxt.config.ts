// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $development: {
    devtools: { enabled: false },
  },
  compatibilityDate: '2025-05-15',
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@prisma/nuxt',
    '@nuxt/ui',
  ],
  runtimeConfig: {
    USER_PASSWORD_SALT: '',
  },
});
