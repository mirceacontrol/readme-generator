// useDarkMode.js
import { useEffect, useState } from "react";

export default function useDarkMode() {
  // This handles SSR/CSR and prevents hydration mismatches
  const [isMounted, setIsMounted] = useState(false);

  const getInitialTheme = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") return true;
      if (saved === "light") return false;
      // Fallback: system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  };

  const [darkMode, setDarkMode] = useState(getInitialTheme);

  // Sync theme on mount
  useEffect(() => {
    setIsMounted(true);
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Only return value when mounted (avoids hydration mismatch)
  return [isMounted ? darkMode : false, setDarkMode];
}
