# UI integration audit — Kalibra web app

Audit date: 2026-10-10. **All three teammate branches: DOES NOT COMPLY / refactor before merge.** No source, configuration, dependency, memory or Git file was changed. The only persisted audit artifact is this report; temporary preview bundles and mock probes stayed in process memory.

## Scope and evidence

Repository root: `/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories`.

| Reference | Checkout / revision |
|---|---|
| Accepted integration | `kalibra-web-app`, branch `docs/ui-integration-audit`; HEAD and `feature/ui-integration` both `b55e885a1e8c6e830ec49ee8443fa8a2765bc05c`; content equality checked |
| Common base | `develop`, `5ec4aef130ab89f3a80e481156aa5c3888093f51` |
| Auth | `worktrees/kalibra-web-app__auth`, `feature/auth`, `8fd65b67de4c501186fea47d511de401e3bb4d5b` |
| Curricular material | `worktrees/kalibra-web-app__curricular-material`, `feature/curricular-material`, `cdb3b5b54f04e9e71dee83de832f5951c8223e27` |
| Student monitoring | `worktrees/kalibra-web-app__student-monitoring`, `feature/student-monitoring`, `ae1f27b0299a583a62da28ca1709a05d40d04fbe` |

In each branch section, source `file:line` citations are relative to its worktree. In the cross-branch section, **I:** means the accepted integration checkout. Automated inventory entries are verbatim scanner locations, not inferred line counts.

Authoritative standard: [SKILL.md](/Users/gonzaloquedena/.claude/quedena-studio/skills/qs-react-frontend/SKILL.md), plus its [architecture-layered](/Users/gonzaloquedena/.claude/quedena-studio/skills/qs-react-frontend/references/architecture-layered.md), [conventions](/Users/gonzaloquedena/.claude/quedena-studio/skills/qs-react-frontend/references/conventions.md), [styling](/Users/gonzaloquedena/.claude/quedena-studio/skills/qs-react-frontend/references/styling.md), [data-and-state](/Users/gonzaloquedena/.claude/quedena-studio/skills/qs-react-frontend/references/data-and-state.md), [documentation](/Users/gonzaloquedena/.claude/quedena-studio/skills/qs-react-frontend/references/documentation.md), [TSDoc examples](/Users/gonzaloquedena/.claude/quedena-studio/skills/qs-react-frontend/references/examples/tsdoc-examples.md), [testing](/Users/gonzaloquedena/.claude/quedena-studio/skills/qs-react-frontend/references/testing.md) and [audit](/Users/gonzaloquedena/.claude/quedena-studio/skills/qs-react-frontend/references/audit.md) references were read.

Design/flow evidence: [REFERENCE.md](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/REFERENCE.md>) (actual file: `repositories/worktrees/_figma/REFERENCE.md`), especially lines 11–23 (tokens/building blocks), 28–33 (web flows), 44 (routes), and 48 (initial route). All **26** web PNGs were opened and visually inspected: 8 auth, 11 material, 7 monitoring frames. The report compares what those PNGs show with source-rendered composition/state rules; it does **not** claim pixel-diff or live browser verification. An in-memory production preview was built successfully, but the in-app browser was unavailable and native Brave access was not approved by the environment. No browser-driven interaction, 360/768/1280 responsive rendering, keyboard/focus audit or merged-app smoke test could therefore be completed.

This is a **web-only** audit. The mobile wireflows in the shared reference are out of scope for these worktrees. Placeholder pages belonging to other unmerged features are expected in isolation; their absence is treated as an integration dependency, not as teammate regressions.

## Summary

Error counts below count **error-severity findings rows** in the branch tables, grouped by the primary category. A finding can describe several occurrences; related design and flow rows can share a root cause. Environment write restrictions are recorded separately and are not charged as source defects.

| Branch | Build health | Build errors | Standard errors | Design errors | Flow errors | Redundancy errors | Integration errors | Total errors / warnings | Verdict |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| feature/auth | Lint passes; normal tsc/test/build blocked by sandbox; read-only substitutes pass | 0 | 5 | 1 | 2 | 0 | 1 | 9 / 18 | DOES NOT COMPLY |
| feature/curricular-material | Lint fails (2 errors); normal tsc/test/build blocked by sandbox; read-only substitutes pass | 2 | 5 | 5 | 1 | 0 | 1 | 14 / 13 | DOES NOT COMPLY |
| feature/student-monitoring | Lint fails (2 errors); normal tsc/test/build blocked by sandbox; read-only substitutes pass | 2 | 6 | 2 | 2 | 0 | 3 | 15 / 12 | DOES NOT COMPLY |

Automated scanner **hit counts**, separately from the finding-row counts above:

| Branch | Architecture errors | Style errors | Documentation errors | Total error hits | Warning hits | Failed error rules |
|---|---:|---:|---:|---:|---:|---|
| feature/auth | 0 | 18 | 34 | 52 | 33 | STYLE-01, STYLE-02, DOC-02, DOC-03 |
| feature/curricular-material | 0 | 0 | 11 | 11 | 11 | DOC-02, DOC-03 |
| feature/student-monitoring | 2 | 264 | 23 | 289 | 22 | ARCH-01, STYLE-01, STYLE-02, DOC-02, DOC-03 |

Counts use the scanner's `--json --all` inventory. One hit can contain several arbitrary values and a file can fail both documentation rules; these totals are not unique-file or unique-defect counts. Inherited README and useShellNavigation-test warnings are included in the raw scanner totals. Manual findings add issues the regex audit misses, including mock imports, undefined utilities, JSX comments, feature controls, race conditions and flow gaps.

## Build health: exact commands and environmental limits

All requested commands were invoked **inside each named worktree**, without installing packages or changing configuration. The worktrees are read-only under this session's sandbox. Exact typecheck/build tries could not create `node_modules/.tmp`; exact npm test tries could not create Vite's bundled-config cache. These are **environment failures**, not TypeScript diagnostics/test assertion failures, and no normal build/test pass is claimed.

| Worktree | npm run lint | npx tsc -b | npm test | npm run build | audit script |
|---|---|---|---|---|---|
| kalibra-web-app__auth | exit 0 | exit 1; TS5033/EPERM | exit 1; startup EPERM | exit 1; stops at tsc | exit 1; FAIL |
| kalibra-web-app__curricular-material | exit 1; 2 source errors | exit 1; TS5033/EPERM | exit 1; startup EPERM | exit 1; stops at tsc | exit 1; FAIL |
| kalibra-web-app__student-monitoring | exit 1; 2 source errors | exit 1; TS5033/EPERM | exit 1; startup EPERM | exit 1; stops at tsc | exit 1; FAIL |

Supplementary checks avoided persistent output:

- `npx tsc -p tsconfig.app.json --incremental false --noEmit && npx tsc -p tsconfig.node.json --incremental false --noEmit`: exit **0 on all three branches**, no diagnostics.
- `npm test -- --configLoader native --cache=false`: exit **0 on all three branches**, **9 test files / 20 tests** each; no new feature tests. Tests exercised the existing suite, not the missing partner-feature coverage.
- Installed Vite's programmatic `build({ configLoader: 'native', build: { write: false } })`: succeeded on all three branches, **3 in-memory output assets** each; auth 166, material 162, monitoring 164 transformed modules. This verifies bundling but does not reproduce the normal disk-emitting npm build. Preview servers were stopped.
- In-memory esbuild probes loaded the real mock modules without creating files: material with `?vacio` still returned **3** records; upload to course-2/sub-5 produced **processing**, but course materialCount stayed **0** and subtopic.materialStatus stayed **missing**. Monitoring with `?vacio` still returned **3** students and **2** active students.

## feature/auth

Worktree: `/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth`.

**Verdict: DOES NOT COMPLY.** Layer imports pass the automatic checks; styling/documentation fail and registration/duplicate-email flow is incomplete.

### Check failure diagnostics

First source-error line for lint, verbatim (both independent lint failures shown when present):

Lint exited 0; no error line.

`npx tsc -b` — exact first error line:

```text
error TS5033: Could not write file '/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/node_modules/.tmp/tsconfig.app.tsbuildinfo': EPERM: operation not permitted, mkdir '/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/node_modules/.tmp'.
```

A second TS5033 diagnostic names the same worktree's `node_modules/.tmp/tsconfig.node.tsbuildinfo` and the same denied mkdir. No source type error was emitted.

`npm test` — exact first error line:

```text
Error: EPERM: operation not permitted, mkdir '/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/node_modules/.vite-temp'
```

The earlier first failure diagnostic was also:

```text
failed to load config from /Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/vite.config.ts
```

`npm run build` — exact first error line:

```text
error TS5033: Could not write file '/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/node_modules/.tmp/tsconfig.app.tsbuildinfo': EPERM: operation not permitted, mkdir '/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/node_modules/.tmp'.
```

A second TS5033 diagnostic names the same worktree's `node_modules/.tmp/tsconfig.node.tsbuildinfo` and the same denied mkdir. No source type error was emitted.

Audit — exact first error-severity failure row:

```text
| STYLE-01 | error | FAIL | 15 | no hex / rgb colors outside the tokens file |
```

### Findings

