# UI And Components

The UI is organized around page modules, CSS modules, shared visual primitives,
and React Hook Form for forms. The app should feel like an operational banking
interface: clear, scan-friendly, and data-driven.

## Styling Conventions

- Use existing CSS modules for page and component styling.
- Keep styles near the module that owns the component.
- Use global theme tokens from `src/styles.css`.
- Use `cn` from `src/lib/utils.ts` for conditional class names.
- Use `lucide-react` icons when a matching icon exists.
- Avoid native `select` elements for visible app controls. Use custom dropdowns
  that match the app style.

## Shared Components

Shared components live in `src/components`.

- `AccessDenied`: role-restricted fallback.
- `BankCardVisual`: shared card visualization.
- `BottomNavigation`: compact navigation.
- `Button`: reusable button primitive.
- `PageLoader`: suspense and loading fallback.
- `Sidebar`: authenticated desktop navigation.
- `Skeleton`: loading placeholder.
- `ToastViewport`: global toast rendering.
- `TransferPanel`: right-side transfer drawer.
- `Typography`: text primitive.

Add a component to `src/components` only when it is genuinely shared across
pages or feature areas. Otherwise keep it under the owning page.

## Page-Local Components

Page-local components live under `src/pages/<page>/components`.

Use page-local components for:

- Tables, rows, cards, filters, and dialogs specific to one page.
- Form fragments tied to one backend workflow.
- Page-specific helper components that depend on the page stylesheet.

The page component should usually own data loading, mutations, and high-level
state. Child components should receive prepared props and callbacks.

## Forms

Forms should use `react-hook-form`.

Common rules:

- Keep form value types close to the form component.
- Use generated API request types from `src/shared/api/types.ts` when the form
  maps directly to an API body.
- Validate required values before mutation calls.
- Surface API failures with `showToast` and `getApiErrorMessage`.
- Disable submit buttons while mutations are in flight.
- Redirect-based sign-in actions, such as Google OAuth, should disable related
  login controls while the browser navigation is being started.
- Profile sign-in method cards should render linked social provider/email data
  from the normalized current user instead of placeholder rows.

## Dialogs And Portals

Dialogs and modal overlays should render through React Portal into
`document.body`.

Portal dialogs should:

- Use a full-screen backdrop.
- Set `role="dialog"` and `aria-modal="true"`.
- Provide a stable label through `aria-label` or `aria-labelledby`.
- Close on explicit close action.
- Close on `Escape` when that behavior does not conflict with nested dialogs.
- Avoid leaving body scroll unlocked for drawer/modal overlays.

## Accounts UI Rules

Account creation opens a form where the user selects:

- Account currency.
- Account type.

Visible account data should come from API-backed Redux/RTK Query state. Do not
insert mock accounts into app pages.

Account statuses:

- `ACTIVE`
- `FROZEN`
- `CLOSED`

Account types:

- `CHECKING`
- `SAVINGS`

Account currencies:

- `USD` renders as `$`
- `EUR` renders as `€`
- `CNY` renders as `¥`
- `GBP` renders as `£`

## Cards UI Rules

Card status values are only:

- `ACTIVE`
- `BLOCKED`
- `FROZEN`
- `EXPIRED`

Rules:

- Do not add a separate "virtual card" status or visual style.
- Card status badges are interactive for `ACTIVE`, `BLOCKED`, and `FROZEN`.
- Interactive status badges should show a chevron.
- `CHECKING` and `SAVINGS` accounts render `DEBIT` cards.
- Card limits are edited through the card update mutation.
- Card limit usage indicators should use `spendDailyLimit` and
  `spendMonthlyLimit` from card responses against the configured limits.

## Transfer Panel UI

The transfer panel is a shared right-side drawer opened through
`rightPanel.content === 'transfer'`.

Supported flows:

- Top up own account.
- Withdraw from own account.
- Transfer between own accounts.
- Transfer to another user by email and recipient account.

The form is decomposed into focused presentation components under
`src/components/TransferPanel/components`, while `TransferForm.tsx` keeps the
workflow and mutation logic.

Transaction creation requires a `sourceCardId`. The transfer flow resolves an
active card from the selected source account before showing the confirmation
step. Users choose the source card explicitly; transfer forms should not render
a separate `From account` selector. The card picker shows account balance from
the linked source account and card limit information from the selected card.
Recipient destinations stay account-based: external transfer recipients choose
an active recipient account, not a recipient card. The recipient account field
shows the recipient account currency. If no active source card exists, the form
blocks the transfer and shows a validation message.

Each transaction row on the transactions page exposes a track action when the
row has a `transactionId`. The track action opens a portal modal that connects
to the authenticated STOMP websocket and displays live status updates for that
specific transaction.

## Toasts

Use `showToast` for user-visible operation results. Error messages from API
failures should pass through `getApiErrorMessage`.

Toast copy should be specific enough to identify the failed operation, for
example account creation, card update, recipient lookup, or transfer.

## Empty States

Empty states are preferred over fake business data.

Good empty states:

- Tell the user that data is unavailable or no matching records exist.
- Preserve page layout stability.
- Avoid implying real balances, cards, accounts, or transactions exist.

Bad empty states:

- Mock account balances.
- Fake transaction histories.
- Placeholder user or card data that looks real.
