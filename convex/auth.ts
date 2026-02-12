import { createClient, type GenericCtx } from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { betterAuth } from 'better-auth'
import { components } from './_generated/api'
import type { DataModel } from './_generated/dataModel'
import authConfig from './auth.config'

async function sendResetPasswordEmail(
  email: string,
  resetUrl: string
): Promise<void> {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = parseInt(process.env.SMTP_PORT || '587')
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@etickets.app'

  if (!smtpHost || !smtpUser || !smtpPass) {
    // eslint-disable-next-line no-console
    console.log('[Mock Email] Would send reset email to:', email)
    // eslint-disable-next-line no-console
    console.log('[Mock Email] Reset URL:', resetUrl)
    return
  }

  const nodemailer = await import('nodemailer')
  const transporter = nodemailer.default.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  })

  await transporter.sendMail({
    from: `E-Tickets Manager <${fromEmail}>`,
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Reset your password</h1>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  })
}

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
        void sendResetPasswordEmail(user.email, url)
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
