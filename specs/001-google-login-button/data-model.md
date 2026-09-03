# Phase 1 Data Model: Google Login Button

No new persisted entities or schema changes. This feature reuses existing frontend types and the existing backend contract unchanged.

## Existing Entities Reused

### `GoogleLoginRequest` (`frontend/app/src/types/auth.ts`)

```ts
export interface GoogleLoginRequest {
  idToken: string;
}
```

- **Source of `idToken`**: Previously typed manually into a text field. After this feature, populated automatically from the `credential` returned by Google Identity Services' `onSuccess` callback (via `@react-oauth/google`'s `<GoogleLogin>`).
- **Validation**: None added on the frontend — the value is an opaque JWT string produced by Google, not user-editable. The backend's existing `/auth/google_login` handler remains the source of truth for verifying it.

### `LoginResponse` (existing, unchanged)

Returned by `authApi.googleLogin()` on success; already consumed by `useGoogleLogin()` to call `setTokens(access_token, refresh_token)` on the auth store — no change needed.

## Session / Auth State (existing, unchanged)

- **Authenticated session**: `auth.store` (Zustand) already persists `access_token`/`refresh_token` to localStorage on any successful login mutation (email/password or Google). This feature does not add new state — a successful Google sign-in flows through the same `setTokens` path as email/password login (FR-004).

## No Backend Changes

The backend's `/auth/google_login` endpoint and its expected request/response shapes are unchanged (per CLAUDE.md, this contract must stay in sync between frontend and backend — this feature intentionally keeps it as-is).
