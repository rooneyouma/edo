"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // For landlord and tenant pages, always use light theme
    // For other pages, use localStorage or default to light
    if (
      pathname &&
      (pathname.startsWith("/landlord") || pathname.startsWith("/tenant"))
    ) {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    } else {
      const storedTheme = localStorage.getItem("theme") || "light";
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    }
    setMounted(true);
  }, [pathname]);

  const toggleTheme = () => {
    // Only allow theme toggling for non-landlord/tenant pages
    if (
      pathname &&
      !pathname.startsWith("/landlord") &&
      !pathname.startsWith("/tenant")
    ) {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
