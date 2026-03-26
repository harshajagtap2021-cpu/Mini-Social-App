import { useEffect, useRef } from "react";

/**
 * When the sentinel element enters the viewport, request the next page.
 * `rootMargin` preloads slightly before the user hits the bottom.
 */
export function useInfiniteScrollLoad({ enabled, loading, onLoad }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!enabled || loading) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoad();
      },
      { root: null, rootMargin: "280px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, loading, onLoad]);

  return sentinelRef;
}
