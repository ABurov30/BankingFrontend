# Architecture

The frontend is structured around route-level pages, shared UI components,
Redux feature slices, and RTK Query endpoint modules. Page modules own
page-specific composition and styles, while cross-page behavior lives in
`src/components`, `src/features`, `src/shared`, and `src/lib`.

## Application Bootstrap

`src/main.tsx` creates the React root and installs process-wide providers:

- `Provider` exposes the Redux store.
- `AppTheme` applies the current light/dark theme to the document.
- `BrowserRouter` enables route rendering.
- `ToastViewport` renders global toast notifications.

`src/App.tsx` defines lazy route modules and wraps the route tree in
`Suspense` with `PageLoader` as fallback. `useNotificationsWebSocket` is called
from `App`, so websocket connection management is active whenever a user is
authenticated.

## Store Composition

`src/app/store.ts` creates the Redux store with:

- `baseApi.reducer` under the `api` reducer path.
- Feature slices: `accounts`, `app`, `cards`, `counter`, `rightPanel`,
  `toast`, and `user`.
- RTK Query middleware from `baseApi.middleware`.
- RTK Query listener setup through `setupListeners`.

Use `src/app/hooks.ts` for typed `useDispatch` and `useSelector` access.

## Route Guards

`ProtectedRoute`:

- Reads the current user from the `user` slice.
- Calls `useGetUserInfoQuery` when no user is already present.
- Writes the fetched user into Redux with `setCurrentUser`.
- Redirects unauthorized users to `/login`.
- Shows `PageLoader` while initial authentication state is being resolved.

`RoleRoute`:

- Reads the current user's role from Redux.
- Renders `AccessDenied` when the role is missing or not allowed.
- Allows nested routes for the configured roles.

## Layouts

`AuthenticatedLayout` builds the shell for signed-in pages:

- `Sidebar` for desktop navigation.
- Main content outlet.
- `BottomNavigation` for compact navigation.
- `TransferPanel` when `rightPanel.content === 'transfer'`.

`GuestLayout` wraps public authentication and verification pages without the
authenticated shell.

## Component Boundaries

Shared components live in `src/components` and are intended for reuse across
multiple pages. Page-local components live under `src/pages/<page>/components`
and should not be imported from unrelated pages unless they are promoted to a
shared component.

Current shared component groups include:

- `AccessDenied`: role guard fallback.
- `BankCardVisual`: reusable rendered card visual.
- `BottomNavigation` and `Sidebar`: navigation chrome.
- `Button`, `Typography`, `Skeleton`, and `PageLoader`: reusable UI
  primitives.
- `ToastViewport`: global toast renderer.
- `TransferPanel`: cross-page transfer drawer opened from account workflows.

## Transfer Panel Decomposition

`src/components/TransferPanel/TransferForm.tsx` is the container for transfer
business logic. It owns:

- Operation state: top-up, withdraw, own-account transfer, external transfer.
- Stage state: target selection, own-account operation selection, form.
- React Hook Form setup.
- Recipient lookup.
- Account selection state.
- Mutation calls for account balance updates and transaction creation.
- Toast and right-panel side effects.

Presentation pieces are split under
`src/components/TransferPanel/components`:

- `TransferPanelHeader` renders the title, back button, and close button.
- `TransferStageTabs` renders target and operation selection tabs.
- `AccountPicker` renders account dropdowns.
- `RecipientFields` renders recipient email lookup and recipient account
  selection.
- `AmountField` renders amount input and currency badge.
- `TransferSubmitBlock` renders the verification copy and submit button.
- `TransferConfirmationDialog` renders the confirmation portal.
- `Field` and `OperationTab` provide small local primitives.

Transfer-specific types live in `src/components/TransferPanel/types.ts`, and
small helpers live in `src/components/TransferPanel/utils.ts`.

## Page Modules

Each page module keeps server calls, feature state, and high-level composition
in the page component. Complex visual sections are split into page-local
components.

Examples:

- `AccountsPage` owns account loading, filtering, pagination state, account
  mutations, and right-panel opening. `AccountsPageHeader`,
  `AccountsToolbar`, `AccountsTable`, `AccountsPagination`, and
  `CreateAccountDialog` render page sections.
- `CardsPage` owns card loading, issue-card flow, status filtering, and card
  status updates. `CardsPageHeader`, `CardsList`, `PaymentCard`,
  `LimitsPanel`, and `IssueCardDialog` render page sections.
- `ProfileSettingsCards` composes settings columns. Security, preferences,
  sign-in methods, password field, and password strength logic live in
  `src/pages/user/components/settings`.

## Styling

The project uses CSS modules for page and component styles. Global CSS
variables, theme tokens, resets, and utility classes live in `src/styles.css`.

Rules:

- Keep existing page style files when decomposing components.
- Prefer CSS module classes over inline styling, except for dynamic values such
  as progress width.
- Keep page-local visual classes in the page stylesheet unless a component is
  promoted to shared UI.
- Use `cn` from `src/lib/utils.ts` for conditional class composition.
