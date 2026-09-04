import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const githubPagesBase = repoName ? `/${repoName}/` : '/';
const base = process.env.GITHUB_ACTIONS === 'true' ? githubPagesBase : '/';

export default defineConfig({
  base,
  resolve: {
    alias: {
      '@': `${path.resolve(import.meta.dirname, 'src')}`,
    },
  },
  plugins: [react(), tailwindcss()],
});
