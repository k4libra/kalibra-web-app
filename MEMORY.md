# MEMORY.md - Kalibra Web App

## Current status (2026-10-10)
- `feature/api-integration` replaces production mocks with cookie-authenticated HTTP services.
- Teacher features use real endpoints; administrator routes are `/admin/panel` and `/admin/subtemas-criticos`.
- Startup waits for `/users/me`; role guards isolate teacher/admin shells. Sign-up is followed by sign-in because registration does not issue a cookie.
- README documents API execution and generic seed accounts. `docs/api-integration.md` lists endpoints, adaptations and validation evidence.
- Real adapters passed local API smoke checks for teacher reads, individual progress, admin analytics/CSV and cookie auth; student web login and admin teacher access return 403.
- Final validation: lint, TypeScript, 250 tests and production build pass; frontend audit has zero errors.
- Changes remain uncommitted: sandbox denies writing `.git/index.lock`; no push was attempted.

## Decisions
- Layers remain pages → hooks/useResource → contract-based services → one HTTP client.
- Tokens remain in `src/index.css`; new pages reuse existing UI primitives and mobile-first shells.
- Counters derive from rosters, catalogs, invitation groups, complete paginated materials and mastery measurements.
- Missing academic/file metadata, activity timestamps and recommendations remain unavailable; no derived fake evidence.
- Progress links carry the enrollment course, avoiding ambiguous multi-course student identities.
- Mastery tones: null = no data, <40 low, 40–<70 medium, ≥70 high.
- Institutional practice totals normalize missing activity to null; verification keeps server values because its generation denominator is unavailable. API guide kinds use Spanish product copy.
- Only tests use fetch stubs and generic fixtures under `src/test`; production has no mocks or URL empty scenario.
- README files remain omitted from occupied layers by explicit user policy.

## Pitfalls and external dependencies
- Local API implements v2 auth, names, institutional resources and binary multipart. Seed reads had no practice/material; real generation and ingestion remain unverified.
- API defaults to a 10 MB upload limit; use MATERIALS_MAX_FILE_SIZE=20MB to match UI. Engine/storage may return 503 until configured.
- Cookie secure must be false for local HTTP; credentials are included on every request. No token is exposed to JavaScript or persisted.
- Stale restoration and stale protected-request 401 responses must not replace a newer signed-in identity.
- Testing Library cleanup is explicit; Vitest runs without globals. jsdom remains on 29.x.
- Browser visual QA was blocked: integrated browser unavailable; Computer Use for Brave not approved.
