/**
 * GET /api/me/orders - Fetch orders placed by attendee
 */
export default defineEventHandler(async (_event) => {
  return {
    data: [
      {
        id: "mock-order-1",
        eventTitle: "Tech Summit 2026",
        totalAmount: "50.00",
        status: "paid",
        createdAt: new Date().toISOString(),
      },
    ],
  };
});
