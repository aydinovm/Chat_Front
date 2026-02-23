export default defineNuxtConfig({
  compatibilityDate: "latest",

  runtimeConfig: {
    public: {
    apiBase: import.meta.env.NUXT_PUBLIC_API_BASE ?? 'https://localhost:7072',
    }
  },

  future: {
    compatibilityVersion: 4,
  },

  hooks: {
    'pages:extend'(pages) {
      const indexPage = pages.find(page => page.path === '/')
      if (indexPage) {
        indexPage.redirect = '/chats'
      }
    }
  },

  experimental: {
    sharedPrerenderData: false,
    defaults: {
      useAsyncData: {
        deep: true,
      },
    },
  },

  unhead: {
    renderSSRHeadOptions: {
      omitLineBreaks: false,
    },
  },

  devtools: { enabled: true },

  components: {
    global: true,
    dirs: ['~/components']
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
  ],

  googleFonts: {
    families: {
      Montserrat: true,
    },
  },

  imports: {
    dirs: ['stores', 'composables']
  },
});