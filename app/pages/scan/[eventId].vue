<script setup lang="ts">
definePageMeta({
  layout: "scanner",
});

const route = useRoute();
const _token = computed(() => route.query.token as string);
</script>

<template></template>
