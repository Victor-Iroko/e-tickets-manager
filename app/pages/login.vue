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

<template>
  <div
    class="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6"
  >
    <div class="text-center space-y-2">
      <h1 class="font-heading text-3xl font-bold text-[#534AB7]">WELCOME BACK</h1>
      <p class="text-sm text-slate-500">Sign in to manage your events or access your tickets</p>
    </div>

    <UAlert
      v-if="needsVerification"
      color="warning"
      title="Email not verified"
      description="A verification OTP has been sent to your email. Please verify before signing in."
    />

    <UAlert v-if="error" color="error" :title="error" />

    <form class="space-y-4" @submit.prevent="handleLogin">
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
        <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <UInput v-model="password" type="password" placeholder="••••••••" class="w-full" required />
      </div>

      <div class="flex items-center justify-between text-xs">
        <NuxtLink to="/forgot-password" class="text-[#534AB7] hover:underline"
          >Forgot password?</NuxtLink
        >
        <NuxtLink to="/verify-otp" class="text-[#534AB7] hover:underline">Verify email</NuxtLink>
      </div>

      <UButton type="submit" block color="primary" class="bg-[#534AB7] py-2.5" :loading="loading">
        Sign In
      </UButton>
    </form>

    <div class="flex items-center gap-3 my-4">
      <div class="flex-1 h-px bg-slate-200" />
      <span class="text-xs text-slate-400">or continue with</span>
      <div class="flex-1 h-px bg-slate-200" />
    </div>

    <UButton
      block
      color="neutral"
      variant="outline"
      class="py-2.5"
      @click="signIn.social({ provider: 'google', callbackURL: '/dashboard' })"
    >
      <template #leading>
        <Icon name="logos:google-icon" class="w-5 h-5" />
      </template>
      Google
    </UButton>

    <div class="text-center text-xs text-slate-500">
      Don't have an account?
      <NuxtLink to="/register" class="text-[#534AB7] font-semibold hover:underline"
        >Sign up</NuxtLink
      >
    </div>
  </div>
</template>
