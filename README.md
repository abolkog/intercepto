# Intercepto

Intercepto is a Chrome extension for mocking API calls in the browser.
It matches requests by URL and HTTP method, then returns custom status codes
and response bodies directly from extension rules.

## Features

- Rule-based request matching by URL and HTTP method
- Mock custom status codes and JSON or text responses
- Works with page requests made through fetch and XMLHttpRequest
- Popup and options UIs for managing rules
- Built with React, TypeScript, Vite, and CRXJS

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

## Usage

1. Create a rule in the options page.
2. Set the request URL match and HTTP method.
3. Set the response status code and body.
4. Enable the rule.
5. Open a page that makes a matching request and Intercepto will return the mocked response.

## Project Structure

- `src/popup/` - Popup UI
- `src/options/` - Options page UI
- `src/content/` - Content scripts and request interception
- `src/components/` - Shared UI components
- `src/utils/` - Storage, notifications, and helper logic
- `manifest.config.ts` - Chrome extension manifest configuration

## Open Source

- Repository: https://github.com/abolkog/intercepto
- License: MIT

## Automated Releases

This project uses semantic-release with GitHub Actions.

- Push commits to `main` using Conventional Commits.
- `.github/workflows/release.yml` runs tests, calculates the next version, updates `CHANGELOG.md`, creates a Git tag, and publishes a GitHub release.
- During release preparation, `npm run build` runs and produces a zip package in `release/`.
- `.github/workflows/publish-chrome.yml` triggers on published GitHub releases and uploads the generated zip to the Chrome Web Store.

Required repository secrets for Chrome Web Store publishing:

- `CHROME_EXTENSION_ID`
- `CHROME_CLIENT_ID`
- `CHROME_CLIENT_SECRET`
- `CHROME_REFRESH_TOKEN`

Useful local commands:

```bash
npm run release:dry-run
npm run release
```

## Commit Message Guide

This project uses Conventional Commits so semantic-release can determine version bumps automatically.

Version bump rules:

- `fix:` triggers a patch release (`1.0.0` -> `1.0.1`)
- `feat:` triggers a minor release (`1.0.0` -> `1.1.0`)
- breaking changes trigger a major release (`1.0.0` -> `2.0.0`)

Examples:

```text
fix: correct toast icon path in content notification
feat: add rule-level notification toggle
feat(popup): add quick enable switch for latest rule
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
- Any breaking change uses `!` in the header or includes a `BREAKING CHANGE:` footer
- `npm test` passes locally
- `npm run build` passes locally
- User-facing changes are documented in the PR description

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
