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
    '@vueuse/nuxt',
  ],
  runtimeConfig: {
    managerPassphrase: '',
    userPasswordSalt: '',
    waiterPassphrase: '',
  },
  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/@prisma/client/index-browser.js',
      },
    },
  },
});
