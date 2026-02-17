# Agent Development Guide

Guidelines for AI agents working on this Nuxt 4 + Convex e-tickets application.

## Technology Stack

- **Framework**: Nuxt 4 with Vue 3 Composition API
- **Database**: Convex (serverless backend)
- **Auth**: Better-auth with Convex adapter
- **UI**: Nuxt UI 4 with TailwindCSS 4
- **State**: Pinia + VueUse composables
- **Validation**: Zod (use `zod/mini` for frontend schemas)
- **Testing**: Vitest with @nuxt/test-utils

## Commands

```bash
# Development
bun install                    # Install dependencies
bun run dev:all                # Run Nuxt + Convex together
bun run dev                    # Run Nuxt only
bun run build                  # Production build (long running, avoid in dev)

# Linting & Formatting (run after making changes)
bun run lint:fix               # ESLint with auto-fix
bun run format:fix             # Prettier with auto-fix

# Testing
bun run test                   # Run all tests
bun run test:unit              # Unit tests only (test/unit/)
bun run test:nuxt              # Component tests only (test/nuxt/)
bun run test:e2e               # E2E tests only (test/e2e/)
bun run test:watch             # Watch mode
bunx vitest run test/unit/example.test.ts           # Single test file
bunx vitest run -t "test name"                      # Single test by name
bunx vitest run test/unit/example.test.ts -t "name" # Both filters
```

## Code Style

### Formatting (Prettier)

- No semicolons, single quotes, no trailing commas
- TailwindCSS class sorting via `prettier-plugin-tailwindcss`
- ESLint: `no-console` set to warn

### TypeScript

- Strict mode enabled
- Explicit types for function parameters
- Prefer type inference for local variables
- Use `as const` for literal types
- Export types alongside schemas: `export type LoginSchema = z.infer<typeof loginSchema>`

### Imports

- Vue composables and Nuxt utilities are auto-imported (no explicit import needed)
- Auto-imported: `ref`, `reactive`, `computed`, `watch`, `useRoute`, `navigateTo`, `useToast`, etc.
- Manual imports needed for: external libraries, local utilities not in `app/utils/`
- Import `z` from `zod/mini` for validation schemas (frontend)
- Import in a way that enables tree-shaking: `import { functionName } from 'library'`

### Naming Conventions

| Element          | Convention        | Example                  |
| ---------------- | ----------------- | ------------------------ |
| Components       | PascalCase        | `UserProfile.vue`        |
| Composables      | camelCase, use-   | `useAuth.ts`             |
| Utilities        | kebab-case        | `auth-client.ts`         |
| Pages            | kebab-case        | `reset-password.vue`     |
| Middleware       | camelCase         | `auth.global.ts`         |
| Convex functions | camelCase         | `createEvent`, `getUser` |
| Constants        | UPPER_SNAKE_CASE  | `MAX_TICKET_QUANTITY`    |
| Schema types     | PascalCase+Schema | `LoginSchema`            |

### Vue Components

```vue
<script setup lang="ts">
// 1. Page meta (if page)
definePageMeta({ auth: false })

// 2. Composables (auto-imported, no imports needed)
const { user, signOut } = useAuth()
const toast = useToast()
const route = useRoute()

// 3. Reactive state
const form = reactive({ email: '', password: '' })
const error = ref<string | null>(null)
const isSubmitting = ref(false)

// 4. Computed
const isValid = computed(() => form.email && form.password)

// 5. Functions
async function handleSubmit() {
  isSubmitting.value = true
  try {
    await submitForm(form)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Submit failed'
    toast.add({ title: 'Error', description: message, color: 'error' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- Use Nuxt UI: UButton, UCard, UInput, UForm, etc. -->
</template>
```

### Composables

- Place in `app/composables/` for auto-import
- Export named functions (not default), prefix with `use`
- Return `readonly()` for read-only state to prevent external mutation
- Use `useState()` for shared state across components

```typescript
export function useFeature() {
  const isLoading = useState<boolean>('feature-loading', () => false)
  const toast = useToast()

  async function doSomething(): Promise<boolean> {
    isLoading.value = true
    try {
      await apiCall()
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed'
      toast.add({ title: 'Error', description: message, color: 'error' })
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading: readonly(isLoading), doSomething }
}
```

### Error Handling

- Always wrap async operations in try/catch
- Extract error message: `error instanceof Error ? error.message : 'Default message'`
- Use `useToast()` for user-facing errors: `toast.add({ title, description, color: 'error' })`
- Return `false` from composables on failure, `true` on success

### Validation with Zod

```typescript
import { z } from 'zod/mini'

export const loginSchema = z.object({
  email: z.string().check(z.email('Please enter a valid email address')),
  password: z
    .string()
    .check(z.minLength(8, 'Password must be at least 8 characters'))
})

export type LoginSchema = z.infer<typeof loginSchema>
```

### Middleware

```typescript
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.meta.auth === false) return

  const { session } = await useSession()
  if (!session.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
```

### Convex Functions

- Schema in `convex/schema.ts` with `defineSchema` and `defineTable`
- Use `v` validators from `convex/values`
- Add indexes for frequently queried fields
- Never edit `convex/_generated/` (auto-generated)

```typescript
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  events: defineTable({
    name: v.string(),
    date: v.number(),
    status: v.union(v.literal('draft'), v.literal('published'))
  })
    .index('by_status', ['status'])
    .index('by_created_by', ['createdBy'])
})
```

## Project Structure

```
app/
├── components/       # Vue components (auto-imported)
├── composables/      # Composables (auto-imported)
├── layouts/          # Page layouts
├── middleware/       # Route middleware (auto-imported)
├── pages/            # File-based routing
├── utils/            # Utility functions (auto-imported)
└── assets/css/       # TailwindCSS styles
convex/
├── _generated/       # Auto-generated (DO NOT EDIT)
├── schema.ts         # Database schema
├── auth.ts           # Auth configuration
├── auth.config.ts    # Auth user fields
└── http.ts           # HTTP routes
test/
├── unit/             # Unit tests (Node environment)
├── nuxt/             # Component tests (Nuxt environment)
└── e2e/              # E2E tests (Node environment)
```

## Commit Messages

Uses Conventional Commits: `type(scope): description`

```
feat(auth): add Google OAuth login
fix(tickets): correct inventory calculation
test(events): add unit tests for event creation
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Environment Variables

Copy `.env.example` to `.env.local`. Key variables:

- `CONVEX_DEPLOYMENT` - Convex deployment ID
- `CONVEX_URL` - Convex API URL
- `CONVEX_SITE_URL` - Convex site URL

Set Convex env vars via: `bunx convex env set VAR_NAME value`

## Design Guidelines

- Make designs responsive and professional
- Support light and dark mode
- Use Nuxt UI components (UButton, UCard, UInput, UForm, etc.)
- Add animations and transitions for polish
- Follow accessibility best practices (@nuxt/a11y enabled)
