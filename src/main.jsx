import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { HelmetProvider } from 'react-helmet-async';
import 'aos/dist/aos.css';  // First import library CSS
import './index.css';       // Then your custom CSS

// Debug polyfill and error handling
if (typeof window !== 'undefined') {
  if (typeof window.debug === 'undefined') {
    window.debug = () => {};
  }

  window.addEventListener('unhandledrejection', event => {
    console.warn('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));

// Conditional rendering for development vs production
if (import.meta.env.PROD) {
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  );
} else {
  root.render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}