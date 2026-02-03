// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/a11y',
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-unstorage/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/seo',
    'nuxt-security',
    '@vueuse/motion/nuxt',
    'nuxt-convex'
  ],

  runtimeConfig: {
    // Server-only keys (not exposed to client)
    betterAuthSecret: process.env.NUXT_BETTER_AUTH_SECRET,
    googleClientId: process.env.NUXT_GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,

    // Public keys (exposed to client)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      convexUrl: process.env.NUXT_PUBLIC_CONVEX_URL
    }
  },

  // Configure security module to allow auth endpoints
  security: {
    headers: {
      crossOriginEmbedderPolicy:
        process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp'
    }
  }
})
