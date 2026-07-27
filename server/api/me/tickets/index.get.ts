/**
 * GET /api/me/tickets - Attendee purchased tickets list
 */
export default defineEventHandler(async (_event) => {
  return {
    data: [
      {
        id: "tkt-1",
        qrCode: "QR_TOK_83920192",
        status: "valid",
        unitPrice: "50.00",
        ticketType: { name: "Regular Pass" },
        event: {
          id: "event-1",
          title: "Tech Summit 2026",
          location: "Grand Convention Center",
          startAt: new Date().toISOString(),
          endAt: new Date(Date.now() + 86400000).toISOString(),
        },
      },
    ],
  };
});
