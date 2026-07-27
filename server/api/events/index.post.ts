/**
 * POST /api/events - Create new event (Organizer)
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return {
    id: "mock-created-event-id",
    title: body.title || "Untitled Event",
    description: body.description || "",
    location: body.location || "",
    bannerUrl: body.bannerUrl || null,
    startAt: body.startAt,
    endAt: body.endAt,
    status: "draft",
    createdAt: new Date().toISOString(),
  };
});
