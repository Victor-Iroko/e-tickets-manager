'use node'

import { v } from 'convex/values'
import { internalAction } from './_generated/server'
import nodemailer from 'nodemailer'

export const sendResetPasswordEmail = internalAction({
  args: {
    email: v.string(),
    resetUrl: v.string()
  },
  handler: async (_ctx, { email, resetUrl }) => {
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const smtpSecure = process.env.SMTP_SECURE === 'true'

    const SMTP_HOST = 'smtp.gmail.com'
    const SMTP_PORT = smtpSecure ? 465 : 587

    if (!smtpUser || !smtpPass) {
      // eslint-disable-next-line no-console
      console.log('[Mock Email] Would send reset email to:', email)
      // eslint-disable-next-line no-console
      console.log('[Mock Email] Reset URL:', resetUrl)
      return
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    })

    await transporter.sendMail({
      from: `E-Tickets Manager <${smtpUser}>`,
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
})
