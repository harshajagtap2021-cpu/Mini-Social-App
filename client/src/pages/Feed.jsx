import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Container, Stack, Typography } from "@mui/material";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import AppHeader from "../components/layout/AppHeader.jsx";
import ComposePostCard from "../components/feed/ComposePostCard.jsx";
import PostCard from "../components/feed/PostCard.jsx";
import FeedSkeleton from "../components/feed/FeedSkeleton.jsx";
import { usePaginatedFeed } from "../hooks/usePaginatedFeed.js";
import { useInfiniteScrollLoad } from "../hooks/useInfiniteScrollLoad.js";

export default function Feed() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const {
    posts,
    nextCursor,
    loadingInitial,
    loadingMore,
    error,
    loadInitial,
    loadMore,
    mergePost,
    prependPost,
  } = usePaginatedFeed();

  const [postText, setPostText] = useState("");
  const [postFile, setPostFile] = useState(null);
  const [postSubmitting, setPostSubmitting] = useState(false);
  const [postError, setPostError] = useState("");
  const [expandedComments, setExpandedComments] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [actionErrors, setActionErrors] = useState({});

  /** Keeps latest drafts for stable callbacks passed to memoized PostCard. */
  const commentDraftsRef = useRef(commentDrafts);
  commentDraftsRef.current = commentDrafts;

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const handleLoadMore = useCallback(() => {
    void loadMore();
  }, [loadMore]);

  const sentinelRef = useInfiniteScrollLoad({
    enabled: Boolean(nextCursor) && !loadingInitial,
    loading: loadingMore,
    onLoad: handleLoadMore,
  });

  const mergePostStable = useCallback(
    (updated) => {
      mergePost(updated);
    },
    [mergePost]
  );

  const toggleComments = useCallback((postId) => {
    setExpandedComments((e) => ({ ...e, [postId]: !e[postId] }));
  }, []);

  const setCommentDraft = useCallback((postId, value) => {
    setCommentDrafts((d) => ({ ...d, [postId]: value }));
  }, []);

  const handleCreatePost = useCallback(
    async (e) => {
      e.preventDefault();
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      const trimmed = postText.trim();
      if (!trimmed && !postFile) {
        setPostError("Add some text or choose an image.");
        return;
      }
      setPostError("");
      setPostSubmitting(true);
      try {
        const form = new FormData();
        if (trimmed) form.append("text", trimmed);
        if (postFile) form.append("image", postFile);
        const { data } = await api.post("/posts", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        prependPost(data.post);
        setPostText("");
        setPostFile(null);
      } catch (err) {
        setPostError(err.response?.data?.error || "Could not publish post.");
      } finally {
        setPostSubmitting(false);
      }
    },
    [isAuthenticated, navigate, postFile, postText, prependPost]
  );

  const handleLike = useCallback(
    async (postId) => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      setActionErrors((s) => ({ ...s, [postId]: "" }));
      try {
        const { data } = await api.post(`/posts/${postId}/like`);
        mergePostStable(data.post);
      } catch (err) {
        setActionErrors((s) => ({
          ...s,
          [postId]: err.response?.data?.error || "Like failed.",
        }));
      }
    },
    [isAuthenticated, mergePostStable, navigate]
  );

  const handleSendComment = useCallback(
    async (postId) => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      const text = (commentDraftsRef.current[postId] || "").trim();
      if (!text) return;
      setActionErrors((s) => ({ ...s, [postId]: "" }));
      try {
        const { data } = await api.post(`/posts/${postId}/comments`, { text });
        mergePostStable(data.post);
        setCommentDrafts((d) => ({ ...d, [postId]: "" }));
      } catch (err) {
        setActionErrors((s) => ({
          ...s,
          [postId]: err.response?.data?.error || "Comment failed.",
        }));
      }
    },
    [isAuthenticated, mergePostStable, navigate]
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppHeader
        isAuthenticated={isAuthenticated}
        username={user?.username}
        onLogout={logout}
      />

      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
          Public feed — newest first. Sign in to post, like, and comment. Scroll down to load older posts
          automatically.
        </Typography>

        <ComposePostCard
          isAuthenticated={isAuthenticated}
          text={postText}
          onTextChange={setPostText}
          file={postFile}
          onFileChange={setPostFile}
          error={postError}
          submitting={postSubmitting}
          onSubmit={handleCreatePost}
        />

        {error ? (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        ) : null}

        {loadingInitial ? <FeedSkeleton rows={3} /> : null}

        {!loadingInitial ? (
          <Stack spacing={2}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id}
                commentsOpen={Boolean(expandedComments[post.id])}
                onToggleComments={toggleComments}
                commentDraft={commentDrafts[post.id] || ""}
                onCommentDraftChange={setCommentDraft}
                onLike={handleLike}
                onSendComment={handleSendComment}
                actionError={actionErrors[post.id]}
              />
            ))}
          </Stack>
        ) : null}

        <Box ref={sentinelRef} sx={{ height: 1, py: 2 }} aria-hidden />

        {loadingMore ? (
          <Stack alignItems="center" sx={{ py: 2 }}>
            <CircularProgress size={28} aria-label="Loading more posts" />
          </Stack>
        ) : null}

        {!loadingInitial && nextCursor && !loadingMore ? (
          <Stack alignItems="center" sx={{ py: 1 }}>
            <Button variant="text" size="small" onClick={() => void loadMore()}>
              Load more
            </Button>
          </Stack>
        ) : null}

        {!loadingInitial && posts.length === 0 && !error ? (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            No posts yet. Be the first to share something.
          </Typography>
        ) : null}
      </Container>
    </Box>
  );
}
