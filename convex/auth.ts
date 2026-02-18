import { createClient, type GenericCtx } from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { betterAuth } from 'better-auth'
import { components, internal } from './_generated/api'
import type { DataModel } from './_generated/dataModel'
import authConfig from './auth.config'

export const authComponent = createClient<DataModel>(components.betterAuth, {
  verbose: false
})

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }) => {
        if ('scheduler' in ctx) {
          void ctx.scheduler.runAfter(
            0,
            internal.email.sendResetPasswordEmail,
            {
              email: user.email,
              resetUrl: url
            }
          )
          return
        }

        // eslint-disable-next-line no-console
        console.log('[Mock Email] Would send reset email to:', user.email)
        // eslint-disable-next-line no-console
        console.log('[Mock Email] Reset URL:', url)
      },
      onPasswordReset: async ({ user }) => {
        // eslint-disable-next-line no-console
        console.log(`Password reset successful for user: ${user.email}`)
      }
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
      }
    },
    trustedOrigins: [process.env.BETTER_AUTH_URL as string],
    plugins: [convex({ authConfig })]
  })
