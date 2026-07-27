/**
 * Health check endpoint
 * GET /api/health
 */
export default defineEventHandler(async () => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "e-tickets-manager-api",
  };
});
