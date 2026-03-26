/**
 * `VITE_API_URL` = Render backend origin only, e.g. https://mini-social-api.onrender.com
 * Omit in local dev so `/api` and `/uploads` use the Vite proxy.
 */
const raw = import.meta.env.VITE_API_URL || "";
export const API_ORIGIN = raw.replace(/\/$/, "");

export function apiBasePath() {
  return API_ORIGIN ? `${API_ORIGIN}/api` : "/api";
}
