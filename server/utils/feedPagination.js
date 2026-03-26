import mongoose from "mongoose";

/** Hard caps keep queries predictable and protect the database from huge scans. */
export const FEED_DEFAULT_LIMIT = 10;
export const FEED_MAX_LIMIT = 50;

/**
 * Parses `limit` and `cursor` from the query string.
 * Cursor is opaque to clients; we only document that it is returned as `nextCursor`.
 */
export function parseFeedQuery(query) {
  const raw = Number.parseInt(String(query.limit ?? FEED_DEFAULT_LIMIT), 10);
  const limit = Math.min(Math.max(Number.isFinite(raw) && raw > 0 ? raw : FEED_DEFAULT_LIMIT, 1), FEED_MAX_LIMIT);
  const cursor = typeof query.cursor === "string" && query.cursor.length > 0 ? query.cursor : null;
  return { limit, cursor };
}

/**
 * Keyset ("seek") filter for descending feed order: newer posts first.
 * Avoids large skip/offset values, which get slower as the user pages deeper.
 *
 * After the last visible post (createdAt = T, _id = I), the next page is every post
 * that sorts strictly after (T, I) under sort { createdAt: -1, _id: -1 }.
 */
export function buildPostsAfterCursorFilter(cursor) {
  if (!cursor) return {};
  try {
    const lastUnderscore = cursor.lastIndexOf("_");
    if (lastUnderscore <= 0) return {};
    const t = Number(cursor.slice(0, lastUnderscore));
    const id = cursor.slice(lastUnderscore + 1);
    if (!Number.isFinite(t) || !mongoose.Types.ObjectId.isValid(id)) return {};
    const cursorDate = new Date(t);
    const oid = new mongoose.Types.ObjectId(id);
    return {
      $or: [{ createdAt: { $lt: cursorDate } }, { createdAt: cursorDate, _id: { $lt: oid } }],
    };
  } catch {
    return {};
  }
}

/** Builds the opaque cursor string for the last document on the current page. */
export function encodePostCursor(doc) {
  const createdAt = doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt);
  return `${createdAt.getTime()}_${doc._id.toString()}`;
}
