/**
 * GET /api/events/:id/attendees - Event attendee roster for organizer
 */
export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, "id");
  return {
    eventId,
    data: [
      {
        ticketId: "tkt-1",
        attendeeName: "Alex Attendee",
        attendeeEmail: "attendee@etickets.com",
        ticketType: "Regular Pass",
        status: "valid",
        scannedAt: null,
      },
    ],
  };
});
