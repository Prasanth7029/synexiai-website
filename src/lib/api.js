<<<<<<< HEAD
// src/lib/api.js
export const API_BASE = import.meta.env.DEV
  ? ''                                  // in dev, call relative to same origin
  : import.meta.env.VITE_API_BASE;     // in prod, use your Netlify URL

export function fnUrl(name) {
  return `${API_BASE}/.netlify/functions/${name}`;
}
=======
export const API_BASE = import.meta.env.VITE_API_BASE;
export function fnUrl(name) {
  return `${API_BASE}/.netlify/functions/${name}`;
}
>>>>>>> origin/main
