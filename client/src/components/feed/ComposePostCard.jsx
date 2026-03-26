import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";

/**
 * Composer for new posts: optional text + optional image (validated server-side).
 */
export default function ComposePostCard({
  isAuthenticated,
  text,
  onTextChange,
  file,
  onFileChange,
  error,
  submitting,
  onSubmit,
}) {
  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: (t) => t.shadows[1],
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          New post
        </Typography>
        <Box component="form" onSubmit={onSubmit}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="What’s on your mind? (optional if you add an image)"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            disabled={!isAuthenticated}
            sx={{ mb: 1.5 }}
          />
          <Button
            variant="outlined"
            component="label"
            size="small"
            sx={{ mr: 1, mb: 1 }}
            disabled={!isAuthenticated}
          >
            {file ? file.name : "Add image"}
            <input hidden type="file" accept="image/*" onChange={(e) => onFileChange(e.target.files?.[0] || null)} />
          </Button>
          {!isAuthenticated ? (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              <RouterLink to="/login">Log in</RouterLink> to create posts.
            </Typography>
          ) : null}
          {error ? (
            <Typography color="error" variant="caption" display="block" sx={{ mb: 1 }}>
              {error}
            </Typography>
          ) : null}
          <Button type="submit" variant="contained" disabled={submitting || !isAuthenticated}>
            {submitting ? "Posting…" : "Post"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
