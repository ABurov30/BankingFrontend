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
- `VITE_DEV_PROXY`: when set to `true`, Vite HMR uses port `443` for the local
  nginx domain proxy.
- `VITE_NOTIFICATIONS_WS_URL`: optional websocket URL override for
  notifications.

## Local Domain

Preferred local hostname:

```text
buro-bank.ru
```

`/etc/hosts` should contain:

```text
127.0.0.1 buro-bank.ru
```

Start Vite:

```bash
npm run dev
```

The app opens at:

```text
https://buro-bank.ru:5173
```

To use `https://buro-bank.ru` without a port:

```bash
npm run dev:cert
npm run dev:domain
```

Run the dev nginx proxy in a separate terminal:

```bash
npm run dev:nginx
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

Prefer focused tests around:

- State reducers and synchronization behavior.
- Utility functions.
- Route guard behavior.
- Form validation and mutation callbacks when behavior is non-trivial.
- Component rendering for reusable or high-risk UI.

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
