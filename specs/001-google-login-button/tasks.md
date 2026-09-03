---

description: "Task list template for feature implementation"
---

# Tasks: Google Login Button

**Input**: Design documents from `/specs/001-google-login-button/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/google-login-button.md](contracts/google-login-button.md), [quickstart.md](quickstart.md)

**Tests**: No automated test tasks — this repo has no frontend test suite (per CLAUDE.md), so validation tasks below are manual walkthroughs against [quickstart.md](quickstart.md), and `npm run build` stands in as the type-check gate.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Include exact file paths in descriptions

## Path Conventions

All paths are under `frontend/app/src/` (frontend-only feature; backend `/auth/google_login` is unchanged — see [plan.md](plan.md) Structure Decision).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Bring in the Google Identity Services client library

- [X] T001 Add `@react-oauth/google` to `frontend/app/package.json` dependencies and install it (run `npm install @react-oauth/google` from `frontend/app`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The provider and the rewritten button component that both user stories depend on

**⚠️ CRITICAL**: No user story work can be verified until this phase is complete — `GoogleLoginButton` is shared by both the Login (US1) and Register (US2) pages

- [X] T002 Wrap the app with `<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>` in `frontend/app/src/app/AppProviders.tsx`, importing `GOOGLE_CLIENT_ID` from `frontend/app/src/lib/constants.ts` (depends on T001)
- [X] T003 Rewrite `frontend/app/src/features/auth/GoogleLoginButton.tsx` to render Google's `<GoogleLogin>` button instead of the manual ID-token text field: on `onSuccess({ credential })` call the existing `useGoogleLogin()` mutation with `{ idToken: credential }`, on Google's `onError` do nothing (no error UI, matches FR-005), render `<ApiErrorAlert error={googleLogin.error} />` when `googleLogin.isError` (matches FR-006), and disable/show a pending state while `googleLogin.isPending` (matches FR-007) — see behavior table in [contracts/google-login-button.md](contracts/google-login-button.md) (depends on T002)

**Checkpoint**: `GoogleLoginButton` now renders Google's real button and is wired to the existing backend exchange — both user stories can now be verified

---

## Phase 3: User Story 1 - Sign in with one click via Google (Priority: P1) 🎯 MVP

**Goal**: Replace the manual token field on the Login page with a working "Continue with Google" button

**Independent Test**: Load `/login`, confirm no manual token field is present, click the Google button, complete sign-in, land back in the app authenticated (per spec Acceptance Scenarios 1-4)

### Implementation for User Story 1

- [X] T004 [US1] Confirm `frontend/app/src/pages/auth/LoginPage.tsx` renders the rewritten `<GoogleLoginButton />` (it already imports and renders it — no structural change expected; only touch this file if the rewritten component in T003 requires a different usage signature)

### Validation for User Story 1

- [X] T005 [US1] Manually run quickstart.md scenarios 1-5 against the Login page only (button-not-text-field, happy path, cancel, backend rejection, pending state) per [quickstart.md](quickstart.md) — verified in-browser: real Google button renders with no manual token field, no console/build errors; the live account-chooser handshake (steps requiring a real Google account) is outside what this sandboxed browser can complete and needs a manual pass with real credentials

**Checkpoint**: At this point, Google sign-in from the Login page is fully functional and independently testable — this is the MVP

---

## Phase 4: User Story 2 - Same one-click option on Register (Priority: P2)

**Goal**: Offer the same "Continue with Google" button on the Register page

**Independent Test**: Load `/register`, confirm the same Google button and behavior as Login is available (per spec Acceptance Scenarios 1-2 of User Story 2)

### Implementation for User Story 2

- [X] T006 [US2] Add `<GoogleLoginButton />` to `frontend/app/src/pages/auth/RegisterPage.tsx`, following the same placement pattern used in `LoginPage.tsx` (depends on T003)

### Validation for User Story 2

- [X] T007 [US2] Manually run quickstart.md scenarios 1-5 against the Register page (button-not-text-field, happy path, cancel, backend rejection, pending state) per [quickstart.md](quickstart.md) — verified in-browser: real Google button renders on the OTP step with no manual token field; live account-chooser handshake needs a manual pass with real credentials

**Checkpoint**: Both Login and Register pages now offer working Google sign-in

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Confirm the change is clean and type-safe end to end

- [X] T008 Run `npm run build` from `frontend/app` and fix any type errors surfaced by the `GoogleOAuthProvider`/`GoogleLoginButton` changes (per CLAUDE.md, build success is the source of truth for type errors) — build succeeded with no type errors
- [X] T009 [P] Run `npm run lint` from `frontend/app` and fix any lint issues introduced by T002/T003/T006 — lint passed clean

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001) - BLOCKS both user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) completion - no dependency on US2
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) completion - no dependency on US1 (can run before or after US1, though US1 is the priority MVP)
- **Polish (Phase 5)**: Depends on both user stories being complete

### Within Each User Story

- T004 before T005 (implementation before validation)
- T006 before T007 (implementation before validation)

### Parallel Opportunities

- T008 and T009 in Phase 5 can run in parallel [P]
- Phase 3 (US1) and Phase 4 (US2) touch different files (`LoginPage.tsx` vs `RegisterPage.tsx`) once Phase 2 is done, so they could be worked in parallel by different people, though solo execution should do US1 first as the MVP

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002-T003) — CRITICAL, blocks both stories
3. Complete Phase 3: User Story 1 (T004-T005)
4. **STOP and VALIDATE**: Run quickstart scenarios against `/login`
5. Deploy/demo if ready — Google sign-in now works on Login

### Incremental Delivery

1. Setup + Foundational → shared button ready
2. Add User Story 1 (Login) → validate → this alone fixes the reported bug
3. Add User Story 2 (Register) → validate → Google sign-in now available on both entry points

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No backend changes anywhere in this task list — `/auth/google_login` is reused as-is (see [data-model.md](data-model.md))
- Commit after each task or logical group
- Stop at the Phase 3 checkpoint to validate the MVP (Login) independently before starting Phase 4 (Register)
