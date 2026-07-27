import { validateEnv } from "../../shared/utils/env";

export default defineNitroPlugin(() => {
  // Validate process.env on Nitro startup
  if (process.env.NODE_ENV !== "test") {
    try {
      validateEnv(process.env);
      console.log("✅ Environment variables validated successfully");
    } catch (error) {
      if (process.env.NODE_ENV === "production") {
        console.error("❌ Critical: Startup aborted due to invalid environment variables.");
        throw error;
      } else {
        console.warn(
          "⚠️ Warning: Some environment variables are using defaults or missing for development.",
        );
      }
    }
  }
});
