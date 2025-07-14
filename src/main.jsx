import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';


import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialize AOS once DOM is ready
AOS.init({
  duration: 1000,
  easing: 'ease-out',
  once: true,
  mirror: false,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
