# MEMORY.md - Kalibra Web App

Inter-session project memory. Keep this file concise (about ~50 lines); remove stale details.

## Current status (2026-10-10)
- `feature/ui-integration` holds every teacher feature: auth, courses, curricular material, generated exercises, invitations, indicators and student monitoring. Only UI with mock services; no API.
- The app starts at `/iniciar-sesion`; demo account and session behavior are documented in README. `docs/ui-integration-audit.md` records the partner-branch audit.

## Decisions (and why)
- Layered architecture (qs-react-frontend): pages use hooks, hooks use services plus `useResource`, services export contracts implemented by mocks.
- Tailwind tokens in `src/index.css` mirror `theme/tokens.ts` of the mobile app; no hex values outside the tokens file.
- Mock data is scoped to the signed-in account (`src/mocks/session.ts`); a new account starts empty. `?vacio` forces empty states.
- One material store (`courseMaterialsStore.mock`) drives material rows, course counters and subtopic `MaterialStatus`.
- One student fixture (`students.fixture.ts`) is shared by monitoring, invitations and indicators.
- `masteryTone`: null = no data, <40 low, 40–<70 medium, >=70 high.
- README.md only in empty layer folders (user rule), so the ARCH-05 audit warning is expected.

## Lessons learned and mistakes to avoid
- Vitest runs without globals: Testing Library cleanup is registered in `src/test/setup.ts`.
- jsdom 30 needs Node >= 24.15; pinned to 29.x.
- NavLink for `/cursos` needs `end` or it stays active on `/cursos/:id/*`.
- Route table lives in `src/navigation/appRoutes.tsx`; integration tests must sign in through `authService` first.

## Next steps
- Replace mocks with HTTP services behind the same contracts.
