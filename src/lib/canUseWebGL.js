// src/lib/canUseWebGL.js
let _cache = null;

export function canUseWebGL() {
  if (_cache !== null) return _cache;

  if (typeof window === "undefined") {
    _cache = false;
    return _cache;
  }

  try {
    const canvas = document.createElement("canvas");
    const opts = { failIfMajorPerformanceCaveat: true, antialias: true };
    const gl2 = canvas.getContext("webgl2", opts);
    if (gl2) {
      _cache = true;
      return _cache;
    }
    const gl =
      canvas.getContext("webgl", opts) ||
      canvas.getContext("experimental-webgl", opts);
    _cache = !!gl;
    return _cache;
  } catch (_) {
    _cache = false;
    return _cache;
  }
}
