# Contributing to Intercepto

Thanks for your interest in contributing! This guide covers running the
project locally and PR requirements.

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open Chrome and navigate to `chrome://extensions/`, enable "Developer mode", and load the unpacked extension from the `dist` directory.

4. Build for production:

```bash
npm run build
```

### Working on the landing page

This is a monorepo (npm workspaces). The `site/` workspace hosts the landing
page published to GitHub Pages, separate from the extension itself.

```bash
npm run dev:site
npm run build:site
```

## Project Structure

- `src/popup/` - Popup UI
- `src/options/` - Options page UI
- `src/content/` - Content scripts and request interception
- `src/components/` - Shared UI components
- `src/utils/` - Storage, notifications, and helper logic
- `site/` - Landing page workspace, published to GitHub Pages
- `manifest.config.ts` - Chrome extension manifest configuration

## Commit Message Guide

This project uses Conventional Commits so semantic-release can determine version bumps automatically.

Version bump rules:

- `fix:` triggers a patch release (`1.0.0` -> `1.0.1`)
- `feat:` triggers a minor release (`1.0.0` -> `1.1.0`)
- breaking changes trigger a major release (`1.0.0` -> `2.0.0`)

### Scope: `ext` vs `site`

Since this repo has two workspaces, use the scope to say which one a commit
touches:

- `(ext)` - the Chrome extension itself (`src/`)
- `(site)` - the landing page (`site/`)

Leave the scope off only for changes that affect the whole repo (tooling,
CI, root config).

Examples:

```text
fix(ext): correct toast icon path in content notification
feat(ext): add rule-level notification toggle
feat(popup): add quick enable switch for latest rule
feat(site): add call-to-action button to the landing page
fix(site): fix broken screenshot link
chore: update eslint config
```

Breaking change examples:

```text
feat: redesign rule schema

BREAKING CHANGE: rename method field to httpMethod in stored rules
```

```text
feat!: remove legacy rule migration path
```

## PR Checklist

- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- Commits touching `src/` or `site/` use the `(ext)` or `(site)` scope
- Any breaking change uses `!` in the header or includes a `BREAKING CHANGE:` footer
- `npm test` passes locally
- `npm run build` passes locally
- User-facing changes are documented in the PR description
