import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Link, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext.jsx";
import AuthLayout from "../components/auth/AuthLayout.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isAuthenticated, user, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(email, password, username);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Could not create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout isAuthenticated={isAuthenticated} username={user?.username} onLogout={logout}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Create account
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Sign up with email and a display name. You can post text, images, or both.
      </Typography>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />
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
          autoComplete="new-password"
        />
        <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ mt: 3 }}>
          {loading ? "Creating…" : "Sign up"}
        </Button>
      </Box>
      <Typography sx={{ mt: 2 }} color="text.secondary">
        Already have an account?{" "}
        <Link component={RouterLink} to="/login" underline="hover">
          Log in
        </Link>
      </Typography>
    </AuthLayout>
  );
}
