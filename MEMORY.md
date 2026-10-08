# MEMORY.md - Kalibra Web App

Inter-session project memory. Keep this file concise (about ~50 lines); remove stale details.

## Current status (2026-10-08)
- `develop` (pushed): Tailwind 4 tokens from Figma `kalibra_design_system`, `components/ui` primitives, `AppShell` + sidebar with active-course switcher, routes with `PlaceholderPage`, mock services.
- Local branches (not pushed): `feature/course-management`, `feature/exercise-management`, `feature/invitations-indicators`.
- Only UI and navigation: services point to `src/mocks`; no API integration yet.

## Decisions (and why)
- Layered architecture (qs-react-frontend); Tailwind on web, StyleSheet + `theme/tokens.ts` on mobile, same token names.
- Mobile-first: base classes for 375 px, `md:`/`lg:` widen; sidebar is a drawer below `lg`, tables become stacked rows below `md`.
- Each service has a `*.contract.ts`; the service exports the mock today so the HTTP version swaps in without touching hooks.
- Courses and subtopics are data only; no screen names a specific course. `?vacio` in the URL shows empty states.
- Shared pieces (MaterialStatusChip, mastery/plural helpers, IconName list) live in `develop` to avoid duplicates across branches.
- README.md only in empty layer folders (user rule), so ARCH-05 audit warning is expected.

## Lessons learned and mistakes to avoid
- Vitest runs without globals: Testing Library cleanup is registered in `src/test/setup.ts`.
- jsdom 30 needs Node >= 24.15; pinned to 29.x.
- NavLink for `/cursos` needs `end` or it stays active on `/cursos/:id/*`.

## Next steps
- Partner branches: `feature/auth`, `feature/curricular-material`, `feature/student-monitoring` replace their placeholders.
- Replace mocks with HTTP services behind the same contracts.
