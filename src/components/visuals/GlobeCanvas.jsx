// src/components/visuals/GlobeCanvas.jsx
// Requires: react-globe.gl + three
import React, { useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";

export default function GlobeCanvas({ width, height }) {
  const globeRef = useRef(null);

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;

    try {
      // Smooth autorotation and framing
      const ctrl = g.controls();
      ctrl.autoRotate = true;
      ctrl.autoRotateSpeed = 0.5;
      g.pointOfView({ lat: 10, lng: 0, altitude: 2.2 });

      // --- iOS-friendly clarity tweaks ---
      const isIOS = /iP(hone|ad|od)/i.test(navigator.userAgent);
      const renderer = g.renderer?.();
      if (renderer) {
        // Color management (prevents washed-out look)
        // three r152+: SRGBColorSpace, older: sRGBEncoding
        if ("outputColorSpace" in renderer) {
          renderer.outputColorSpace = THREE.SRGBColorSpace;
        } else {
          renderer.outputEncoding = THREE.sRGBEncoding;
        }

        // DPR: small bump without risking context loss on iOS
        const sysDpr = window.devicePixelRatio || 1;
        const targetDpr = isIOS ? Math.min(sysDpr, 1.25) : Math.min(sysDpr, 2);
        renderer.setPixelRatio(targetDpr);
      }

      // Material quality: anisotropy + filters + color space
      const mat = g.globeMaterial?.();
      if (mat) {
        const maxAniso = renderer?.capabilities?.getMaxAnisotropy?.() || 8;

        // Base color map
        if (mat.map) {
          if ("colorSpace" in mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
          } else {
            mat.map.encoding = THREE.sRGBEncoding;
          }
          mat.map.anisotropy = Math.min(16, maxAniso);
          mat.map.magFilter = THREE.LinearFilter;
          mat.map.minFilter = THREE.LinearMipmapLinearFilter;
          mat.map.needsUpdate = true;
        }

        // Bump map
        if (mat.bumpMap) {
          mat.bumpMap.anisotropy = Math.min(16, maxAniso);
          mat.bumpMap.magFilter = THREE.LinearFilter;
          mat.bumpMap.minFilter = THREE.LinearMipmapLinearFilter;
          mat.bumpMap.needsUpdate = true;
          // Subtle relief; too high looks noisy on mobile
          mat.bumpScale = 0.03;
        }

        mat.needsUpdate = true;
      }
    } catch (e) {
      console.warn("[GlobeCanvas] setup warning", e);
    }
  }, [width, height]);

  const arcs = [
    {
      startLat: 37.7749, startLng: -122.4194,
      endLat: 40.7128, endLng: -74.006,
      color: ["#06b6d4", "#3b82f6"],
    },
    {
      startLat: 51.5072, startLng: -0.1276,
      endLat: 28.6139, endLng: 77.2090,
      color: ["#22d3ee", "#34d399"],
    },
  ];

  return (
    <Globe
      ref={globeRef}
      width={width}
      height={height}
      backgroundColor="rgba(0,0,0,0)"
      // 🔁 Replace these with your own higher-res assets (see checklist)
      globeImageUrl="/assets/earth-blue-marble-4k.webp"
      bumpImageUrl="/assets/earth-topology-4k.webp"
      arcsData={arcs}
      arcColor={"color"}
      arcDashLength={0.6}
      arcDashGap={0.15}
      arcDashAnimateTime={3000}
      atmosphereColor="#67e8f9"
      atmosphereAltitude={0.15}
      rendererConfig={{
        alpha: true,
        antialias: false,         // keep false; we improve quality via DPR/filters
        powerPreference: "default",
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: true,
      }}
    />
  );
}
