/**
 * In production, static uploads are served from the Render API origin, not Vercel.
 * Dev: Vite proxies `/uploads` → keep relative paths.
 */
export function resolveMediaUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  if (base) return `${base}${path.startsWith("/") ? path : `/${path}`}`;
  return path;
}
