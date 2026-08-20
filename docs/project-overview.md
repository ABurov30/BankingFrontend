# Project Overview

Buro Bank Frontend is a React, TypeScript, and Vite application for a banking
pet project. It talks to a Java backend through an API gateway and presents
authenticated banking workflows for users, managers, and administrators.

## Runtime Stack

- React 19 for UI rendering.
- TypeScript 5 for application typing.
- Vite 7 for local development and production bundling.
- React Router 7 for route composition.
- Redux Toolkit and RTK Query for application state and server communication.
- React Redux for store binding.
- React Hook Form for form state and validation.
- CSS modules plus global theme variables from `src/styles.css`.
- `lucide-react` for iconography.
- `@stomp/stompjs` for authenticated notification and transaction status
  websocket delivery.
- Vitest and Testing Library for tests.

## Application Scope

The application currently supports:

- Authentication: login, Google OAuth redirect login, signup, logout, user
  verification, and password changes.
- Dashboard views for account and notification summaries.
- Account management: account list, filtering, creation, freezing, unfreezing,
  top-up, withdraw, and transfers.
- Card management: card issue flow, status changes, and daily/monthly limits.
- Transactions list, transfer creation, and per-transaction status tracking.
- Notifications list, read-state mutation, websocket updates, and toast
  notifications.
- Profile page with personal data, security settings, preferences, and linked
  sign-in methods.
- Manager/admin user management pages.
- Admin service health page.

The UI must not show mock banking data. Empty states are allowed, but they
should clearly state that data is unavailable or absent.

## Repository Layout

```text
src/
  app/          Redux store, typed hooks, and theme bootstrap.
  components/   Shared UI components used across pages.
  features/     Redux slices and feature-level state helpers.
  layouts/      Route-level layout shells.
  lib/          Shared formatting and utility functions.
  pages/        Page modules, page-local components, and page styles.
  routes/       Route guard components.
  shared/api/   RTK Query base API, endpoint modules, generated types, enums.
  shared/i18n/  Translation dictionary and translation hook.
  test/         Testing helpers and provider wrappers.
```

Root-level operational files:

- `vite.config.ts` configures React, localhost development, optional HTTPS
  local-domain behavior, `/api` proxying, and the `@` path alias.
- `vitest.config.ts` configures the jsdom test environment.
- `Dockerfile` builds the app and serves it with nginx.
- `nginx.conf` serves the production SPA and proxies `/api` to the backend.
- `nginx.dev.conf` proxies `https://buro-bank.ru` to the Vite dev server.
- `AGENTS.md` contains persistent guidance for coding agents.

## Routes

Routes are declared in `src/App.tsx` and lazy-loaded with `React.lazy`.

Authenticated routes are wrapped by `ProtectedRoute` and
`AuthenticatedLayout`:

- `/`: dashboard.
- `/accounts`: user account management.
- `/cards`: card management.
- `/notifications`: notification list.
- `/profile`: current user profile and settings.
- `/transactions`: transaction list.
- `/users`: manager/admin user list.
- `/users/:authUserId`: manager/admin user details.
- `/health`: admin-only service health view.

Guest routes are wrapped by `GuestLayout`:

- `/login`: login page.
- `/signup`: signup page.
- `/user-verify`: manual user verification page.
- `/user-verify/:authUserId/:verificationCode`: verification link route.

The catch-all route renders the not-found page.

## Runtime URLs

The default local hostname is `localhost`.

- `npm run dev` starts Vite at `http://localhost:5173`.
- `npm run dev:domain` starts Vite with proxy-aware HMR for the local nginx
  domain proxy.
- `npm run dev:nginx` runs the local HTTPS nginx proxy at
  `https://buro-bank.ru`.

The `/api` Vite proxy targets `http://localhost:8080` and strips the `/api`
prefix before forwarding requests.

## Deployment Model

The production Docker image is multi-stage:

1. `node:20-alpine` installs dependencies and builds the Vite bundle.
2. `nginx:1.27-alpine` serves the generated `dist` directory.

The production nginx config:

- Serves the SPA through `try_files ... /index.html`.
- Proxies `/api/` to `http://host.docker.internal:8080/`.
- Serves built assets with immutable cache headers.
