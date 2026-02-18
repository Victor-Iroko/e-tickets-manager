# Agent Development Guide

Guidelines for agentic coding assistants working in this Nuxt 4 + Convex repository.

## Scope

- Treat this file as the repo-level source of truth for build/test/style behavior.
- Preserve architecture and conventions unless the task explicitly asks for refactoring.
- Never edit generated files: `.nuxt/`, `.output/`, `convex/_generated/`.

## Rule Files Discovered

- Cursor rules: no `.cursorrules` and no `.cursor/rules/` directory found.
- Copilot rules: no `.github/copilot-instructions.md` found.
- Additional instruction file exists: `.github/instructions/convex.instructions.md`.
- When editing Convex TS/JS files, follow both this guide and that Convex instruction file.

## Build, Lint, and Test Commands

```bash
# Setup
bun install

# Dev
bun run dev         # Nuxt only (uses .env.local)
bun run dev:all     # Nuxt + Convex

# Build / preview
bun run build (never run build by yourself, it takes to much time)
bun run preview

# Lint / format
bun run lint
bun run lint:fix
bun run format
bun run format:fix

# Tests
bun run test
bun run test:watch
bun run test:coverage
bun run test:unit
bun run test:nuxt
bun run test:e2e
```

## Single-Test Commands (Important)

Vitest uses named projects (`unit`, `nuxt`, `e2e`). Prefer `bunx vitest` for precise targeting.

```bash
# Single file in a specific project
bunx vitest run --project unit test/unit/example.test.ts
bunx vitest run --project nuxt test/nuxt/example.test.ts
bunx vitest run --project e2e test/e2e/example.test.ts

# Single test name
bunx vitest run --project unit -t "creates event"

# Single file + single test name
bunx vitest run --project unit test/unit/example.test.ts -t "creates event"
```

- If tests do not exist yet, create them under `test/unit/`, `test/nuxt/`, or `test/e2e/`.
- CI workflow runs `lint`, `format`, `build`, and `test` on PRs/pushes to `main`.

## Code Style Guidelines

### Formatting and Linting

- Prettier config: `semi: false`, `singleQuote: true`, `trailingComma: none`.
- `prettier-plugin-tailwindcss` is enabled; let it sort classes automatically.
- ESLint includes `no-console: warn`.
- Convex files enforce `@typescript-eslint/no-floating-promises: error`.
- After non-trivial edits, run: `bun run lint:fix && bun run format:fix`.

### Imports and Auto-Imports

- Nuxt/Vue composables are auto-imported; do not manually import by default.
- Common auto-imports: `ref`, `reactive`, `computed`, `watch`, `useRoute`, `navigateTo`, `useToast`.
- Manually import external libraries and local modules outside auto-import boundaries.
- Prefer named imports for tree-shaking.
- For frontend validation, import `z` from `zod/mini`.

### TypeScript

- Keep strict typing patterns across app and Convex code.
- Add explicit types for function parameters and exported/public function returns.
- Prefer inference for obvious local variables.
- Use `as const` for discriminated literals.
- Keep schema and type exports together, e.g. `export type LoginSchema = z.infer<typeof loginSchema>`.

### Naming Conventions

| Element          | Convention                  | Example                  |
| ---------------- | --------------------------- | ------------------------ |
| Components       | PascalCase                  | `UserProfile.vue`        |
| Composables      | camelCase with `use` prefix | `useAuth.ts`             |
| Utilities        | kebab-case                  | `auth-client.ts`         |
| Pages            | kebab-case                  | `reset-password.vue`     |
| Middleware       | camelCase                   | `auth.global.ts`         |
| Convex functions | camelCase                   | `createEvent`, `getUser` |
| Constants        | UPPER_SNAKE_CASE            | `MAX_TICKET_QUANTITY`    |
| Schema types     | PascalCase + `Schema`       | `LoginSchema`            |

### Nuxt/Vue Patterns

- Use `<script setup lang="ts">`.
- For pages, define `definePageMeta` near the top.
- Existing route meta keys: `auth?: boolean`, `requiredRole?: 'planner' | 'scanner'`.
- Keep composables in `app/composables/` and export named functions only.
- Return `readonly(state)` from composables when exposing read-only state.
- Use `useState()` for shared cross-component client state.

### Error Handling

- Wrap async operations in `try/catch`.
- Normalize error text via `error instanceof Error ? error.message : 'Default message'`.
- Use Nuxt UI toast for user-visible failures: `toast.add({ title, description, color: 'error' })`.
- In user-action composables, return `boolean` success where practical.

## Convex Rules

- Use current Convex object syntax: `query`, `mutation`, `action` (and internal variants).
- Include both `args` and `returns` validators in every Convex function.
- If no value is returned, use `returns: v.null()` and explicitly `return null`.
- Use `internalQuery/internalMutation/internalAction` for internal-only behavior.
- Keep schema in `convex/schema.ts`; add indexes for query paths.
- Prefer `withIndex` queries; avoid `filter` scans when index-based query is possible.
- Do not edit `convex/_generated/`.

## UI and Design System Rules (Nuxt UI First)

When designing or updating UI, follow Nuxt UI design conventions in this repo.

- Prefer Nuxt UI components (`UButton`, `UCard`, `UForm`, `UInput`, etc.) over raw HTML where equivalents exist.
- Use semantic Nuxt UI colors/tokens (`primary`, `secondary`, `success`, `warning`, `error`, `neutral`).
- Prefer theme colors from `app/app.config.ts`: `primary: indigo`, `secondary: emerald`, `neutral: stone`.
- Avoid hardcoded Tailwind palette classes for semantic UI states (for example `text-blue-500`, `bg-red-600`) when Nuxt UI color props/tokens fit.
- Prefer Nuxt UI surface/text utility tokens (muted, toned, elevated) for consistency.
- Keep layouts responsive and accessible; preserve keyboard/focus behavior from Nuxt UI components.

## Git and Commit Hygiene

- Commit style: Conventional Commits (`feat(scope): description`, `fix(scope): description`, etc.).
- Husky hooks are enabled:
  - pre-commit: `bunx lint-staged`
  - commit-msg: `commitlint` with `@commitlint/config-conventional`
- Before finishing substantial work, run `bun run lint`, `bun run format`, and `bun run test`.

## Environment Variables

- Start from `.env.example` to create `.env.local`.
- Key runtime variables: `CONVEX_DEPLOYMENT`, `CONVEX_URL`, `CONVEX_SITE_URL`.
- Set Convex env vars with `bunx convex env set VAR_NAME value`.
