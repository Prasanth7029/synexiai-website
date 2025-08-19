export const fnUrl = (name) =>
  (import.meta.env.DEV)
    ? `/.netlify/functions/${name}`
    : `/.netlify/functions/${name}`;
