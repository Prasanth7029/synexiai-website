import { useEffect, useState, useCallback } from "react";


export default function ThemeToggle({ className = "" }) {
const STORAGE_KEY = "theme"; // values: 'light' | 'dark'


const getSystem = () =>
typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches
? "dark"
: "light";


const getInitial = () => {
if (typeof window === "undefined") return "light";
const saved = localStorage.getItem(STORAGE_KEY);
if (saved === "light" || saved === "dark") return saved;
return getSystem();
};


const [theme, setTheme] = useState(getInitial);


const applyTheme = useCallback((next, persist = true) => {
const root = document.documentElement;


// Prevent jarring transitions during theme flip
root.classList.add("theme-changing");


// Toggle class and sync color-scheme
const wantDark = next === "dark";
root.classList.toggle("dark", wantDark);
root.setAttribute("data-theme", next);
root.style.colorScheme = wantDark ? "dark" : "light";


if (persist) localStorage.setItem(STORAGE_KEY, next);


// Allow the DOM to paint once with transitions disabled, then re-enable
requestAnimationFrame(() => {
root.classList.remove("theme-changing");
});
}, []);


// Initial paint (no persistence write)
useEffect(() => {
applyTheme(theme, false);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


// Apply when user toggles
useEffect(() => {
applyTheme(theme, true);
}, [theme, applyTheme]);


// Respond to changes from other tabs
useEffect(() => {
const onStorage = (e) => {
if (e.key === STORAGE_KEY && (e.newValue === "light" || e.newValue === "dark")) {
setTheme(e.newValue);
}
};
window.addEventListener("storage", onStorage);
return () => window.removeEventListener("storage", onStorage);
}, []);


// Follow system changes ONLY if user has not set an explicit preference yet
useEffect(() => {
const saved = localStorage.getItem(STORAGE_KEY);
if (saved === "light" || saved === "dark") return;
const mq = window.matchMedia("(prefers-color-scheme: dark)");
}