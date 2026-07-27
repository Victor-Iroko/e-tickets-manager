/**
 * DELETE /api/events/:id - Delete an event
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  return {
    success: true,
    message: `Event ${id} deleted`,
  };
});
