// src/components/visuals/GlobeCanvas.jsx
import React, { useEffect, useRef, useMemo } from "react";
import Globe from "react-globe.gl";

export default function GlobeCanvas({ width, height }) {
  const globeRef = useRef(null);

  // Dynamic texture path (mobile = 2K, desktop = 4K)
  const globeTexture = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    return isMobile ? "/textures/2k_earth_nightmap.jpg" : "/textures/8081_earthmap4k.jpg";
  }, []);

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;

    try {
      g.controls().autoRotate = true;
      g.controls().autoRotateSpeed = 10;
      g.pointOfView({ lat: 10, lng: 0, altitude: 2.2 });

      const renderer = g.renderer?.();
      if (renderer) {
        // ✅ Higher DPR for retina, but clamp for iOS safety
        const isIOS = /iP(hone|ad|od)/i.test(navigator.userAgent);
        const dpr = isIOS ? 1.5 : Math.min(window.devicePixelRatio || 1, 2.5);
        renderer.setPixelRatio(dpr);
      }

      // Responsive resize
      const handleResize = () => {
        g.width = width;
        g.height = height;
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    } catch (e) {
      console.warn("[GlobeCanvas] setup warning", e);
    }
  }, [width, height]);

  const arcs = [
    // 🌎 North America
    {
      startLat: 37.7749, // San Francisco
      startLng: -122.4194,
      endLat: 40.7128, // New York
      endLng: -74.006,
      color: ["#06b6d4", "#3b82f6"],
    },
    {
      startLat: 34.0522, // Los Angeles
      startLng: -118.2437,
      endLat: 45.5017, // Montreal
      endLng: -73.5673,
      color: ["#22d3ee", "#2563eb"],
    },
    {
      startLat: 40.7128, // New York
      startLng: -74.006,
      endLat: 25.7617, // Miami
      endLng: -80.1918,
      color: ["#3b82f6", "#06b6d4"],
    },

    // 🌍 Europe
    {
      startLat: 51.5072, // London
      startLng: -0.1276,
      endLat: 48.8566, // Paris
      endLng: 2.3522,
      color: ["#22d3ee", "#34d399"],
    },
    {
      startLat: 52.52, // Berlin
      startLng: 13.405,
      endLat: 41.9028, // Rome
      endLng: 12.4964,
      color: ["#3b82f6", "#10b981"],
    },
    {
      startLat: 51.5072, // London
      startLng: -0.1276,
      endLat: 28.6139, // New Delhi
      endLng: 77.209,
      color: ["#22d3ee", "#34d399"],
    },
    {
      startLat: 48.8566, // Paris
      startLng: 2.3522,
      endLat: 35.6895, // Tokyo
      endLng: 139.6917,
      color: ["#06b6d4", "#3b82f6"],
    },

    // 🌏 Asia-Pacific
    {
      startLat: 28.6139, // New Delhi
      startLng: 77.209,
      endLat: 1.3521, // Singapore
      endLng: 103.8198,
      color: ["#10b981", "#3b82f6"],
    },
    {
      startLat: 35.6895, // Tokyo
      startLng: 139.6917,
      endLat: -33.8688, // Sydney
      endLng: 151.2093,
      color: ["#3b82f6", "#06b6d4"],
    },
    {
      startLat: 1.3521, // Singapore
      startLng: 103.8198,
      endLat: 37.7749, // San Francisco
      endLng: -122.4194,
      color: ["#22d3ee", "#2563eb"],
    },

    // 🌍 Middle East & Africa
    {
      startLat: 25.2048, // Dubai
      startLng: 55.2708,
      endLat: 30.0444, // Cairo
      endLng: 31.2357,
      color: ["#14b8a6", "#3b82f6"],
    },
    {
      startLat: -1.2921, // Nairobi
      startLng: 36.8219,
      endLat: 6.5244, // Lagos
      endLng: 3.3792,
      color: ["#22d3ee", "#34d399"],
    },

    // 🌎 South America
    {
      startLat: -23.5505, // São Paulo
      startLng: -46.6333,
      endLat: -34.6037, // Buenos Aires
      endLng: -58.3816,
      color: ["#06b6d4", "#3b82f6"],
    },
    {
      startLat: -33.4489, // Santiago
      startLng: -70.6693,
      endLat: 37.7749, // San Francisco
      endLng: -122.4194,
      color: ["#10b981", "#2563eb"],
    },

    // 🌍 Bonus cross-continental arcs (symbolic connections)
    {
      startLat: 37.7749, // San Francisco
      startLng: -122.4194,
      endLat: 35.6895, // Tokyo
      endLng: 139.6917,
      color: ["#06b6d4", "#34d399"],
    },
    {
      startLat: 40.7128, // New York
      startLng: -74.006,
      endLat: 1.3521, // Singapore
      endLng: 103.8198,
      color: ["#3b82f6", "#22d3ee"],
    },
  ];


  return (
    <Globe
      ref={globeRef}
      width={width}
      height={height}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl={globeTexture}
      bumpImageUrl="/textures/8k_earth_nightmap.jpg"
      arcsData={arcs}
      arcColor="color"
      arcDashLength={0.4}
      arcDashGap={0.15}
      arcDashAnimateTime={5000}
      atmosphereColor="#67e8f9"
      atmosphereAltitude={0.2}
      rendererConfig={{
        alpha: true,
        antialias: true, // ✅ improves edges
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false, // allow fallback
      }}
    />
  );
}
