# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Full-stack social platform: an Express/MongoDB REST+GraphQL+Socket.IO API at the repo root, paired
with a React SPA in `frontend/app`. Users register/log in, manage a profile with a Cloudinary
avatar, post text/images, comment/reply/like, add friends, chat in real time, and (admins) manage
roles. The two halves are separate npm projects with separate installs, separate `.env` files, and
separate Vercel deployments — always treat them independently unless a task explicitly spans both.

## Commands

### Backend (repo root)

```bash
npm install
npm start          # nodemon --env-file=.env index.js — loads .env via Node's --env-file flag
npm run dev         # node --watch index.js — relies on process-level env or a pre-existing .env
```

No test suite exists (`npm test` is a stub). There is no lint script for the backend.

### Frontend (`frontend/app` — always `cd` here first)

```bash
npm install
npm run dev         # Vite dev server
npm run build        # tsc -b && vite build — treat build success as the truth for type errors
npm run lint          # eslint .
npm run format         # prettier --write .
```

No test suite exists for the frontend either.

### Env setup

Backend needs a `.env` at the repo root: `CONNECTION_URI`, `JWT_SECRET_KEY`,
`ACCESS_TOKEN_EXPIRES_IN`, `REFRESH_TOKEN_EXPIRES_IN`, `ROUNDS`, `SECRET_KEY`, `EMAIL`, `PASS`,
`GOOGLE_CLIENT_ID`, `CLOUD_NAME`, `API_KEY`, `API_SECRET`, `CLOUD_FOLDER_NAME`, `NODE_ENV`.
`EMAIL`/`PASS` must be a Gmail address + an **App Password** (requires 2FA on the Google account) —
a normal account password will fail SMTP auth with a 535 error.

Frontend needs `frontend/app/.env`: `VITE_API_BASE_URL`, `VITE_SOCKET_URL`, `VITE_GOOGLE_CLIENT_ID`.
Neither `.env` is committed; there's no `.env.example` in the repo either (deliberately gitignored).

## Backend architecture (repo root, `src/`)

Feature-module layout under `src/modules/<domain>/`, each typically with:
- `<domain>.controller.js` — Express router (route wiring, middleware order)
- `<domain>.service.js` — route handlers (business logic), wrapped in `asyncHandler`
- `<domain>.validation.js` — Joi schemas, one per route
- `<domain>.endpoint.js` — arrays of allowed roles per action, consumed by `isAuthorized`

Domains: `auth`, `user`, `post`, `comment` (nested under `post`), `admin`, `chat`. GraphQL lives in
`src/modules/app.graph.js` + `src/modules/post/graphql/` (post reads only, mounted at `/graphql`).
Socket.IO lives in `src/socketio/` (`index.js` bootstraps it from `index.js` after `app.listen`).

**Middleware chain per protected route**: `isAuthenticate` (Bearer JWT → `req.user`) →
`isAuthorized(endpoints.<action>)` (role check) → optional `uploadCloud(...)` (multer → Cloudinary)
→ `validation(schema)` (Joi; merges `req.body` + `req.params` + `req.query`, and folds
`req.file`/`req.files` into `data.file`) → `asyncHandler(service.fn)`.

