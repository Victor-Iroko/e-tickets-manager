/**
 * DELETE /api/events/:id/ticket-types/:typeId - Delete ticket type
 */
export default defineEventHandler(async (event) => {
  const typeId = getRouterParam(event, "typeId");
  return {
    success: true,
    message: `Ticket type ${typeId} deleted`,
  };
});
