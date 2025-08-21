import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import { initWebVitals } from "./reportWebVitals";
import { LoadingProvider } from "./lib/LoadingProvider.jsx";
import LoadingOverlay from "./components/LoadingOverlay.jsx";
import { attachAxiosLoading } from "./lib/setupAxiosLoading.js";
import { ProgressProvider } from "./context/ProgressContext.jsx";

// ✅ New import for persona context
import { PersonaProvider } from "./context/PersonaContext.jsx";

// Debug polyfill and error handling
if (typeof window !== "undefined") {
 if (typeof window.debug === "undefined") {
 window.debug = () => {};
 }
 initWebVitals((metric) => {
 console.log("[WebVitals]", metric.name, metric.value);
 });

 window.addEventListener("unhandledrejection", (event) => {
 console.warn("Unhandled promise rejection:", event.reason);
 event.preventDefault();
 });
}

// Attach axios interceptors once (HMR-safe)
attachAxiosLoading();

const root = ReactDOM.createRoot(document.getElementById("root"));

if (!import.meta.env.PROD) {
 // DEV: StrictMode ON
 root.render(
 <React.StrictMode>
 <HelmetProvider>
 <PersonaProvider>
 <LoadingProvider>
 <ProgressProvider>
 <App />
 </ProgressProvider>
 <LoadingOverlay />
 </LoadingProvider>
 </PersonaProvider>
 </HelmetProvider>
 </React.StrictMode>,
 );
} else {
 // PROD: StrictMode OFF (optional, but recommended)
 root.render(
 <HelmetProvider>
 <PersonaProvider>
 <LoadingProvider>
 <ProgressProvider>
 <App />
 </ProgressProvider>
 <LoadingOverlay />
 </LoadingProvider>
 </PersonaProvider>
 </HelmetProvider>,
 );
}
