import crypto from "node:crypto";

/**
 * POST /api/events/:id/scanner-sessions - Generate new scanner magic link token
 */
export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, "id");
  const body = await readBody(event);
  const token = crypto.randomBytes(16).toString("hex");
  const expiresAt = body.expiresAt || new Date(Date.now() + 86400000 * 30).toISOString();

  return {
    id: "scan-sess-new",
    eventId,
    label: body.label || "Scanner Gate",
    token,
    expiresAt,
    revoked: false,
    link: `http://localhost:3000/scan/${eventId}?token=${token}`,
  };
});
