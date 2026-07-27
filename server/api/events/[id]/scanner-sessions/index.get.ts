/**
 * GET /api/events/:id/scanner-sessions - Fetch magic link scanner sessions for event
 */
export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, "id");
  return {
    eventId,
    data: [
      {
        id: "scan-sess-1",
        label: "Gate A",
        token: "test-scanner-token-12345",
        expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
        revoked: false,
        link: "http://localhost:3000/scan/mock-event-1?token=test-scanner-token-12345",
      },
    ],
  };
});
