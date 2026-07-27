/**
 * GET /api/me/tickets/:id - View single ticket details and QR code
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  return {
    id,
    qrCode: "QR_TOK_83920192",
    status: "valid",
    unitPrice: "50.00",
    scannedAt: null,
    ticketType: { name: "Regular Pass" },
    event: {
      id: "event-1",
      title: "Tech Summit 2026",
      location: "Grand Convention Center",
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 86400000).toISOString(),
    },
    order: { id: "order-1" },
  };
});
