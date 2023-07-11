// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-mongoose',
  ],
  devtools: { enabled: true },
  nitro: {
    plugins: ['~/server/index.ts']
  },
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
  }
})
