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

## Deploying (GitHub + Vercel/Netlify + Render)

**Yes — push the whole repo to GitHub.** One repository is normal: the frontend and backend are deployed as **two separate services**, each pointing at a subfolder of the same repo.

| Part | Where it runs | What to deploy |
|------|----------------|----------------|
| Frontend | **Vercel** or **Netlify** | `client/` (React/Vite build output) |
| Backend | **Render** | `server/` (Node/Express API) |

Do **not** commit `server/.env` or real secrets. `.gitignore` already ignores `.env`; keep using `server/.env.example` as documentation only.

### 1) Backend on Render (do this first)

1. Push the project to GitHub (no `.env` in the repo).
2. In [Render](https://render.com): **New → Web Service**, connect the repo.
3. **Root Directory:** `server`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start` (runs `node server.js`)
6. **Environment variables** (Render dashboard):
   - `MONGODB_URI` — your Atlas (or other) connection string
   - `JWT_SECRET` — long random string
   - `PORT` is set automatically by Render; the app already reads `process.env.PORT`.

7. Copy the public URL Render gives you, e.g. `https://your-api-name.onrender.com`.

**MongoDB Atlas:** under **Network Access**, allow your API to connect (often `0.0.0.0/0` for class projects; tighten later for production).

**Note:** On Render’s free tier the disk is **ephemeral**. Files in `server/uploads/` can disappear after a restart. For a real production app, move images to **S3**, **Cloudinary**, etc. For demos, it is usually acceptable.

### 2) Frontend on Vercel

1. **New Project** → import the same GitHub repo.
2. **Root Directory:** `client`
3. **Framework Preset:** Vite (or “Other” with build `npm run build`, output `dist`).
4. **Environment Variables:**
   - `VITE_API_URL` = your Render URL **without** a trailing slash, e.g. `https://your-api-name.onrender.com`  
   The app calls `https://…/api/...` and loads images from `https://…/uploads/...` using that origin.

5. Deploy. `client/vercel.json` adds a SPA fallback so React Router routes like `/login` work on refresh.

Redeploy the frontend whenever you change `VITE_API_URL`.

### 3) Frontend on Netlify

- Either use **`netlify.toml`** at the repo root (build runs in `client` and publishes `client/dist`), **or** in the Netlify UI set **Base directory** to `client`, build command `npm run build`, publish directory `dist`.
- Add the same **`VITE_API_URL`** in **Site settings → Environment variables**.

### How local dev still works

If `VITE_API_URL` is **unset**, the client keeps using relative `/api` and `/uploads` and the Vite dev proxy — no change to your current `npm run dev` workflow.

### CORS

The API uses `cors` with `origin: true`, so the browser’s `Origin` (your Vercel/Netlify URL) is reflected and allowed. No extra change is required for typical Bearer-token requests.
