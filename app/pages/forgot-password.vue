<script setup lang="ts">
const step = ref<"email" | "otp">("email");
const email = ref("");
const otp = ref("");
const newPassword = ref("");
const error = ref("");
const loading = ref(false);

async function handleRequestOtp() {
  error.value = "";
  loading.value = true;

  const { error: reqError } = await authClient.emailOtp.requestPasswordReset({
    email: email.value,
  });

  if (reqError) {
    error.value = reqError.message ?? "Failed to send reset code";
  } else {
    step.value = "otp";
  }

  loading.value = false;
}

async function handleResetPassword() {
  error.value = "";
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

<template>
  <div
    class="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6"
  >
    <div class="text-center space-y-2">
      <h1 class="font-heading text-3xl font-bold text-[#534AB7]">RESET PASSWORD</h1>
      <p class="text-sm text-slate-500">
        {{
          step === "email"
            ? "Enter your email to receive a reset code"
            : "Enter the OTP and your new password"
        }}
      </p>
    </div>

    <UAlert v-if="error" color="error" :title="error" />

    <form v-if="step === 'email'" class="space-y-4" @submit.prevent="handleRequestOtp">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Email address</label>
        <UInput
          v-model="email"
          type="email"
          placeholder="you@example.com"
          class="w-full"
          required
        />
      </div>

      <UButton type="submit" block color="primary" class="bg-[#534AB7] py-2.5" :loading="loading">
        Send Reset Code
      </UButton>
    </form>

    <form v-if="step === 'otp'" class="space-y-4" @submit.prevent="handleResetPassword">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">OTP Code</label>
        <UInput
          v-model="otp"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          placeholder="123456"
          class="w-full text-center text-2xl tracking-[0.5em]"
          maxlength="6"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">New Password</label>
        <UInput
          v-model="newPassword"
          type="password"
          placeholder="••••••••"
          class="w-full"
          required
          minlength="8"
        />
      </div>

      <UButton type="submit" block color="primary" class="bg-[#534AB7] py-2.5" :loading="loading">
        Reset Password
      </UButton>

      <button
        type="button"
        class="text-xs text-[#534AB7] hover:underline w-full text-center"
        @click="step = 'email'"
      >
        Back to email entry
      </button>
    </form>

    <div class="text-center text-xs text-slate-500">
      Remembered your password?
      <NuxtLink to="/login" class="text-[#534AB7] font-semibold hover:underline"
        >Back to Login</NuxtLink
      >
    </div>
  </div>
</template>
