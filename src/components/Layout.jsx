import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-[#0a0a0a] to-[#111] text-white">
      {/* Header */}
      <Header />

      {/* Page content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
