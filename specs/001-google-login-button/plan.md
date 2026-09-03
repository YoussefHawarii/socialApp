# Implementation Plan: Google Login Button

**Branch**: `001-google-login-button` | **Date**: 2026-08-22 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-google-login-button/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Replace the manual "paste Google ID token" control on the Login page (and add the missing one on the Register page) with a real "Continue with Google" button backed by Google Identity Services. The button renders Google's own sign-in UI, obtains a credential with no typing required, and passes it straight into the existing `POST /auth/google_login` exchange that `useGoogleLogin()` / `authApi.googleLogin()` already wire up — no backend changes needed.

## Technical Context

**Language/Version**: TypeScript ~5.x (repo pins `typescript ~6.0.2`), React 19

**Primary Dependencies**: `@react-oauth/google` (new, wraps Google Identity Services `<script>` + button rendering), existing `@tanstack/react-query`, `axios`, `zustand`

**Storage**: N/A (frontend-only change; tokens persisted via existing `auth.store` → localStorage, unchanged)

**Testing**: No frontend test suite exists in this repo (per CLAUDE.md); verification is manual via `npm run build` (type-check) and a browser walkthrough of the Login/Register pages

**Target Platform**: Browser SPA (Vite build), existing Vercel deployment for `frontend/app`

**Project Type**: Web application — frontend change only (`frontend/app/src`); backend `/auth/google_login` endpoint already exists and is unchanged

**Performance Goals**: N/A beyond normal page-load budget; Google Identity Services script loads async and must not block initial render

**Constraints**: Must reuse the existing `VITE_GOOGLE_CLIENT_ID` env var and existing `GoogleLoginRequest { idToken }` / `authApi.googleLogin` contract; must not require any backend changes

**Scale/Scope**: Two pages affected (Login, Register); one component rewritten (`GoogleLoginButton.tsx`), one provider added at app root

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` is still the unfilled template (no ratified project principles), so there are no project-specific gates to check. Proceeding under the general engineering norms already stated in `CLAUDE.md` (don't reorder env-loading imports, keep the `GoogleLoginRequest`/`authApi.googleLogin` contract in sync with the backend, no unrelated refactors). No violations to track in Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-google-login-button/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
frontend/app/src/
├── app/
│   └── AppProviders.tsx          # add GoogleOAuthProvider wrapping the app (new)
├── features/auth/
│   ├── GoogleLoginButton.tsx     # rewritten: renders Google's button, no text input
│   └── useAuth.ts                # unchanged: useGoogleLogin() already posts { idToken }
├── pages/auth/
│   ├── LoginPage.tsx             # unchanged usage of <GoogleLoginButton />
│   └── RegisterPage.tsx          # add <GoogleLoginButton /> (currently missing)
├── services/
│   └── auth.api.ts               # unchanged: POST /auth/google_login contract
├── types/auth.ts                 # unchanged: GoogleLoginRequest { idToken }
└── lib/constants.ts              # unchanged: GOOGLE_CLIENT_ID already read from env

# backend (repo root) — no changes; /auth/google_login already implemented
```

**Structure Decision**: Frontend-only change inside `frontend/app/src`. No new directories — the fix is a component rewrite (`GoogleLoginButton.tsx`), a new provider mount point (`AppProviders.tsx`), and adding the button to `RegisterPage.tsx`. Backend (`src/modules/auth/`) is untouched since `/auth/google_login` already exists and expects the same `idToken` shape Google Identity Services produces.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — Constitution Check gate is not applicable (unratified template) and no complexity beyond the existing project patterns is introduced.
