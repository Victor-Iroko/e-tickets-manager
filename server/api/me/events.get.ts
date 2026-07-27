/**
 * GET /api/me/events - Fetch events created by the logged-in organizer
 */
export default defineEventHandler(async (_event) => {
  return {
    data: [
      {
        id: "mock-event-1",
        title: "Tech Summit 2026",
        status: "published",
        startAt: new Date().toISOString(),
        endAt: new Date(Date.now() + 86400000).toISOString(),
        totalTicketsSold: 25,
        totalRevenue: "1250.00",
      },
    ],
  };
});
