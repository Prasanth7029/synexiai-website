// src/components/visuals/GlobeCanvas.jsx
// Requires: react-globe.gl + three
import React, { useEffect, useRef } from "react";
import Globe from "react-globe.gl";

export default function GlobeCanvas({ width, height }) {
 const globeRef = useRef(null);

 useEffect(() => {
 const g = globeRef.current;
 if (!g) return;

 try {
 // Globe controls
 g.controls().autoRotate = true;
 g.controls().autoRotateSpeed = 0.5;
 g.pointOfView({ lat: 10, lng: 0, altitude: 2.2 });

 // iOS-friendly DPR cap
 const isIOS = /iP(hone|ad|od)/i.test(navigator.userAgent);
 const renderer = g.renderer?.();
 if (renderer) {
 renderer.setPixelRatio(isIOS ? 1 : Math.min(window.devicePixelRatio || 1, 2));
 }
 } catch (e) {
 console.warn("[GlobeCanvas] setup warning", e);
 }
 }, [width, height]);

 const arcs = [
 {
 startLat: 37.7749,
 startLng: -122.4194,
 endLat: 40.7128,
 endLng: -74.006,
 color: ["#06b6d4", "#3b82f6"],
 },
 {
 startLat: 51.5072,
 startLng: -0.1276,
 endLat: 28.6139,
 endLng: 77.209,
 color: ["#22d3ee", "#34d399"],
 },
 ];

 return (
 <Globe
 ref={globeRef}
 width={width}
 height={height}
 backgroundColor="rgba(0,0,0,0)"
 globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
 bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
 arcsData={arcs}
 arcColor={"color"}
 arcDashLength={0.6}
 arcDashGap={0.15}
 arcDashAnimateTime={3000}
 atmosphereColor="#67e8f9"
 atmosphereAltitude={0.15}
 rendererConfig={{
 alpha: true,
 antialias: false, // ✅ iOS friendly
 powerPreference: "default", // Avoid forcing high-performance on iOS
 preserveDrawingBuffer: false,
 failIfMajorPerformanceCaveat: true,
 }}
 />
 );
}
