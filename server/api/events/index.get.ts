/**
 * GET /api/events - Public events listing
 * Query params: ?search, location, page
 */
export default defineEventHandler(async (event) => {
  const _query = getQuery(event);
  return {
    data: [
      {
        id: "mock-event-1",
        title: "Tech Summit 2026",
        description: "The premier technology conference.",
        location: "Grand Convention Center",
        bannerUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
        startAt: new Date().toISOString(),
        endAt: new Date(Date.now() + 86400000).toISOString(),
        status: "published",
        ticketTypes: [{ name: "Regular Pass", price: "50.00" }],
      },
    ],
    pagination: {
      cursor: null,
      hasNext: false,
    },
  };
});
