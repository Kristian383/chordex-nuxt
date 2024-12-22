// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxtjs/sitemap', '@nuxtjs/turnstile', '@nuxt/scripts'],
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
  },
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      apiBase: process.env.NODE_ENV === "production" ? "/api" : "", // Use "/api" in production, no prefix in development
      apiDomain: process.env.NUXT_APP_URL,
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    },
    turnstile: {
      // secretKey:'1x00000000000000000000AA' // process.env.TURNSTILE_SECRET_KEY,
      secretKey:process.env.NUXT_TURNSTILE_SECRET_KEY // process.env.TURNSTILE_SECRET_KEY,
     },
  },
   turnstile: {
     siteKey: process.env.NUXT_TURNSTILE_SITE_KEY, //process.env.NUXT_TURNSTILE_SITE_KEY,
    //  siteKey: '3x00000000000000000000FF' //process.env.NUXT_TURNSTILE_SITE_KEY,
   },
  css: ["~/assets/styles/index.scss"], // Registers the global stylesheet
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
  router: { // TODO: this covers what router guards did
    options: {
      scrollBehaviorType: "smooth",
    }
  },
  // auth: {
  //   isEnabled: true,
  //   disableServerSideAuth: false,
  //   originEnvKey: 'AUTH_ORIGIN',
  //   baseURL: 'http://localhost:3000/api/auth',
  //   provider: { /* your provider config */ },
  //   sessionRefresh: {
  //     enablePeriodically: true,
  //     enableOnWindowFocus: true,
  //   }
  // }
})