import { createTheme } from "@mui/material/styles";

/**
 * Global design tokens: calm neutrals + teal accent (TaskPlanet-adjacent social feel).
 */
export const theme = createTheme({
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
    h6: { fontWeight: 700 },
  },
  palette: {
    mode: "light",
    primary: { main: "#0d9488", dark: "#0f766e", light: "#5eead4" },
    secondary: { main: "#475569" },
    background: { default: "#f1f5f9", paper: "#ffffff" },
    divider: "rgba(15, 23, 42, 0.08)",
  },
  shape: { borderRadius: 12 },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "medium" },
    },
  },
});
