# Mini Social Post Application

React + Express + MongoDB mini social feed: signup/login, posts (text and/or image), public feed, likes (with usernames), and comments (with usernames). UI uses Material UI.

## Requirements

- Node.js 18+
- MongoDB running locally or a `MONGODB_URI` connection string

## Setup

1. Copy `server/.env.example` to `server/.env` and set `JWT_SECRET` (and `MONGODB_URI` if not local).

2. Install dependencies:

```bash
npm run install:all
```

Or: `npm install` in the repo root, then `cd server && npm install`, then `cd ../client && npm install`.

## Run (development)

Start MongoDB, then from the repo root:

```bash
npm run dev
```

- API: [http://127.0.0.1:5000](http://127.0.0.1:5000)
- App: [http://127.0.0.1:5173](http://127.0.0.1:5173)

The Vite dev server proxies `/api` and `/uploads` to the API.

## Assignment notes

- **Collections:** `users` and `posts` only (Mongoose models `User` and `Post`).
- **Auth:** JWT in `Authorization: Bearer` header; stored in `localStorage` on the client.
- **Posts:** Multipart upload for optional image; at least one of text or image is required.
- **Likes / comments:** Usernames are stored on each post; the feed updates immediately from API responses after like or comment.

### Feed pagination (API)

`GET /api/posts` supports **cursor-based** paging (keyset on `createdAt` + `_id`), not `skip`/`offset`:

- Query: `limit` (default `10`, max `50`), optional `cursor` (opaque string from the previous response).
- Response: `{ posts, nextCursor, limit }`. When `nextCursor` is `null`, there are no older posts.

The UI loads the first page, then appends older posts via infinite scroll (with a **Load more** fallback button).

## UI / code structure (bonus-oriented)

- MUI theme tuned for spacing, typography, and responsive breakpoints; feed uses `maxWidth="md"` and mobile-friendly stacks.
- Reusable pieces: `AppHeader`, `AuthLayout`, `ComposePostCard`, `PostCard` (memoized), `FeedSkeleton`.
- Hooks: `usePaginatedFeed`, `useInfiniteScrollLoad`.

---

### CORS

The API uses `cors` with `origin: true`, so the browser’s `Origin` (your Vercel/Netlify URL) is reflected and allowed. No extra change is required for typical Bearer-token requests.
