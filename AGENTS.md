# Agent Development Guide

Guidelines for AI agents working on this Nuxt 4 + Convex e-tickets application.

Details about the project can be found in [Plan.md](./PLAN.md).

## Technology Stack

- **Framework**: Nuxt 4 with Vue 3 Composition API
- **Database**: Convex (serverless backend)
- **Auth**: Better-auth with Convex adapter
- **UI**: Nuxt UI 4 with TailwindCSS 4
- **State**: Pinia + VueUse composables
- **Testing**: Vitest with @nuxt/test-utils

## Commands

```bash
# Development
bun install                    # Install dependencies
bun run dev:all                # Run Nuxt + Convex together
bun run dev                    # Run Nuxt only
bun run build                  # Production build

# Linting & Formatting (run after code changes)
bun run lint:fix               # ESLint with auto-fix
bun run format:fix             # Prettier with auto-fix

# Testing
bun run test                   # Run all tests
bun run test:unit              # Unit tests only (test/unit/)
bun run test:nuxt              # Component tests (test/nuxt/)
bun run test:e2e               # E2E tests (test/e2e/)

# Single test file
bunx vitest run path/to/file.test.ts

# Single test by name
bunx vitest run -t "test name pattern"

# Watch mode
bun run test:watch
```

## Code Style

### Formatting (Prettier)

- No semicolons
- Single quotes
- No trailing commas
- TailwindCSS class sorting enabled (via `prettier-plugin-tailwindcss`)

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
| Utilities        | kebab-case       | `auth-client.ts`         |
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
  <!-- Use Nuxt UI components: UButton, UCard, UInput, etc. -->
</template>
```

### Composables

- Place in `app/composables/` for auto-import
- Export named functions (not default)
- Prefix with `use` (e.g., `useAuth`, `useEvent`)
- Return `readonly()` for read-only state

```typescript
export function useAuth() {
  const isLoading = useState<boolean>('auth-loading', () => false)

  async function signIn(email: string, password: string): Promise<boolean> {
    isLoading.value = true
    try {
      await authClient.signIn.email({ email, password })
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed'
      useToast().add({ title: 'Error', description: message, color: 'error' })
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading: readonly(isLoading), signIn }
}
```

### Error Handling

```typescript
try {
  const result = await someAsyncOperation()
} catch (error) {
  const message = error instanceof Error ? error.message : 'Operation failed'
  // Use toast for user-facing errors
  useToast().add({ title: 'Error', description: message, color: 'error' })
} finally {
  isSubmitting.value = false
}
```

### Convex Functions

- Schema in `convex/schema.ts` with `defineSchema` and `defineTable`
- Use `v` validators from `convex/values`
- Never edit `convex/_generated/` (auto-generated)

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
├── components/       # Vue components (auto-imported)
├── composables/      # Composables (auto-imported)
├── layouts/          # Page layouts
├── middleware/       # Route middleware
├── pages/            # File-based routing
└── utils/            # Utility functions (auto-imported)
convex/
├── _generated/       # Auto-generated (DO NOT EDIT)
├── schema.ts         # Database schema
├── auth.ts           # Auth configuration
└── http.ts           # HTTP routes
test/
├── unit/             # Unit tests
├── nuxt/             # Component tests
└── e2e/              # E2E tests
```

## Commit Messages

Uses Conventional Commits:

```
type(scope): description

feat(auth): add Google OAuth login
fix(tickets): correct inventory calculation
test(events): add unit tests for event creation
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Environment Variables

Copy `.env.example` to `.env.local`. Key variables:

- `NUXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- `NUXT_BETTER_AUTH_SECRET` - Auth secret key
- `NUXT_GOOGLE_CLIENT_ID/SECRET` - OAuth credentials

Set Convex env vars: `bunx convex env set VAR_NAME value`

## Design System

Make the designs responsive, professional, add support for light and dark mode and use nuxt ui components whereever possible (if you aren't sure of what component to use, use the nuxt ui mcp or any of the docs or web search tools) and add animations and transitions to make it look nice.
