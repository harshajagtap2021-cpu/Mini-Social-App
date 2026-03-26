import { Link as RouterLink } from "react-router-dom";
import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";

/**
 * Sticky top bar shared across the app shell (feed + auth pages can reuse branding).
 */
export default function AppHeader({ isAuthenticated, username, onLogout }) {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        backdropFilter: "blur(10px)",
        bgcolor: "rgba(255,255,255,0.86)",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: { xs: "100%", sm: 720, md: 900 },
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3 },
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          fontWeight={700}
          color="primary"
          sx={{ flexGrow: 1, textDecoration: "none" }}
        >
          Mini Social
        </Typography>
        {isAuthenticated ? (
          <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 1.5 }} flexWrap="wrap" justifyContent="flex-end">
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: { xs: 120, sm: "none" }, overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {username}
            </Typography>
            <Button color="inherit" size="small" onClick={onLogout}>
              Log out
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/login" color="inherit" size="small">
              Log in
            </Button>
            <Button component={RouterLink} to="/signup" variant="contained" size="small">
              Sign up
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