| ID | Severity | Category | File:line | Finding | Required fix |
|---|---|---|---|---|---|
| A01 | error | Standard | [src/components/auth/AuthLayout.tsx:34](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthLayout.tsx:34>); [src/components/auth/AuthForm.tsx:257](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthForm.tsx:257>); [src/components/auth/LogoutConfirmModal.tsx:20](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/LogoutConfirmModal.tsx:20>) | Hard-coded colors and non-token styles: audit STYLE-01 has 15 hits and STYLE-02 has 3. The scanner also misses `z-[9999]` and inline pixel sizes in the logout dialog. | Use the existing semantic colors, typography, radius and shadows. Move genuinely intrinsic layout dimensions into a reusable layout/UI primitive. |
| A02 | error | Standard | [src/components/auth/AuthAlert.tsx:14](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthAlert.tsx:14>); [src/components/auth/AuthForm.tsx:64](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthForm.tsx:64>); [src/components/auth/PasswordField.tsx:53](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/PasswordField.tsx:53>); [src/navigation/ShellRoute.tsx:81](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/navigation/ShellRoute.tsx:81>) | Uses red/green/blue/gray/indigo/black palette utilities although `src/index.css:9` clears the default palette. These colors do not resolve to the project theme. | Use danger, secondary, primary, content and surface tokens; validate the emitted CSS rather than relying on a successful build. |
| A03 | warn | Standard | [src/components/auth/AuthForm.tsx:114](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthForm.tsx:114>); [src/components/auth/AuthForm.tsx:196](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthForm.tsx:196>); [src/components/auth/AuthForm.tsx:254](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthForm.tsx:254>); [src/components/auth/PasswordField.tsx:42](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/PasswordField.tsx:42>); [src/components/auth/LogoutConfirmModal.tsx:80](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/LogoutConfirmModal.tsx:80>) | Recreates inputs, action buttons and icon buttons in feature components. The page-only raw-control audit does not catch these. | Compose TextField, Button, IconButton and Icon. Extend TextField for password visibility, native attributes and error/help text; keep the native input inside the primitive. |
| A04 | error | Standard | [src/components/auth/AuthAlert.tsx:1](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthAlert.tsx:1>); [src/hooks/useLogin.ts:1](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/hooks/useLogin.ts:1>); [src/services/auth.service.ts:1](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/services/auth.service.ts:1>); [src/types/auth.ts:1](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/types/auth.ts:1>) | All 15 added source files lack the required file header; DOC-02 reports 15 hits. Existing router/shell headers remain. | Add an English module summary, creator name from git, @author and @packageDocumentation to every added file, including the barrel. See the complete inventory below. |
| A05 | error | Standard | [src/components/auth/AuthForm.tsx:38](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthForm.tsx:38>); [src/hooks/useLogin.ts:20](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/hooks/useLogin.ts:20>); [src/services/auth.contract.ts:9](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/services/auth.contract.ts:9>); [src/types/auth.ts:2](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/types/auth.ts:2>) | DOC-03 reports 19 undocumented exports; props interfaces are private and their members are undocumented. | Document all declarations and methods using the canonical examples; export/document component props and add hook @returns/@example and method @param/@returns/@throws where applicable. |
| A06 | warn | Standard | [src/pages/LoginPage.tsx:9](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/LoginPage.tsx:9>); [src/pages/RegisterPage.tsx:8](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/RegisterPage.tsx:8>); [src/hooks/useLogin.ts:4](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/hooks/useLogin.ts:4>); [src/services/auth.service.ts:6](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/services/auth.service.ts:6>); [src/mocks/auth.mock.ts:7](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/mocks/auth.mock.ts:7>) | Fourteen imports ascend with `../` instead of the requested `@/` alias. These cover pages, hooks, services and mocks. | Use @/ for cross-layer imports. Adjacent `./` imports in barrels are a separate convention and are permitted by the standard. |
| A07 | warn | Standard | [src/components/auth/AuthAlert.tsx:28](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthAlert.tsx:28>); [src/components/auth/AuthForm.tsx:38](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthForm.tsx:38>); [src/components/auth/AuthLayout.tsx:28](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthLayout.tsx:28>); [src/components/auth/LogoutConfirmModal.tsx:9](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/LogoutConfirmModal.tsx:9>); [src/components/auth/PasswordField.tsx:16](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/PasswordField.tsx:16>); [src/pages/LoginPage.tsx:19](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/LoginPage.tsx:19>); [src/pages/RegisterPage.tsx:20](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/RegisterPage.tsx:20>) | Seven default component/page exports violate the named-export convention (CONV-01). | Convert to named exports and update the auth barrel/router imports; keep App's permitted default export. |
| A08 | warn | Standard | [src/components/auth/AuthAlert.tsx:13](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthAlert.tsx:13>); [src/components/auth/AuthForm.tsx:64](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthForm.tsx:64>) | `alertStyles` has no Record<AlertType, ...> annotation; field status styling is implemented in a function instead of the existing typed TextField status map. | Reuse Callout/TextField typed maps; any new variant map must be an exhaustive Record with complete literal classes. |
| A09 | warn | Standard | [src/mocks/auth.mock.ts:13](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/mocks/auth.mock.ts:13>); [src/pages/LoginPage.tsx:78](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/LoginPage.tsx:78>); [src/pages/RegisterPage.tsx:109](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/RegisterPage.tsx:109>); [src/navigation/ShellRoute.tsx:90](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/navigation/ShellRoute.tsx:90>) | Spanish comments remain (DOC-04: 6 reported hits), and ShellRoute retains the complete old implementation as commented code. The scanner does not include every JSX/commented-out instance. | Translate explanatory comments to English and remove the commented-out implementation. Keep Spanish product copy. |
| A10 | warn | Standard | [src/pages/LoginPage.tsx:22](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/LoginPage.tsx:22>); [src/pages/LoginPage.tsx:36](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/LoginPage.tsx:36>); [src/pages/RegisterPage.tsx:21](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/RegisterPage.tsx:21>); [src/pages/RegisterPage.tsx:38](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/RegisterPage.tsx:38>) | Form values, validation and orchestration are owned by pages rather than form/use-case hooks; validation is also repeated in the mock. | Move form state/validation/submission into focused hooks and pure validators; leave pages composing props and navigation outcomes. |
| A11 | warn | Standard | [src/hooks/useLogin.ts:25](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/hooks/useLogin.ts:25>); [src/hooks/useRegister.ts:25](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/hooks/useRegister.ts:25>); [src/hooks/useLogout.ts:17](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/hooks/useLogout.ts:17>) | Mutations update state after awaiting without an unmount/current-request guard. Returned callbacks are recreated each render, and the public loading flag is named `loading` rather than isSubmitting. | Guard obsolete completions, stabilize callbacks passed to children, and expose the standard mutation state. Test unmount and repeated submission behavior. |
| A12 | warn | Standard | [src/hooks/useLogin.ts:20](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/hooks/useLogin.ts:20>); [src/hooks/useRegister.ts:20](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/hooks/useRegister.ts:20>); [src/hooks/useLogout.ts:13](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/hooks/useLogout.ts:13>); [src/services/auth.service.ts:26](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/services/auth.service.ts:26>) | No added feature tests. The 9 files/20 passing tests are inherited; auth services, hooks, forms, pages and logout transitions are untested. TEST-02 only lists the hooks and misses the class-based service. | Add behavior tests for mock contract errors, mutations, validation, password toggles, duplicate-email recovery, success navigation and logout cancel/confirm. |
| A13 | error | Flow | [src/pages/RegisterPage.tsx:108](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/RegisterPage.tsx:108>); [src/pages/RegisterPage.tsx:171](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/RegisterPage.tsx:171>) | Successful registration clears passwords and shows a test-success message but never navigates. Required transition 1 → 3.1 is missing. | Navigate to the real CoursesPage in the new teacher's empty-course scenario; ensure the scenario is preserved by mock/session state. |
| A14 | error | Flow | [src/components/auth/AuthForm.tsx:88](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthForm.tsx:88>); [src/components/auth/AuthForm.tsx:254](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthForm.tsx:254>); [src/pages/RegisterPage.tsx:182](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/RegisterPage.tsx:182>); [src/mocks/auth.mock.ts:59](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/mocks/auth.mock.ts:59>) | Duplicate email becomes a generic top alert. The main CTA remains Crear cuenta; there is no dedicated Usar otro correo recovery, and the affected email is not marked invalid from the service error. | Expose a typed duplicate-email state: mark the email field, offer Iniciar sesión → /iniciar-sesion and Usar otro correo → registration, with values/errors managed deliberately. |
| A15 | error | Standard | [src/components/auth/LogoutConfirmModal.tsx:15](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/LogoutConfirmModal.tsx:15>); [src/components/auth/LogoutConfirmModal.tsx:18](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/LogoutConfirmModal.tsx:18>) | Custom logout modal has no Escape handler/dismiss hook or focus management; aria-modal alone does not implement modal keyboard behavior. | Compose the existing Modal/useDismiss path, preserve an accessible title/description, verify Escape and focus return, and verify keyboard focus containment. |
| A16 | warn | Redundancy | [src/components/auth/AuthAlert.tsx:28](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthAlert.tsx:28>); [src/components/auth/AuthLayout.tsx:36](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthLayout.tsx:36>); [src/components/auth/PasswordField.tsx:16](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/PasswordField.tsx:16>); [src/components/auth/LogoutConfirmModal.tsx:9](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/LogoutConfirmModal.tsx:9>); [src/mocks/auth.mock.ts:27](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/mocks/auth.mock.ts:27>) | Duplicates Callout, Logo, field/icon primitives, Modal and the shared respond delay helper. Login/register hooks also repeat the same mutation state/error pattern. | Reuse existing blocks; generalize only password-field support, dismissible callout support and the auth layout when needed. Use respond from mocks/scenario with an intentional mock timing contract. |
| A17 | error | Integration | [src/navigation/AppRouter.tsx:24](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/navigation/AppRouter.tsx:24>); [src/navigation/AppRouter.tsx:35](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/navigation/AppRouter.tsx:35>) | Root and unknown routes still redirect to /cursos, so the initial-route = sign-in decision is unmet. This behavior is inherited from develop/integration. | Set the root initial redirect to ROUTES.signIn and define the unknown-route policy explicitly; test initial load after merging the real pages. |
| A18 | warn | Integration | [src/navigation/ShellRoute.tsx:28](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/navigation/ShellRoute.tsx:28>); [src/navigation/ShellRoute.tsx:59](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/navigation/ShellRoute.tsx:59>); [src/hooks/useLogout.ts:22](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/hooks/useLogout.ts:22>); [src/pages/LoginPage.tsx:75](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/LoginPage.tsx:75>) | Auth overrides the shell's signOut callback while the integration hook still exposes its direct-navigation signOut. Auth responses are discarded and the sidebar profile still comes from the fixed teacher service. | Give logout orchestration one owner, retain course switching, and map mock session identity to useCurrentTeacher. Clear session-specific active-course state on successful logout; no real API/auth implementation is required by this UI audit. |
| A19 | warn | Design | [src/components/auth/AuthLayout.tsx:34](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthLayout.tsx:34>); [src/components/auth/AuthLayout.tsx:36](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthLayout.tsx:36>); [src/components/auth/AuthForm.tsx:74](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthForm.tsx:74>) | Frame 01: code uses equal desktop columns (640/640 at 1280) instead of Figma's 560/720 split; recreates the logo as a letter K and features as Unicode; misses the Docente strip. Uses separate Nombre/Apellido plus Confirmar contraseña instead of Nombre completo/email/password. Headings, hero copy, domain hint, icons and password help do not match. | Match 01_registro.png using layout/UI primitives and token typography; retain the API request shape through a form adapter rather than adding unrequested controls. |
| A20 | warn | Design | [src/components/auth/PasswordField.tsx:26](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/PasswordField.tsx:26>); [src/components/auth/PasswordField.tsx:72](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/PasswordField.tsx:72>); [src/components/auth/AuthForm.tsx:239](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthForm.tsx:239>) | Frame 01.1: visibility toggle exists but uses custom SVG eyes and a second confirmation-password field; the same layout/copy differences as 01 persist. | Match 01.1_registro_contrasena_visible.png; use Material Symbols and show/hide the single designed password field without losing its value. |
| A21 | error | Design | [src/components/auth/AuthForm.tsx:88](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthForm.tsx:88>); [src/components/auth/AuthForm.tsx:254](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthForm.tsx:254>) | Frame 01.2: lacks the inline email error box and field border, exact duplicate-email copy and the main Iniciar sesión CTA shown in the frame. | Implement the dedicated state in A14 and match 01.2_registro_correo_ya_registrado.png; follow REFERENCE.md for the additional Usar otro correo transition. |
| A22 | warn | Design | [src/pages/LoginPage.tsx:85](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/LoginPage.tsx:85>); [src/components/auth/AuthForm.tsx:74](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthForm.tsx:74>); [src/components/auth/AuthAlert.tsx:46](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthAlert.tsx:46>) | Frame 02: hero/form titles are Bienvenido a Kalibra / Bienvenido de nuevo instead of the designed hero and Inicia sesión; generic one-line alert omits the designed heading plus Revisa tus datos e inténtalo nuevamente supporting text. Email label/domain hint, role strip and Material Symbols are missing. | Match 02_inicio_sesion.png, including the error notice and Spanish copy; use a Callout composition that supports heading/body/dismiss. |
| A23 | warn | Design | [src/components/auth/PasswordField.tsx:62](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/PasswordField.tsx:62>); [src/components/auth/AuthAlert.tsx:46](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthAlert.tsx:46>) | Frame 02.1: error + visible-password state is possible, but it inherits 02's wrong notice composition, missing field icons/role strip and custom eye SVG. | Match 02.1_inicio_sesion_contrasena_visible.png; preserve error notice when toggling visibility. |
| A24 | warn | Design | [src/pages/LoginPage.tsx:121](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/LoginPage.tsx:121>); [src/pages/LoginPage.tsx:126](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/LoginPage.tsx:126>); [src/components/auth/AuthForm.tsx:74](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/AuthForm.tsx:74>) | Frame 02.2: dismissal exists through reset, but the form heading and footer use Bienvenido de nuevo / ¿Todavía no tienes una cuenta? Crear cuenta rather than Inicia sesión / ¿No tienes una cuenta? Regístrate. Role strip, email/domain label and action arrow are absent. | Match 02.2_inicio_sesion_aviso_descartado.png and keep notice dismissal independent of field values. |
| A25 | warn | Design | [src/pages/LoginPage.tsx:121](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/pages/LoginPage.tsx:121>); [src/components/auth/PasswordField.tsx:72](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/PasswordField.tsx:72>) | Frame 02.3: dismissed + visible-password state exists; the same 02.2 layout/copy differences and custom eye icon persist. | Match 02.3_aviso_descartado_contrasena_visible.png with the shared password primitive. |
| A26 | warn | Design | [src/components/auth/LogoutConfirmModal.tsx:27](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/LogoutConfirmModal.tsx:27>); [src/components/auth/LogoutConfirmModal.tsx:77](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/components/auth/LogoutConfirmModal.tsx:77>); [src/navigation/AppRouter.tsx:25](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/navigation/AppRouter.tsx:25>) | Frame 10: modal max-width is 420px versus the PNG's approximately 460px; question adds Deseas, icons/colors/shadow are custom. The branch background is a Courses placeholder, not frame 10's accepted course cards. | Match 10_confirmar_cierre_sesion.png in the integrated CoursesPage; reuse Modal/Button/Icon and document any required intrinsic size in the primitive. |
| A27 | warn | Integration | [README.md:11](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/README.md:11>); [src/mocks/auth.mock.ts:15](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/mocks/auth.mock.ts:15>); [src/hooks/useCurrentTeacher.ts:22](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__auth/src/hooks/useCurrentTeacher.ts:22>) | Auth introduces a different mock teacher than the existing course/sidebar teacher, but README adds no mock sign-in instructions. The inherited README claims React 19.3 while package.json declares ^19.2.0. | Document deliberately public mock sign-in usage without real credentials; keep the displayed teacher coherent and reconcile README versions with the installed lockfile. |

### Inspected frame index

Each frame has a concrete comparison in its corresponding design finding above.

| Finding | Opened reference PNG |
|---|---|
| A19 | [01_registro.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/01_registro.png>) |
| A20 | [01.1_registro_contrasena_visible.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/01.1_registro_contrasena_visible.png>) |
| A21 | [01.2_registro_correo_ya_registrado.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/01.2_registro_correo_ya_registrado.png>) |
| A22 | [02_inicio_sesion.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/02_inicio_sesion.png>) |
| A23 | [02.1_inicio_sesion_contrasena_visible.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/02.1_inicio_sesion_contrasena_visible.png>) |
| A24 | [02.2_inicio_sesion_aviso_descartado.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/02.2_inicio_sesion_aviso_descartado.png>) |
| A25 | [02.3_aviso_descartado_contrasena_visible.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/02.3_aviso_descartado_contrasena_visible.png>) |
| A26 | [10_confirmar_cierre_sesion.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/10_confirmar_cierre_sesion.png>) |

### Ordered refactor plan and acceptance criteria

1. [ ] Rebase/refactor against the accepted integration without replacing its router or shell. Acceptance: real Courses, Subtemas, GeneratedExercises, Invitations and CourseIndicators routes remain; auth pages replace only auth placeholders; root opens `/iniciar-sesion`. Course switching still works.
2. [ ] Consolidate primitives and token styling. Acceptance: frames **01, 01.1, 01.2, 02, 02.1, 02.2, 02.3 and 10** match their PNGs at 1280×832; use Plus Jakarta Sans and Material Symbols. The desktop auth split is 560/720 at the reference width, the role strip exists, registration uses the designed full-name/email/password controls, and small/medium layouts remain usable at approximately 360/768 widths.
3. [ ] Extract validation and typed form/mutation state. Acceptance: invalid registration stays on **01** with field errors; show password **01 ↔ 01.1** preserves values; duplicate email reaches **01.2**, `Iniciar sesión` opens sign-in and `Usar otro correo` returns to editable registration; valid registration reaches the real **3.1** empty Courses state. No test-success notice substitutes for navigation.
4. [ ] Complete sign-in state transitions. Acceptance: initial form is **02.2**; valid mock sign-in opens real **3** Courses; invalid credentials show **02**; dismissal returns **02.2**; visibility toggles **02 ↔ 02.1** and **02.2 ↔ 02.3**, preserving entered values and the correct notice state. Footer navigation stays inside the router.
5. [ ] Give logout/session display one owner. Acceptance: sidebar `Cerrar sesión` opens **10** over the current screen; Cancelar/No leaves that screen unchanged; confirm/Yes completes the mock logout and opens **02.2**. Escape and close behave intentionally, focus returns to the trigger, and no stale course/teacher identity is shown after a new mock sign-in.
6. [ ] Finish conventions, docs and tests. Acceptance: no new `../` cross-layer imports, default page/component exports, undocumented exports, Spanish code comments, copied primitives, undefined palette classes or feature-level arbitrary styles. Every new file has a git-derived author header. Test service errors, all auth hooks, fields, notice actions, pages and logout outcomes.
7. [ ] Run the final gates in a writable developer/CI checkout: `npm run lint`, `npx tsc -b`, `npm test`, `npm run build` and the exact audit script must all exit 0. Existing shared ARCH-05/test-coverage observations require a documented disposition; feature coverage must not be replaced by the 20 inherited tests.

### Automatic rules and complete failing-location inventory

