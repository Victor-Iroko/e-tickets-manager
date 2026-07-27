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

<template>
  <div
    class="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6"
  >
    <div class="text-center space-y-2">
      <h1 class="font-heading text-3xl font-bold text-[#534AB7]">VERIFY EMAIL</h1>
      <p class="text-sm text-slate-500">Enter the OTP sent to {{ email || "your email" }}</p>
    </div>

    <UAlert v-if="success" color="success" :title="success" />
    <UAlert v-if="error" color="error" :title="error" />

    <form class="space-y-4" @submit.prevent="handleVerify">
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

      <UButton type="submit" block color="primary" class="bg-[#534AB7] py-2.5" :loading="loading">
        Verify Email
      </UButton>
    </form>

    <div class="text-center text-xs text-slate-500">
      Didn't receive the code?
      <button
        class="text-[#534AB7] font-semibold hover:underline"
        :disabled="resending"
        @click="handleResend"
      >
        {{ resending ? "Resending..." : "Resend OTP" }}
      </button>
    </div>

    <div class="text-center text-xs text-slate-500">
      <NuxtLink to="/login" class="text-[#534AB7] hover:underline">Back to Login</NuxtLink>
    </div>
  </div>
</template>
