# Agent Notes

Use this file as persistent project guidance for future coding-agent sessions.

## Project

Buro Bank frontend is a React + TypeScript + Vite application for a banking pet project. The API is a Java backend exposed through an API gateway. OpenAPI-generated types live in `src/shared/api/schema.ts` and project-facing aliases live in `src/shared/api/types.ts`.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Dev server on local domain without a port: run `npm run dev:domain` and `npm run dev:nginx`
- Generate local HTTPS cert: `npm run dev:cert`
- Generate API types from Swagger: `npm run api:types`
- Verify changes: `npm run lint` and `npm run build`

## Local Domain

The preferred dev hostname is `buro-bank.ru`.

`/etc/hosts` should contain:

```text
127.0.0.1 buro-bank.ru
```

`npm run dev` opens Vite on `https://buro-bank.ru:5173`. To use `https://buro-bank.ru` without a port, use the dev nginx proxy.

## API And State

- Keep API setup in `src/shared/api`.
- Use RTK Query endpoints for server calls.
- Store `user`, `accounts`, and `cards` in Redux slices, not only in RTK Query cache.
- `accounts` state is owned by `src/features/accounts/accountsSlice.ts`.
- `cards` state is owned by `src/features/cards/cardsSlice.ts`.
- Account queries should synchronize both `accounts` and `cards` slices after successful fetches.
- Card updates should synchronize both the `cards` slice and nested cards inside the `accounts` slice.
- On logout or unrecoverable `401`, clear `user`, `accounts`, and `cards`.
- For `401` responses, first try `/auth/refresh`; redirect to `/login` only when refresh fails.

## Data Rules

- Do not add mock data to app pages.
- Empty states are acceptable, but they must say data is unavailable rather than showing fake business data.
- Prefer generated Swagger types from `src/shared/api/types.ts`.
- Runtime enum values must come from `src/shared/api/enums.ts`.

Current frontend enums:

- `AccountCurrency`: `RUB`, `USD`, `EUR`, `CNY`, `GBP`
- `AccountType`: `CHECKING`, `SAVINGS`
- `AccountStatus`: `ACTIVE`, `FROZEN`, `CLOSED`
- `AuthUserStatus`: `ACTIVE`, `BLOCKED`, `PENDING`
- `Role`: `USER`, `MANAGER`, `ADMIN`
- `CardStatus`: `ACTIVE`, `BLOCKED`, `FROZEN`, `EXPIRED`
- `UserProfileStatus`: `ACTIVE`, `BLOCKED`, `PENDING`

## UI Rules

- Use the existing page styles and CSS modules.
- Use `lucide-react` icons for button/icon affordances when a matching icon exists.
- Forms should use `react-hook-form`.
- Modals/dialogs should render via React Portal into `document.body`, with full-screen overlay shadow/backdrop.
- Custom dropdowns should match the app style; avoid native select elements for visible app controls.
- Money should be formatted as `CODE amount`, for example `RUB 0.00` or `USD 0.00`. Do not use currency symbols like `$`.
- Cards:
  - Card status values are only `ACTIVE`, `BLOCKED`, `FROZEN`, `EXPIRED`.
  - Do not use a separate "virtual card" style/status.
  - Card status badge is interactive for `ACTIVE`, `BLOCKED`, `FROZEN` and should show a chevron.
  - `CHECKING` and `SAVINGS` accounts render `DEBIT` cards.
- Account creation opens a form where the user selects account currency and account type.

## Git Safety

- The worktree may already be dirty.
- Never revert user changes unless explicitly asked.
- Keep edits scoped to the user request.
