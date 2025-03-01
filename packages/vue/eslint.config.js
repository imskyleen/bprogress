import { config } from '@workspace/eslint-config/vue';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    files: ['**/__tests__/**/*.{ts,js,vue}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/one-component-per-file': 'off',
      'vue/order-in-components': 'off',
    },
  },
];
