<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

# Guidelines for AI Agents

## 1. Nuxt & Nuxt UI Design System
- **Design System & Components**: Adhere strictly to the **Nuxt UI** design system. Use Nuxt UI components wherever possible instead of building custom UI elements from scratch.
- **Customization**: Perform customizations within the Nuxt UI component configuration and design system framework (e.g., via component props, slots, app.config / theme configuration, and utility classes).
- **Best Practices & Production Standards**: Follow best practices for **Nuxt** (auto-imports, composables, server routes, clean architecture) and **Nuxt UI** (accessible patterns, semantic components, theme composition). All code, architecture, error handling, state management, and performance patterns must strictly follow industry standards used in production enterprise systems and codebases.

## 2. UI & Functional Validation
- **Agent Browser**: ALWAYS use the `agent-browser` skill / browser automation tools to visually and functionally validate frontend work in a live browser before concluding tasks.

## 3. Knowledge & Tool Usage
- **Proactive Research**: ALWAYS use tools—such as web search, MCPs (e.g., Context7 for documentation), and specialized skills (e.g., the `nuxt-ui` skill)—to look up up-to-date documentation and determine the best component, composable, or pattern for the task at hand before implementing.

