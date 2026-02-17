// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: ['convex/_generated/']
  },
  {
    rules: {
      'no-console': 'warn'
    }
  },
  {
    files: ['convex/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './convex/tsconfig.json'
      }
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error'
    }
  }
)
