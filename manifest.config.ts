import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json' with { type: 'json' };

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  icons: {
    '16': 'public/icons/icon16.png',
    '48': 'public/icons/icon48.png',
    '128': 'public/icons/icon128.png',
  },
  action: {
    default_icon: {
      '16': 'public/icons/icon16.png',
      '48': 'public/icons/icon48.png',
      '128': 'public/icons/icon128.png',
    },
    default_popup: 'src/popup/index.html',
  },
  permissions: ['storage'],
  content_scripts: [
    {
      js: ['src/content/interceptorMain.ts'],
      matches: ['https://*/*', 'http://*/*'],
      run_at: 'document_start',
      world: 'MAIN',
    },
    {
      js: ['src/content/main.ts'],
      matches: ['https://*/*', 'http://*/*'],
      run_at: 'document_start',
    },
  ],
  options_ui: {
    page: 'src/options/index.html',
    open_in_tab: true,
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
});
