import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.url().nonempty("DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z.string().nonempty("BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
  PAYSTACK_SECRET_KEY: z.string().nonempty("PAYSTACK_SECRET_KEY is required"),
  CLOUDINARY_URL: z.string().nonempty("CLOUDINARY_URL is required"),
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().default(465),
  SMTP_USER: z.string().nonempty("SMTP_USER is required"),
  SMTP_PASS: z.string().nonempty("SMTP_PASS is required"),
  SENTRY_DSN: z.string().nonempty("SENTRY_DSN is required"),
  GOOGLE_CLIENT_ID: z.string().nonempty("GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().nonempty("GOOGLE_CLIENT_SECRET is required"),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(env: Record<string, string | undefined> = process.env): Env {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    console.error(
      "❌ Environment validation failed:",
      JSON.stringify(z.treeifyError(parsed.error), null, 2),
    );
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}
