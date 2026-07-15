import { useEffect, useState } from "react";

// This hook indicates whether the viewport is wider than a specific value
function useIsWide(breakpoint = 600) {
  const [isWide, setIsWide] = useState(window.innerWidth >= breakpoint);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const handler = (e) => setIsWide(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [breakpoint]);

  return isWide;
}

export default useIsWide;
