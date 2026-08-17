# Social App Frontend

This is the client for **Social App**, a full-stack social platform: a React SPA talking to the
Express/MongoDB API in the repository root ([root README](../../README.md)). Users can register,
build a profile with a Cloudinary-hosted avatar, post text/images, comment and reply, add
friends, chat in real time over Socket.IO, and — for admins — manage user roles from a dashboard.

Built module-by-module directly against the real backend (no mocked data), matching the
backend's actual request/response contracts, multipart upload keys, and Socket.IO event names.

## Stack

React 19, Vite, TypeScript, React Router, TanStack Query, Axios, Zustand, React Hook Form + Zod,
Socket.IO client, Tailwind CSS v4, ESLint + Prettier.

## Setup

```bash
npm install
npm run dev
```

Then create a `.env` file in this directory (`frontend/app/.env`) with the variables below before
starting the dev server — it isn't included in the repo since it's environment-specific.

Requires the backend running (default `http://localhost:3000`) with MongoDB reachable and its own
`.env` configured (see the root README's Configuration section).

### Environment variables

Create `frontend/app/.env` with:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Backend REST base URL |
| `VITE_SOCKET_URL` | Socket.IO server URL |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client id (for the Google login scaffold) |

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — typecheck (`tsc -b`) then production build
- `npm run lint` — ESLint
- `npm run format` — Prettier write

## What's implemented

**Phase 0-3 — Bootstrap, architecture, API/session engine, auth**
Vite/React/TS/Tailwind setup, path aliases (`@/*`), folder architecture (`app`, `pages`,
`features`, `components`, `services`, `store`, `lib`, `types`), Axios client with request/response
interceptors (attaches `Authorization: Bearer <token>`, retries once on 401 via
`GET /auth/refresh_token` sending `{ refresh_token }` in the body per the backend's non-standard
contract), Zustand auth store persisted to `localStorage`, toast system, reusable UI kit
(Button/Input/FormField/Spinner/Alert/Modal), login/register (OTP)/forget-reset password/account
activation/Google login scaffold, `ProtectedRoute`/`PublicOnlyRoute`/`RoleGuard`.

**Phase 4 — User/Profile**
Profile page (avatar, username, email, role, friends summary), edit username, change password,
update email (with pending-verification messaging), verify-email token page, profile picture
upload/delete (Cloudinary, multipart), deactivate account with confirmation modal.

**Phase 5 — Posts/Feed**
Feed with pagination, create post (text + multiple images, previews, remove-before-submit),
edit post (replaces all images when new ones are uploaded, per backend behavior), soft
delete/restore with an Archived tab, post details page, optimistic like/unlike with rollback.

**Phase 6 — Comments/Replies**
Comments panel on post details: create (text and/or one image), edit, soft delete, hard delete
(confirmed), one level of inline replies, optimistic like/unlike.

**Phase 7 — Friends**
Friends list, incoming friend requests, send request by user id, accept request, cache
invalidation on both actions.

**Phase 8 — Chat (REST + Socket.IO)**
Friend selector, REST history load (`GET /chat/:friendId`), realtime send via
`sendMessage`/receive via `successMessage`, connection status badge, socket lifecycle owned by
`useSocketConnection` (connects while authenticated, disconnects on logout) with duplicate-listener-safe
effect cleanup in `useChatSocket`.

**Phase 9 — Admin**
Role-guarded `/admin` route, users + posts overview, change-role form with confirmation modal,
cache invalidation after role changes.

**Phase 10 — Hardening**
Consistent loading/empty/error components across every page, normalized backend error message
parsing (including reflowing Joi's comma-joined validation messages), a11y passes (labels,
`aria-live` toasts, `role="dialog"` modals with focus-on-open, `role="tab"` feed tabs, keyboard
Escape-to-close), responsive layout (chat view stacks on mobile), query-key audit, route/role
guard audit, and this README.

## Known backend quirks handled in the frontend

- **Global rate limiting is aggressive**: `express-rate-limit` is configured for **3 requests per
  5 minutes per IP across the entire API** (not per-route). This is expected to make manual QA
  and even normal usage feel very restrictive: expect `"Too many requests..."` errors during
  testing. Not something the frontend can work around — flagged here since it materially affects
  the smoke-test experience below.
- **Refresh token contract**: `GET /auth/refresh_token` expects `refresh_token` in the request
  body despite being a GET. The Axios client sends it via `config.data` on a GET request
  (works via XHR, which — unlike `fetch` — permits a body on GET).
- **Register auto-activates accounts**: `POST /auth/register` sets `isActivated: true`
  unconditionally, even though `GET /auth/activate_account/:token` also exists. The activation
  page still works if a user follows an activation link, but it isn't required before login.
- **`GET /post/getAllActivePosts` pagination metadata is wrong for non-admin users**: `totalPages`
  /`totalposts` are computed from an unfiltered `countDocuments()` over the whole collection,
  while `data` is filtered to the current user's own posts (non-admins only ever see their own
  posts in the "feed", not a global feed). This can show e.g. "Page 1 of 2" with zero items on
  page 1. The frontend renders exactly what the backend returns rather than trying to reconcile
  the mismatch.
