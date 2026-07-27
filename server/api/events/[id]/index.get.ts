/**
 * GET /api/events/:id - Get event details
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  return {
    id,
    title: "Tech Summit 2026",
    description: "The premier technology conference.",
    location: "Grand Convention Center",
    bannerUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 86400000).toISOString(),
    status: "published",
    organizer: {
      id: "org-uuid-1",
      name: "Jane Organizer",
    },
    ticketTypes: [
      {
        id: "tt-1",
        name: "Regular Pass",
        description: "General admission ticket",
        price: "50.00",
        quantity: 500,
        quantitySold: 25,
      },
    ],
  };
});
