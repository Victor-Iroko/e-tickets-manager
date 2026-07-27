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

<template></template>
