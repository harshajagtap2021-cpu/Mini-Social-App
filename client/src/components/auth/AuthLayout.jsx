import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Link, Paper, Typography } from "@mui/material";
import AppHeader from "../layout/AppHeader.jsx";

/**
 * Centered auth screen with shared chrome: readers can return to the public feed.
 */
export default function AuthLayout({ children, isAuthenticated, username, onLogout }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: (t) =>
          `linear-gradient(165deg, ${t.palette.primary.light}22 0%, ${t.palette.background.default} 45%, ${t.palette.background.default} 100%)`,
      }}
    >
      <AppHeader isAuthenticated={isAuthenticated} username={username} onLogout={onLogout} />
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", py: { xs: 3, sm: 6 } }}>
        <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              boxShadow: (t) => t.shadows[2],
            }}
          >
            {children}
            <Typography sx={{ mt: 2 }} color="text.secondary" variant="body2">
              <Link component={RouterLink} to="/" underline="hover" color="inherit">
                ← Back to feed
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
