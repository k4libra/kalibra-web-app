# MEMORY.md - Kalibra Web App

## Current status (2026-10-10)
- This worktree is `feature/student-monitoring`; integration merge already committed as `fd4b39c`.
- Monitoring refactor is uncommitted; no Git write commands were executed.
- Accepted courses, exercises, invitations and indicators routes remain; root opens sign-in.
- Auth and curricular material retain placeholders until their branches are integrated.
- Monitoring includes course-grouped students, individual progress and coordinated gap-map/heatmap resources.
- Read-only Git only in this sandbox; never touch other worktrees or merge into main/develop.

## Decisions
- Layered architecture: pages use hooks, hooks use services plus `useResource`, mocks implement contracts.
- Canonical `mocks/students.fixture.ts` shares `st-1/2/3` identities, enrollment and activity with indicators/invitations; legacy `student-1/2/3` progress URLs remain supported.
- Keep `masteryTone`: null = no data, <40 low, 40–<70 medium, >=70 high. Legend reflects accepted thresholds rather than Figma's conflicting 70% boundary.
- Progress recommendations rely on explicit subtopic IDs and recent responses; never infer recent incorrect answers from mastery alone.
- Opening progress synchronizes ActiveCourseContext to the student's course; listing all courses does not change it.
- Tokens and existing UI primitives replace bespoke colors, bars, badges and stats; new HeatmapCell/Legend are generic UI primitives.
- `?vacio` is shared across courses, monitoring and indicators; preserve it on the first-course CTA.

## Verification and limitations
- Baseline: 45 tests passed; lint had 2 errors and audit had 289 error hits.
- Refactor tests cover service projections, boundaries, errors/retry, stale responses, cleanup, shell synchronization and the real merged router.
- Live visual verification at 1280×832 and 360/768 remains pending: no connected browser; automatic review denied Chrome access.
- Audit warning disposition: 7 layer READMEs intentionally absent; 5 inherited page/shell hooks lack tests; monitoring's type-only contract needs no runtime test.
- Vitest has no globals: cleanup is registered in `src/test/setup.ts`; jsdom remains 29.x.
