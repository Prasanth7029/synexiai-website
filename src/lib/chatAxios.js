// Dedicated axios for ChatWidget (no global interceptors/overlays)
import axios from "axios";

export const chatAxios = axios.create({
 // If you use a baseURL in fnUrl, leave this empty
 // baseURL: import.meta.env.VITE_API_BASE || ''
 timeout: 10000,
});

// IMPORTANT: do not attach the app-wide interceptors here.
chatAxios.interceptors.request.use((cfg) => {
 // Explicitly mark this as "no global loader" just in case:
 cfg.headers = cfg.headers || {};
 cfg.headers["X-No-Global-Loader"] = "1";
 return cfg;
});
