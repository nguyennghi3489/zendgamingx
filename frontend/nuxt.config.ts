// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/google-fonts",
    "@nuxt/icon",
    "@nuxt/ui",
    "@pinia/nuxt",
    "dayjs-nuxt",
  ],
  googleFonts: {
    families: {
      Inter: true,
    },
  },
  css: ["~/assets/css/main.css"],
});
