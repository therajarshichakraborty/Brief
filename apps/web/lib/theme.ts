"use client";

import { useSyncExternalStore } from "react";
import { THEME_COLORS, THEME_STORAGE_KEY } from "./theme-script";

export type Theme = "light" | "dark" | "system";

const listeners = new Set<() => void>();
const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)");

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function applyTheme(theme: Theme) {
  const isDark = theme === "dark" || (theme === "system" && darkQuery().matches);
  const root = document.documentElement;

  // Switch every colour in one frame instead of letting each element animate on its own.
  root.classList.add("theme-switching");
  root.classList.toggle("dark", isDark);
  root.style.colorScheme = isDark ? "dark" : "light";
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", isDark ? THEME_COLORS.dark : THEME_COLORS.light));
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);

  const onSystemChange = () => {
    if (readTheme() === "system") applyTheme("system");
    onChange();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyTheme(readTheme());
    onChange();
  };

  const query = darkQuery();
  query.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onChange);
    query.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function setTheme(theme: Theme) {
  try {
    if (theme === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode); the choice still applies for this page.
  }
  applyTheme(theme);
  listeners.forEach((listener) => listener());
}

/** The single source of truth for the theme, shared by every toggle on the page. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "system" as Theme);
  return { theme, setTheme };
}
