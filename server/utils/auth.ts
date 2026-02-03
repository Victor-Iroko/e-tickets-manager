import { betterAuth } from 'better-auth'

export function createServerAuth() {
  const config = useRuntimeConfig()

  return betterAuth({
    baseURL: config.public.siteUrl as string,
    secret: config.betterAuthSecret,
    emailAndPassword: {
      enabled: true
    },
    socialProviders: {
      google: {
        clientId: config.googleClientId as string,
        clientSecret: config.googleClientSecret as string
      }
    },
    trustedOrigins: [config.public.siteUrl as string]
  })
}

export type Auth = ReturnType<typeof createServerAuth>
