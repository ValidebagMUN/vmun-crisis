// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@sidebase/nuxt-auth',
  ],
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel:"stylesheet", href: "https://use.typekit.net/ipw2eyg.css" }
      ]
    }
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          fontFamily: {
            serif: ['adobe-garamond-pro']
          }
        }
      }
    }
  },
  auth: {
    globalAppMiddleware: true
  },
  runtimeConfig: {
    AUTH_ORIGIN: process.env.VERCEL_URL || "http://localhost:3000",
    AUTH_SECRET: process.env.AUTH_SECRET || "/.It??=Kznez5E5y(R[a(zrNAIN7y9",
    DATABASE_URL: process.env.DATABASE_URL
  }
})
