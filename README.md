# Social App Backend API

Backend API built with `Node.js`, `Express`, and `MongoDB` for user authentication, profile management, posts, comments, likes, and role-based admin controls.

This project includes:
- JWT authentication (`access` + `refresh` token flow)
- OTP email verification for registration and password reset
- User profile management with profile picture upload to Cloudinary
- Post CRUD-style operations (create, update, soft delete, restore, list, like/unlike)
- Comment system (create, update, reply, soft delete, hard delete, like/unlike)
- Role-based authorization (`user`, `admin`, `superAdmin`)
- Basic API security (`helmet`, `cors`, `express-rate-limit`)

---

## 1. Tech Stack

- Runtime: `Node.js` (engine pinned to `20.15.1`)
- Framework: `Express 5`
- Database: `MongoDB` + `Mongoose`
- Auth: `jsonwebtoken`, `bcrypt`
- Validation: `Joi`
- File Upload: `multer`
- Cloud Media: `cloudinary`
- Email: `nodemailer` + event-based emitter
- Deployment config: `vercel.json`

---

## 2. Project Structure

```txt
.
|- index.js
|- vercel.json
|- src/
|  |- app.controller.js
|  |- DB/
|  |  |- connection.js
|  |  |- models/
|  |     |- user.model.js
|  |     |- post.model.js
|  |     |- comment.model.js
|  |     |- otp.model.js
|  |- middleware/
|  |  |- authentication.middleware.js
|  |  |- authorization.middleware.js
|  |  |- validation.middleware.js
|  |- modules/
|  |  |- auth/
|  |  |- user/
|  |  |- post/
|  |  |- comment/
|  |  |- admin/
|  |- utils/
|     |- emails/
|     |- errors/
|     |- fileUploading/
|     |- hashing/
|     |- token/
|     |- encryption/
|- uploads/
```

---

## 3. How the App Boots

1. `index.js` loads environment variables and starts Express on port `3000`.
2. `src/app.controller.js`:
- Connects to MongoDB.
- Enables `cors`.
- Parses JSON.
- Adds global rate limit (`3` requests per `5` minutes per IP).
- Adds `helmet`.
- Mounts routes:
  - `/auth`
  - `/user`
  - `/post`
  - `/comment`
  - `/admin`
- Handles unknown routes and global errors.

---

## 4. Environment Variables

Create a `.env` file in the project root:

```env
CONNECTION_URI=
JWT_SECRET_KEY=
ACCESS_TOKEN_EXPIRES_IN=
REFRESH_TOKEN_EXPIRES_IN=
ROUNDS=
SECRET_KEY=
EMAIL=
PASS=
GOOGLE_CLIENT_ID=
CLOUD_NAME=
API_KEY=
API_SECRET=
CLOUD_FOLDER_NAME=
NODE_ENV=development
```

Meaning:
- `CONNECTION_URI`: MongoDB connection string
- `JWT_SECRET_KEY`: JWT signing secret
- `ACCESS_TOKEN_EXPIRES_IN`: access token expiry (example: `1h`)
- `REFRESH_TOKEN_EXPIRES_IN`: refresh token expiry (example: `7d`)
- `ROUNDS`: bcrypt salt rounds (example: `8` or `10`)
- `SECRET_KEY`: AES key used by encryption util
- `EMAIL`, `PASS`: Gmail SMTP credentials used by Nodemailer
- `GOOGLE_CLIENT_ID`: Google OAuth client id for Google login
- `CLOUD_*` + `API_*`: Cloudinary config
- `NODE_ENV`: affects error stack output

---

## 5. Run Locally

```bash
npm install
npm run dev
```

Scripts:
- `npm run dev`: run with `nodemon` + `.env`
- `npm start`: run with `node` + `.env`

Server default URL:
- `http://localhost:3000`

---

## 6. Authentication & Authorization

### Authentication middleware
- Reads `Authorization` header in format: `Bearer <token>`
- Verifies JWT and loads user from DB
- Rejects invalid/expired/changed-password sessions

### Authorization middleware
- Per-route role checks using allowed endpoint role lists
- Roles:
  - `superAdmin`
  - `admin`
  - `user`

---

## 7. API Modules and Endpoints

## Auth (`/auth`)

- `POST /auth/verify`
  - Send OTP for registration email.
- `POST /auth/register`
  - Register using `email + otp + password + confirmPassword + userName`.
- `GET /auth/activate_account/:token`
  - Account activation route (token based).
- `POST /auth/login`
  - Returns `access_token` and `refresh_token`.
- `POST /auth/forget_password`
  - Sends OTP for reset flow.
- `POST /auth/reset_password`
  - Resets password using OTP.
- `GET /auth/refresh_token`
  - Refreshes access token (expects `refresh_token` in body in current implementation).