- **Comment author is inconsistently populated**: `GET /post/:postId/comment/` does not populate
  `user` (raw id only), while `GET /post/getPost/:id` does populate it. `Comment.user` is typed as
  `string | PostAuthor` and the UI falls back to "Unknown user" for the unpopulated case.
- **`friendRequests` is never populated**: only `friends` is. Incoming friend requests are shown
  as raw user ids with an Accept button — there's no endpoint to resolve them to profiles.
- **No user directory/search endpoint** exists for regular users, so "send friend request" is a
  manual user-id input rather than a picker.
- **REST chat send is effectively broken**: `POST /chat/message/:friendId` routes to a handler
  that is commented out in `chat.service.js`, so it would throw if called. All message sending
  therefore goes through the Socket.IO `sendMessage` event only (REST is used solely to load
  history), which matches the intended UX anyway.
- **Realtime delivery may not reach the recipient**: the socket handler does
  `socket.to(to).emit("successMessage", ...)`, targeting a room named after the recipient's user
  id, but no code ever calls `socket.join(<userId>)` — sockets are only ever in their
  auto-generated connection-id room. In practice this means the recipient's browser will often
  never receive the `successMessage` event even though the message is persisted to MongoDB. The
  frontend implements the documented contract faithfully (connect, emit `sendMessage`, listen for
  `successMessage`); this is a backend-side fix, out of scope here.
- **Response envelopes are inconsistent** across endpoints (`results`, `results.data`,
  `results.comment`, `post`, `posts`, bare `message`, some missing `success` entirely). The
  frontend types each endpoint's actual shape individually rather than assuming a common
  envelope, and prefers refetch/invalidate over trusting mutation response shapes where they're
  inconsistent (e.g. comments).

## Smoke-test checklist

Because of the 3-requests-per-5-minutes global limiter, run these in small batches with pauses
between batches rather than back-to-back.

- [ ] Register: request OTP → complete registration → redirected to login
- [ ] Login: wrong password shows backend error; correct credentials log in and land on the feed
- [ ] Refresh flow: after the access token expires (or is corrupted), the next API call
      transparently refreshes and retries once; a fully invalid refresh token logs the user out
- [ ] Forget/reset password: request OTP → reset → login with new password
- [ ] Account activation link opens `/activate-account/:token` and shows success/failure
- [ ] Route guards: visiting `/login` while authenticated redirects to `/`; visiting `/` while
      logged out redirects to `/login`; visiting `/admin` as a non-admin redirects away
- [ ] Profile: edit username, change password, update email (check the "verification sent"
      message), upload/delete profile picture, deactivate account (logs out)
- [ ] Feed: create a post with text/images, edit it, soft-delete it (appears in Archived),
      restore it, like/unlike (optimistic, rolls back on forced failure), paginate
- [ ] Post details: comment with text/image, edit, soft delete, hard delete (confirm dialog),
      reply, like/unlike a comment
- [ ] Friends: send a request by user id, accept an incoming request, list updates
- [ ] Chat: select a friend, load history, send a message (appears immediately, optimistic);
      note per the backend quirk above the *other* browser/session may not receive it live
- [ ] Admin (as admin/superAdmin): view users + posts, change a lower-ranked user's role, confirm
      modal blocks accidental submits, forbidden role changes surface the backend's 403 message