| Rule | Severity | Result | Hits |
|---|---|---|---:|
| ARCH-01 | error | pass | 0 |
| ARCH-02 | error | pass | 0 |
| ARCH-03 | error | pass | 0 |
| ARCH-04 | error | pass | 0 |
| ARCH-05 | warn | FAIL | 7 |
| DATA-01 | error | pass | 0 |
| STYLE-01 | error | FAIL | 15 |
| STYLE-02 | error | FAIL | 3 |
| STYLE-03 | warn | FAIL | 9 |
| STYLE-04 | error | pass | 0 |
| STYLE-05 | warn | pass | 0 |
| STYLE-06 | error | pass | 0 |
| TS-01 | error | pass | 0 |
| TS-02 | warn | pass | 0 |
| CONV-01 | warn | FAIL | 7 |
| CONV-02 | warn | pass | 0 |
| CONV-03 | warn | pass | 0 |
| DOC-01 | error | pass | 0 |
| DOC-02 | error | FAIL | 15 |
| DOC-03 | error | FAIL | 19 |
| DOC-04 | warn | FAIL | 6 |
| TEST-01 | error | pass | 0 |
| TEST-02 | warn | FAIL | 4 |
| SEC-01 | error | pass | 0 |

The 16 arbitrary-value locations reported inside UI/layout are inherited permitted intrinsic-dimension information, not new feature failures. Dynamic percentage width alone is allowed: in monitoring, STYLE-03's StudentMasteryTable width is not itself a fixed-style violation; the priority legend and segment colors are.

<details>
<summary>ARCH-05 — every layer folder has a README.md (7 hits)</summary>

```text
src/components/README.md missing
src/hooks/README.md missing
src/services/README.md missing
src/context/README.md missing
src/utils/README.md missing
src/types/README.md missing
src/pages/README.md missing
```

</details>

<details>
<summary>STYLE-01 — no hex / rgb colors outside the tokens file (15 hits)</summary>

```text
src/components/auth/AuthForm.tsx:257  #4738ed
src/components/auth/AuthLayout.tsx:34  #f8f7fc
src/components/auth/AuthLayout.tsx:35  #4738ed
src/components/auth/LogoutConfirmModal.tsx:20  rgba(
src/components/auth/LogoutConfirmModal.tsx:32  #FFFFFF
src/components/auth/LogoutConfirmModal.tsx:33  rgba(
src/components/auth/LogoutConfirmModal.tsx:44  #FEE4E2
src/components/auth/LogoutConfirmModal.tsx:45  #D92D20
src/components/auth/LogoutConfirmModal.tsx:74  #101828
src/components/auth/LogoutConfirmModal.tsx:87  #344054
src/components/auth/LogoutConfirmModal.tsx:115  #475467
src/components/auth/LogoutConfirmModal.tsx:138  #EEF2FF
src/components/auth/LogoutConfirmModal.tsx:139  #101828
src/components/auth/LogoutConfirmModal.tsx:160  #C9161D
src/components/auth/LogoutConfirmModal.tsx:161  #FFFFFF
```

</details>

<details>
<summary>STYLE-02 — no arbitrary values outside components/ui and components/layout (3 hits)</summary>

```text
src/components/auth/AuthLayout.tsx:35  [320px]
src/components/auth/AuthLayout.tsx:76  [500px]
src/components/auth/LogoutConfirmModal.tsx:27  [420px]
```

</details>

<details>
<summary>STYLE-03 — no inline styles in pages and feature components (9 hits)</summary>

```text
src/components/auth/LogoutConfirmModal.tsx:20
src/components/auth/LogoutConfirmModal.tsx:28
src/components/auth/LogoutConfirmModal.tsx:39
src/components/auth/LogoutConfirmModal.tsx:70
src/components/auth/LogoutConfirmModal.tsx:86
src/components/auth/LogoutConfirmModal.tsx:112
src/components/auth/LogoutConfirmModal.tsx:128
src/components/auth/LogoutConfirmModal.tsx:135
src/components/auth/LogoutConfirmModal.tsx:154
```

</details>

<details>
<summary>CONV-01 — no export default (except App) (7 hits)</summary>

```text
src/components/auth/AuthAlert.tsx:28
src/components/auth/AuthForm.tsx:38
src/components/auth/AuthLayout.tsx:28
src/components/auth/LogoutConfirmModal.tsx:9
src/components/auth/PasswordField.tsx:16
src/pages/LoginPage.tsx:19
src/pages/RegisterPage.tsx:20
```

</details>

<details>
<summary>DOC-02 — every file has a header with @packageDocumentation and @author (15 hits)</summary>

```text
src/components/auth/AuthAlert.tsx
src/components/auth/AuthForm.tsx
src/components/auth/AuthLayout.tsx
src/components/auth/LogoutConfirmModal.tsx
src/components/auth/PasswordField.tsx
src/components/auth/index.ts
src/hooks/useLogin.ts
src/hooks/useLogout.ts
src/hooks/useRegister.ts
src/mocks/auth.mock.ts
src/pages/LoginPage.tsx
src/pages/RegisterPage.tsx
src/services/auth.contract.ts
src/services/auth.service.ts
src/types/auth.ts
```

</details>

<details>
<summary>DOC-03 — every export has a TSDoc comment (19 hits)</summary>

```text
src/components/auth/AuthAlert.tsx:28  AuthAlert
src/components/auth/AuthForm.tsx:38  AuthForm
src/components/auth/AuthLayout.tsx:28  AuthLayout
src/components/auth/LogoutConfirmModal.tsx:9  LogoutConfirmModal
src/components/auth/PasswordField.tsx:16  PasswordField
src/hooks/useLogin.ts:20  useLogin
src/hooks/useLogout.ts:13  useLogout
src/hooks/useRegister.ts:20  useRegister
src/mocks/auth.mock.ts:47  authMock
src/pages/LoginPage.tsx:19  LoginPage
src/pages/RegisterPage.tsx:20  RegisterPage
src/services/auth.contract.ts:9  AuthServiceContract
src/services/auth.service.ts:26  authService
src/types/auth.ts:2  UserRole
src/types/auth.ts:4  RegisterRequest
src/types/auth.ts:12  LoginRequest
src/types/auth.ts:17  AuthUser
src/types/auth.ts:26  AuthResponse
src/types/auth.ts:31  AuthError
```

</details>

<details>
<summary>DOC-04 — comments are written in English (6 hits)</summary>

```text
src/mocks/auth.mock.ts:13
src/mocks/auth.mock.ts:14
src/pages/LoginPage.tsx:78
src/pages/RegisterPage.tsx:110
src/services/auth.contract.ts:16
src/services/auth.contract.ts:21
```

</details>

<details>
<summary>TEST-02 — hooks, services and utils have tests (4 hits)</summary>

```text
src/hooks/useLogin.ts
src/hooks/useLogout.ts
src/hooks/useRegister.ts
src/hooks/useShellNavigation.ts
```

</details>

TEST-02's file-based scan is incomplete: it can flag a type-only contract or miss a class-based service. The branch's missing behavior tests are assessed manually in its findings.

## feature/curricular-material

Worktree: `/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material`.

**Verdict: DOES NOT COMPLY.** The branch reuses many primitives and MaterialStatus correctly, but has two lint failures, a page-to-mock dependency, undocumented headers, stale aggregate state and missing designed upload/empty/processing states.

### Check failure diagnostics

First source-error line for lint, verbatim (both independent lint failures shown when present):

```text
  108:9  error  Error: Calling setState synchronously within an effect can trigger cascading renders
  84:14  error  Error: Calling setState synchronously within an effect can trigger cascading renders
```

`npx tsc -b` — exact first error line:

```text
error TS5033: Could not write file '/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/node_modules/.tmp/tsconfig.app.tsbuildinfo': EPERM: operation not permitted, mkdir '/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/node_modules/.tmp'.
```

A second TS5033 diagnostic names the same worktree's `node_modules/.tmp/tsconfig.node.tsbuildinfo` and the same denied mkdir. No source type error was emitted.

`npm test` — exact first error line:

```text
Error: EPERM: operation not permitted, mkdir '/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/node_modules/.vite-temp'
```

The earlier first failure diagnostic was also:

```text
failed to load config from /Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/vite.config.ts
```

`npm run build` — exact first error line:

```text
error TS5033: Could not write file '/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/node_modules/.tmp/tsconfig.app.tsbuildinfo': EPERM: operation not permitted, mkdir '/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/node_modules/.tmp'.
```

A second TS5033 diagnostic names the same worktree's `node_modules/.tmp/tsconfig.node.tsbuildinfo` and the same denied mkdir. No source type error was emitted.

Audit — exact first error-severity failure row:

```text
| DOC-02 | error | FAIL | 10 | every file has a header with @packageDocumentation and @author |
```

### Findings

