/**
 * PATCH /api/events/:id/ticket-types/:typeId - Edit ticket type
 */
export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, "id");
  const typeId = getRouterParam(event, "typeId");
  const body = await readBody(event);
  return {
    id: typeId,
    eventId,
    ...body,
  };
});
