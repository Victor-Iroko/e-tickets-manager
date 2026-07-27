<script setup lang="ts">
const step = ref<"email" | "otp">("email");
const email = ref("");
const otp = ref("");
const newPassword = ref("");
const error = ref("");
const loading = ref(false);

async function handleRequestOtp() {
  error.value = "";
  if (!email.value) {
    error.value = "Email is required";
    return;
  }
  loading.value = true;

  const { error: sendError } = await authClient.emailOtp.sendVerificationOtp({
    email: email.value,
    type: "forget-password",
  });

  if (sendError) {
    error.value = sendError.message ?? sendError.code ?? "Failed to send OTP";
  } else {
    step.value = "otp";
  }

  loading.value = false;
}

async function handleResetPassword() {
  error.value = "";
  if (!otp.value || !newPassword.value) {
    error.value = "OTP and new password are required";
    return;
  }
  loading.value = true;

  const { error: resetError } = await authClient.emailOtp.resetPassword({
    email: email.value,
    otp: otp.value,
    password: newPassword.value,
  });

  if (resetError) {
    error.value = resetError.message ?? resetError.code ?? "Failed to reset password";
  } else {
    navigateTo("/login");
  }

  loading.value = false;
}
</script>

<template></template>
