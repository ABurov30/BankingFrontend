# Buro Bank Frontend Technical Documentation

This directory is the technical documentation hub for the Buro Bank frontend.
Keep these documents in sync with code changes, architecture decisions, and
developer workflow updates.

## Documents

- [Project Overview](./project-overview.md): product scope, runtime stack,
  repository layout, routes, and deployment model.
- [Architecture](./architecture.md): application bootstrap, routing, layout
  composition, feature boundaries, and component organization.
- [API And State Management](./api-and-state.md): RTK Query setup, generated
  OpenAPI contracts, Redux slices, authentication recovery, and domain data
  synchronization.
- [UI And Components](./ui-and-components.md): shared components, page
  composition rules, forms, dialogs, cards, money formatting, and styling
  conventions.
- [Development And Quality](./development-and-quality.md): local setup,
  scripts, environment variables, Docker, testing, formatting, and required
  end-of-session checks.

## Documentation Maintenance Rule

Every agent or developer session that changes behavior, architecture, commands,
state contracts, routing, API usage, UI conventions, or project structure must
update the relevant file in this directory before the session is considered
complete.

At minimum, update documentation when:

- A route, layout, page, feature slice, API endpoint, or shared component is
  added, removed, renamed, or materially changed.
- Generated API types, runtime enums, authentication behavior, or Redux
  synchronization rules change.
- Commands, local development requirements, environment variables, Docker
  behavior, or quality gates change.
- UI rules, form patterns, modal behavior, money formatting, or card/account
  behavior change.

If no documentation update is needed, the final session summary should say that
the docs were reviewed and no update was required.
