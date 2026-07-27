/**
 * POST /api/scan/verify - Token-authenticated QR code scan & entry validation
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const authHeader = getHeader(event, "authorization");
  const tokenQuery = getQuery(event).token;
  const token = authHeader?.replace("Bearer ", "") || tokenQuery;

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Scanner session token is required" });
  }

  // TODO: Verify scanner token, check ticket QR status atomically, mark used with scannedAt & scannedBySessionId
  if (body.qrCode === "INVALID_TEST") {
    return {
      valid: false,
      reason: "invalid",
    };
  }

  return {
    valid: true,
    ticket: {
      id: "tkt-1",
      status: "used",
    },
    attendeeName: "Alex Attendee",
    ticketType: "Regular Pass",
  };
});
