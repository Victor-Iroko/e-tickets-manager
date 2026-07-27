/**
 * POST /api/events/:id/ticket-types - Add ticket type to event
 */
export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, "id");
  const body = await readBody(event);
  return {
    id: "mock-tt-id",
    eventId,
    name: body.name || "General Admission",
    description: body.description || "",
    price: body.price || "0.00",
    quantity: body.quantity || 100,
    quantitySold: 0,
  };
});