| ID | Severity | Category | File:line | Finding | Required fix |
|---|---|---|---|---|---|
| C01 | error | Build | [src/components/curricular-material/UploadMaterialModal.tsx:108](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:108>) | ESLint react-hooks/set-state-in-effect rejects synchronous form resets in the effect. | Initialize a newly mounted/keyed upload form or reset in explicit open/replace actions; do not disable the lint rule. |
| C02 | error | Build | [src/hooks/useCurricularMaterials.ts:84](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/hooks/useCurricularMaterials.ts:84>) | ESLint react-hooks/set-state-in-effect rejects refreshMaterials from the effect because it synchronously sets loading/state. | Use the existing useResource pattern or a request-key-driven hook; keep all loading/error transitions lint-clean. |
| C03 | error | Standard | [src/pages/CurricularMaterialPage.tsx:33](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/pages/CurricularMaterialPage.tsx:33>); [src/pages/CurricularMaterialPage.tsx:65](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/pages/CurricularMaterialPage.tsx:65>) | Page imports SUBTOPICS directly from mocks. ARCH-01 passes because it checks services, not this mock-layer bypass. | Load course/subtopics through useCourseSubtopics or a feature page hook backed by coursesService. |
| C04 | error | Standard | [src/components/curricular-material/MaterialErrorModal.tsx:48](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/MaterialErrorModal.tsx:48>); [src/components/curricular-material/MaterialErrorModal.tsx:67](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/MaterialErrorModal.tsx:67>); [src/components/curricular-material/UploadMaterialModal.tsx:246](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:246>); [src/components/curricular-material/MaterialTable.tsx:190](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/MaterialTable.tsx:190>) | References undefined theme utilities: border-border-subtle, bg-surface-secondary, bg-danger-subtle and text-content-tertiary; also rounded-xl is outside the reset radius scale. Automatic color/arbitrary checks miss undefined names. | Map to line-subtle/default, surface-background/card, danger-container and content-muted, and use defined radius tokens. Check actual emitted styles. |
| C05 | error | Standard | [src/pages/CurricularMaterialPage.tsx:2](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/pages/CurricularMaterialPage.tsx:2>); [src/hooks/useCurricularMaterials.ts:2](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/hooks/useCurricularMaterials.ts:2>); [src/components/curricular-material/index.ts:2](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/index.ts:2>) | All 10 added files have missing @author (some also lack complete headers); DOC-02 has 10 hits. | Complete each header from git creator identity and canonical English module documentation, including the barrel. |
| C06 | error | Standard | [src/components/curricular-material/UploadMaterialModal.tsx:34](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:34>) | UploadMaterialModalProps has no declaration TSDoc; DOC-03 has 1 hit. | Document the exported interface and every property, including the callback result contract. |
| C07 | warn | Standard | [src/hooks/useCurricularMaterials.ts:32](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/hooks/useCurricularMaterials.ts:32>); [src/services/curricularMaterial.service.ts:38](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/services/curricularMaterial.service.ts:38>); [src/types/curricularMaterial.ts:70](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/types/curricularMaterial.ts:70>); [src/components/curricular-material/MaterialTable.tsx:26](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/MaterialTable.tsx:26>) | Existing comments do not meet the full canonical shape: hook lacks @returns/@example; exported request/stats/props members lack descriptions; service methods omit applicable throws documentation. | Complete semantic member docs, hook result/example, and service/error contracts rather than only satisfying header presence. |
| C08 | warn | Standard | [src/hooks/useCurricularMaterials.ts:37](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/hooks/useCurricularMaterials.ts:37>); [src/services/curricularMaterial.service.ts:78](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/services/curricularMaterial.service.ts:78>); [src/components/curricular-material/UploadMaterialModal.tsx:47](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:47>) | No added tests for service, data hook, validators, table, dialogs or page. All 20 passing tests are inherited. | Test loading/error/empty/race cases, upload validation, replacement, callbacks and both designed upload flows; type-only contracts do not require their own tests. |
| C09 | error | Standard | [src/hooks/useCurricularMaterials.ts:49](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/hooks/useCurricularMaterials.ts:49>); [src/hooks/useCurricularMaterials.ts:66](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/hooks/useCurricularMaterials.ts:66>); [src/hooks/useCurricularMaterials.ts:83](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/hooks/useCurricularMaterials.ts:83>) | No cleanup or request-identity guard around course loads. A delayed response for the previous course can overwrite the new course's materials/stats, and unmount still permits setters. | Reuse useResource or guard by request key with cleanup; keep mutation refresh tied to the submitted course. Test an out-of-order two-course response. |
| C10 | warn | Standard | [src/components/curricular-material/UploadMaterialModal.tsx:47](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:47>); [src/components/curricular-material/UploadMaterialModal.tsx:98](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:98>); [src/components/curricular-material/UploadMaterialModal.tsx:163](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:163>) | Feature component owns validation, form state and async upload-error orchestration, and implements state styles with a nested ternary. | Put upload use-case state and pure file validation in hooks/utils; pass values/errors/actions to a presentational modal. Use an exhaustive typed state map if a new UI primitive needs state variants. |
| C11 | warn | Standard | [src/components/curricular-material/MaterialErrorModal.tsx:98](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/MaterialErrorModal.tsx:98>); [src/components/curricular-material/MaterialErrorModal.tsx:106](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/MaterialErrorModal.tsx:106>); [src/components/curricular-material/MaterialTable.tsx:182](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/MaterialTable.tsx:182>); [src/components/curricular-material/UploadMaterialModal.tsx:293](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:293>) | Raw action buttons bypass Button/IconButton. The hidden file input is not a violation by itself: there is no existing file-picker primitive. | Replace actions with primitives; generalize FileDropzone/FileSelection only for the missing file input interaction, preserving a native accessible input internally. |
| C12 | warn | Redundancy | [src/components/curricular-material/MaterialTable.tsx:35](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/MaterialTable.tsx:35>); [src/components/curricular-material/UploadMaterialModal.tsx:79](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:79>); [src/components/curricular-material/UploadMaterialModal.tsx:47](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:47>); [src/mocks/curricularMaterial.mock.ts:76](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/mocks/curricularMaterial.mock.ts:76>); [src/mocks/curricularMaterial.mock.ts:147](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/mocks/curricularMaterial.mock.ts:147>) | File-size formatting is repeated; extension/size validation is duplicated in UI/mock and partly duplicates MATERIAL_UPLOAD_CONFIG. Local respond duplicates mocks/scenario.ts and changes cloning/timing semantics. | Share pure file metadata/validation helpers and constraints; use the existing respond/isEmptyScenario. Preserve the existing MaterialStatus/MaterialStatusChip reuse. |
| C13 | error | Integration | [src/mocks/curricularMaterial.mock.ts:171](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/mocks/curricularMaterial.mock.ts:171>); [src/mocks/curricularMaterial.mock.ts:182](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/mocks/curricularMaterial.mock.ts:182>); [src/types/course.ts:57](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/types/course.ts:57>) | Upload updates only the material collection, leaving course.materialCount and subtopic.materialStatus unchanged. An in-memory probe uploading to course-2 returned processing material while the course count remained 0 and subtopic status missing. | Derive or synchronize course/subtopic aggregates from the same mock material store; refresh consumers so course cards, Subtemas and exercise/indicator entry points agree. |
| C14 | warn | Integration | [src/navigation/AppRouter.tsx:13](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/navigation/AppRouter.tsx:13>); [src/navigation/AppRouter.tsx:24](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/navigation/AppRouter.tsx:24>) | Read-only three-way merge against feature/ui-integration detects an AppRouter conflict. This branch still contains other features' develop placeholders. | Keep the accepted router and replace only the material placeholder with CurricularMaterialPage; preserve course/exercise/invitation/indicator pages and auth/monitoring routes. |
| C15 | error | Flow | [src/mocks/curricularMaterial.mock.ts:85](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/mocks/curricularMaterial.mock.ts:85>); [src/pages/CurricularMaterialPage.tsx:43](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/pages/CurricularMaterialPage.tsx:43>); [src/pages/CurricularMaterialPage.tsx:128](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/pages/CurricularMaterialPage.tsx:128>) | Material mocks ignore ?vacio while course loading honors it. Probe of course-1 with ?vacio still returned 3 materials; header upload can be disabled while stale material rows render. | Use one empty/new-teacher scenario across course/material services. Distinguish teacher-without-courses from an existing course with zero materials. |
| C16 | warn | Flow | [src/components/curricular-material/UploadMaterialModal.tsx:264](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:264>); [src/components/curricular-material/UploadMaterialModal.tsx:293](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:293>); [src/components/curricular-material/UploadMaterialModal.tsx:204](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:204>) | Unsupported-file recovery can reopen the same picker or remove the file, but never presents the wireflow's Seleccionar otro archivo action. Replacement changes the title to Reemplazar material instead of returning to the designed Cargar material state. | Give invalid-file recovery the required action/copy and reset state intentionally; keep replacement subtopic selected and return to the designed upload form. See reference ambiguity notes. |
| C17 | warn | Design | [src/components/curricular-material/MaterialTable.tsx:131](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/MaterialTable.tsx:131>); [src/components/curricular-material/MaterialTable.tsx:143](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/MaterialTable.tsx:143>); [src/pages/CurricularMaterialPage.tsx:187](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/pages/CurricularMaterialPage.tsx:187>) | Frame 05: every file uses description with a primary box rather than PDF/image-specific icons and the red failed-file box. Table copy uses text-sm instead of token text styles; Ver motivo is a bare text button; ingestion-error notice is generic rather than naming Programación Dinámica. | Match 05_material_curricular.png, including icons/tones, table columns, metadata scale, tonal action and the subtopic-specific error callout. |
| C18 | error | Design | [src/pages/CurricularMaterialPage.tsx:141](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/pages/CurricularMaterialPage.tsx:141>); [src/pages/CurricularMaterialPage.tsx:173](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/pages/CurricularMaterialPage.tsx:173>) | Frame 05.1: all three zero-value StatCards render above the empty card, although Figma shows only the large empty card and formats callout. Empty icon/description differ. | Match 05.1_material_sin_material.png: omit stats when the course has no material, use upload_file and the exact empty-state copy/action. |
| C19 | warn | Design | [src/components/curricular-material/UploadMaterialModal.tsx:204](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:204>); [src/components/curricular-material/UploadMaterialModal.tsx:251](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:251>); [src/components/curricular-material/UploadMaterialModal.tsx:278](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:278>) | Frame 05.2: modal description differs; select lacks its leading subtopic icon; dropzone uses upload_file rather than cloud_upload. Selected-file row lacks PDF/type/page metadata and Válido chip; extra Archivo label and different spacing alter the composition. | Match 05.2_cargar_material.png using the shared select/icon/chip/file primitives, with legitimate metadata from the fixture or processing response. |
| C20 | error | Design | [src/components/curricular-material/UploadMaterialModal.tsx:278](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:278>); [src/components/curricular-material/UploadMaterialModal.tsx:309](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:309>) | Frame 05.3: invalid file row retains neutral styling and no No soportado chip; message differs and uses nonexistent bg-danger-subtle. Submit is correctly disabled via canSubmit. | Match 05.3_formato_no_soportado.png: danger file state, unsupported chip, exact notice, disabled submission and working recovery. |
| C21 | error | Design | [src/pages/CurricularMaterialPage.tsx:187](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/pages/CurricularMaterialPage.tsx:187>); [src/components/curricular-material/MaterialTable.tsx:165](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/MaterialTable.tsx:165>); [src/components/ui/MaterialStatusChip.tsx:15](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/ui/MaterialStatusChip.tsx:15>) | Frame 05.4: no persistent extracting-content callout for processing records. Processing uses inherited En ingestión/schedule instead of frame Pendiente/hourglass; upload date becomes a calendar date rather than Hoy, 10:05, and uploaded PDFs have no page metadata. | Match 05.4_material_en_ingestion.png; support a shared contextual status label/icon without breaking other uses; format dates from controlled fixtures and show a persistent processing callout alongside the toast. |
| C22 | error | Design | [src/components/curricular-material/MaterialErrorModal.tsx:43](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/MaterialErrorModal.tsx:43>); [src/components/curricular-material/MaterialErrorModal.tsx:89](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/MaterialErrorModal.tsx:89>) | Frame 05.5: title is Motivo del error, missing the danger header icon and filename/subtopic/date subtitle. The designed MOTIVO box and three ingestion recommendations are replaced by generic text; invalid background/border tokens compound the mismatch. | Match 05.5_motivo_del_error.png, including No pudimos procesar el material, exact reason text and the 300 ppp/reflections/one-subtopic checklist. |
| C23 | warn | Design | [src/components/curricular-material/UploadMaterialModal.tsx:115](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:115>); [src/components/curricular-material/UploadMaterialModal.tsx:210](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:210>) | Frame 05.6: options only provide labels and status chips. Missing filename/needs-replacement/no-material descriptions and trigger icon, despite Select supporting description/icon. | Match 05.6_selector_subtema.png; pass option descriptions and account_tree icon through the existing Select API. |
| C24 | warn | Design | [src/components/curricular-material/UploadMaterialModal.tsx:108](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:108>); [src/components/curricular-material/UploadMaterialModal.tsx:205](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:205>) | Frame 05.7: initializes to an empty disabled placeholder instead of the displayed Espacios Vectoriales selection; description/dropzone icon/copy differ and the backdrop inherits the unwanted zero stats. | Match 05.7_cargar_material_algebra.png with the intended first subtopic selected when appropriate and an empty-course backdrop matching 05.1. |
| C25 | warn | Design | [src/components/curricular-material/UploadMaterialModal.tsx:120](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:120>); [src/components/curricular-material/UploadMaterialModal.tsx:210](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:210>) | Frame 05.8: all four subtopics/chips are available but Sin material cargado secondary lines and the leading subtopic icon are omitted. | Match 05.8_algebra_selector_subtema.png, preserving selected highlighting/check and all four options. |
| C26 | warn | Design | [src/components/curricular-material/UploadMaterialModal.tsx:256](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:256>); [src/components/curricular-material/UploadMaterialModal.tsx:278](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/curricular-material/UploadMaterialModal.tsx:278>) | Frame 05.9: selecting a valid file leaves Arrastra tu archivo aquí, picker button and the same tall dropzone instead of Archivo listo para subir. The row lacks Válido and PDF/page metadata; Quitar archivo is implemented. | Match 05.9_algebra_archivo_seleccionado.png and make remove return to 05.7 without losing the chosen subtopic. |
| C27 | error | Design | [src/pages/CurricularMaterialPage.tsx:187](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/pages/CurricularMaterialPage.tsx:187>); [src/pages/CurricularMaterialPage.tsx:106](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/pages/CurricularMaterialPage.tsx:106>); [src/components/ui/MaterialStatusChip.tsx:15](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__curricular-material/src/components/ui/MaterialStatusChip.tsx:15>) | Frame 05.10: stats/table/toast can appear after upload, but the persistent extracting-content callout is absent and the processing label/icon/date/metadata differ as in 05.4. | Match 05.10_material_algebra_en_ingestion.png with 1/0/0 counters, one pending row, persistent subtopic-specific processing notice and the toast. |

### Inspected frame index

Each frame has a concrete comparison in its corresponding design finding above.

| Finding | Opened reference PNG |
|---|---|
| C17 | [05_material_curricular.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/05_material_curricular.png>) |
| C18 | [05.1_material_sin_material.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/05.1_material_sin_material.png>) |
| C19 | [05.2_cargar_material.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/05.2_cargar_material.png>) |
| C20 | [05.3_formato_no_soportado.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/05.3_formato_no_soportado.png>) |
| C21 | [05.4_material_en_ingestion.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/05.4_material_en_ingestion.png>) |
| C22 | [05.5_motivo_del_error.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/05.5_motivo_del_error.png>) |
| C23 | [05.6_selector_subtema.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/05.6_selector_subtema.png>) |
| C24 | [05.7_cargar_material_algebra.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/05.7_cargar_material_algebra.png>) |
| C25 | [05.8_algebra_selector_subtema.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/05.8_algebra_selector_subtema.png>) |
| C26 | [05.9_algebra_archivo_seleccionado.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/05.9_algebra_archivo_seleccionado.png>) |
| C27 | [05.10_material_algebra_en_ingestion.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/05.10_material_algebra_en_ingestion.png>) |

### Ordered refactor plan and acceptance criteria

1. [ ] Integrate the route on top of accepted work and fix both lint failures. Acceptance: `/cursos/:courseId/material` renders the new page; every previously accepted page remains; upload opens without effect-driven reset errors.
2. [ ] Move course/subtopic loading and upload state behind hooks, with a single material mock store and shared validators. Acceptance: pages import no services/mocks; old-course responses cannot overwrite new-course state; the real newly created course/subtopics appear without fixture-specific assumptions. Uploading/replacing updates material rows, course count and Subtemas material status consistently.
3. [ ] Match the populated and replacement sequence. Acceptance: **05 → 05.2 → 05.6** exposes all four subtopics with descriptions/status; unsupported file reaches **05.3**, records nothing and disables submit; selecting another valid file returns to the valid upload state; `Subir material` reaches **05.4** with the replacement pending, error count 0, persistent processing notice and toast. **05 → Ver motivo → 05.5 → Reemplazar archivo → 05.2** preserves the affected subtopic.
4. [ ] Match the empty-course sequence. Acceptance: course-2 (or a newly created course) renders **05.1**, with no zero-stat row; `Cargar primer material` opens **05.7**; **05.8** lists all four Algebra subtopics; valid selection reaches **05.9** with ready copy, legitimate file metadata and valid chip; `Quitar archivo` returns **05.7**; submit reaches **05.10** with 1/0/0 stats, one pending row, notice and toast.
5. [ ] Verify all integration entry points. Acceptance: sidebar Material curricular, Subtemas `Cargar material`, GeneratedExercises `Cargar material`, and CourseIndicators `Cargar material` all open `courseRoutes.material(theCorrectCourseId)`; returning to courses/subtopics does not contradict the uploaded material state. Do not add real network/ingestion behavior for this mock UI scope.
6. [ ] Consolidate UI/formatting and documentation. Acceptance: every listed frame **05–05.10** matches the corresponding PNG at 1280×832 and remains usable at 360/768; no undefined tokens, feature-layer raw actions or undocumented exports/headers; option descriptions use the existing Select API. Tests cover file format/size/empty boundary cases, replacement, empty states, errors, upload lifecycle and race handling.
7. [ ] Require all five normal gates to exit 0 in writable CI/developer execution: `npm run lint`, `npx tsc -b`, `npm test`, `npm run build`, audit script. Confirm feature tests ran, not just inherited tests, and explicitly dispose of inherited warnings.

### Automatic rules and complete failing-location inventory

| Rule | Severity | Result | Hits |
|---|---|---|---:|
| ARCH-01 | error | pass | 0 |
| ARCH-02 | error | pass | 0 |
| ARCH-03 | error | pass | 0 |
| ARCH-04 | error | pass | 0 |
| ARCH-05 | warn | FAIL | 7 |
| DATA-01 | error | pass | 0 |
| STYLE-01 | error | pass | 0 |
| STYLE-02 | error | pass | 0 |
| STYLE-03 | warn | pass | 0 |
| STYLE-04 | error | pass | 0 |
| STYLE-05 | warn | pass | 0 |
| STYLE-06 | error | pass | 0 |
| TS-01 | error | pass | 0 |
| TS-02 | warn | pass | 0 |
| CONV-01 | warn | pass | 0 |
| CONV-02 | warn | pass | 0 |
| CONV-03 | warn | pass | 0 |
| DOC-01 | error | pass | 0 |
| DOC-02 | error | FAIL | 10 |
| DOC-03 | error | FAIL | 1 |
| DOC-04 | warn | pass | 0 |
| TEST-01 | error | pass | 0 |
| TEST-02 | warn | FAIL | 4 |
| SEC-01 | error | pass | 0 |

The 16 arbitrary-value locations reported inside UI/layout are inherited permitted intrinsic-dimension information, not new feature failures. Dynamic percentage width alone is allowed: in monitoring, STYLE-03's StudentMasteryTable width is not itself a fixed-style violation; the priority legend and segment colors are.

