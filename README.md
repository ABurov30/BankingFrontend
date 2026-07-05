# Bank Frontend

Frontend for a banking pet project built with React, TypeScript, Vite, React Router, Redux Toolkit and Tailwind CSS.

## Requirements

- Node.js 20+
- npm
- Docker, for containerized launch

## Setup

```bash
npm install
```

Create local environment file if you need to override the API URL:

```bash
cp .env.example .env
```

## Scripts

```bash
npm run dev
```

Starts the local Vite dev server.

```bash
npm run build
```

Runs TypeScript checks and builds the production bundle.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run format
```

Formats the project with Prettier.

```bash
npm run preview
```

Serves the production build locally.

```bash
npm run docker:build
```

Builds the Docker image as `bank-frontend`.

```bash
npm run docker:run
```

Runs the existing Docker image on `http://localhost:5173`.

```bash
npm run docker:up
```

Builds the Docker image and starts the container on `http://localhost:5173`.

To build the image with a different API endpoint:

```bash
docker build --build-arg VITE_API_URL=http://localhost:8080/api -t bank-frontend .
```

## Routing

Routes are split by layout:

- `AuthenticatedLayout` wraps authorized pages and renders the sidebar layout.
- `GuestLayout` wraps public auth pages without extra layout chrome.

Current routes:

- `/` - dashboard, rendered inside `AuthenticatedLayout`
- `/accounts` - accounts page, rendered inside `AuthenticatedLayout`
- `/cards` - cards page, rendered inside `AuthenticatedLayout`
- `/notifications` - notifications page, rendered inside `AuthenticatedLayout`
- `/profile` - user profile page, rendered inside `AuthenticatedLayout`
- `/transactions` - transactions page, rendered inside `AuthenticatedLayout`
- `/login` - login page, rendered inside `GuestLayout`
- `/signup` - signup page, rendered inside `GuestLayout`

## Project Structure

```text
src/
  app/          Redux store and typed hooks
  components/   Shared UI components
  layouts/      Route-level layouts
  lib/          Shared utilities
  pages/        Page components
  shared/api/   Shared API setup
```
