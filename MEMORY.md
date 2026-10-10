# MEMORY.md - Kalibra Web App

Inter-session project memory. Keep this file concise (about ~50 lines); remove stale details.

## Current status (2026-10-10)
- This worktree is `feature/curricular-material`; accepted `feature/ui-integration` was merged, retaining courses/exercises/invitations/indicators and their tests.
- Material page uses hooks, `useResource`, service contracts and props-only components; upload/replacement/empty/error/processing flows are covered.
- Required checks pass; audit has zero errors and the two inherited warning categories documented in `docs/curricular-material-refactor.md`.
- Browser verification at 360/768/1280 is pending: IAB unavailable and Brave automatically rejected. PNG references were opened; no pixel parity is claimed.
- No API/ingestion integration and no push. Auth/monitoring placeholders belong to their branches.

## Decisions (and why)
- Layered architecture (qs-react-frontend); Tailwind on web, StyleSheet + `theme/tokens.ts` on mobile, same token names.
- Mobile-first: base classes for 375 px, `md:`/`lg:` widen; sidebar is a drawer below `lg`, tables become stacked rows below `md`.
- Material metadata has one store in course mocks; course counts and subtopic MaterialStatus are projections, never independent fixtures.
- Unknown PDF page counts remain absent. Tables use contextual Pendiente; shared status stays processing/En ingestión.
- Empty teachers hide reference courses but may create courses and upload to their real subtopic IDs.
- Each service has a `*.contract.ts`; the service exports the mock today so the HTTP version swaps in without touching hooks.
- Courses and subtopics are data only; no screen names a specific course. `?vacio` in the URL shows empty states.
- Shared pieces (MaterialStatusChip, mastery/plural helpers, IconName list) live in `develop` to avoid duplicates across branches.
- Course counters, subtopic status and material rows derive from `courseMaterialsStore.mock`; uploads retain one material per subtopic. Created courses remain visible in the empty-teacher scenario.
- Upload state belongs to hooks using `useResource`; course changes/unmount suppress stale reads, mutations and toasts. `FileDropzone` is a controlled native-input primitive.
- New uploads expose real file metadata only; page counts and scan labels require source metadata. The material table uses contextual `Pendiente`, preserving shared `En ingestión` elsewhere.
- README.md only in empty layer folders (user rule), so ARCH-05 audit warning is expected.
- Inherited audit exceptions: seven missing layer READMEs and five page/shell hooks without dedicated tests; documented in README, deferred to integration follow-up.

## Lessons learned and mistakes to avoid
- Vitest runs without globals: Testing Library cleanup is registered in `src/test/setup.ts`.
- jsdom 30 needs Node >= 24.15; pinned to 29.x.
- NavLink for `/cursos` needs `end` or it stays active on `/cursos/:id/*`.
- Month abbreviations vary by ICU version; material dates use the reference's explicit Spanish abbreviations.
- All 11 material PNG references were inspected. Live visual comparison at 1280×832 and 360/768 remains pending: Brave access was denied and no integrated browser was available.

## Next steps
- Integrate auth/monitoring branches and finish material viewport comparison before claiming the full visual acceptance gate.
- Replace mocks with HTTP services behind the same contracts.