<details>
<summary>ARCH-05 — every layer folder has a README.md (7 hits)</summary>

```text
src/components/README.md missing
src/hooks/README.md missing
src/services/README.md missing
src/context/README.md missing
src/utils/README.md missing
src/types/README.md missing
src/pages/README.md missing
```

</details>

<details>
<summary>DOC-02 — every file has a header with @packageDocumentation and @author (10 hits)</summary>

```text
src/components/curricular-material/MaterialErrorModal.tsx
src/components/curricular-material/MaterialTable.tsx
src/components/curricular-material/UploadMaterialModal.tsx
src/components/curricular-material/index.ts
src/hooks/useCurricularMaterials.ts
src/mocks/curricularMaterial.mock.ts
src/pages/CurricularMaterialPage.tsx
src/services/curricularMaterial.contract.ts
src/services/curricularMaterial.service.ts
src/types/curricularMaterial.ts
```

</details>

<details>
<summary>DOC-03 — every export has a TSDoc comment (1 hits)</summary>

```text
src/components/curricular-material/UploadMaterialModal.tsx:34  UploadMaterialModalProps
```

</details>

<details>
<summary>TEST-02 — hooks, services and utils have tests (4 hits)</summary>

```text
src/hooks/useCurricularMaterials.ts
src/hooks/useShellNavigation.ts
src/services/curricularMaterial.contract.ts
src/services/curricularMaterial.service.ts
```

</details>

TEST-02's file-based scan is incomplete: it can flag a type-only contract or miss a class-based service. The branch's missing behavior tests are assessed manually in its findings.

## feature/student-monitoring

Worktree: `/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring`.

**Verdict: DOES NOT COMPLY.** Two lint failures, page service/mock imports, extensive token violations and a fundamentally different student-list composition block readiness; several integration/data identities and transitions also diverge.

### Check failure diagnostics

First source-error line for lint, verbatim (both independent lint failures shown when present):

```text
  30:17  error  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components
  51:13  error  Error: Calling setState synchronously within an effect can trigger cascading renders
```

`npx tsc -b` — exact first error line:

```text
error TS5033: Could not write file '/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/node_modules/.tmp/tsconfig.app.tsbuildinfo': EPERM: operation not permitted, mkdir '/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/node_modules/.tmp'.
```

A second TS5033 diagnostic names the same worktree's `node_modules/.tmp/tsconfig.node.tsbuildinfo` and the same denied mkdir. No source type error was emitted.

`npm test` — exact first error line:

```text
Error: EPERM: operation not permitted, mkdir '/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/node_modules/.vite-temp'
```

The earlier first failure diagnostic was also:

```text
failed to load config from /Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/vite.config.ts
```

`npm run build` — exact first error line:

```text
error TS5033: Could not write file '/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/node_modules/.tmp/tsconfig.app.tsbuildinfo': EPERM: operation not permitted, mkdir '/Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/node_modules/.tmp'.
```

A second TS5033 diagnostic names the same worktree's `node_modules/.tmp/tsconfig.node.tsbuildinfo` and the same denied mkdir. No source type error was emitted.

Audit — exact first error-severity failure row:

```text
| ARCH-01 | error | FAIL | 2 | pages do not import services |
```

### Findings

| ID | Severity | Category | File:line | Finding | Required fix |
|---|---|---|---|---|---|
| S01 | error | Build | [src/components/student-monitoring/MasteryBadge.tsx:30](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/MasteryBadge.tsx:30>) | ESLint react-refresh/only-export-components rejects exporting getMasteryLevel next to a component. | Remove the duplicated helper in favor of utils/mastery; leave component modules exporting components/types. |
| S02 | error | Build | [src/pages/StudentsPage.tsx:51](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:51>) | ESLint react-hooks/set-state-in-effect rejects synchronous setStudents in the effect's no-course branch. | Move loading/state ownership into a lint-clean request-key hook; derive the no-course state without resetting state inside the effect. |
| S03 | error | Standard | [src/pages/GapMapPage.tsx:6](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:6>); [src/pages/GapMapPage.tsx:8](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:8>); [src/pages/StudentsPage.tsx:6](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:6>); [src/pages/StudentsPage.tsx:7](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:7>); [src/pages/StudentProgressPage.tsx:5](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentProgressPage.tsx:5>) | Two pages import/call studentMonitoringService (ARCH-01: 2 hits); all three pages read course/subtopic mocks directly. Pages own network try/catch and data transformations. | Use course/data/page hooks exclusively; load a coherent heatmap through a hook, and pass data/callbacks into presentational components. |
| S04 | error | Standard | [src/components/student-monitoring/StudentMasteryTable.tsx:14](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/StudentMasteryTable.tsx:14>); [src/components/student-monitoring/SubtopicPriorityList.tsx:93](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/SubtopicPriorityList.tsx:93>); [src/pages/GapMapPage.tsx:139](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:139>) | STYLE-01 reports 136 color hits. Feature tables/pages redefine the primary/content/danger/warning/success palette, including inline segment/legend colors. | Use the canonical semantic token palette and existing UI tone maps; inline styles may retain calculated widths, not fixed colors. |
| S05 | error | Standard | [src/components/student-monitoring/StudentMasteryTable.tsx:62](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/StudentMasteryTable.tsx:62>); [src/components/student-monitoring/StudentTable.tsx:63](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/StudentTable.tsx:63>); [src/pages/GapMapPage.tsx:272](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:272>); [src/pages/StudentsPage.tsx:126](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:126>) | STYLE-02 reports 128 hits (line-based, sometimes multiple values per hit) outside primitives: font sizes, radii, padding, shadows, fixed minimum widths and custom grids. | Replace with token typography/layout scales; put legitimate intrinsic table/heatmap dimensions inside reusable UI primitives. |
| S06 | error | Standard | [src/components/student-monitoring/MasteryBadge.tsx:54](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/MasteryBadge.tsx:54>); [src/pages/GapMapPage.tsx:105](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:105>); [src/pages/StudentProgressPage.tsx:42](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentProgressPage.tsx:42>) | MasteryBadge and error/navigation states use emerald/amber/red/slate/indigo palette utilities cleared by index.css. MasteryBadge is only barrel-exported and not consumed by these pages. | Use Chip + masteryTone with defined tokens; remove unused duplicate presentation code and ensure visible error states are actually styled. |
| S07 | error | Standard | [src/components/student-monitoring/MasteryBadge.tsx:2](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/MasteryBadge.tsx:2>); [src/hooks/useStudentMonitoring.ts:2](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/hooks/useStudentMonitoring.ts:2>); [src/types/studentMonitoring.ts:2](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/types/studentMonitoring.ts:2>); [src/pages/GapMapPage.tsx:1](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:1>) | DOC-02 reports 13 missing headers/@author; DOC-03 reports 10 missing exported declaration comments. | Complete every new module header and exported props/component/page declaration. Use git creator identity and the canonical examples; inventory below. |
| S08 | warn | Standard | [src/types/studentMonitoring.ts:21](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/types/studentMonitoring.ts:21>); [src/hooks/useStudentMonitoring.ts:25](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/hooks/useStudentMonitoring.ts:25>); [src/services/studentMonitoring.service.ts:41](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/services/studentMonitoring.service.ts:41>); [src/components/student-monitoring/StudentTable.tsx:99](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/StudentTable.tsx:99>); [src/pages/GapMapPage.tsx:136](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:136>) | Domain/props fields lack documentation; data hooks lack required result/examples; service methods omit parameters/results/errors. Spanish JSX comments remain although DOC-04 reports pass. | Document member semantics and hook/service contracts; translate comments to English. Identifiers are already English; preserve Spanish UI copy. |
| S09 | warn | Standard | [src/pages/StudentsPage.tsx:102](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:102>); [src/pages/StudentsPage.tsx:122](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:122>); [src/pages/GapMapPage.tsx:272](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:272>); [src/components/student-monitoring/StudentTable.tsx:153](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/StudentTable.tsx:153>) | Raw buttons/select/table structures duplicate primitives. Page audit reports 8 raw controls and misses feature-component controls. | Compose Button, Select, TableCard/TableHeader/TableRow, PageHeader, Avatar, StatCard, EmptyState, ProgressBar and Icon; a bespoke heatmap may use a generic accessible UI table extension. |
| S10 | warn | Standard | [src/components/student-monitoring/StudentTable.tsx:28](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/StudentTable.tsx:28>); [src/components/student-monitoring/StudentMasteryTable.tsx:10](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/StudentMasteryTable.tsx:10>); [src/components/student-monitoring/SubtopicPriorityList.tsx:10](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/SubtopicPriorityList.tsx:10>); [src/pages/GapMapPage.tsx:15](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:15>) | Visual level maps are repeated in if chains rather than exhaustive typed Record maps. MasteryBadge's Record is correct structurally, but its palette is not. | Use masteryTone for classification and centralized Record<Tone, ...> presentation maps within primitives; keep feature-specific priority text configurable. |
| S11 | warn | Standard | [src/hooks/useStudentMonitoring.ts:28](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/hooks/useStudentMonitoring.ts:28>); [src/hooks/useStudentMonitoring.ts:77](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/hooks/useStudentMonitoring.ts:77>); [src/hooks/useStudentMonitoring.ts:98](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/hooks/useStudentMonitoring.ts:98>); [src/hooks/useStudentMonitoring.ts:158](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/hooks/useStudentMonitoring.ts:158>) | useMonitoredStudents fetches stats only, always returns its initial [] students, exposes a raw setter and a non-memoized loader; it is not used by StudentsPage. Other hooks repeat useResource and have no refetch or transport cancellation; boolean cleanup does guard stale responses. | Replace the unused/incomplete hook with a real grouped-students resource hook; reuse useResource, expose stable actions/retry, and preserve cleanup. Add AbortSignal when real transport is introduced. |
| S12 | error | Standard | [src/pages/GapMapPage.tsx:49](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:49>); [src/pages/GapMapPage.tsx:70](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:70>); [src/pages/GapMapPage.tsx:120](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:120>) | Heatmap loads separately from the summary. A failed student/progress Promise.all is only console.error'd, leaving the page rendering a successful summary and empty heatmap without a visible failure/retry state. | Expose coordinated heatmap loading/error state from the page hook; fail visibly or render an explicit partial-data state with retry. Test one progress request rejecting. |
| S13 | warn | Standard | [src/hooks/useStudentMonitoring.ts:28](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/hooks/useStudentMonitoring.ts:28>); [src/services/studentMonitoring.service.ts:75](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/services/studentMonitoring.service.ts:75>); [src/pages/StudentsPage.tsx:11](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:11>) | No added service, hook, component, formatter or page tests. All 20 passing tests are inherited. TEST-02 includes the type-only contract, which does not itself need a test. | Add meaningful per-layer tests for grouped/empty data, mastery boundaries, errors/cleanup, routing, heatmap callbacks and each individual state; test services, not type declarations. |
| S14 | error | Flow | [src/pages/StudentsPage.tsx:104](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:104>); [src/navigation/AppRouter.tsx:30](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/navigation/AppRouter.tsx:30>); [src/navigation/AppRouter.tsx:38](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/navigation/AppRouter.tsx:38>) | Ver mapa de brechas goes to /cursos/:id/brechas. Only /cursos/:id/mapa-de-brechas exists, so the wildcard redirects to /cursos instead. | Use courseRoutes.gapMap(courseId), centralize the new student-progress URL builder, and test the actual destination page. |
| S15 | error | Flow | [src/pages/StudentsPage.tsx:15](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:15>); [src/pages/StudentsPage.tsx:222](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:222>); [src/mocks/studentMonitoring.mock.ts:137](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/mocks/studentMonitoring.mock.ts:137>) | Teacher-without-courses flow 8.4 → Crear mi primer curso is absent. Page always reads nonempty COURSES, mocks ignore ?vacio, and there is no create-course CTA. | Use the teacher's course hook/scenario; render 8.4 for zero courses and route its CTA to the accepted course creation flow. |
| S16 | error | Integration | [src/pages/StudentsPage.tsx:15](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:15>); [src/pages/StudentsPage.tsx:125](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:125>); [src/pages/StudentProgressPage.tsx:23](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentProgressPage.tsx:23>); [src/hooks/useShellNavigation.ts:41](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/hooks/useShellNavigation.ts:41>) | Local course selector is independent of ActiveCourseContext. Selecting course-2 can show its empty students while the sidebar still points to course-1. Student-progress URLs carry no courseId for shell synchronization. | Prefer the specified all-course grouped view. Resolve the student's course in the page hook and coordinate the active-course context when opening progress; test course-2 → students → progress/sidebar consistency. |
| S17 | error | Integration | [src/components/student-monitoring/StudentTable.tsx:43](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/StudentTable.tsx:43>); [src/components/student-monitoring/StudentMasteryTable.tsx:29](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/StudentMasteryTable.tsx:29>); [src/pages/GapMapPage.tsx:24](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:24>); [src/mocks/studentMonitoring.mock.ts:223](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/mocks/studentMonitoring.mock.ts:223>) | At exactly 70%, table/heatmap/priority helpers classify medium, while MasteryBadge, the monitoring mock and integration masteryTone classify high (>=70). The Figma legend says medium 40–70 / high >70, so the supplied reference itself differs from the accepted helper at this boundary. | Use one approved threshold definition across classifier, distributions, badges and legends; preserve the accepted helper unless the team deliberately updates it and its tests. Test null, 39, 40, 69, 70 and 71. |
| S18 | warn | Redundancy | [src/components/student-monitoring/MasteryBadge.tsx:30](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/MasteryBadge.tsx:30>); [src/components/student-monitoring/StudentMasteryTable.tsx:94](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/StudentMasteryTable.tsx:94>); [src/components/student-monitoring/SubtopicPriorityList.tsx:119](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/SubtopicPriorityList.tsx:119>); [src/pages/StudentProgressPage.tsx:123](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentProgressPage.tsx:123>) | Reimplements masteryTone, Chip, Avatar, ProgressBar, StatCard and integration StackedBar, plus repeated level helpers and percentage/plural/date formatting in presentation files. | Reuse existing primitives/utils; put a reusable mastery chip/heatmap cell in components/ui only if needed, keep feature composition under student-monitoring, and move pure formatters to utils. |
| S19 | error | Integration | [src/mocks/studentMonitoring.mock.ts:26](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/mocks/studentMonitoring.mock.ts:26>); [src/mocks/studentMonitoring.mock.ts:72](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/mocks/studentMonitoring.mock.ts:72>) | New student fixtures duplicate the three integration indicator identities/counters but use student-1/2/3 rather than indicators' st-1/2/3. Two independent fixture graphs can diverge or fail future cross-feature links. | Create one canonical student/enrollment identity fixture shared by monitoring/indicators; adapt each contract's projection. Keep the current sample mastery values coherent across course/subtopic/indicator aggregates. |
| S20 | warn | Integration | [src/navigation/AppRouter.tsx:14](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/navigation/AppRouter.tsx:14>); [src/navigation/AppRouter.tsx:30](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/navigation/AppRouter.tsx:30>); [src/navigation/AppRouter.tsx:33](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/navigation/AppRouter.tsx:33>) | Read-only three-way merge against feature/ui-integration detects an AppRouter conflict; the new individual-progress route must survive along with every accepted route. | Keep the accepted router, replace monitoring placeholders and add the progress route; preserve all other feature pages and the sign-in initial-route decision. |
| S21 | warn | Design | [src/pages/GapMapPage.tsx:135](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:135>); [src/components/student-monitoring/SubtopicPriorityList.tsx:79](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/SubtopicPriorityList.tsx:79>); [src/components/student-monitoring/SubtopicPriorityList.tsx:86](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/SubtopicPriorityList.tsx:86>) | Frame 07: summary values and priority sorting are present, but pages add p-6 inside AppShell's padding, shrinking and shifting content. Headline is 22px versus token display 26px, feature titles 15px versus 18px; glyphs replace Material Symbols. Priority subtitle omits total student count/update time. New palette differs from Figma. | Match 07_mapa_de_brechas.png using the shared shell/token typography/Icon/StatCard/StackedBar. Preserve priority order and the student × subtopic heatmap with click-through. |
| S22 | warn | Design | [src/pages/GapMapPage.tsx:147](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:147>); [src/pages/GapMapPage.tsx:167](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:167>); [src/pages/GapMapPage.tsx:183](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/GapMapPage.tsx:183>) | Frame 07.1: uses a round glyph instead of the square insights box, populated-state description rather than the empty-state description, and embeds a different info message inside the card rather than the external callout. | Match 07.1_mapa_datos_insuficientes.png: empty header copy, large EmptyState and separate exact insufficient-data Callout. |
| S23 | error | Design | [src/pages/StudentsPage.tsx:88](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:88>); [src/pages/StudentsPage.tsx:114](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:114>); [src/pages/StudentsPage.tsx:183](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:183>); [src/components/student-monitoring/StudentTable.tsx:124](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/StudentTable.tsx:124>) | Frame 08: shows a single selected course instead of both course groups. Replaces Invitar estudiante with Ver mapa de brechas and adds a course selector. Third statistic is average mastery instead of inactive count; student rows show level chips instead of progress bars; Algebra's inline empty-group notice and bottom invitations callout are missing. | Match 08_estudiantes.png with global 3/2/1 stats, populated course-1 group plus empty course-2 group, invitation entry point, progress bars and notices. |
| S24 | warn | Design | [src/pages/StudentProgressPage.tsx:85](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentProgressPage.tsx:85>); [src/pages/StudentProgressPage.tsx:193](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentProgressPage.tsx:193>); [src/components/student-monitoring/StudentMasteryTable.tsx:88](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/components/student-monitoring/StudentMasteryTable.tsx:88>) | Frame 08.1: sample values 62%, 42, 31/42 and 72/81/33/null match. Layout/typography/colors/icons differ; warning substitutes generic weakest-subtopic advice for the designed last-three-incorrect-responses copy. The current type lacks recent-attempt data to substantiate that copy. | Match 08.1_progreso_individual_valentina.png, adding a legitimate mock progress recommendation projection for recent attempts; do not invent the claim from mastery alone. |
| S25 | warn | Design | [src/pages/StudentProgressPage.tsx:69](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentProgressPage.tsx:69>); [src/pages/StudentProgressPage.tsx:201](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentProgressPage.tsx:201>) | Frame 08.2: sample values 50%, 27, 17/27 and 58/63/29/null match, but recommendation considers only the weakest subtopic and omits Recursividad y Backtracking (58%). Same layout/typography/icon mismatches persist. | Match 08.2_progreso_individual_diego.png with the designed multi-subtopic recommendation generated from explicit fixture data. |
| S26 | warn | Design | [src/pages/StudentProgressPage.tsx:215](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentProgressPage.tsx:215>); [src/pages/StudentProgressPage.tsx:222](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentProgressPage.tsx:222>) | Frame 08.3: generic Aún no hay actividad registrada replaces Lucía aún no registra actividad; exercise glyph replaces hourglass; the separate invitation-accepted/date info callout is absent. | Match 08.3_progreso_individual_sin_actividad.png with data-driven first name/date, hourglass icon and the external callout; retain Volver a estudiantes. |
| S27 | error | Design | [src/pages/StudentsPage.tsx:15](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:15>); [src/pages/StudentsPage.tsx:222](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/kalibra-web-app__student-monitoring/src/pages/StudentsPage.tsx:222>) | Frame 08.4: no distinct teacher-without-courses layout. The only empty rendering is per selected course, with wrong heading/copy, stats/selector still present and no Crear mi primer curso button. | Match 08.4_estudiantes_sin_matriculados.png as the zero-course scenario, with no course controls/stats and a working course-creation CTA. |

