/**
 * Configures TypeScript, React lifecycle and TSDoc validation for the frontend.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tsdoc from 'eslint-plugin-tsdoc'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * Enforces the frontend rules and permits providers with their context access hooks.
 */
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: { tsdoc },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'tsdoc/syntax': 'error',
    },
  },
  {
    // Context modules export a provider and its access hook together by design.
    files: ['src/context/**/*.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
