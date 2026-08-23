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

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
