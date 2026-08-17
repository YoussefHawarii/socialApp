# Social App

A full-stack social platform: a REST + GraphQL + Socket.IO API (this repository's root) paired
with a React SPA client in [`frontend/app`](frontend/app). Users can register/log in, manage a
profile with a Cloudinary-hosted avatar, create posts with images, comment/reply/like, add
friends, chat in real time, and (for admins) manage user roles.

This document covers the **backend API**. For the frontend — setup, environment variables, and
the full list of implemented pages/features — see [`frontend/app/README.md`](frontend/app/README.md).

## Project structure

```
.
├── src/                  # Express app: routes, services, models, middleware, GraphQL, sockets
├── index.js              # Entry point — boots Express, Socket.IO, and the DB connection
└── frontend/
    └── app/              # React + Vite + TypeScript client (separate README, separate install)
```

The backend and frontend are developed and run independently — install and start each one
separately (see each project's own setup instructions).

## Description

This project includes:

- JWT authentication with access and refresh token flow.
- OTP email verification for registration and password reset.
- Google login support.
- User profile management with Cloudinary profile picture upload.
- Friend request and friend acceptance flow.
- Post operations: create, update, soft delete, restore, list, and like/unlike.
- Comment operations: create, update, reply, soft delete, hard delete, and like/unlike.
- GraphQL post query schema mounted at `/graphql`.
- Chat storage with MongoDB and real-time message sending through Socket.IO.
- Role-based authorization with `user`, `admin`, and `superAdmin` roles.
- Basic API security with `helmet`, `cors`, and `express-rate-limit`.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [New Features](#new-features)
- [New Files](#new-files)
- [Configuration](#configuration)
- [Dependencies](#dependencies)
- [License](#license)
- [Contribution Guidelines](#contribution-guidelines)

## Installation

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root before running the server. See [Configuration](#configuration) for the required variables.

## Usage

Run the application in watch mode:

```bash
npm run dev
```

Run the application with `nodemon` and `.env` loading:

```bash
npm start
```

The server listens on:

```txt
http://localhost:3000
```

All authenticated REST routes expect this header format:

```http
Authorization: Bearer <token>
```

### REST API

#### Auth Routes

Base path: `/auth`

- `POST /auth/verify` - Send OTP for registration email verification.
- `POST /auth/register` - Register with `email`, `otp`, `password`, `confirmPassword`, and `userName`.
- `GET /auth/activate_account/:token` - Activate an account using a token.
- `POST /auth/login` - Login and return access and refresh tokens.
- `POST /auth/forget_password` - Send OTP for password reset.
- `POST /auth/reset_password` - Reset password using OTP.
- `GET /auth/refresh_token` - Refresh access token.
- `POST /auth/google_login` - Login or register using a Google `idToken`.

#### User Routes

Base path: `/user`

- `GET /user/profile` - Get the authenticated user's profile with populated friends.
- `PATCH /user/profile` - Update profile fields validated by `user.validation.js`.
- `PATCH /user/change-password` - Change password using `oldPassword`, `password`, and `confirmPassword`.
- `DELETE /user/deactivate` - Soft-deactivate the authenticated account.
- `PATCH /user/update-email` - Store a temporary email and send verification mail.
- `GET /user/verify-email/:token` - Confirm and apply a temporary email change.
- `POST /user/profilePicture` - Upload a profile picture to Cloudinary.
- `DELETE /user/profilePicture` - Delete the Cloudinary profile picture and restore the default image.
- `POST /user/send-friend-request/:friendId` - Send a friend request to another active, non-deleted user.
- `POST /user/friend-request/:friendId/accept` - Accept a pending friend request.

#### Post Routes

Base path: `/post`

- `POST /post/createPost` - Create a post with text and/or images.
- `PATCH /post/updatePost/:id` - Update post text and optionally replace images.
- `PATCH /post/softDeletePost/:id` - Soft-delete a post.
- `PATCH /post/restorePost/:id` - Restore a soft-deleted post.
- `GET /post/getPost/:id` - Get one post with populated comments and replies.
- `GET /post/getAllActivePosts` - List active posts.
- `GET /post/getAllnonActivePosts` - List soft-deleted posts.
- `PATCH /post/:id/like-unlike` - Toggle like/unlike on a post.

#### Comment Routes

Base path: `/post/:postId/comment`

- `POST /post/:postId/comment/` - Create a top-level comment.
- `PATCH /post/:postId/comment/:id` - Update a comment.
- `PATCH /post/:postId/comment/:id/delete` - Soft-delete a comment.
- `GET /post/:postId/comment/` - Get top-level comments and replies.
- `PATCH /post/:postId/comment/:id/like-unlike` - Toggle like/unlike on a comment.
- `POST /post/:postId/comment/:id` - Reply to a comment.
- `DELETE /post/:postId/comment/:id` - Hard-delete a comment.

#### Admin Routes

Base path: `/admin`

- `GET /admin/` - Fetch users and posts.
- `PATCH /admin/role` - Change a target user's role according to role hierarchy checks.

#### Chat Routes

Base path: `/chat`

- `GET /chat/:friendId` - Get the stored chat between the authenticated user and a friend.

### GraphQL

GraphQL is mounted at:

```txt
http://localhost:3000/graphql
```

The GraphQL handler reads the `authorization` header and passes it into the GraphQL context.

Declared post queries include:

```graphql
query GetOnePost($id: ID!) {
  onePost(id: $id) {
    success
    statusCode
    results {
      _id
      text
      images {
        secure_url
        public_id
      }
      user {
        _id
        email
        userName
      }
      likes
      isDeleted
      deletedBy
      createdAt
      updatedAt
    }
  }
}
```

```graphql
query GetAllPosts {
  allPosts {
    success
    statusCode
    results {
      _id
      text
      user {
        _id
        userName
      }
    }
  }
}
```

### Socket.IO Chat

Socket.IO starts from `index.js` after the Express server is created.

Clients must authenticate through the Socket.IO handshake auth object:

```javascript
const socket = io("http://localhost:3000", {
  auth: {
    authorization: "Bearer <token>",
  },
});
```

Send a message:

```javascript
socket.emit("sendMessage", {
  to: "<friendUserId>",
  message: "Hello",
});
```

Listen for incoming message notifications:

```javascript
socket.on("successMessage", (payload) => {
  console.log(payload);
});
```

## New Features

- Friend requests: Users can send a friend request with `POST /user/send-friend-request/:friendId`. The target user receives the sender ID in `friendRequests`.
- Friend acceptance: Users can accept a pending request with `POST /user/friend-request/:friendId/accept`. Both users are added to each other's `friends` arrays, and the pending request is removed.
- Friend-aware profile response: `GET /user/profile` populates the authenticated user's `friends` field.
- Friend and request guard helpers: `areFriends()` and `requestExists()` prevent duplicate friendships and duplicate pending requests.
- GraphQL endpoint: `/graphql` is mounted with `graphql-http` and exposes post query definitions from `src/modules/post/graphql/post.query.js`.
- GraphQL middleware composition: GraphQL authentication, validation, and middleware composition helpers support resolver-level access checks and argument validation.
- GraphQL post response types: Post, user, and image response types define the GraphQL shape for post query results.
- Real-time chat with Socket.IO: The server authenticates Socket.IO clients with the same Bearer token format used by REST routes and handles `sendMessage` events.
- Chat persistence: Chat messages are stored in MongoDB using the `chat` model, with exactly two members per chat document.
- Chat history endpoint: `GET /chat/:friendId` returns the stored chat between the authenticated user and the selected friend.
- ObjectId validation helper: `isValidObjectId` in `src/middleware/validation.middleware.js` validates route params such as `friendId`.

## New Files

- [`src/DB/models/chat.model.js`](src/DB/models/chat.model.js) - Mongoose chat model with two chat members and timestamped message subdocuments.
- [`src/graphql/allFunctions.js`](src/graphql/allFunctions.js) - Utility for composing GraphQL middleware functions around a resolver.
- [`src/graphql/authentication.js`](src/graphql/authentication.js) - GraphQL authentication middleware using Bearer JWT tokens and optional role checks.
- [`src/graphql/validation.js`](src/graphql/validation.js) - GraphQL argument validation wrapper using Joi schemas.
- [`src/modules/app.graph.js`](src/modules/app.graph.js) - Main GraphQL schema definition and root query registration.
- [`src/modules/chat/chat.controller.js`](src/modules/chat/chat.controller.js) - Express chat router for chat history and declared message route wiring.
- [`src/modules/chat/chat.service.js`](src/modules/chat/chat.service.js) - Chat REST service logic for loading a chat between two users.
- [`src/modules/chat/chat.validation.js`](src/modules/chat/chat.validation.js) - Joi validation schemas for chat route parameters and message content.
- [`src/modules/post/graphql/post.graph.service.js`](src/modules/post/graphql/post.graph.service.js) - GraphQL resolver logic for post queries.
- [`src/modules/post/graphql/post.graphql.validation.js`](src/modules/post/graphql/post.graphql.validation.js) - Joi validation schema for GraphQL post query arguments.
- [`src/modules/post/graphql/post.mutation.js`](src/modules/post/graphql/post.mutation.js) - Placeholder file for future post GraphQL mutations.
- [`src/modules/post/graphql/post.query.js`](src/modules/post/graphql/post.query.js) - GraphQL post query definitions for `onePost` and `allPosts`.
- [`src/modules/post/graphql/types/post.types.request.js`](src/modules/post/graphql/types/post.types.request.js) - GraphQL argument type definitions for post queries.
- [`src/modules/post/graphql/types/post.types.response.js`](src/modules/post/graphql/types/post.types.response.js) - GraphQL response type definitions for post data.
- [`src/modules/user/graphql/user.types.response.js`](src/modules/user/graphql/user.types.response.js) - GraphQL response type definition for user data embedded in post responses.
- [`src/modules/user/helpers/checkFriends.js`](src/modules/user/helpers/checkFriends.js) - Helper functions for checking existing friendships and pending friend requests.
- [`src/socketio/chatting/chat.services.js`](src/socketio/chatting/chat.services.js) - Socket.IO chat message handler that creates chat documents and stores messages.
- [`src/socketio/index.js`](src/socketio/index.js) - Socket.IO server bootstrap and event registration.
- [`src/socketio/middleware/authentication.socketio.js`](src/socketio/middleware/authentication.socketio.js) - Socket.IO authentication middleware using Bearer JWT tokens.
- [`src/utils/graphql/image.type.js`](src/utils/graphql/image.type.js) - Reusable GraphQL image type with `secure_url` and `public_id`.

## Configuration

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

Variable meanings:

- `CONNECTION_URI` - MongoDB connection string.
- `JWT_SECRET_KEY` - JWT signing secret.
- `ACCESS_TOKEN_EXPIRES_IN` - Access token expiry.
- `REFRESH_TOKEN_EXPIRES_IN` - Refresh token expiry.
- `ROUNDS` - bcrypt salt rounds.
- `SECRET_KEY` - AES key used by the encryption utility.
- `EMAIL` - Email address used by Nodemailer.
- `PASS` - Email password or app password used by Nodemailer.
- `GOOGLE_CLIENT_ID` - Google OAuth client ID for Google login.
- `CLOUD_NAME` - Cloudinary cloud name.
- `API_KEY` - Cloudinary API key.
- `API_SECRET` - Cloudinary API secret.
- `CLOUD_FOLDER_NAME` - Cloudinary folder name used by upload utilities.
- `NODE_ENV` - Runtime environment. Non-production mode includes stack traces in error responses.

## Dependencies

Runtime and framework:

- `node` engine: `20.15.1`
- `express`
- `mongoose`
- `dotenv`

Authentication and security:

- `jsonwebtoken`
- `bcrypt`
- `bcryptjs`
- `google-auth-library`
- `helmet`
- `cors`
- `express-rate-limit`

Validation and async handling:

- `joi`
- `express-async-handler`

Uploads and media:

- `multer`
- `cloudinary`
- `nanoid`

Email and tokens:

- `nodemailer`
- `randomstring`
- `crypto-js`

GraphQL and real-time messaging:

- `graphql`
- `graphql-http`
- `socket.io`

Deployment:

- `vercel.json` configures `index.js` for deployment with `@vercel/node`.

## License

This project is licensed under the ISC License.

## Contribution Guidelines

1. Create a focused branch for each change.
2. Keep changes scoped to the feature or fix being implemented.
3. Add or update validation schemas when adding request inputs.
4. Keep route documentation in this README aligned with controller and service changes.
5. Run the app locally before opening a pull request.
6. Do not commit `.env`, credentials, generated local uploads, or other sensitive files.
