export default defineNuxtConfig({
  compatibilityDate: "latest",
  // runtimeConfig: {
  //   public: {
  //     apiBase: 'https://calendar-admin-api.7hrm.az/api', 
  //   }
  // },
  future: {
    compatibilityVersion: 4,
  },  
  
  hooks: {
    'pages:extend'(pages) {
      const indexPage = pages.find(page => page.path === '/')
      if (indexPage) {
        indexPage.redirect = '/chats' // Изменено с /login на /chats
      }
    }
  },
  experimental: {
    sharedPrerenderData: false,
    defaults:{
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
    "@nuxtjs/google-fonts"
  ],
  
  googleFonts:{
    families:{
      Montserrat: true,
    },
  },
});