**Auth contract** (must stay in sync with the frontend's `httpClient.ts`):
- Access token in `Authorization: Bearer <token>` on every protected request.
- `GET /auth/refresh_token` is a GET that expects `{ refresh_token }` in the **request body**
  (non-standard, but that's the actual backend contract — don't "fix" it without updating both sides).
- Comments are nested: `/post/:postId/comment/*`, mounted via `router.use("/:postId/comment", commentRouter)`
  in `post.controller.js` with `mergeParams: true`.

**Known backend quirks worth knowing before debugging something that "just doesn't work"**:
- `express-rate-limit` in `src/app.controller.js` applies globally to the whole API, not per-route.
- Comment `user` field is populated on `GET /post/getPost/:id` but **not** on
  `GET /post/:postId/comment/` — same field, inconsistent population depending on endpoint.
- `User.friendRequests` is never populated (only `friends` is) — the frontend renders raw ids there.
- `POST /chat/message/:friendId` (REST send) has no working handler — all real-time chat send goes
  through the Socket.IO `sendMessage` event instead; REST is read-only (`GET /chat/:friendId`).
- Socket.IO auth middleware reassigns `socket.id = user.id` but nothing ever calls
  `socket.join(user.id)`, so `socket.to(to).emit("successMessage", ...)` targets a room nobody is
  in — realtime delivery to the recipient is unreliable. This is a platform/logic issue, not
  something the frontend can work around.
- Any code path that calls `mongoose.connect()` or reads `process.env` at **module top level**
  (i.e. as a side effect of `import`, not inside a function) must not assume `dotenv` has already
  run — `index.js` loads env via `import "dotenv/config"` as its first line specifically so
  ordering is correct; don't reorder imports above it.
- `connectDB()` (`src/DB/connection.js`) deliberately does not re-throw on failure — letting Express
  finish booting means DB-dependent routes fail through the normal `asyncHandler` →
  `globalErrorHandler` path (a proper JSON 500) instead of crashing the whole serverless function.
- Backend is deployed to Vercel as a `@vercel/node` serverless function (see root `vercel.json`).
  Serverless functions don't support persistent WebSocket connections, so Socket.IO chat is
  fundamentally unreliable in that production environment — a platform constraint, not a bug to fix
  in code.
- Error responses always look like `{ success: false, message: <string> }`
  (`src/utils/errors/globalErrorHandler.js`); Joi validation errors arrive as a **comma-joined
  string** (an array coerced through `new Error(arrayOfMessages)`), not a real array or object.

## Frontend architecture (`frontend/app/src/`)

Feature-based structure, mirroring the backend's domain split:
- `app/` — providers (`AppProviders.tsx`: React Query + Router), `AppRouter.tsx` (all routes),
  `routing/` (`ProtectedRoute`, `PublicOnlyRoute`, `RoleGuard`).
- `pages/<domain>/` — route-level components, thin wrappers around `features/`.
- `features/<domain>/` — TanStack Query hooks (`use*Queries.ts`, `use*Mutations.ts`), Zod schemas,
  and domain-specific components.
- `services/` — one Axios-based API client per backend domain (`auth.api.ts`, `post.api.ts`, etc.),
  all built on the shared `httpClient.ts`.
- `store/` — Zustand: `auth.store.ts` (tokens, persisted to localStorage), `toast.store.ts`.
- `components/ui/` — generic primitives (Button, Input, Modal, ...); `components/shared/` — app-aware
  shared pieces (layouts, `ApiErrorAlert`, pagination, image pickers).
- `types/` — one file per backend domain, typed to match that **specific endpoint's actual response
  shape** (the backend's response envelopes are inconsistent across endpoints — `results`,
  `results.data`, bare `post`/`posts`, etc. — so don't assume a shared envelope type fits everywhere).

**`httpClient.ts`** is the single Axios instance: request interceptor attaches the bearer token from
`auth.store`; response interceptor retries once on 401 via the refresh-token flow (deduped via a
shared in-flight promise so concurrent 401s don't fire multiple refreshes), then clears tokens and
gives up if refresh also fails.

**Socket lifecycle**: `services/socket.ts` holds a single module-level socket instance.
`useSocketConnection` (mounted once in `AppLayout`) connects/disconnects it based on auth state.
`useChatSocket` (per open conversation) is defensively idempotent about connecting too — because
child effects can run before parent effects on first mount, it doesn't assume the socket already
exists.

**Path alias**: `@/*` → `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json` — keep
both in sync if it ever changes).

## Deployment

Two independent Vercel projects, both linked to this GitHub repo but at different root directories:
- Backend: root directory `.`, uses the root `vercel.json` (`@vercel/node` builder for `index.js`).
- Frontend: root directory `frontend/app`, uses `frontend/app/vercel.json` (SPA rewrite —
  `/(.*)` → `/index.html` — required or client-side routes 404 on direct navigation).

Vercel env var changes do **not** take effect on already-running instances/deployments — a new
deployment is required to pick them up (push a commit, even an empty one, to trigger it via the
GitHub integration).

## Agent skills

### Issue tracker

Issues live in GitHub Issues for `YoussefHawarii/socialApp`, using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context layout: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
