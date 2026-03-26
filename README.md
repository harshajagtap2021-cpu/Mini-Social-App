# Mini Social Post Application

A small social-style app: **signup / login**, **posts** (text and/or image), a **public feed**, **likes** and **comments** with usernames stored in MongoDB. Built with **React (Vite) + Material UI** on the frontend and **Node.js + Express + Mongoose** on the backend.

---

## Project links

| Resource | URL |
|----------|-----|
| **GitHub repository** | [github.com/harshajagtap2021-cpu/Mini-Social-App](https://github.com/harshajagtap2021-cpu/Mini-Social-App) |
| **Live frontend (Vercel)** | [mini-social-app.vercel.app](https://mini-social-app-topaz.vercel.app/) |
| **Live backend API (Render)** | [mini-social-app.onrender.com](https://mini-social-app-limz.onrender.com) |

---

## Features

- Account creation and login (email + password); passwords hashed with **bcrypt**; **JWT** for API auth  
- Create posts with optional **text** and/or **image** (at least one required)  
- Public feed with **cursor-based pagination** (infinite scroll + “Load more”)  
- Like (toggle) and comment; **usernames** stored for likers and commenters; UI updates from API responses  
- Responsive UI with reusable components (header, auth layout, post card, composer)

---

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 18, Vite, Material UI, React Router, Axios |
| Backend | Express, Mongoose, Multer (uploads), jsonwebtoken, cors |
| Database | MongoDB (Atlas in production) |

---

## Local development

**Requirements:** Node.js 18+, MongoDB (local or Atlas URI).

1. Copy `server/.env.example` → `server/.env` and set `MONGODB_URI` and `JWT_SECRET`.  
2. Install dependencies:

```bash
npm run install:all
```

3. Run API + Vite together:

```bash
npm run dev
``` 

With **`VITE_API_URL` unset**, the client uses the Vite proxy for `/api` and `/uploads`.

---

## Environment variables

### Backend (`server/.env` or Render)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `PORT` | Optional locally; **Render sets this automatically** |

### Frontend (Vercel / Netlify)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Render API origin only, **no trailing slash**, e.g. `https://mini-social-app.onrender.com` |

---

## API notes

- **Auth:** `POST /api/auth/signup`, `POST /api/auth/login` — send `Authorization: Bearer <token>` for protected routes.  
- **Posts:** `GET /api/posts?limit=10&cursor=...` — cursor-based pagination; `POST /api/posts` (multipart) create; `POST /api/posts/:id/like`, `POST /api/posts/:id/comments`.  
- **Uploads:** served at `/uploads/...` on the same host as the API.

---

## Repository layout

```
├── client/          # React (Vite) frontend
├── server/          # Express API + Mongoose models
├── package.json     # Root scripts (concurrently dev)
├── netlify.toml     # Optional Netlify build config
└── README.md
```

---

## License

Use for educational / assignment purposes unless you add your own license.
