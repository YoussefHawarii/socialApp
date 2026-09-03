# Quickstart: Validate Google Login Button

## Prerequisites

- `frontend/app/.env` has `VITE_GOOGLE_CLIENT_ID` set to a valid Google OAuth 2.0 Web Client ID (from Google Cloud Console, matching whatever the backend's `/auth/google_login` expects/verifies).
- Backend `.env` at repo root is configured and the backend is running (`npm start` at repo root) — `/auth/google_login` must be reachable.
- `frontend/app` dependencies installed, including the new `@react-oauth/google` package (`npm install` after it's added to `package.json`).

## Run

```bash
npm run dev
```
(run from `frontend/app`)

## Validation scenarios (maps to spec Acceptance Scenarios)

1. **Button replaces manual token field** — Open `/login` in a browser. Confirm you see a "Continue with Google"-style button (Google's own rendered button) and there is no free-text "Google ID token" input anywhere on the page. Repeat for `/register`.

2. **Happy path sign-in** — Click the Google button, choose a Google account in the popup, grant consent if prompted. Expect: redirected to `/`, and the app shows an authenticated state (e.g., a logged-in nav/profile element), same as after a normal email/password login. Verify `access_token`/`refresh_token` are set (e.g., via browser devtools → Application → Local Storage).

3. **Cancel flow** — Click the Google button, then close the account chooser popup without selecting an account. Expect: back on `/login`, no error message shown, page fully usable (per [data-model.md](data-model.md), see FR-005 contract in [contracts/google-login-button.md](contracts/google-login-button.md)).

4. **Backend rejection** — Temporarily point `VITE_API_BASE_URL` at a backend that returns an error for `/auth/google_login` (or stop the backend), attempt Google sign-in. Expect: a visible, human-readable error message on the page (via the existing `ApiErrorAlert` pattern), and the user is not signed in.

5. **Pending/loading state** — Using browser devtools network throttling, click the Google button and observe the button/area shows a disabled or loading indicator while the backend exchange is in flight, and a second click doesn't fire a duplicate request.

## Type-check

```bash
npm run build
```
(run from `frontend/app` — per CLAUDE.md, treat build success as the source of truth for type errors, since there is no dedicated frontend test suite)
