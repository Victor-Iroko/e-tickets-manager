<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const email = ref((route.query.email as string) ?? "");
const otp = ref("");
const error = ref("");
const success = ref("");
const loading = ref(false);
const resending = ref(false);

async function handleVerify() {
  error.value = "";
  loading.value = true;

  const { error: verifyError } = await authClient.verifyEmail({
    email: email.value,
    otp: otp.value,
  });

  if (verifyError) {
    error.value = verifyError.message ?? verifyError.code ?? "Invalid or expired OTP";
  } else {
    success.value = "Email verified successfully! You can now sign in.";
    setTimeout(() => router.push("/login"), 2000);
  }

  loading.value = false;
}

async function handleResend() {
  resending.value = true;
  error.value = "";

  const { error: sendError } = await authClient.emailOtp.sendVerificationOtp({
    email: email.value,
    type: "email-verification",
  });

  if (sendError) {
    error.value = sendError.message ?? "Failed to resend OTP";
  }

  resending.value = false;
}
</script>

<template></template>
