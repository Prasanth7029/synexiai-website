import React, { useEffect, useState } from "react";
import { FiUsers, FiClock } from "react-icons/fi";

const TTL_HOURS = 12; // only count one visit per user every 12h

function formatDMY(date) {
  // "20/8/2025" style (day/month/year)
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);
}

export default function VisitorsBar({ className = "" }) {
  const [count, setCount] = useState(null);
  const [updated, setUpdated] = useState("");

  useEffect(() => {
    // Use the SPA's index.html modified time as "last updated"
    const d = new Date(document.lastModified || Date.now());
    setUpdated(formatDMY(d));
  }, []);

  useEffect(() => {
    const KEY = "synexiai:lastHitAt";
    const last = Number(localStorage.getItem(KEY) || 0);
    const needsHit = Date.now() - last > TTL_HOURS * 60 * 60 * 1000;

    const method = needsHit ? "POST" : "GET";
    fetch("/.netlify/functions/visitors", { method })
      .then((r) => r.json())
      .then((data) => {
        setCount(Number(data.total || 0));
        if (needsHit) localStorage.setItem(KEY, String(Date.now()));
      })
      .catch(() => setCount(null));
  }, []);

  return (
    <div
      className={`mx-auto max-w-6xl px-4 ${className}`}
      aria-live="polite"
      role="status"
    >
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 backdrop-blur p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-2 font-semibold">
            <FiUsers className="opacity-80" />
            <span>Visitors:</span>
            <span className="tabular-nums">
              {count === null ? "—" : count.toLocaleString("en-US")}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 text-sm opacity-80">
            <FiClock />
            <span>Page last updated on: {updated || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
