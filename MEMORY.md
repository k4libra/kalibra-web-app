# MEMORY.md - Kalibra Web App

## Current status (2026-11-21)
- `release/v1.0.0` (2026-11-21): Vercel deploy prep. `vercel.json` proxies `/api/*` to `https://kalibra-api-production.up.railway.app` (SameSite=Lax cookie needs same-site calls; 120 s proxy limit) and falls back to `index.html`. README fixes stale Redis/10 MB notes. Lint, tsc, 360 tests and build pass.
- Material upload availability implemented on `feature/ui-v2-refactor`: service + hook read on mount/window focus; unavailable disables page/empty-state/modal upload actions with the exact generic notice and titles. Matching upload 503 uses the same notice. Lint, 73 files / 360 tests and production build pass (bundle size warning); prior uncommitted work preserved.
- UI v2 refactor uncommitted on `feature/ui-v2-refactor` (from develop): v2 tokens, Lucide icons, new SVG logo, BackgroundGlow, IconTile/StatStrip/CountBadge/AlertBanner/CodeBlock primitives and every teacher/admin screen restyled to the Figma frames. Lint, 68 files / 324 tests and build pass; live E2E on localhost:5173 against the real API matched the frames.
- Shared contract implemented over UI v2: course term/faculty/semester and subtopic descriptions (280 characters), material size/pages and 20 MB uploads, structured exercise steps/key idea with plain-text fallback. Fetch-stub coverage: 71 files / 344 tests; lint and production build pass. Live localhost:8080 login/modal smoke passed; seed account has no courses.
- Legend uses bar swatches (no dots); ProgressBar track is always lavender, high level fills `secondary-strong`; ready material chip uses `secondary-container`.
- 2026-11-11 evidence correction: recaptured all 46 desktop cases with explicit font loading, single-glyph icon checks, completed requests/images and stable UI before every shot. Same names/Gherkin/style/count (284 web + 4 linked native screenshots); 69-case document bundle revalidated/rendered. No application source changes; QA services/configs removed.
- `feature/course-subtopic-editing` adds draft editing and course/subtopic mutations over cookie-authenticated HTTP.
- `feature/subtopic-actions-menu` adds one aligned, accessible ⋮ menu per active row and `/cursos/:courseId/subtemas/archivados` as the only restoration screen, with confirmation and inline storage-box SVGs.
- Subtopic creation stacks full-width controls below `md`, returning to a shrinkable field and auto-width button at `md`; metadata stays single-column on mobile and rename already wraps. Responsive class regression added; lint, TypeScript and all 300 tests pass. Visual 375 px verification remains pending because Chrome launch failed in this environment.
- `UnarchiveIcon` uses a body at y 11–21 and a tilted lid hinged at (4, 11), raised 6.2 units at its right edge to read as open at small sizes; only its path changed. Icon tests (3) and lint pass; `ArchiveIcon` is unchanged.
- Teacher features use real endpoints; administrator routes are `/admin/panel` and `/admin/subtemas-criticos`.
- Startup waits for `/users/me`; role guards isolate teacher/admin shells. Sign-up is followed by sign-in because registration does not issue a cookie.
- README documents API execution and generic seed accounts. `docs/api-integration.md` lists endpoints, adaptations and validation evidence.
- Real adapters passed local API smoke checks for teacher reads, individual progress, admin analytics/CSV and cookie auth; student web login and admin teacher access return 403.
- Final validation: lint, TypeScript, 299 tests and production build pass; frontend audit has zero errors (existing README/test-coverage warnings).
- Changes remain uncommitted by explicit task instruction; no push was attempted.

## Decisions
- Course/subtopic mutations use PATCH/POST/DELETE and refetch the complete projection; creation sends one POST with `subtopics: [{name, description?}]`. Course metadata saves also refresh mounted course lists and shell metadata.
- Server status/locked are authoritative. Archived subtopics are hidden by default and excluded from action selectors, gap maps and indicator rows; historical material/exercise names remain available.
- Active curriculum has no archive toggle; the archive link appears only when archived rows exist. Locked rename/delete menu items remain discoverable with their disabled reason.
- Only the archive projection requests `/courses/:id/indicators` for historical solved counts; missing entries remain unknown. Ordinary curriculum reads retain their previous endpoint dependencies.
- Conflict ProblemDetail detail is shown in curriculum callouts; stale-course mutation results are ignored and concurrent writes are blocked.
- Layers remain pages → hooks/useResource → contract-based services → one HTTP client.
- Availability read failures restore upload to enabled so transient reads do not block teachers; the server guards submission. Reuse `useResource` cancellation/stale-response handling, and share one notice across controls and `MATERIAL_UPLOAD_UNAVAILABLE` recovery.
- Tokens remain in `src/index.css`; new pages reuse existing UI primitives and mobile-first shells.
- Counters derive from rosters, catalogs, invitation groups, complete paginated materials and mastery measurements.
- Persist API academic metadata; derive `currentAcademicTerm()` only for null/absent term and omit null faculty/semester. Map nullable `sizeBytes`/`pageCount` independently; do not invent file metadata or recommendations. Description-only PATCH remains available for material-locked subtopics.
- Progress links carry the enrollment course, avoiding ambiguous multi-course student identities.
- Roster and individual progress preserve API `lastActivityAt`; null shows "Sin actividad". Roster dates require one cancellable progress GET per enrolled student.
- Mis cursos counts unique roster student IDs across courses; each course retains its own enrollment count.
- Mastery tones: null = no data, <40 low, 40–<70 medium, ≥70 high.
- Institutional practice totals normalize missing activity to null; verification keeps server values because its generation denominator is unavailable. API guide kinds use Spanish product copy.
- Only tests use fetch stubs and generic fixtures under `src/test`; production has no mocks or URL empty scenario.
- README files remain omitted from occupied layers by explicit user policy.

## Pitfalls and external dependencies
- API CORS allows `http://localhost:5173` only; a dev server on `127.0.0.1` gets 403 "Invalid CORS request" (UI shows the student-account message). On the external volume Vite needs `CHOKIDAR_USEPOLLING=1` to pick up edits.
- Local API implements v2 auth, names, institutional resources and binary multipart. Seed reads had no practice/material; real generation and ingestion remain unverified.
- Web upload limit is 20 MB (including HTTP 413 copy); API changes are parallel and older deployments may still reject large files. Nullable/absent explanation steps fall back to `explanation`; keep key idea independently visible. Engine/storage may return 503 until configured.
- Cookie secure must be false for local HTTP; credentials are included on every request. No token is exposed to JavaScript or persisted.
- Stale restoration and stale protected-request 401 responses must not replace a newer signed-in identity.
- Testing Library cleanup is explicit; Vitest runs without globals. jsdom remains on 29.x.
