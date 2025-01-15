import Aura from '@primevue/themes/aura'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  typescript: { typeCheck: true },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  primevue: {
    options: {
        theme: {
            preset: Aura
        }
    }
  },
})