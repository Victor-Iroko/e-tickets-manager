<script setup lang="ts">
const name = ref("");
const email = ref("");
const password = ref("");
const role = ref("attendee");
const error = ref("");
const loading = ref(false);
const signedUp = ref(false);

const router = useRouter();

async function handleSignUp() {
  error.value = "";
  loading.value = true;

  const { error: authError } = await signUp.email({
    name: name.value,
    email: email.value,
    password: password.value,
    role: role.value,
  });

  if (authError) {
    error.value = authError.message ?? authError.code ?? "An error occurred";
  } else {
    signedUp.value = true;
    router.push(`/verify-otp?email=${encodeURIComponent(email.value)}`);
  }

  loading.value = false;
}
</script>

<template>
  <div
    class="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6"
  >
    <div class="text-center space-y-2">
      <h1 class="font-heading text-3xl font-bold text-[#534AB7]">CREATE ACCOUNT</h1>
      <p class="text-sm text-slate-500">Join E-Tickets Manager as an Organizer or Attendee</p>
    </div>

    <UAlert v-if="error" color="error" :title="error" />

    <UAlert
      v-if="signedUp"
      color="success"
      title="Account created!"
      description="A verification OTP has been sent to your email."
    />

    <form class="space-y-4" @submit.prevent="handleSignUp">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
        <UInput v-model="name" placeholder="Alex Smith" class="w-full" required />
      </div>

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
        <UInput
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="w-full"
          required
          minlength="8"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">I want to...</label>
        <USelect v-model="role" class="w-full">
          <option value="attendee">Attend Events (Buy Tickets)</option>
          <option value="organizer">Host & Manage Events (Sell Tickets)</option>
        </USelect>
      </div>

      <UButton type="submit" block color="primary" class="bg-[#534AB7] py-2.5" :loading="loading">
        Create Account
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
      Already have an account?
      <NuxtLink to="/login" class="text-[#534AB7] font-semibold hover:underline">Sign in</NuxtLink>
    </div>
  </div>
</template>
