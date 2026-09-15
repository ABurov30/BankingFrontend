# Development And Quality

This document describes local setup, scripts, environment variables, Docker
behavior, tests, formatting, and required end-of-session quality checks.

## Requirements

- Node.js 20 or newer.
- npm.
- Docker, when building or running the containerized app.
- Backend API gateway at `http://localhost:8080`, unless `VITE_API_URL` points
  somewhere else.

Install dependencies:

```bash
npm install
```

## Environment Variables

`.env.example` currently contains the default API URL shape. Create `.env` only
when local overrides are needed.

Important variables:

- `VITE_API_URL`: API base URL used by RTK Query. Defaults to `/api`.
- `VITE_DEV_HOST`: set to `buro-bank.ru` to use the local HTTPS domain mode.
- `VITE_DEV_PROXY`: when set to `true`, Vite HMR uses port `443` for the local
  nginx domain proxy.
- `VITE_NOTIFICATIONS_WS_URL`: optional websocket URL override for
  notifications.
- `VITE_TRANSACTIONS_WS_URL`: optional websocket URL override for transaction
  status tracking. Falls back to `VITE_NOTIFICATIONS_WS_URL`, then
  `ws(s)://<current-host>/api/ws`.
- `E2E_USER_EMAIL`: email of the test user used by Playwright scenarios.
- `E2E_USER_PASSWORD`: password of the test user used by Playwright scenarios.

Playwright loads these values from the local `.env` file through
`playwright.config.ts`. Keep the real credentials out of `.env.example` and
the repository. E2E tests can access them with `process.env.E2E_USER_EMAIL`
and `process.env.E2E_USER_PASSWORD`.

## Local Development

Default local URL:

```text
http://localhost:5173
```

Start Vite:

```bash
npm run dev
```

For the optional local domain, `/etc/hosts` should contain:

```text
127.0.0.1 buro-bank.ru
```

To use `https://buro-bank.ru`:

```bash
npm run dev:cert
npm run dev:domain
```

Run the dev nginx proxy in a separate terminal:

```bash
npm run dev:nginx
```

The app opens through nginx at:

```text
https://buro-bank.ru
```

Vite itself runs at:

```text
https://buro-bank.ru:5173
```

## Scripts

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

Start Vite with local-domain proxy-aware HMR:

```bash
npm run dev:domain
```

Generate local HTTPS certificate:

```bash
npm run dev:cert
```

Run local dev nginx:

```bash
npm run dev:nginx
```

Generate API types from Swagger:

```bash
npm run api:types
```

Run ESLint:

```bash
npm run lint
```

Run tests:

```bash
npm run test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Build production bundle:

```bash
npm run build
```

Format files:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

Preview production build:

```bash
npm run preview
```

Build Docker image:

```bash
npm run docker:build
```

Run Docker image:

```bash
npm run docker:run
```

Build and run Docker image:

```bash
npm run docker:up
```

## Docker

The Docker build uses `VITE_API_URL=/api` by default.

To build with a different API endpoint:

```bash
docker build --build-arg VITE_API_URL=http://localhost:8080/api -t buro-frontend .
```

The runtime image serves static files with nginx and proxies `/api/` to:

```text
http://host.docker.internal:8080/
```

## Testing

Tests use Vitest and Testing Library.

Current test locations:

- Shared API behavior: `src/shared/api/*.test.ts`.
- Redux slices and feature helpers: `src/features/**/*.test.ts`.
- Shared components: `src/components/*.test.tsx`.
- Page components and utilities: `src/pages/**/*.test.tsx` and
  `src/pages/**/*.test.ts`.
- Shared library utilities: `src/lib/*.test.ts`.

Test helper:

- `src/test/renderWithProviders.tsx` renders components with the Redux store
  and router/provider setup required by app components.

Run `npm run test:coverage` for the full source coverage report. Vitest enforces
80% minimum statements, functions, and lines; branch coverage is reported
separately. The report includes untested source files. Open `coverage/index.html`
for uncovered lines. Workflow tests cover money amounts, source card selection,
transfer confirmation/retries, manager actions, verification, route guards,
logout state clearing, and live transaction updates.

Prefer focused tests around:

- State reducers and synchronization behavior.
- Utility functions.
- Route guard behavior.
- Form validation and mutation callbacks when behavior is non-trivial.
- Component rendering for reusable or high-risk UI.

### Playwright E2E

`playwright.config.ts` discovers browser tests in `e2e/`, separately from
Vitest. Both desktop Chrome and Pixel 7 emulation use Chromium. Tests run
with one worker to reduce contention when using a shared test backend.
CI rejects `test.only` and retries failed tests once; tests that mutate
backend data must provide repeatable setup and cleanup.

```bash
npx playwright install chromium
npx playwright test
npx playwright show-report
```

Browser runs are headed by default with a 150 ms action delay so clicks are
visible. Credentials are loaded from `.env`: use `E2E_USER_EMAIL` and
`E2E_USER_PASSWORD`, falling back to `AUTH_BOOTSTRAP_ADMIN_EMAIL` and
`AUTH_BOOTSTRAP_ADMIN_PASSWORD`. Missing credentials fail the run rather than
silently skipping authentication scenarios.

Playwright starts Vite at `http://localhost:5173` without opening an extra
browser window, or reuses an existing server locally. Start the backend
separately for API-dependent scenarios. This configuration does not add E2E
test backend or start the backend. The `e2e/auth.spec.ts` smoke test verifies
that the configured test user can sign in and reach the dashboard.

`e2e/navigation.spec.ts` checks protected routes, desktop/mobile navigation,
logout, and opening/closing forms. `e2e/transfers.spec.ts` checks operation
selection and recipient validation. Successful money mutations and account/card
creation are currently covered by Vitest workflow tests, not full browser E2E.
Backend `503` responses can block authenticated browser scenarios; inspect the
retained network trace rather than treating those failures as passing tests.

Failures retain traces, screenshots, and videos in `test-results/`; the HTML
report is written to `playwright-report/`. Both directories and local auth
state in `playwright/.auth/` are ignored by Git. Visual assertions using
`toHaveScreenshot()` disable animations. Review screenshot baselines before
committing them and compare them in a consistent browser/OS environment.

#### E2E Selectors

Add a stable `data-testid` to elements used by Playwright. E2E DOM selectors
must use only `data-testid`; do not locate elements by role, text, label,
placeholder, tag name, CSS class, `href`, or form field name. URL assertions are
allowed for route checks. Use semantic values such as `login-submit`,
`page-dashboard`, and `accounts-create-button`.

ESLint rejects role/text/label/placeholder/CSS locator calls in `e2e/`. Use
`getByTestId`, `or`, and `filter({ visible: true })` for responsive elements.
Unit/component tests may use semantic Testing Library selectors.

## Required Agent Session Checklist

Before an agent session is considered complete:

1. Update the relevant files in `docs/` when behavior, architecture, routing,
   API/state contracts, commands, UI rules, or project structure changed.
2. Run the linter:

   ```bash
   npm run lint
   ```

3. Run the test suite:

   ```bash
   npm run test
   ```

4. Run `npm run build` when TypeScript, build config, routing, imports, API
   types, or application code changed.
5. If any required command cannot be run, record the exact reason in the final
   session summary.

Documentation-only changes still require `npm run lint` and `npm run test`
unless the user explicitly asks to skip verification.

## Formatting

Use Prettier for Markdown, TypeScript, CSS, JSON, and config formatting.

For targeted formatting after small changes:

```bash
npx prettier --write <files>
```

Use `npm run format` only when intentionally formatting the whole project.
