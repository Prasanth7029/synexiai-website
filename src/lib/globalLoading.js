// A tiny pub/sub counter used by axios + UI overlay
let count = 0;
const listeners = new Set();

export const GlobalLoading = {
 getCount: () => count,
 inc: () => {
 count++;
 listeners.forEach((fn) => fn(count));
 },
 dec: () => {
 count = Math.max(0, count - 1);
 listeners.forEach((fn) => fn(count));
 },
 subscribe: (fn) => {
 listeners.add(fn);
 return () => listeners.delete(fn);
 },
};