- `POST /auth/google_login`
  - Login/registration via Google `idToken`.

## User (`/user`) - requires auth

- `GET /user/profile`
  - Current authenticated profile data.
- `PATCH /user/profile`
  - Update profile fields (validation currently for `userName`).
- `PATCH /user/change-password`
  - Change password using `oldPassword`.
- `DELETE /user/deactivate`
  - Soft-deactivate account (`isDeleted = true`).
- `PATCH /user/update-email`
  - Save temporary email and send verification email.
- `GET /user/verify-email/:token`
  - Finalize new email change.
- `POST /user/profilePicture`
  - Upload profile picture to Cloudinary.
- `DELETE /user/profilePicture`
  - Delete Cloudinary profile picture and restore default.

## Post (`/post`) - requires auth

- `POST /post/createPost`
  - Create post with text and/or images.
- `PATCH /post/updatePost/:id`
  - Update text and optional image replacement.
- `PATCH /post/softDeletePost/:id`
  - Soft delete post.
- `PATCH /post/restorePost/:id`
  - Restore soft-deleted post by same deleter.
- `GET /post/getPost/:id`
  - Get one post with populated comments/replies.
- `GET /post/getAllActivePosts`
  - List active posts.
  - Supports pagination via query `page` (custom Mongoose query helper, page size `4`).
- `GET /post/getAllnonActivePosts`
  - List soft-deleted posts.
- `PATCH /post/:id/like-unlike`
  - Toggle like on a post.

## Comment (`/post/:postId/comment`) - requires auth

- `POST /post/:postId/comment/`
  - Create comment.
- `PATCH /post/:postId/comment/:id`
  - Update comment.
- `PATCH /post/:postId/comment/:id/delete`
  - Soft delete comment.
- `GET /post/:postId/comment/`
  - Get all top-level comments and replies.
- `PATCH /post/:postId/comment/:id/like-unlike`
  - Toggle like on comment.
- `POST /post/:postId/comment/:id`
  - Reply to a comment.
- `DELETE /post/:postId/comment/:id`
  - Hard delete comment.

## Admin (`/admin`) - requires `admin` or `superAdmin`

- `GET /admin/`
  - Fetch all users and posts.
- `PATCH /admin/role`
  - Change target user role.
  - Includes `canChangeRole` hierarchy check:
    - `superAdmin` can act on lower roles.
    - `admin` can act on lower roles.

---

## 8. Data Models

## User

- Fields:
  - `email`, `password`, `userName`, `role`
  - `isActivated`, `isDeleted`, `tempEmail`
  - `provider` (`system` / `google`)
  - `profilePicture` (`secure_url`, `public_id`)
  - `pictures[]`
- Hooks:
  - `pre("save")` hashes password if modified.

## OTP

- Fields:
  - `email`, `otp`
- TTL index:
  - Expires after `300` seconds (5 minutes).

## Post

- Fields:
  - `text`, `images[]`, `user`, `likes[]`
  - `isDeleted`, `deletedBy`, `cloudFolder`
- Virtual:
  - `comments` relation.
- Query helper:
  - `.paginate(page)` with limit `4`.

## Comment

- Fields:
  - `post`, `user`, `text`, `image`
  - `likes[]`, `isDeleted`, `deletedBy`
  - `parentComment`
- Virtual:
  - `replies`.
- Hook:
  - recursive delete of child replies on hard delete.

---

## 9. Upload and Media Flow

- `multer` uses memory/temp flow for Cloudinary upload (`uploadCloud`).
- Local-disk upload util also exists (`multerUpload.js`) and creates user-specific folders.
- Current active routes mainly use Cloudinary:
  - User profile pictures
  - Post images
  - Comment/reply images

---

## 10. Email Flow

- Uses `EventEmitter` in `email.event.js`.
- Active email event:
  - `sendOTPEmail` (for verify/reset OTP).
- Email templates are generated from `generateHTML.js`.
- `update-email` sends verification URL using a dedicated template.

---

## 11. Error Handling

- `asyncHandler` wraps async route handlers.
- Unknown APIs go to `notFound`.
- `globalErrorHandler` sends:
  - status from `error.cause` or `500`
  - message
  - stack trace in non-production mode

---

## 12. Security

- `helmet` for common HTTP security headers.
- `cors` enabled.
- `express-rate-limit` globally enabled:
  - window: 5 minutes
  - max: 3 requests/IP

---

## 13. Deployment

`vercel.json` is configured to deploy `index.js` with `@vercel/node` and route all paths to that entry point.

---

## 14. Notes

- Test script is currently placeholder (`"no test specified"`).
- Both local filesystem and Cloudinary upload strategies are present; Cloudinary is the active route path in current controllers.
