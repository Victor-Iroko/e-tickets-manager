// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  css: ["~/assets/css/main.css"],

  modules: [
    "@nuxt/a11y",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/hints",
    "@nuxt/test-utils",
    "@vueuse/nuxt",
    "@nuxtjs/seo",
    "@pinia/nuxt",
    [
      "@sentry/nuxt/module",
      {
        org: "none-9sy",
        project: "e-tickets-manager",
        autoInjectServerSentry: "top-level-import",
      },
    ],
  ],

  sourcemap: {
    client: "hidden",
  },
});
