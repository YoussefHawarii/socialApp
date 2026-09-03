# Contract: `<GoogleLoginButton />` component

This feature has no new backend/API contract — it reuses the existing `POST /auth/google_login` endpoint unchanged (request `{ idToken: string }`, response matches `LoginResponse`, same as `POST /auth/login`). The contract that *is* new is the frontend component's behavioral interface, documented here since this is a UI-only feature.

## Props

```ts
// No required props — clientId is supplied by the ancestor GoogleOAuthProvider,
// and the backend exchange endpoint is fixed (authApi.googleLogin).
export function GoogleLoginButton(): JSX.Element
```

## Preconditions

- Must be rendered somewhere inside a `<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>` ancestor (mounted once in `AppProviders.tsx`). Rendering it outside that provider is a programming error, not a user-facing case.
- `VITE_GOOGLE_CLIENT_ID` must be set in the frontend `.env` (already documented as a required env var in CLAUDE.md).

## Behavior contract

| Trigger | Outcome |
|---|---|
| Component mounts | Renders Google's standard "Continue with Google" button (via `<GoogleLogin>`). No text input is rendered. |
| User clicks the button and completes account selection | `onSuccess({ credential })` fires → component calls `googleLogin.mutate({ idToken: credential })` → on mutation success, tokens are stored via existing `useGoogleLogin()` and the caller (`LoginPage`/`RegisterPage`) navigates to `/`. |
| User cancels/closes the Google chooser | Google's `onError` fires with no credential produced → component does nothing (no error UI, no navigation), matching FR-005. |
| Backend rejects the credential (`POST /auth/google_login` returns an error) | `googleLogin.isError` becomes true → component renders `<ApiErrorAlert error={googleLogin.error} />`, matching FR-006. |
| Mutation in flight | Google's button area shows a disabled/pending state (matching the existing `Button isLoading` pattern used elsewhere) to prevent duplicate submissions, matching FR-007. |

## Consumers

- `frontend/app/src/pages/auth/LoginPage.tsx` — existing usage, behavior unchanged from the caller's point of view (still just `<GoogleLoginButton />`).
- `frontend/app/src/pages/auth/RegisterPage.tsx` — new usage, added per FR-008.
