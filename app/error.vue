<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    statusMessage: string
    message: string
    description: string
  }
}>()

const handleError = () => clearError({ redirect: '/' })

const errorConfig = computed(() => {
  switch (props.error.statusCode) {
    case 403:
      return {
        icon: 'i-heroicons-shield-exclamation',
        title: 'Access Denied',
        description:
          props.error.description ||
          "You don't have permission to access this page.",
        color: 'text-warning-600 dark:text-warning-400',
        bgColor: 'bg-warning-100 dark:bg-warning-900/30'
      }
    case 404:
      return {
        icon: 'i-heroicons-magnifying-glass',
        title: 'Page Not Found',
        description:
          props.error.description ||
          "The page you're looking for doesn't exist.",
        color: 'text-primary-600 dark:text-primary-400',
        bgColor: 'bg-primary-100 dark:bg-primary-900/30'
      }
    case 500:
      return {
        icon: 'i-heroicons-exclamation-triangle',
        title: 'Server Error',
        description:
          props.error.description ||
          'Something went wrong on our end. Please try again.',
        color: 'text-error-600 dark:text-error-400',
        bgColor: 'bg-error-100 dark:bg-error-900/30'
      }
    default:
      return {
        icon: 'i-heroicons-exclamation-circle',
        title: 'Error',
        description: props.error.description || 'An unexpected error occurred.',
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-100 dark:bg-gray-800'
      }
  }
})
</script>

<template>
  <NuxtLayout name="public">
    <div class="flex min-h-screen items-center justify-center px-4 py-12">
      <!-- Background decorations -->
      <div
        class="fixed top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary-400/10 blur-3xl dark:bg-primary-600/10"
      />
      <div
        class="fixed right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-secondary-400/10 blur-3xl dark:bg-secondary-600/10"
      />

      <div
        v-motion
        class="relative w-full max-w-lg text-center"
        :initial="{ opacity: 0, y: 30, scale: 0.95 }"
        :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 500 } }"
      >
        <!-- Error Icon -->
        <div
          v-motion
          class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl"
          :class="errorConfig.bgColor"
          :initial="{ scale: 0, rotate: -180 }"
          :enter="{
            scale: 1,
            rotate: 0,
            transition: { delay: 200, type: 'spring' }
          }"
        >
          <UIcon
            :name="errorConfig.icon"
            class="h-12 w-12"
            :class="errorConfig.color"
          />
        </div>

        <!-- Error Code -->
        <div
          v-motion
          class="text-8xl font-bold tracking-tighter"
          :class="errorConfig.color"
          :initial="{ opacity: 0, scale: 0.5 }"
          :enter="{
            opacity: 1,
            scale: 1,
            transition: { delay: 100, type: 'spring' }
          }"
        >
          {{ error.statusCode }}
        </div>

        <!-- Title -->
        <h1
          v-motion
          class="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
        >
          {{ errorConfig.title }}
        </h1>

        <!-- Description -->
        <p
          v-motion
          class="mx-auto mt-4 max-w-md text-lg text-gray-600 dark:text-gray-400"
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 300 } }"
        >
          {{ errorConfig.description }}
        </p>

        <!-- Error Message (if available) -->
        <p
          v-if="error.message && error.message !== errorConfig.description"
          v-motion
          class="mx-auto mt-4 max-w-md rounded-lg bg-gray-100 p-4 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1, transition: { delay: 400 } }"
        >
          {{ error.message }}
        </p>

        <!-- Action Buttons -->
        <div
          v-motion
          class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 400 } }"
        >
          <UButton
            color="primary"
            size="lg"
            class="btn-shine"
            @click="handleError"
          >
            <template #leading>
              <UIcon name="i-heroicons-home" class="h-5 w-5" />
            </template>
            Go Home
          </UButton>

          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            @click="$router.back()"
          >
            <template #leading>
              <UIcon name="i-heroicons-arrow-left" class="h-5 w-5" />
            </template>
            Go Back
          </UButton>
        </div>

        <!-- Help Text -->
        <p
          v-motion
          class="mt-8 text-sm text-gray-500 dark:text-gray-400"
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1, transition: { delay: 500 } }"
        >
          Need help?
          <NuxtLink
            to="#"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Contact Support
          </NuxtLink>
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>
