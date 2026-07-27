/**
 * PATCH /api/me - Update user profile
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  // TODO: Validate body with Zod and update user record
  return {
    user: {
      id: "mock-user-uuid",
      name: body.name || "Jane Doe",
      email: body.email || "jane@example.com",
    },
  };
});
