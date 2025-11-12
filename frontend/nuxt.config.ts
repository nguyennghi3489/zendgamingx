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
  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
    },
  },
});
