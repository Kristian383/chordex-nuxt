// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'ChordEx Music',
      titleTemplate: 'ChordEx Music'
      // titleTemplate: (page) => {
      //   const componentName = page?.name || ''; // You can customize this depending on your routing setup
      //   return componentName ? `${componentName} - ChordEx Music` : 'ChordEx Music';
      // },
    },
    // baseURL: '/prefix/'
  },
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      apiBase: '/api'
    }
  },
  // Registers the global stylesheet
  css: ["~/assets/styles/index.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/assets/styles/mixins.scss" as *;`
        }
      }
    }
  },
  modules: ['@nuxt/eslint']
})