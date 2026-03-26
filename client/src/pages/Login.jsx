import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Link, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext.jsx";
import AuthLayout from "../components/auth/AuthLayout.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout isAuthenticated={isAuthenticated} username={user?.username} onLogout={logout}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Log in
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Welcome back. Continue to the feed and interact with posts.
      </Typography>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ mt: 3 }}>
          {loading ? "Signing in…" : "Log in"}
        </Button>
      </Box>
      <Typography sx={{ mt: 2 }} color="text.secondary">
        No account?{" "}
        <Link component={RouterLink} to="/signup" underline="hover">
          Sign up
        </Link>
      </Typography>
    </AuthLayout>
  );
}
