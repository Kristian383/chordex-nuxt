// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
    head: {
      // title: 'ChordEx Music',
      // titleTemplate: '%s - ChordEx Music',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
      ],
      script: [
        {
          key: 'gtm',
          children: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TG3L2DTS');
          `,
          type: 'text/javascript',
        },
      ],
      noscript: [
        {
          children: `
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TG3L2DTS"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>
          `,
        },
      ],
    },
    // baseURL: '/prefix/'
    
  },
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      apiBase: process.env.VUE_APP_URL // || 'http://localhost:8000',
    }
  },
  // Registers the global stylesheet
  css: ["~/assets/styles/index.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/styles/mixins.scss" as *;
            @use "~/assets/styles/auth.scss" as *;
          `,
        }
      }
    },
  },
  modules: ['@nuxt/eslint', '@nuxtjs/sitemap'],
  router: { // TODO: this covers what router guards did
    options: {
      middleware: ['auth', 'meta'], // Global middleware
      scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
          return { el: to.hash, behavior: 'smooth' };
        } else if (savedPosition) {
          return savedPosition;
        } else {
          return { top: 0, left: 0, behavior: 'smooth' };
        }
      },

    },
  },
})