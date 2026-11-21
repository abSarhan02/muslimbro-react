import { useEffect, useState } from "react";

// true quando scorro oltre offset px
// (navbar opaca)
export function useScrolled(offset) {
  const [scrolled, setScrolled] = useState(() => typeof window !== "undefined" && window.scrollY > offset);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > offset);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [offset]);

  return scrolled;
}
