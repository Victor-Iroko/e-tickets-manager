/**
 * PATCH /api/events/:id/status - Change event status (published, cancelled, completed)
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  return {
    id,
    status: body.status || "published",
  };
});
