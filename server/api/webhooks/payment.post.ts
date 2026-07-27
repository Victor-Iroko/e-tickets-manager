import { verifyWebhookSignature } from "../../utils/paystack";

/**
 * POST /api/webhooks/payment - Paystack payment webhook handler
 */
export default defineEventHandler(async (event) => {
  const rawBody = await readRawBody(event);
  const signature = getHeader(event, "x-paystack-signature") || "";

  if (rawBody && !verifyWebhookSignature(rawBody, signature)) {
    throw createError({ statusCode: 401, statusMessage: "Invalid Paystack Signature" });
  }

  // TODO: Transition order status to 'paid', increment quantitySold, generate QR code tickets & send email
  return { status: "success" };
});
