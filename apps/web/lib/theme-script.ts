export const THEME_STORAGE_KEY = "brief-theme";

export const THEME_COLORS = { light: "#ffffff", dark: "#111317" } as const;

/**
 * Runs in <head> before first paint (see app/layout.tsx), so the page never
 * flashes the wrong theme. Must stay dependency-free and ES5-safe.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||((!t||t==="system")&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;if(d)r.classList.add("dark");r.style.colorScheme=d?"dark":"light";}catch(e){}})()`;
