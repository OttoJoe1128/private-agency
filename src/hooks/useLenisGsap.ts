import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface RenderLoopTelemetry {
  isInitialized: boolean;
  prefersReducedMotion: boolean;
  lagSmoothingZero: boolean;
  autoRafDisabled: boolean;
  tickerFps: number;
}

export function useLenisGsap(): RenderLoopTelemetry {
  const [telemetry, setTelemetry] = useState<RenderLoopTelemetry>({
    isInitialized: false,
    prefersReducedMotion: false,
    lagSmoothingZero: true,
    autoRafDisabled: true,
    tickerFps: 60,
  });

  useEffect(() => {
    // 1. Accessibility Check: Vestibular motion sensitivity
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = motionQuery.matches;

    // 2. Prevent frame jumping on sudden GPU spikes
    gsap.ticker.lagSmoothing(0);

    if (prefersReducedMotion) {
      setTelemetry({
        isInitialized: true,
        prefersReducedMotion: true,
        lagSmoothingZero: true,
        autoRafDisabled: true,
        tickerFps: 60,
      });
      return;
    }

    // 3. Initialize Lenis with internal RAF disabled (autoRaf: false)
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      autoRaf: false, // Critical: delegate RAF to GSAP central ticker
    });

    // 4. Synchronize Lenis scroll position with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 5. Synchronize Lenis render step with GSAP ticker
    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);

    // Track FPS
    let frameCount = 0;
    let lastTime = performance.now();
    const fpsTracker = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setTelemetry((prev) => ({
          ...prev,
          tickerFps: frameCount,
        }));
        frameCount = 0;
        lastTime = now;
      }
    };
    gsap.ticker.add(fpsTracker);

    setTelemetry({
      isInitialized: true,
      prefersReducedMotion: false,
      lagSmoothingZero: true,
      autoRafDisabled: true,
      tickerFps: 60,
    });

    return () => {
      gsap.ticker.remove(tickerUpdate);
      gsap.ticker.remove(fpsTracker);
      lenis.destroy();
    };
  }, []);

  return telemetry;
}
