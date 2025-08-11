import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { GlobalLoading } from "./globalLoading";

const Ctx = createContext(null);

export function LoadingProvider({ children }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const showTimer = useRef(null);
  const minShowTimer = useRef(null);

  useEffect(() => {
    const unsub = GlobalLoading.subscribe(setCount);
    return unsub;
  }, []);

  useEffect(() => {
    // Debounce show (avoid flash on super-fast requests)
    if (count > 0) {
      if (!showTimer.current) {
        showTimer.current = setTimeout(() => {
          setVisible(true);
          // ensure minimum 250ms visible once shown (prevents flicker)
          if (minShowTimer.current) clearTimeout(minShowTimer.current);
          minShowTimer.current = setTimeout(() => {}, 250);
        }, 150);
      }
      // lock scroll while visible
      document.documentElement.style.overflow = "hidden";
    } else {
      // clear pending show
      if (showTimer.current) { clearTimeout(showTimer.current); showTimer.current = null; }
      // release after a tiny delay so it feels smooth
      minShowTimer.current = setTimeout(() => {
        setVisible(false);
        document.documentElement.style.overflow = "";
      }, 200);
    }
  }, [count]);

  const value = useMemo(() => ({ count, visible }), [count, visible]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGlobalLoading() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useGlobalLoading must be used inside LoadingProvider");
  return v;
}
