/**
 * POST /api/orders - Initiate ticket order checkout
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  // TODO: Validate available ticket quantity atomically and initialize Paystack transaction
  return {
    order: {
      id: "mock-order-id",
      eventId: body.eventId,
      totalAmount: "50.00",
      status: "pending",
    },
    paymentUrl: "https://checkout.paystack.com/mock-checkout",
  };
});
