<script setup lang="ts">
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const needsVerification = ref(false);

async function handleLogin() {
  error.value = "";
  needsVerification.value = false;
  loading.value = true;

  const { error: authError } = await signIn.email({ email: email.value, password: password.value });

  if (authError) {
    if (authError.code === "EMAIL_NOT_VERIFIED") {
      needsVerification.value = true;
      await authClient.emailOtp.sendVerificationOtp({
        email: email.value,
        type: "email-verification",
      });
    }
    error.value = authError.message ?? authError.code ?? "An error occurred";
  } else {
    navigateTo("/dashboard");
  }

  loading.value = false;
}
</script>

<template></template>
