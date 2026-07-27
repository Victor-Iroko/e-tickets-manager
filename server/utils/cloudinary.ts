import crypto from "node:crypto";
import { z } from "zod/v4";
import { v2 as cloudinary } from "cloudinary";
import type {
  UploadApiOptions,
  UploadApiResponse,
  ResourceType,
  TransformationOptions,
} from "cloudinary";

export const UploadCategory = [
  "event_banner",
  "profile_photo",
  "organizer_logo",
  "ticket_asset",
  "id_document",
  "report_evidence",
] as const;

export type UploadCategory = (typeof UploadCategory)[number];

export const uploadCategoryEnum = z.enum(UploadCategory);

export const ALLOWED_FORMATS: Record<UploadCategory, string[]> = {
  event_banner: ["jpg", "jpeg", "png", "webp"],
  profile_photo: ["jpg", "jpeg", "png", "webp"],
  organizer_logo: ["jpg", "jpeg", "png", "webp", "svg"],
  ticket_asset: ["jpg", "jpeg", "png", "webp", "svg"],
  id_document: ["jpg", "jpeg", "png", "pdf"],
  report_evidence: ["jpg", "jpeg", "png", "webp", "pdf"],
};

export interface PresignedUploadResponse {
  uploadUrl: string;
  folder: string;
  publicId: string;
  signature: string;
  apiKey: string;
  timestamp: number;
  expiresIn: number;
  allowedTypes: string[];
  allowedFormats: string;
}

// Initialize Cloudinary SDK directly using CLOUDINARY_URL from process.env if available
if (process.env.CLOUDINARY_URL) {
  cloudinary.config();
}

/**
 * Retrieve Cloudinary configuration credentials populated from CLOUDINARY_URL
 */
function getCloudinaryConfig(): { cloudName: string; apiKey: string; apiSecret: string } {
  const config = cloudinary.config();
  let cloudName = config.cloud_name || "";
  let apiKey = config.api_key || "";
  let apiSecret = config.api_secret || "";

  // Parse directly from CLOUDINARY_URL if config values are not yet populated
  if ((!cloudName || !apiKey || !apiSecret) && process.env.CLOUDINARY_URL) {
    try {
      const parsed = new URL(process.env.CLOUDINARY_URL);
      cloudName = parsed.hostname;
      apiKey = decodeURIComponent(parsed.username);
      apiSecret = decodeURIComponent(parsed.password);
    } catch {
      // Ignore URL parsing errors and fallback to current values
    }
  }

  return { cloudName, apiKey, apiSecret };
}

export async function uploadImage(
  file: string,
  options?: UploadApiOptions,
): Promise<UploadApiResponse> {
  return cloudinary.uploader.upload(file, { ...options, use_filename: true });
}

export async function deleteImage(publicId: string, resourceType: ResourceType = "image") {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export function getImageUrl(
  publicId: string,
  options?: {
    transformation?: TransformationOptions;
    resourceType?: ResourceType;
  },
): string {
  const { cloudName } = getCloudinaryConfig();
  const resourceType = options?.resourceType ?? "image";
  const transformation = options?.transformation ?? {};
  return cloudinary.url(publicId, {
    cloud_name: cloudName || undefined,
    resource_type: resourceType,
    transformation,
  });
}

export async function getImageInfo(publicId: string, resourceType: ResourceType = "image") {
  return cloudinary.api.resource(publicId, { resource_type: resourceType });
}

export async function generatePresignedUpload(
  folder: string,
  fileType: UploadCategory,
  options?: {
    resourceType?: ResourceType;
    expirationMinutes?: number;
  },
): Promise<PresignedUploadResponse> {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const expirationMinutes = options?.expirationMinutes ?? 15;
  const expireAt = Math.floor((Date.now() + expirationMinutes * 60 * 1000) / 1000);
  const publicId = crypto.randomBytes(16).toString("hex");
  const allowedFormats = ALLOWED_FORMATS[fileType] ?? [];
  const effectiveResourceType =
    fileType === "id_document" ? "auto" : (options?.resourceType ?? "image");

  const paramsToSign: Record<string, string | number> = {
    public_id: publicId,
    folder,
    timestamp: expireAt,
    allowed_formats: allowedFormats.join(","),
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${effectiveResourceType}/upload`;

  return {
    uploadUrl,
    publicId,
    signature,
    apiKey,
    timestamp: expireAt,
    folder,
    expiresIn: expirationMinutes * 60,
    allowedTypes: allowedFormats,
    allowedFormats: allowedFormats.join(","),
  };
}

export function validateFileExtension(extension: string, allowedExtensions: string[]): boolean {
  if (extension.trim() === "") return false;
  const ext = extension.toLowerCase().replace(/^\./, "");
  return allowedExtensions.includes(ext);
}
