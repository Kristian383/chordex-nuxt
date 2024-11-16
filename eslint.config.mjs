// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import vue from 'eslint-plugin-vue'
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default withNuxt([
  {
    files: ['**/*.ts', '**/*.js', '**/*.vue'], // Files to lint
    plugins: {
      vue,
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser, // Use the imported TypeScript parser
      parserOptions: {
        ecmaVersion: 'latest', // Use the latest ECMAScript standard
        sourceType: 'module',  // Support ES Modules
      },
    },
    rules: {
      ...vue.configs['vue3-recommended'].rules, // Vue 3 recommended rules
      ...tsPlugin.configs.recommended.rules, // TypeScript recommended rules
      'vue/multi-word-component-names': 'off', // Allow single-word component names
      '@typescript-eslint/no-unused-vars': ['error'], // TypeScript-specific rule
      'no-console': 'warn', // Warn instead of error for console.log
      'no-debugger': 'warn', // Warn instead of error for debugger
    },
  },
])
