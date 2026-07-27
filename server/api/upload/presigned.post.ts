import { z } from "zod/v4";
import { auth } from "../../utils/auth";
import type { UploadCategory } from "../../utils/cloudinary";
import { generatePresignedUpload, uploadCategoryEnum } from "../../utils/cloudinary";

const PresignedUploadBody = z.object({
  category: uploadCategoryEnum,
  expirationMinutes: z.number().int().min(1).max(60).optional(),
});

const ORGANIZER_ONLY: UploadCategory[] = ["event_banner", "organizer_logo", "ticket_asset"];

const FOLDERS: Record<UploadCategory, (userId: string) => string> = {
  event_banner: (id) => `users/${id}/events/banner`,
  profile_photo: (id) => `users/${id}/profile`,
  organizer_logo: (id) => `users/${id}/organizer/logo`,
  ticket_asset: (id) => `users/${id}/events/assets`,
  id_document: (id) => `users/${id}/verification/id`,
  report_evidence: (id) => `users/${id}/reports/evidence`,
};

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const result = await readValidatedBody(event, (body: unknown) =>
    PresignedUploadBody.safeParse(body),
  );

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid input",
      data: result.error.issues,
    });
  }

  const { category, expirationMinutes } = result.data;

  if (ORGANIZER_ONLY.includes(category) && session.user.role !== "organizer") {
    throw createError({
      statusCode: 403,
      statusMessage: `Only organizers can upload ${category}`,
    });
  }

  const folder = FOLDERS[category](session.user.id);

  return generatePresignedUpload(folder, category, { expirationMinutes });
});
