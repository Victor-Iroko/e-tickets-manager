# Agent Development Guide

This document provides development guidelines for AI agents working on this codebase.

## Technology Stack

- **Framework**: Nuxt 4 with Vue 3 Composition API
- **Database**: Convex (serverless backend)
- **Auth**: Better-auth with Convex adapter
- **UI**: Nuxt UI 4 with TailwindCSS 4
- **State**: Pinia with VueUse composables
- **Testing**: Vitest with @nuxt/test-utils

## Build & Development Commands

```bash
# Install dependencies
bun install

# Development (Nuxt + Convex together)
bun run dev:all

# Development (Nuxt only)
bun run dev

# Production build
bun run build

# Preview production build
bun run preview
```

## Linting & Formatting

```bash
# Lint check
bun run lint

# Lint with auto-fix
bun run lint:fix

# Format check
bun run format

# Format with auto-fix
bun run format:fix
```

## Testing Commands

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage

# Run a single test file
bunx vitest run path/to/file.test.ts

# Run a single test by name pattern
bunx vitest run -t "test name pattern"

# Run specific test suites
bun run test:unit    # Unit tests (test/unit/)
bun run test:nuxt    # Component tests (test/nuxt/)
bun run test:e2e     # E2E tests (test/e2e/)
```

## Code Style Guidelines

### Formatting (Prettier)

- No semicolons
- Single quotes
- No trailing commas
- TailwindCSS class sorting enabled

### TypeScript

- Strict mode enabled
- Always use explicit types for function parameters
- Use `computed()` return types when non-obvious
- Prefer type inference for local variables
- Use `as const` for literal types

### Naming Conventions

| Element          | Convention       | Example                  |
| ---------------- | ---------------- | ------------------------ |
| Components       | PascalCase       | `UserProfile.vue`        |
| Composables      | camelCase, use-  | `useAuth.ts`             |
| Utilities        | camelCase        | `auth-client.ts`         |
| Pages            | kebab-case       | `reset-password.vue`     |
| Convex functions | camelCase        | `createEvent`, `getUser` |
| Constants        | UPPER_SNAKE_CASE | `MAX_TICKET_QUANTITY`    |

### Vue Components

```vue
<script setup lang="ts">
// 1. Page meta (if page)
definePageMeta({ middleware: 'auth' })

// 2. Composables
const { user, signOut } = useAuth()
const router = useRouter()

// 3. Reactive state
const form = reactive({ email: '', password: '' })
const error = ref<string | null>(null)
const isSubmitting = ref(false)

// 4. Computed properties
const isValid = computed(() => form.email && form.password)

// 5. Functions
async function handleSubmit() {
  // implementation
}
</script>

<template>
  <!-- Use Nuxt UI components (UButton, UCard, UInput, etc.) -->
</template>
```

### Composables

- Place in `app/composables/` for auto-import
- Export named functions (not default exports)
- Prefix with `use` (e.g., `useAuth`, `useEvent`)
- Include JSDoc comments for complex logic

```typescript
/**
 * SSR-compatible auth composable.
 */
export function useAuth() {
  // Return reactive refs and functions
  return { user, isAuthenticated, signIn, signOut }
}
```

### Middleware

- Place in `app/middleware/`
- Use descriptive names: `auth.ts`, `guest.ts`, `planner.ts`
- Return `navigateTo()` for redirects

```typescript
export default defineNuxtRouteMiddleware(async () => {
  const { data: session } = await useAuthSession()
  if (!session.value) {
    return navigateTo('/login', { redirectCode: 302 })
  }
})
```

### Error Handling

```typescript
// In Vue components - use try/catch with typed errors
try {
  const result = await someAsyncOperation()
  if (result.error) {
    error.value = result.error.message ?? 'Operation failed'
  }
} catch (e: unknown) {
  const err = e as Error
  error.value = err.message ?? 'An unexpected error occurred'
} finally {
  isSubmitting.value = false
}
```

### Convex Functions

- Schema in `convex/schema.ts` using `defineSchema` and `defineTable`
- Use `v` validators from `convex/values`
- HTTP routes in `convex/http.ts`

```typescript
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  events: defineTable({
    name: v.string(),
    date: v.number(),
    status: v.union(v.literal('draft'), v.literal('published'))
  }).index('by_status', ['status'])
})
```

## Project Structure

```
app/
├── assets/css/       # Global styles
├── components/       # Vue components (auto-imported)
├── composables/      # Composables (auto-imported)
├── layouts/          # Page layouts
├── middleware/       # Route middleware
├── pages/            # File-based routing
└── utils/            # Utility functions (auto-imported)
convex/
├── _generated/       # Auto-generated (do not edit)
├── schema.ts         # Database schema
├── auth.ts           # Auth configuration
└── http.ts           # HTTP routes
server/
├── api/              # Server API routes
└── utils/            # Server utilities
test/
├── unit/             # Unit tests (*.test.ts)
├── nuxt/             # Component tests (*.test.ts)
└── e2e/              # E2E tests (*.test.ts)
```

## Commit Message Format

Uses Conventional Commits (`@commitlint/config-conventional`):

```
type(scope): description

# Types: feat, fix, docs, style, refactor, test, chore
# Examples:
feat(auth): add Google OAuth login
fix(tickets): correct inventory calculation
test(events): add unit tests for event creation
```

## Environment Variables

Copy `.env.example` to `.env.local` for local development. Key variables:

- `NUXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- `NUXT_BETTER_AUTH_SECRET` - Auth secret key
- `NUXT_GOOGLE_CLIENT_ID/SECRET` - OAuth credentials

For Convex, set env vars via: `bunx convex env set VAR_NAME value`
