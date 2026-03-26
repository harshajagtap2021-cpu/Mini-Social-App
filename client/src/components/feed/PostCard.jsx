import { memo, useCallback } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { formatPostDate } from "../../utils/formatDate.js";
import { resolveMediaUrl } from "../../utils/mediaUrl.js";

function userLikedPost(post, currentUserId) {
  if (!currentUserId) return false;
  return (post.likes || []).some((l) => String(l.userId) === String(currentUserId));
}

/**
 * Single feed item: content, lazy-loaded media, likes with usernames, comments thread.
 * Wrapped in `memo` so typing in another card’s comment field does not re-render the whole list.
 */
function PostCard({
  post,
  currentUserId,
  commentsOpen,
  onToggleComments,
  commentDraft,
  onCommentDraftChange,
  onLike,
  onSendComment,
  actionError,
}) {
  const liked = userLikedPost(post, currentUserId);
  const likesCount = post.likesCount ?? post.likes?.length ?? 0;
  const commentsCount = post.commentsCount ?? post.comments?.length ?? 0;

  const handleLike = useCallback(() => onLike(post.id), [onLike, post.id]);
  const handleSend = useCallback(() => onSendComment(post.id), [onSendComment, post.id]);

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "visible",
        boxShadow: (t) => t.shadows[1],
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 44, height: 44 }}>
            {(post.authorUsername || "?").charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={600} noWrap>
              {post.authorUsername}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatPostDate(post.createdAt)}
            </Typography>
          </Box>
        </Stack>

        {post.text ? (
          <Typography sx={{ mb: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{post.text}</Typography>
        ) : null}

        {post.imageUrl ? (
          <Box
            component="img"
            src={resolveMediaUrl(post.imageUrl)}
            alt=""
            loading="lazy"
            decoding="async"
            sx={{
              width: "100%",
              maxHeight: { xs: 280, sm: 400 },
              objectFit: "cover",
              borderRadius: 1.5,
              mb: 1.5,
              bgcolor: "action.hover",
            }}
          />
        ) : null}

        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
          <IconButton
            size="small"
            color={liked ? "error" : "default"}
            onClick={handleLike}
            aria-label={liked ? "Unlike" : "Like"}
            aria-pressed={liked}
          >
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {likesCount} {likesCount === 1 ? "like" : "likes"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            · {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
          </Typography>
        </Stack>

        {(post.likes || []).length > 0 ? (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              Liked by
            </Typography>
            <Stack direction="row" gap={0.5} flexWrap="wrap" useFlexGap>
              {post.likes.map((l, i) => (
                <Chip key={`${l.userId}-${i}`} label={l.username} size="small" variant="outlined" />
              ))}
            </Stack>
          </Box>
        ) : null}

        {actionError ? (
          <Typography variant="caption" color="error" display="block" sx={{ mb: 1 }}>
            {actionError}
          </Typography>
        ) : null}

        <Divider sx={{ my: 1.5 }} />
        <Button size="small" onClick={() => onToggleComments(post.id)}>
          {commentsOpen ? "Hide comments" : "Show comments"}
        </Button>
        <Collapse in={Boolean(commentsOpen)}>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {(post.comments || []).map((c) => (
              <Box key={c.id} sx={{ pl: 1, borderLeft: 2, borderColor: "divider" }}>
                <Typography variant="subtitle2" component="span" fontWeight={600}>
                  {c.username}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {formatPostDate(c.createdAt)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, wordBreak: "break-word" }}>
                  {c.text}
                </Typography>
              </Box>
            ))}
            {(!post.comments || post.comments.length === 0) && (
              <Typography variant="body2" color="text.secondary">
                No comments yet.
              </Typography>
            )}
          </Stack>
        </Collapse>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 2 }}>
          <TextField
            size="small"
            fullWidth
            placeholder={currentUserId ? "Write a comment…" : "Log in to comment"}
            value={commentDraft}
            onChange={(e) => onCommentDraftChange(post.id, e.target.value)}
            disabled={!currentUserId}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!currentUserId}
            aria-label="Send comment"
            sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default memo(PostCard);
