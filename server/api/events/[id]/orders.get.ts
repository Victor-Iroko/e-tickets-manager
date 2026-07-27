/**
 * GET /api/events/:id/orders - List event orders for organizer
 */
export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, "id");
  return {
    eventId,
    data: [
      {
        id: "order-1",
        attendeeName: "Alex Attendee",
        attendeeEmail: "attendee@etickets.com",
        totalAmount: "50.00",
        status: "paid",
        createdAt: new Date().toISOString(),
      },
    ],
  };
});
