import React from "react";
import { createPortal } from "react-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalLoading } from "../lib/LoadingProvider";

export default function LoadingOverlay() {
 const { visible } = useGlobalLoading();
 if (typeof document === "undefined") return null;

 return createPortal(
 <AnimatePresence>
 {visible && (
 <motion.div
 key="global-loader"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[9999] flex items-center justify-center
 bg-black/60 "
 >
 {/* Spinner */}
 <div className="relative h-16 w-16">
 <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
 <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin"></div>
 </div>
 <span className="sr-only">Loading…</span>
 </motion.div>
 )}
 </AnimatePresence>,
 document.body,
 );
}
