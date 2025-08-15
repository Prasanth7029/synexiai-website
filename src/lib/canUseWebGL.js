// src/lib/canUseWebGL.js
export function canUseWebGL() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');

    // iOS often fails WebGL2: prefer WebGL1 first
    const gl =
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: true });

    if (!gl) return false;

    // Basic sanity check to avoid "software" contexts that glitch on iOS
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : '';
    const isIOS = /iP(hone|ad|od)/i.test(navigator.userAgent);
    const looksSoftware = /software|swiftshader|angle/i.test(renderer || '');

    return !(isIOS && looksSoftware);
  } catch {
    return false;
  }
}

export const isIOS = () =>
  typeof navigator !== 'undefined' && /iP(hone|ad|od)/i.test(navigator.userAgent);
