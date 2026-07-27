/**
 * GET /api/orders/:id - Get order status and associated tickets
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  return {
    id,
    status: "paid",
    totalAmount: "50.00",
    paymentRef: "paystack_ref_123",
    tickets: [
      {
        id: "tkt-1",
        ticketType: "Regular Pass",
        qrCode: "QR_TOK_83920192",
        status: "valid",
      },
    ],
  };
});
