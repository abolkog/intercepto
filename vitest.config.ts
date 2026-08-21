import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    environmentOptions: {
      'web-ext': {
        path: './dist',
      },
    },
  },
});
