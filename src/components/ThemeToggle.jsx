import { useEffect, useState, useCallback } from "react";

export default function ThemeToggle({ className = "" }) {
 const storageKey = "theme"; // 'light' | 'dark'

 const [theme, setTheme] = useState(() => {
 if (typeof window === "undefined") return "light";
 const saved = localStorage.getItem(storageKey);
 if (saved === "light" || saved === "dark") return saved;
 const prefersDark = window.matchMedia?.(
 "(prefers-color-scheme: dark)",
 ).matches;
 return prefersDark ? "dark" : "light";
 });

 const applyTheme = useCallback((next, persist = true) => {
 const root = document.documentElement;
 root.classList.add("[&_*]:!transition-none");
 if (next === "dark") root.classList.add("dark");
 else root.classList.remove("dark");
 root.setAttribute("data-theme", next);
 if (persist) localStorage.setItem(storageKey, next);
 window.setTimeout(() => {
 root.classList.remove("[&_*]:!transition-none");
 }, 0);
 }, []);

 useEffect(() => {
 applyTheme(theme, false);
 }, []); // eslint-disable-line react-hooks/exhaustive-deps

 useEffect(() => {
 applyTheme(theme, true);
 }, [theme, applyTheme]);

 useEffect(() => {
 const onStorage = (e) => {
 if (
 e.key === storageKey &&
 (e.newValue === "light" || e.newValue === "dark")
 ) {
 setTheme(e.newValue);
 }
 };
 window.addEventListener("storage", onStorage);
 return () => window.removeEventListener("storage", onStorage);
 }, []);

 useEffect(() => {
 const saved = localStorage.getItem(storageKey);
 if (saved === "light" || saved === "dark") return;
 const mq = window.matchMedia("(prefers-color-scheme: dark)");
 const listener = (e) => setTheme(e.matches ? "dark" : "light");
 mq.addEventListener?.("change", listener);
 return () => mq.removeEventListener?.("change", listener);
 }, []);

 const isDark = theme === "dark";
 const toggle = () => setTheme(isDark ? "light" : "dark");

 return (
 <button
 type="button"
 onClick={toggle}
 aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
 aria-pressed={isDark}
 className={`relative z-50 pointer-events-auto select-none
 inline-flex items-center gap-2 px-3 py-2 rounded-md
 border border-gray-300 dark:border-gray-700
 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100
 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700
 transition focus:outline-none focus:ring-2 focus:ring-cyan-500 ${className}`}
 >
 <span className="text-base">{isDark ? "☀️" : "🌙"}</span>
 <span className="text-sm font-medium">{isDark ? "Light" : "Dark"}</span>
 </button>
 );
}
