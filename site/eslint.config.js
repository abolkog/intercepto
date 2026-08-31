import { defineConfig } from 'eslint/config';
import rootConfig from '../eslint.config.js';

export default defineConfig([
  ...rootConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
