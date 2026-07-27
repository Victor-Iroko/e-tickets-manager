// ─────────────────────────────────────────────
// Email Types & Templates
// ─────────────────────────────────────────────

export type SendEmailParams = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
};

export type SendEmailFunctionParams = {
  toList: string[];
  subject: string;
  html?: string;
  text?: string;
  fromEmail: string;
};

// ── Templates ──

export type EmailTemplateName =
  | "email_verification"
  | "password_reset"
  | "welcome"
  | "order_confirmation"
  | "ticket_delivery"
  | "event_reminder"
  | "event_cancellation"
  | "account_deletion"
  | "email_change"
  | "email_change_notification"
  | "password_change"
  | "password_changed_notification";

export type EmailTemplateData = {
  email_verification: { otp: string };
  password_reset: { otp: string };
  welcome: { name?: string | null };
  order_confirmation: {
    eventTitle: string;
    ticketCount: number;
    totalAmount: string;
  };
  ticket_delivery: {
    eventTitle: string;
    attendeeName: string;
    ticketId: string;
    qrCodeUrl: string;
  };
  event_reminder: {
    eventTitle: string;
    startAt: string;
    location: string;
  };
  event_cancellation: {
    eventTitle: string;
  };
  account_deletion: { otp: string };
  email_change: { otp: string; newEmail: string };
  email_change_notification: { newEmail: string };
  password_change: { otp: string };
  password_changed_notification: Record<string, never>;
};