### Inspected frame index

Each frame has a concrete comparison in its corresponding design finding above.

| Finding | Opened reference PNG |
|---|---|
| S21 | [07_mapa_de_brechas.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/07_mapa_de_brechas.png>) |
| S22 | [07.1_mapa_datos_insuficientes.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/07.1_mapa_datos_insuficientes.png>) |
| S23 | [08_estudiantes.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/08_estudiantes.png>) |
| S24 | [08.1_progreso_individual_valentina.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/08.1_progreso_individual_valentina.png>) |
| S25 | [08.2_progreso_individual_diego.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/08.2_progreso_individual_diego.png>) |
| S26 | [08.3_progreso_individual_sin_actividad.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/08.3_progreso_individual_sin_actividad.png>) |
| S27 | [08.4_estudiantes_sin_matriculados.png](</Users/gonzaloquedena/Workspace/dev/1.- workshop/kalibra/github/repositories/worktrees/_figma/web/08.4_estudiantes_sin_matriculados.png>) |

### Ordered refactor plan and acceptance criteria

1. [ ] Keep the accepted router and add only the monitoring routes; fix both lint failures and wrong URL. Acceptance: `/estudiantes`, `/estudiantes/:studentId` and `/cursos/:courseId/mapa-de-brechas` work alongside all accepted feature routes. Any retained `Ver mapa de brechas` action uses courseRoutes.gapMap and never hits the wildcard.
2. [ ] Replace page service/mock access with complete data/page hooks. Acceptance: no page imports services/mocks; grouped enrollment, summary, individual progress and heatmap expose loading/error/retry; heatmap failures cannot masquerade as success. One canonical student fixture uses stable identifiers across monitoring/indicators.
3. [ ] Rebuild the grouped student view. Acceptance: **08** renders the populated Algorithms group and the empty Algebra group together, with global 3/2/1 counters, the designed bars/notices and invitation entry point. **08 → Ver progreso** opens **08.1** for student-1/Valentina, **08.2** for student-2/Diego, or **08.3** for student-3/Lucía. **08.1/08.2/08.3 → Volver a estudiantes → 08** works without selecting a different course accidentally.
4. [ ] Implement the distinct teacher-empty flow. Acceptance: the shared `?vacio`/new-teacher scenario renders **08.4**, no stale course groups/stats/selector, and `Crear mi primer curso` reaches the accepted Courses/create-course flow. An existing course with no enrollments remains an inline group notice under **08**, not the zero-course screen.
5. [ ] Complete the gap-map flow. Acceptance: enough data opens **07** with 56%, 31%, 2 of 3 active, priority order Programación Dinámica → Recursividad → Árboles → Grafos, distributions and student × subtopic heatmap. Selecting a heatmap student opens that student's individual progress (**08.1/08.2/08.3**); `Ver estudiantes` opens **08**. Course-2/no activity opens **07.1** with its distinct description/empty card/external callout.
6. [ ] Consolidate mastery primitives/rules and screen fidelity. Acceptance: reuse Chip/ProgressBar/Avatar/StatCard/StackedBar/Icon; no extra page padding over AppShell, arbitrary values, undefined palette names or new hex/rgb. Match **07, 07.1, 08, 08.1, 08.2, 08.3, 08.4** against all PNGs at 1280×832 and verify 360/768 widths. Preserve correct sample metrics and support legitimate recommendation data (Valentina's recent responses, Diego's two subtopics, Lucía's accepted invitation).
7. [ ] Test boundaries and every layer, then finish English docs/comments. Acceptance: null/39/40/69/70/71 share one approved classifier across helper/mock/tables/legend; request errors/cleanup, global/course empty states, heatmap navigation and active-course synchronization have behavior tests. All new headers/exports/member docs meet TSDoc.
8. [ ] All five normal gates must exit 0 in writable developer/CI execution: lint, `npx tsc -b`, tests, build and audit script. Include merged navigation/empty-state smoke tests and explicit disposition of inherited warnings.

### Automatic rules and complete failing-location inventory

| Rule | Severity | Result | Hits |
|---|---|---|---:|
| ARCH-01 | error | FAIL | 2 |
| ARCH-02 | error | pass | 0 |
| ARCH-03 | error | pass | 0 |
| ARCH-04 | error | pass | 0 |
| ARCH-05 | warn | FAIL | 7 |
| DATA-01 | error | pass | 0 |
| STYLE-01 | error | FAIL | 136 |
| STYLE-02 | error | FAIL | 128 |
| STYLE-03 | warn | FAIL | 3 |
| STYLE-04 | error | pass | 0 |
| STYLE-05 | warn | pass | 0 |
| STYLE-06 | error | pass | 0 |
| TS-01 | error | pass | 0 |
| TS-02 | warn | pass | 0 |
| CONV-01 | warn | pass | 0 |
| CONV-02 | warn | pass | 0 |
| CONV-03 | warn | FAIL | 8 |
| DOC-01 | error | pass | 0 |
| DOC-02 | error | FAIL | 13 |
| DOC-03 | error | FAIL | 10 |
| DOC-04 | warn | pass | 0 |
| TEST-01 | error | pass | 0 |
| TEST-02 | warn | FAIL | 4 |
| SEC-01 | error | pass | 0 |

The 16 arbitrary-value locations reported inside UI/layout are inherited permitted intrinsic-dimension information, not new feature failures. Dynamic percentage width alone is allowed: in monitoring, STYLE-03's StudentMasteryTable width is not itself a fixed-style violation; the priority legend and segment colors are.

<details>
<summary>ARCH-01 — pages do not import services (2 hits)</summary>

```text
src/pages/GapMapPage.tsx:8  @/services/studentMonitoring.service
src/pages/StudentsPage.tsx:7  @/services/studentMonitoring.service
```

</details>

<details>
<summary>ARCH-05 — every layer folder has a README.md (7 hits)</summary>

```text
src/components/README.md missing
src/hooks/README.md missing
src/services/README.md missing
src/context/README.md missing
src/utils/README.md missing
src/types/README.md missing
src/pages/README.md missing
```

</details>

<details>
<summary>STYLE-01 — no hex / rgb colors outside the tokens file (136 hits)</summary>

```text
src/components/student-monitoring/StudentMasteryTable.tsx:14  #E4E8FF
src/components/student-monitoring/StudentMasteryTable.tsx:15  #E4E8FF
src/components/student-monitoring/StudentMasteryTable.tsx:23  #FFD9D7
src/components/student-monitoring/StudentMasteryTable.tsx:24  #C91E22
src/components/student-monitoring/StudentMasteryTable.tsx:32  #FFDCB7
src/components/student-monitoring/StudentMasteryTable.tsx:33  #F59E0B
src/components/student-monitoring/StudentMasteryTable.tsx:40  #66F2BD
src/components/student-monitoring/StudentMasteryTable.tsx:41  #047857
src/components/student-monitoring/StudentMasteryTable.tsx:63  #E7EAFE
src/components/student-monitoring/StudentMasteryTable.tsx:64  #141A33
src/components/student-monitoring/StudentMasteryTable.tsx:68  #60657A
src/components/student-monitoring/StudentMasteryTable.tsx:74  #60657A
src/components/student-monitoring/StudentMasteryTable.tsx:78  #E7EAFE
src/components/student-monitoring/StudentMasteryTable.tsx:90  #141A33
src/components/student-monitoring/StudentMasteryTable.tsx:105  #E4E8FF
src/components/student-monitoring/StudentMasteryTable.tsx:115  #141A33
src/components/student-monitoring/StudentMasteryTable.tsx:128  #60657A
src/components/student-monitoring/StudentTable.tsx:32  #E4E8FF
src/components/student-monitoring/StudentTable.tsx:39  #FFD9D7
src/components/student-monitoring/StudentTable.tsx:46  #FFDCB7
src/components/student-monitoring/StudentTable.tsx:52  #66F2BD
src/components/student-monitoring/StudentTable.tsx:65  #E7EAFE
src/components/student-monitoring/StudentTable.tsx:66  #60657A
src/components/student-monitoring/StudentTable.tsx:70  #60657A
src/components/student-monitoring/StudentTable.tsx:74  #60657A
src/components/student-monitoring/StudentTable.tsx:78  #60657A
src/components/student-monitoring/StudentTable.tsx:82  #60657A
src/components/student-monitoring/StudentTable.tsx:88  #E7EAFE
src/components/student-monitoring/StudentTable.tsx:97  #FAFAFF
src/components/student-monitoring/StudentTable.tsx:102  #E4E8FF
src/components/student-monitoring/StudentTable.tsx:107  #141A33
src/components/student-monitoring/StudentTable.tsx:111  #60657A
src/components/student-monitoring/StudentTable.tsx:119  #141A33
src/components/student-monitoring/StudentTable.tsx:127  #141A33
src/components/student-monitoring/StudentTable.tsx:141  #60657A
src/components/student-monitoring/StudentTable.tsx:143  #F0F1F8
src/components/student-monitoring/StudentTable.tsx:156  #E4E8FF
src/components/student-monitoring/StudentTable.tsx:170  #60657A
src/components/student-monitoring/SubtopicPriorityList.tsx:14  #E4E8FF
src/components/student-monitoring/SubtopicPriorityList.tsx:22  #FFD9D7
src/components/student-monitoring/SubtopicPriorityList.tsx:30  #FFDCB7
src/components/student-monitoring/SubtopicPriorityList.tsx:37  #66F2BD
src/components/student-monitoring/SubtopicPriorityList.tsx:80  #E7EAFE
src/components/student-monitoring/SubtopicPriorityList.tsx:82  #141A33
src/components/student-monitoring/SubtopicPriorityList.tsx:86  #5F647A
src/components/student-monitoring/SubtopicPriorityList.tsx:91  #5F647A
src/components/student-monitoring/SubtopicPriorityList.tsx:93  #C91E22
src/components/student-monitoring/SubtopicPriorityList.tsx:94  #F59E0B
src/components/student-monitoring/SubtopicPriorityList.tsx:95  #047857
src/components/student-monitoring/SubtopicPriorityList.tsx:96  #E4E8FF
src/components/student-monitoring/SubtopicPriorityList.tsx:109  #E7EAFE
src/components/student-monitoring/SubtopicPriorityList.tsx:120  #C91E22
src/components/student-monitoring/SubtopicPriorityList.tsx:121  #F59E0B
src/components/student-monitoring/SubtopicPriorityList.tsx:122  #047857
src/components/student-monitoring/SubtopicPriorityList.tsx:123  #E4E8FF
src/components/student-monitoring/SubtopicPriorityList.tsx:132  #141A33
src/components/student-monitoring/SubtopicPriorityList.tsx:161  #60657A
src/components/student-monitoring/SubtopicPriorityList.tsx:169  #141A33
src/components/student-monitoring/SubtopicPriorityList.tsx:175  #60657A
src/pages/GapMapPage.tsx:17  #E4E8FF
src/pages/GapMapPage.tsx:21  #FFD9D7
src/pages/GapMapPage.tsx:25  #FFDCB7
src/pages/GapMapPage.tsx:28  #66F2BD
src/pages/GapMapPage.tsx:92  #60657A
src/pages/GapMapPage.tsx:101  #141A33
src/pages/GapMapPage.tsx:139  #60657A
src/pages/GapMapPage.tsx:143  #141A33
src/pages/GapMapPage.tsx:147  #60657A
src/pages/GapMapPage.tsx:156  #E4E8FF
src/pages/GapMapPage.tsx:168  #E4E8FF
src/pages/GapMapPage.tsx:174  #141A33
src/pages/GapMapPage.tsx:178  #60657A
src/pages/GapMapPage.tsx:183  #E4E8FF
src/pages/GapMapPage.tsx:196  #E4E8FF
src/pages/GapMapPage.tsx:203  #141A33
src/pages/GapMapPage.tsx:207  #60657A
src/pages/GapMapPage.tsx:214  #FFD9D7
src/pages/GapMapPage.tsx:221  #141A33
src/pages/GapMapPage.tsx:227  #60657A
src/pages/GapMapPage.tsx:234  #66F2BD
src/pages/GapMapPage.tsx:241  #141A33
src/pages/GapMapPage.tsx:245  #60657A
src/pages/GapMapPage.tsx:260  #E7EAFE
src/pages/GapMapPage.tsx:261  #141A33
src/pages/GapMapPage.tsx:265  #60657A
src/pages/GapMapPage.tsx:275  #60657A
src/pages/GapMapPage.tsx:282  #60657A
src/pages/GapMapPage.tsx:309  #4F46E5
src/pages/GapMapPage.tsx:311  #E4E8FF
src/pages/GapMapPage.tsx:315  #141A33
src/pages/GapMapPage.tsx:319  #60657A
src/pages/GapMapPage.tsx:349  #FFDCB7
src/pages/GapMapPage.tsx:352  #805013
src/pages/StudentProgressPage.tsx:29  #60657A
src/pages/StudentProgressPage.tsx:38  #141A33
src/pages/StudentProgressPage.tsx:89  #60657A
src/pages/StudentProgressPage.tsx:93  #141A33
src/pages/StudentProgressPage.tsx:97  #60657A
src/pages/StudentProgressPage.tsx:106  #E4E8FF
src/pages/StudentProgressPage.tsx:124  #E4E8FF
src/pages/StudentProgressPage.tsx:131  #141A33
src/pages/StudentProgressPage.tsx:137  #60657A
src/pages/StudentProgressPage.tsx:145  #FFDCB7
src/pages/StudentProgressPage.tsx:152  #141A33
src/pages/StudentProgressPage.tsx:156  #60657A
src/pages/StudentProgressPage.tsx:164  #66F2BD
src/pages/StudentProgressPage.tsx:174  #141A33
src/pages/StudentProgressPage.tsx:178  #60657A
src/pages/StudentProgressPage.tsx:193  #FFDCB7
src/pages/StudentProgressPage.tsx:196  #805013
src/pages/StudentProgressPage.tsx:216  #E4E8FF
src/pages/StudentProgressPage.tsx:222  #141A33
src/pages/StudentProgressPage.tsx:226  #60657A
src/pages/StudentsPage.tsx:88  #60657A
src/pages/StudentsPage.tsx:92  #141A33
src/pages/StudentsPage.tsx:96  #60657A
src/pages/StudentsPage.tsx:106  #E4E8FF
src/pages/StudentsPage.tsx:117  #141A33
src/pages/StudentsPage.tsx:126  #E4E8FF
src/pages/StudentsPage.tsx:137  #60657A
src/pages/StudentsPage.tsx:141  #B91C1C
src/pages/StudentsPage.tsx:152  #E4E8FF
src/pages/StudentsPage.tsx:157  #141A33
src/pages/StudentsPage.tsx:161  #60657A
src/pages/StudentsPage.tsx:168  #66F2BD
src/pages/StudentsPage.tsx:173  #141A33
src/pages/StudentsPage.tsx:177  #60657A
src/pages/StudentsPage.tsx:184  #FFDCB7
src/pages/StudentsPage.tsx:189  #141A33
src/pages/StudentsPage.tsx:195  #60657A
src/pages/StudentsPage.tsx:206  #141A33
src/pages/StudentsPage.tsx:210  #60657A
src/pages/StudentsPage.tsx:216  #E4E8FF
src/pages/StudentsPage.tsx:223  #E4E8FF
src/pages/StudentsPage.tsx:227  #141A33
src/pages/StudentsPage.tsx:231  #60657A
```

</details>

<details>
<summary>STYLE-02 — no arbitrary values outside components/ui and components/layout (128 hits)</summary>

```text
src/components/student-monitoring/StudentMasteryTable.tsx:62  [16px]
src/components/student-monitoring/StudentMasteryTable.tsx:64  [15px]
src/components/student-monitoring/StudentMasteryTable.tsx:68  [11px]
src/components/student-monitoring/StudentMasteryTable.tsx:88  [15px]
src/components/student-monitoring/StudentMasteryTable.tsx:90  [12px]
src/components/student-monitoring/StudentMasteryTable.tsx:105  [9px]
src/components/student-monitoring/StudentMasteryTable.tsx:115  [12px]
src/components/student-monitoring/StudentMasteryTable.tsx:122  [5px], [4px], [10px]
src/components/student-monitoring/StudentMasteryTable.tsx:128  [10px]
src/components/student-monitoring/StudentTable.tsx:61  [16px]
src/components/student-monitoring/StudentTable.tsx:63  [760px]
src/components/student-monitoring/StudentTable.tsx:66  [10px], [0.04em]
src/components/student-monitoring/StudentTable.tsx:70  [10px], [0.04em]
src/components/student-monitoring/StudentTable.tsx:74  [10px], [0.04em]
src/components/student-monitoring/StudentTable.tsx:78  [10px], [0.04em]
src/components/student-monitoring/StudentTable.tsx:82  [10px], [0.04em]
src/components/student-monitoring/StudentTable.tsx:102  [11px]
src/components/student-monitoring/StudentTable.tsx:107  [12px]
src/components/student-monitoring/StudentTable.tsx:111  [10px]
src/components/student-monitoring/StudentTable.tsx:119  [12px]
src/components/student-monitoring/StudentTable.tsx:127  [12px]
src/components/student-monitoring/StudentTable.tsx:133  [5px], [4px], [10px]
src/components/student-monitoring/StudentTable.tsx:141  [11px]
src/components/student-monitoring/StudentTable.tsx:143  [5px], [10px]
src/components/student-monitoring/StudentTable.tsx:156  [8px], [11px]
src/components/student-monitoring/StudentTable.tsx:170  [12px]
src/components/student-monitoring/SubtopicPriorityList.tsx:79  [16px]
src/components/student-monitoring/SubtopicPriorityList.tsx:82  [15px]
src/components/student-monitoring/SubtopicPriorityList.tsx:86  [11px]
src/components/student-monitoring/SubtopicPriorityList.tsx:91  [10px]
src/components/student-monitoring/SubtopicPriorityList.tsx:129  [15px]
src/components/student-monitoring/SubtopicPriorityList.tsx:132  [13px]
src/components/student-monitoring/SubtopicPriorityList.tsx:137  [5px], [3px], [10px]
src/components/student-monitoring/SubtopicPriorityList.tsx:145  [11px], [3px], [4px]
src/components/student-monitoring/SubtopicPriorityList.tsx:152  [3px]
src/components/student-monitoring/SubtopicPriorityList.tsx:161  [7px], [10px]
src/components/student-monitoring/SubtopicPriorityList.tsx:169  [17px]
src/components/student-monitoring/SubtopicPriorityList.tsx:175  [10px]
src/pages/GapMapPage.tsx:139  [10px], [0.02em]
src/pages/GapMapPage.tsx:143  [22px]
src/pages/GapMapPage.tsx:147  [11px]
src/pages/GapMapPage.tsx:156  [9px], [10px], [11px]
src/pages/GapMapPage.tsx:158  [15px]
src/pages/GapMapPage.tsx:167  [16px]
src/pages/GapMapPage.tsx:169  [24px]
src/pages/GapMapPage.tsx:174  [16px]
src/pages/GapMapPage.tsx:178  [12px]
src/pages/GapMapPage.tsx:183  [9px], [11px]
src/pages/GapMapPage.tsx:195  [75px], [13px]
src/pages/GapMapPage.tsx:196  [10px]
src/pages/GapMapPage.tsx:197  [22px]
src/pages/GapMapPage.tsx:203  [23px]
src/pages/GapMapPage.tsx:207  [11px]
src/pages/GapMapPage.tsx:213  [75px], [13px]
src/pages/GapMapPage.tsx:214  [10px]
src/pages/GapMapPage.tsx:215  [22px]
src/pages/GapMapPage.tsx:221  [23px]
src/pages/GapMapPage.tsx:227  [11px]
src/pages/GapMapPage.tsx:233  [75px], [13px]
src/pages/GapMapPage.tsx:234  [10px]
src/pages/GapMapPage.tsx:235  [22px]
src/pages/GapMapPage.tsx:241  [23px]
src/pages/GapMapPage.tsx:245  [11px]
src/pages/GapMapPage.tsx:259  [16px]
src/pages/GapMapPage.tsx:261  [15px]
src/pages/GapMapPage.tsx:265  [11px]
src/pages/GapMapPage.tsx:272  [720px], [6px]
src/pages/GapMapPage.tsx:275  [10px]
src/pages/GapMapPage.tsx:282  [10px]
src/pages/GapMapPage.tsx:311  [10px]
src/pages/GapMapPage.tsx:315  [11px]
src/pages/GapMapPage.tsx:330  [7px], [13px], [12px]
src/pages/GapMapPage.tsx:349  [9px], [11px]
src/pages/GapMapPage.tsx:352  [12px]
src/pages/StudentProgressPage.tsx:89  [10px], [0.02em]
src/pages/StudentProgressPage.tsx:93  [22px]
src/pages/StudentProgressPage.tsx:97  [11px]
src/pages/StudentProgressPage.tsx:106  [9px], [10px], [11px]
src/pages/StudentProgressPage.tsx:108  [15px]
src/pages/StudentProgressPage.tsx:123  [75px], [13px]
src/pages/StudentProgressPage.tsx:124  [10px]
src/pages/StudentProgressPage.tsx:125  [22px]
src/pages/StudentProgressPage.tsx:131  [23px]
src/pages/StudentProgressPage.tsx:137  [11px]
src/pages/StudentProgressPage.tsx:144  [75px], [13px]
src/pages/StudentProgressPage.tsx:145  [10px]
src/pages/StudentProgressPage.tsx:146  [21px]
src/pages/StudentProgressPage.tsx:152  [23px]
src/pages/StudentProgressPage.tsx:156  [11px]
src/pages/StudentProgressPage.tsx:163  [75px], [13px]
src/pages/StudentProgressPage.tsx:164  [10px]
src/pages/StudentProgressPage.tsx:167  [22px]
src/pages/StudentProgressPage.tsx:174  [23px]
src/pages/StudentProgressPage.tsx:178  [11px]
src/pages/StudentProgressPage.tsx:193  [9px], [11px]
src/pages/StudentProgressPage.tsx:196  [12px]
src/pages/StudentProgressPage.tsx:215  [16px]
src/pages/StudentProgressPage.tsx:217  [24px]
src/pages/StudentProgressPage.tsx:222  [16px]
src/pages/StudentProgressPage.tsx:226  [12px]
src/pages/StudentsPage.tsx:88  [10px], [0.02em]
src/pages/StudentsPage.tsx:92  [22px]
src/pages/StudentsPage.tsx:96  [11px]
src/pages/StudentsPage.tsx:106  [9px], [10px], [11px]
src/pages/StudentsPage.tsx:114  [13px]
src/pages/StudentsPage.tsx:117  [11px]
src/pages/StudentsPage.tsx:126  [220px], [8px], [11px]
src/pages/StudentsPage.tsx:137  [16px], [12px]
src/pages/StudentsPage.tsx:141  [16px], [12px]
src/pages/StudentsPage.tsx:151  [75px], [13px]
src/pages/StudentsPage.tsx:152  [10px], [21px]
src/pages/StudentsPage.tsx:157  [23px]
src/pages/StudentsPage.tsx:161  [11px]
src/pages/StudentsPage.tsx:167  [75px], [13px]
src/pages/StudentsPage.tsx:168  [10px], [20px]
src/pages/StudentsPage.tsx:173  [23px]
src/pages/StudentsPage.tsx:177  [11px]
src/pages/StudentsPage.tsx:183  [75px], [13px]
src/pages/StudentsPage.tsx:184  [10px], [22px]
src/pages/StudentsPage.tsx:189  [23px]
src/pages/StudentsPage.tsx:195  [11px]
src/pages/StudentsPage.tsx:206  [15px]
src/pages/StudentsPage.tsx:210  [11px]
src/pages/StudentsPage.tsx:216  [6px], [11px]
src/pages/StudentsPage.tsx:222  [16px]
src/pages/StudentsPage.tsx:223  [22px]
src/pages/StudentsPage.tsx:227  [16px]
src/pages/StudentsPage.tsx:231  [12px]
```

</details>

<details>
<summary>STYLE-03 — no inline styles in pages and feature components (3 hits)</summary>

```text
src/components/student-monitoring/StudentMasteryTable.tsx:109
src/components/student-monitoring/SubtopicPriorityList.tsx:101
src/components/student-monitoring/SubtopicPriorityList.tsx:153
```

</details>

<details>
<summary>CONV-03 — pages use design-system primitives, not raw controls (8 hits)</summary>

```text
src/pages/GapMapPage.tsx:109  <button>
src/pages/GapMapPage.tsx:153  <button>
src/pages/GapMapPage.tsx:272  <table>
src/pages/GapMapPage.tsx:304  <button>
src/pages/StudentProgressPage.tsx:46  <button>
src/pages/StudentProgressPage.tsx:103  <button>
src/pages/StudentsPage.tsx:102  <button>
src/pages/StudentsPage.tsx:122  <select>
```

</details>

<details>
<summary>DOC-02 — every file has a header with @packageDocumentation and @author (13 hits)</summary>

```text
src/components/student-monitoring/MasteryBadge.tsx
src/components/student-monitoring/StudentMasteryTable.tsx
src/components/student-monitoring/StudentTable.tsx
src/components/student-monitoring/SubtopicPriorityList.tsx
src/components/student-monitoring/index.ts
src/hooks/useStudentMonitoring.ts
src/mocks/studentMonitoring.mock.ts
src/pages/GapMapPage.tsx
src/pages/StudentProgressPage.tsx
src/pages/StudentsPage.tsx
src/services/studentMonitoring.contract.ts
src/services/studentMonitoring.service.ts
src/types/studentMonitoring.ts
```

</details>

<details>
<summary>DOC-03 — every export has a TSDoc comment (10 hits)</summary>

```text
src/components/student-monitoring/MasteryBadge.tsx:14  MasteryBadgeProps
src/components/student-monitoring/StudentMasteryTable.tsx:5  StudentMasteryTableProps
src/components/student-monitoring/StudentMasteryTable.tsx:46  StudentMasteryTable
src/components/student-monitoring/StudentTable.tsx:4  StudentTableProps
src/components/student-monitoring/StudentTable.tsx:56  StudentTable
src/components/student-monitoring/SubtopicPriorityList.tsx:5  SubtopicPriorityListProps
src/components/student-monitoring/SubtopicPriorityList.tsx:64  SubtopicPriorityList
src/pages/GapMapPage.tsx:31  GapMapPage
src/pages/StudentProgressPage.tsx:21  StudentProgressPage
src/pages/StudentsPage.tsx:11  StudentsPage
```

</details>

<details>
<summary>TEST-02 — hooks, services and utils have tests (4 hits)</summary>

```text
src/hooks/useShellNavigation.ts
src/hooks/useStudentMonitoring.ts
src/services/studentMonitoring.contract.ts
src/services/studentMonitoring.service.ts
```

</details>

TEST-02's file-based scan is incomplete: it can flag a type-only contract or miss a class-based service. The branch's missing behavior tests are assessed manually in its findings.

## Cross-branch refactors and merge decisions

### Shared building blocks

| Current duplication / gap | Existing implementation and required ownership |
|---|---|
| Alerts, buttons, icon actions, dialogs | **I:** `src/components/ui/Callout.tsx:66`, `Button.tsx`, `IconButton.tsx`, `Modal.tsx:77` and `useDismiss.ts`. Reuse these for auth/errors/actions; add a small reusable dismissible-notice extension only where the current API cannot express the designed notice. LogoutConfirmModal can remain feature composition over Modal. |
| Password/form field | **I:** `src/components/ui/TextField.tsx:19` already provides typed status styles; its current type at line 50 is only text/email. Extend the primitive for password type, visibility action, help/error association and native attributes needed by auth. Do not pretend existing TextField already supports password. Keep intrinsic sizes and Record maps in UI. |
| Upload/dropzone/selected-file state | No existing file-picker primitive was found. Generalize `FileDropzone` / a selected-file row into `components/ui` if reused across valid/invalid/replacement states; use Button, Icon, Chip and a hidden accessible native input. Move pure validation/size/date helpers to utils and submission/form orchestration to hooks. |
| Mastery badges, progress, counters, distributions | **I:** `src/utils/mastery.ts:31`, `src/components/ui/Chip.tsx:47`, `ProgressBar.tsx:64`, `Avatar.tsx`, `StatCard.tsx`; integration also has `StackedBar.tsx:50`. Reuse these rather than monitoring's four classifiers and hand-built bars. If a mastery chip/cell is needed across features, it belongs in UI with configurable content. |
| Grouped course headers/tables | **I:** `src/components/invitations/CourseInvitationsGroup.tsx:8` already composes SectionHeader/Chip/IconBox/Table primitives with an empty group. Use the same UI primitives for students; do not import a component from invitations into student-monitoring. If group framing is truly identical, extract only that reusable frame into UI. |
| Invitation/course creation actions | **I:** `src/components/invitations/InviteStudentModal.tsx:39`, `src/components/courses/CreateCourseModal.tsx`, and their page hooks already own these flows. Route student actions to the accepted Invitations/Courses page actions; do not build parallel modals or cross-feature component imports. |
| Auth branding/frame | **I:** `src/components/layout/Logo.tsx:18`, AppShell and Sidebar remain canonical. Auth may use a reusable AuthLayout in layout, extending Logo for an inverse presentation if needed; feature content remains data/props. |
| Read loading / mock utilities | **I:** `src/hooks/useResource.ts:43` implements request-key/stale-response handling; `useCourses`, `useCourseSubtopics.ts:22`, `useCurrentTeacher.ts:21` already wrap course services. `src/mocks/scenario.ts:21,37` supplies isEmptyScenario/respond with cloning. Replace page fixture access/local delay helpers with these patterns. |
| Formatting | **I:** `src/utils/plural.ts:21`, `percent.ts:20` and `cn.ts` already exist. Reuse percentages/count grammar; add shared pure file/date formatting only for missing functionality. A mastery percentage is not necessarily answer accuracy: do not replace model mastery with percent(correct,total). |
| Shared tokens | **I:** `src/index.css:7` is the canonical token file. Map existing hex aliases/undefined names to primary/content/surface/line/danger/secondary/tertiary tokens. No additional palette is needed. Any genuine intrinsic dialog/heatmap dimension stays in UI/layout; any new design token must come from the design system. |

### Conflict and behavior matrix

A legacy three-way `git merge-tree <base> feature/ui-integration <teammate>` inspection was used read-only: it did not write merge trees, check out files, merge branches or alter refs.

| File / interface | Evidence and result | Resolution |
|---|---|---|
| `src/navigation/AppRouter.tsx` | Changed by integration and every teammate branch. Against integration alone, **auth has no textual conflict** in the read-only three-way result; **curricular-material and student-monitoring both have conflict markers**. Branch-specific route citations are A17, C14, S14/S20; **I:** lines 20–37 contain the real accepted pages. | Keep integration's accepted route table, apply auth replacements, material replacement, gap/students replacements and new progress path. Never copy an entire develop-based router over it. Recheck a combined merge, since the three branches were not actually merged during this audit. |
| Initial navigation | All four router versions still point root/unknown routes to /cursos; **I:** `AppRouter.tsx:26,37`; auth `AppRouter.tsx:24,35`; material `AppRouter.tsx:21,32`; monitoring `AppRouter.tsx:26,38`. | Root must open sign-in per REFERENCE.md:48. This is an inherited unmet decision, not a new source regression in every teammate. Define unknown-route handling separately and test both. |
| `src/navigation/ShellRoute.tsx` / `useShellNavigation.ts` | Only auth changes ShellRoute relative to develop. Integration changes useShellNavigation (dynamic newly created-course refresh), not ShellRoute. The three-way auth result merges the shell cleanly. Auth's confirm callback coexists with the integration hook's direct signOut. | Retain integration's active-course synchronization and newly created-course refresh; route sidebar sign-out through the confirmation orchestration exactly once. Remove stale commented code, wire visible errors inside the dialog/callout, and verify course switching plus logout. |
| `src/components/layout/AppShell.tsx`, Sidebar, CourseSwitcherDialog, Logo | No teammate edits to these files relative to develop. Monitoring pages add their own `p-6` under **I:** `AppShell.tsx:57` padding. | Keep the canonical shell. Remove redundant page padding; do not replace sidebar/navigation to imitate a screenshot. Test active course and responsive drawer after integration. |
| `src/App.tsx` | No teammate or accepted-integration change relative to develop. **I:** lines 17–21 mount ToastProvider and ActiveCourseProvider. No current textual conflict. | Preserve providers/order. If a mock session provider is introduced during refactor, add it deliberately; clear/reset relevant per-session state rather than replacing the root wholesale. |
| `src/types/course.ts` / `src/types/ui.ts` | Teammates do not edit these common files. Integration extends course types/contracts (CreateCourseInput etc.); material correctly aliases existing MaterialStatus in `types/curricularMaterial.ts:22`. Monitoring introduces another level representation. | Preserve integration's additions, shared Tone/IconName/MaterialStatus, and canonical mastery thresholds. Add any needed icons/props in the shared UI API; adapt feature types rather than overwriting common types. |
| `src/mocks/courses.mock.ts` / course contract | No teammate edits, but integration makes COURSES/SUBTOPICS mutable for course creation (**I:** `courses.mock.ts:85–105`). Material/monitoring reference these arrays directly. Material upload currently does not update course counters/subtopic status (probe verified). | Use shared service/fixture ownership; support created course IDs/subtopics and synchronized material state. Keep file metadata separate from course projection but derive both from the same data. Test create course → upload → Subtemas/Courses/exercise eligibility and indicators. |
| Student and indicator fixtures | Monitoring `studentMonitoring.mock.ts:26–132` repeats the identities/activity/mastery represented by **I:** `indicators.mock.ts:20–29`; IDs differ (`student-*` vs `st-*`). | Share identity/enrollment data and stable IDs; provide contract-specific monitoring/indicator projections. Do not assume equal labels make independently keyed data interchangeable. |
| `package.json` / `package-lock.json` | No teammate or accepted-integration changes relative to develop for these files; no current lockfile conflict was found. Installed Node is 24.10.0; checks reported Vite 7.3.6 and Vitest 5.0.3. | Keep the current lockfile. If refactor needs dependencies, justify and regenerate it once through the normal package manager; no dependency change is needed for the present reuse plan. |
| Auth identity / empty scenarios | Login/register discard AuthResponse; course teacher data stays independent; register never navigates. New material/monitoring mocks ignore ?vacio (both verified in-memory). | Coordinate mock identity and initial course scenario so valid sign-in → populated Courses, valid registration → empty Courses, logout → sign-in, and ?vacio/zero-course views agree across shell, course, material and monitoring. No real credentials/API are needed. |

### Inherited observations and reference ambiguities

- The accepted integration audit exits 0, **PASS WITH WARNINGS**: ARCH-05 reports the same seven missing layer READMEs; TEST-02 reports five hooks without tests (`useCourseIndicatorsPage`, `useCoursesPage`, `useGeneratedExercisesPage`, `useInvitationsPage`, `useShellNavigation`). MEMORY.md records the README policy as intentional. Keep these separate from newly introduced feature warnings; decide/document their disposition before a strict warning-free gate.
- The baseline README table at `README.md:11` says React 19.3 while `package.json:15–16` declares ^19.2.0. Reconcile documentation with the actual lockfile; do not upgrade dependencies to make the prose true.
- Root/tool configuration is outside the script's source/test scan. For example `vite.config.ts:1` has no TSDoc author/module header, inherited unchanged. A literal “every code file” documentation gate needs a separate root-config inventory; a source-scan PASS is not proof of that broader gate.
- Figma **01.2** shows an Iniciar sesión main CTA but no separate Usar otro correo action; REFERENCE.md:28 explicitly requires both transitions. Support the recovery without losing the designed inline error state. Figma **05.3** shows Seleccionar archivo while REFERENCE.md:31 calls recovery Seleccionar otro archivo; preserve the working replacement transition and choose the reviewed copy deliberately.
- Figma's mastery legend says medium 40–70/high >70, but accepted `utils/mastery.ts:13,18,31` treats 70 as high. This is a real reference/implementation boundary discrepancy. Unify and test the selected rule; do not silently change accepted business presentation while refactoring.
- Figma **05.4/05.10** says Pendiente with an hourglass, while accepted `MaterialStatusChip.tsx:15` says En ingestión with schedule. Prefer a reviewed contextual/shared primitive extension; do not recreate another status enum/chip. PNG dates/pages are fixture data: no page count or “last three incorrect answers” may be fabricated from a file size or mastery percentage.
- Web screenshot **07** is clipped at the lower heatmap. Source contains the heatmap/navigation, but unseen lower pixels are not claimed as visually verified.

### Final integration gate

1. [ ] Resolve the two confirmed router conflicts while retaining the clean auth changes and all accepted screens; prove the combined route table, not just the isolated merge previews.
2. [ ] Run the five normal commands in a writable checkout and require zero failures. Feature service/hook/UI/page tests must be present and run; process-memory checks below are supplementary evidence only.
3. [ ] Exercise every branch's acceptance flow above in the merged UI, including root sign-in, registration-empty Courses, both upload branches, all students, heatmap navigation, invitation/course creation entry points and logout cancel/confirm.
4. [ ] Compare all 26 PNG states at 1280×832; verify 360/768 responsive behavior and keyboard interaction. Resolve all error findings and review the warnings, including inherited exceptions. Only then is merge readiness established.

