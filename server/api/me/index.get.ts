/**
 * GET /api/me - Fetch authenticated user profile
 */
export default defineEventHandler(async (_event) => {
  // TODO: Get authenticated user from session
  return {
    user: {
      id: "mock-user-uuid",
      name: "Jane Doe",
      email: "jane@example.com",
      role: "organizer",
      emailVerified: true,
    },
  };
});
