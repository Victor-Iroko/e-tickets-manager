import nodemailer from "nodemailer";
import type { SendEmailParams, EmailTemplateName, EmailTemplateData } from "../types/email.js";

const smtpTransport =
  process.env.SMTP_HOST && process.env.SMTP_PORT
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? "" }
          : undefined,
      })
    : null;

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  const toList = Array.isArray(to) ? to : [to];
  const fromEmail = process.env.DEFAULT_FROM_EMAIL ?? "noreply@eventtickets.com";

  const content = html ?? text ?? undefined;
  if (!content) throw new Error("Either html or text content is required");

  if (!smtpTransport) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP transport is not configured");
    }
    console.log(`[MOCK EMAIL] To: ${toList.join(", ")} | Subject: ${subject}`);
    return { id: "mock-sent", from: fromEmail, to: toList };
  }

  try {
    const info = await smtpTransport.sendMail({
      from: fromEmail,
      to: toList.join(", "),
      subject,
      html,
      text,
    });

    console.log({ messageId: info.messageId, to: toList }, "smtp_email_sent");

    return { id: info.messageId, from: fromEmail, to: toList };
  } catch (error) {
    console.error({ error }, "smtp_send_failed");
    throw new Error("Failed to send email via SMTP", { cause: error });
  }
}

const emailTemplates: {
  [K in EmailTemplateName]: (data: EmailTemplateData[K]) => { subject: string; html: string };
} = {
  email_verification: ({ otp }) => ({
    subject: "Your email verification code",
    html: `<p>Your verification code is <strong>${otp}</strong>.</p>`,
  }),
  password_reset: ({ otp }) => ({
    subject: "Your password reset code",
    html: `<p>Your password reset code is <strong>${otp}</strong>.</p>`,
  }),
  welcome: ({ name }) => {
    const greeting = name ? `, ${name}` : "";
    return {
      subject: "Welcome to Event Tickets!",
      html: `<h1>Welcome to Event Tickets${greeting}!</h1>
<p>Your email has been verified. Start exploring events and booking tickets today!</p>`,
    };
  },
  order_confirmation: ({ eventTitle, ticketCount, totalAmount }) => ({
    subject: `Order confirmed for ${eventTitle}`,
    html: `<p>Your order for <strong>${eventTitle}</strong> is confirmed.</p>
<p>Tickets: ${ticketCount} | Total: ${totalAmount}</p>`,
  }),
  ticket_delivery: ({ eventTitle, attendeeName, ticketId, qrCodeUrl }) => ({
    subject: `Your tickets for ${eventTitle}`,
    html: `<p>Hi ${attendeeName},</p>
<p>Your tickets for <strong>${eventTitle}</strong> are ready.</p>
<p>Ticket ID: ${ticketId}</p>
<p>Scan the QR code below at the event entrance:</p>
<img src="${qrCodeUrl}" alt="QR Code" />`,
  }),
  event_reminder: ({ eventTitle, startAt, location }) => ({
    subject: `Reminder: ${eventTitle} starts soon`,
    html: `<p><strong>${eventTitle}</strong> is starting at <strong>${startAt}</strong>.</p>
<p>Location: ${location}</p>`,
  }),
  event_cancellation: ({ eventTitle }) => ({
    subject: `${eventTitle} has been cancelled`,
    html: `<p>We regret to inform you that <strong>${eventTitle}</strong> has been cancelled.</p>
<p>Your payment will be refunded shortly.</p>`,
  }),
  account_deletion: ({ otp }) => ({
    subject: "Your account deletion code",
    html: `<p>Your account deletion code is <strong>${otp}</strong>.</p><p>This code expires in 10 minutes. If you didn't request this, ignore this email.</p>`,
  }),
  email_change: ({ otp, newEmail }) => ({
    subject: "Your email change code",
    html: `<p>Your email change verification code is <strong>${otp}</strong>.</p><p>This code was sent because you requested to change your email to <strong>${newEmail}</strong>. If you didn't request this, ignore this email.</p>`,
  }),
  email_change_notification: ({ newEmail }) => ({
    subject: "Your email address has been changed",
    html: `<p>Your email address has been changed to <strong>${newEmail}</strong>.</p><p>If you didn't make this change, please contact support immediately.</p>`,
  }),
  password_change: ({ otp }) => ({
    subject: "Your password change code",
    html: `<p>Your password change verification code is <strong>${otp}</strong>.</p><p>If you didn't request this, ignore this email.</p>`,
  }),
  password_changed_notification: () => ({
    subject: "Your password has been changed",
    html: `<p>Your password has been changed successfully.</p><p>If you didn't make this change, please contact support immediately.</p>`,
  }),
};

export function sendTemplatedEmail<K extends EmailTemplateName>(
  to: string,
  template: K,
  data: EmailTemplateData[K],
) {
  const { subject, html } = emailTemplates[template](data);
  return sendEmail({ to, subject, html });
}
