import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { authRequired, attachUser } from "../middleware/auth.js";
import {
  parseFeedQuery,
  buildPostsAfterCursorFilter,
  encodePostCursor,
} from "../utils/feedPagination.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname) || ".jpg"}`;
    cb(null, safe);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\//.test(file.mimetype);
    cb(ok ? null : new Error("Only image uploads are allowed."), ok);
  },
});

const router = Router();

function serializePost(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: o._id,
    authorUsername: o.authorUsername,
    text: o.text || "",
    imageUrl: o.imageUrl || "",
    createdAt: o.createdAt,
    likes: (o.likes || []).map((l) => ({
      userId: l.userId,
      username: l.username,
    })),
    comments: (o.comments || []).map((c) => ({
      id: c._id,
      userId: c.userId,
      username: c.username,
      text: c.text,
      createdAt: c.createdAt,
    })),
    likesCount: (o.likes || []).length,
    commentsCount: (o.comments || []).length,
  };
}

/**
 * Paginated public feed. Uses keyset pagination (cursor + limit), not skip/offset.
 * Fetch `limit + 1` to know if another page exists without a separate count query.
 */
router.get("/", async (req, res) => {
  try {
    const { limit, cursor } = parseFeedQuery(req.query);
    const filter = buildPostsAfterCursorFilter(cursor);
    const take = limit + 1;
    const batch = await Post.find(filter).sort({ createdAt: -1, _id: -1 }).limit(take);
    const hasMore = batch.length > limit;
    const page = hasMore ? batch.slice(0, limit) : batch;
    const nextCursor = hasMore && page.length ? encodePostCursor(page[page.length - 1]) : null;
    res.json({
      posts: page.map((p) => serializePost(p)),
      nextCursor,
      limit,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not load posts." });
  }
});

router.post("/", authRequired, attachUser, (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "Upload failed." });
    }
    try {
      const user = req.user || (await User.findById(req.userId));
      if (!user) {
        return res.status(401).json({ error: "User not found." });
      }
      const text = (req.body?.text ?? "").trim();
      const imagePath = req.file ? `/uploads/${req.file.filename}` : "";
      if (!text && !imagePath) {
        return res.status(400).json({ error: "Provide text and/or an image." });
      }
      const post = await Post.create({
        authorId: user._id,
        authorUsername: user.username,
        text,
        imageUrl: imagePath,
      });
      res.status(201).json({ post: serializePost(post) });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Could not create post." });
    }
  });
});

router.post("/:id/like", authRequired, attachUser, async (req, res) => {
  try {
    const user = req.user || (await User.findById(req.userId));
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    const uid = user._id.toString();
    const idx = post.likes.findIndex((l) => l.userId.toString() === uid);
    if (idx >= 0) {
      post.likes.splice(idx, 1);
    } else {
      post.likes.push({ userId: user._id, username: user.username });
    }
    await post.save();
    res.json({ post: serializePost(post) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not update like." });
  }
});

router.post("/:id/comments", authRequired, attachUser, async (req, res) => {
  try {
    const user = req.user || (await User.findById(req.userId));
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }
    const text = (req.body?.text ?? "").trim();
    if (!text) {
      return res.status(400).json({ error: "Comment text is required." });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }
    post.comments.push({
      userId: user._id,
      username: user.username,
      text,
    });
    await post.save();
    res.status(201).json({ post: serializePost(post) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not add comment." });
  }
});

export default router;
