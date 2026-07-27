/**
 * PATCH /api/me/password - Change user password
 */
export default defineEventHandler(async (event) => {
  const _body = await readBody(event);
  // TODO: Verify current password and update to new password
  return {
    message: "Password updated successfully",
  };
});
