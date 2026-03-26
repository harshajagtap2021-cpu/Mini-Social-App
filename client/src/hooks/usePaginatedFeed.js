import { useCallback, useRef, useState } from "react";
import api from "../api/client.js";
import { FEED_PAGE_SIZE } from "../constants/feed.js";

/**
 * Cursor-based feed: first load + "load more" append.
 * New posts are prepended so authors see their content immediately without refetching pages.
 */
export function usePaginatedFeed() {
  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const loadingMoreRef = useRef(false);

  const fetchPage = useCallback(async (cursor) => {
    const { data } = await api.get("/posts", {
      params: { limit: FEED_PAGE_SIZE, ...(cursor ? { cursor } : {}) },
    });
    return {
      posts: data.posts || [],
      nextCursor: data.nextCursor ?? null,
    };
  }, []);

  const loadInitial = useCallback(async () => {
    setError("");
    setLoadingInitial(true);
    try {
      const { posts: first, nextCursor: cursor } = await fetchPage(null);
      setPosts(first);
      setNextCursor(cursor);
    } catch {
      setError("Could not load the feed. Is the API running?");
      setPosts([]);
      setNextCursor(null);
    } finally {
      setLoadingInitial(false);
    }
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    setError("");
    try {
      const { posts: older, nextCursor: cursor } = await fetchPage(nextCursor);
      setPosts((prev) => {
        const seen = new Set(prev.map((p) => String(p.id)));
        const merged = older.filter((p) => !seen.has(String(p.id)));
        return [...prev, ...merged];
      });
      setNextCursor(cursor);
    } catch {
      setError("Could not load more posts.");
    } finally {
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }, [fetchPage, nextCursor]);

  const mergePost = useCallback((updated) => {
    setPosts((prev) => prev.map((p) => (String(p.id) === String(updated.id) ? updated : p)));
  }, []);

  const prependPost = useCallback((post) => {
    setPosts((prev) => [post, ...prev.filter((p) => String(p.id) !== String(post.id))]);
  }, []);

  return {
    posts,
    nextCursor,
    loadingInitial,
    loadingMore,
    error,
    setError,
    loadInitial,
    loadMore,
    mergePost,
    prependPost,
  };
}
