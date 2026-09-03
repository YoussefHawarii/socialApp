# Phase 0 Research: Google Login Button

## Unknowns from Technical Context

None marked `NEEDS CLARIFICATION` — the spec's Assumptions section already resolved the open questions (Google client ID is configured via `VITE_GOOGLE_CLIENT_ID`, backend endpoint is unchanged, styling is an implementation detail). The research below covers the technology choice needed to implement FR-001–FR-009.

## Decision: Use `@react-oauth/google` for the client-side Google sign-in flow

**Rationale**:
- It's a thin, actively maintained wrapper around Google Identity Services (GIS), the current (non-deprecated) Google sign-in API. Google's older `gapi.auth2` library is deprecated and shouldn't be used for new integrations.
- It provides a `<GoogleOAuthProvider clientId=...>` context provider plus a `<GoogleLogin onSuccess={...} onError={...} />` component that renders Google's own branded "Continue with Google" button — satisfying FR-001/FR-002 (no manual token entry, standard Google chooser) with minimal custom UI code.
- `onSuccess` returns a `credential` (a Google-issued ID token JWT) synchronously usable as the `idToken` the existing backend contract (`GoogleLoginRequest { idToken }`, `POST /auth/google_login`) already expects — so no backend or type changes are needed (FR-003).
- It has zero dependencies beyond React, matching this repo's lean dependency list, and works with React 19.

**Alternatives considered**:
- **Raw Google Identity Services `<script>` + `google.accounts.id.initialize/renderButton`**: More control, but requires manually loading the external script, managing its lifecycle, and hand-writing the callback wiring that `@react-oauth/google` already provides. Rejected as unnecessary complexity for a two-page button.
- **`react-google-login` (older, unmaintained)**: Built on the deprecated `gapi.auth2` library Google has sunset. Rejected — would ship a deprecated flow.
- **Firebase Auth / other full auth SDKs**: Would pull in an entire competing auth system when the backend already owns auth via JWT + `/auth/google_login`. Rejected as out of scope and redundant.

## Decision: Where to mount `GoogleOAuthProvider`

**Rationale**: The provider must wrap any component that renders `<GoogleLogin />`, i.e. both `LoginPage` and `RegisterPage`. Mounting it once in `AppProviders.tsx` (alongside the existing React Query / Router providers) is simplest and avoids provider duplication or forgetting it on a future third page.

**Alternatives considered**:
- **Wrap only around `LoginPage`/`RegisterPage` individually**: Works but duplicates the provider and risks drift if a third entry point is added later. Rejected in favor of the single app-root provider, consistent with how the other cross-cutting providers (Query client, Router) are already mounted in `AppProviders.tsx`.

## Decision: Error and cancel handling

**Rationale**: `@react-oauth/google`'s `<GoogleLogin>` exposes `onError` (fires when Google itself fails/cancels before producing a credential) separately from the existing `googleLogin.isError` (fires when the backend rejects the credential via `useGoogleLogin()`'s mutation). Mapping these to FR-005/FR-006:
- Google-side cancel/failure (`onError`) → no error shown, button just returns to idle (FR-005 — matches "user closes the chooser").
- Backend rejection (mutation `onError`) → reuse the existing `ApiErrorAlert` component already used elsewhere in `LoginPage.tsx` to show a human-readable message (FR-006), consistent with how `login.isError` is already handled.

**Alternatives considered**:
- **Show a generic error on any `onError` from Google**: Rejected — would violate FR-005 (cancelling should not show an error) since GIS's `onError` fires on both hard failures and simple dismissals without reliably distinguishing them; the safer default per FR-005 is to stay silent for the Google-side callback and only surface errors that come back from the backend exchange, which are the ones the user can act on.
