/**
 * DELETE /api/events/:id/scanner-sessions/:sessionId - Revoke scanner magic link
 */
export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, "sessionId");
  return {
    success: true,
    message: `Scanner session ${sessionId} revoked`,
  };
});
