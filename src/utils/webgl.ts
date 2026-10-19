/**
 * Resilient WebGL capability detector.
 * Tests actual WebGL context creation without throwing errors in sandboxed/headless environments.
 */
let cachedSupport: boolean | null = null;

export function isWebGLSupported(): boolean {
  if (cachedSupport !== null) return cachedSupport;
  if (typeof window === 'undefined') {
    cachedSupport = false;
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    if (!gl) {
      cachedSupport = false;
      return false;
    }

    // Verify context isn't lost or disabled by sandbox
    if (typeof (gl as WebGLRenderingContext).isContextLost === 'function') {
      if ((gl as WebGLRenderingContext).isContextLost()) {
        cachedSupport = false;
        return false;
      }
    }

    cachedSupport = true;
    return true;
  } catch {
    cachedSupport = false;
    return false;
  }
}
