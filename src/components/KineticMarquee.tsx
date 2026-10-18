import { useEffect, useRef, useState } from 'react';
import { sound } from '../utils/soundEngine.ts';
import { Gauge, Sparkles, MoveHorizontal, Zap } from 'lucide-react';

export default function KineticMarquee() {
  const topTrackRef = useRef<HTMLDivElement | null>(null);
  const bottomTrackRef = useRef<HTMLDivElement | null>(null);

  const topPos = useRef<number>(0);
  const bottomPos = useRef<number>(0);
  const scrollVelocity = useRef<number>(0);
  const lastScrollY = useRef<number>(0);

  const [currentKmh, setCurrentKmh] = useState<number>(12);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;
      // Scroll velocity boost
      scrollVelocity.current += delta * 0.18;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    let animId: number;
    let lastMetricTime = performance.now();

    const tick = (time: number) => {
      // Friction / Deceleration
      scrollVelocity.current *= 0.92;

      const baseSpeed = 0.85 * speedMultiplier;
      const absVelocity = Math.abs(scrollVelocity.current);
      const effectiveSpeed = (baseSpeed + absVelocity * 0.6) * (isHovered ? 0.35 : 1.0);

      topPos.current -= effectiveSpeed;
      bottomPos.current += effectiveSpeed * 1.1;

      if (topTrackRef.current) {
        topTrackRef.current.style.transform = `translate3d(${topPos.current % 1800}px, 0, 0)`;
      }

      if (bottomTrackRef.current) {
        bottomTrackRef.current.style.transform = `translate3d(${-1800 + (bottomPos.current % 1800)}px, 0, 0)`;
      }

      // Update telemetry display every 150ms
      if (time - lastMetricTime > 150) {
        const kmh = Math.round(12 + absVelocity * 14 * speedMultiplier);
        setCurrentKmh(kmh);
        lastMetricTime = time;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animId);
    };
  }, [speedMultiplier, isHovered]);

  const text1 = "ENGINEERING LIVING SYSTEMS · 60 FPS WEBGL · RS485 MODBUS · BARE-METAL · DETERMINISTIC ARCHITECTURE · ";
  const text2 = "PHYSICAL COMPUTING · ESP-IDF FREERTOS · OFFSCREEN CANVAS · ZERO ABSTRACTION BLOAT · SOP TOPOLOGY · ";

  const cycleMultiplier = () => {
    sound.playClick();
    setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 3 : 1));
  };

  return (
    <div
      className="relative py-16 md:py-24 bg-[#0A0A0A] border-y border-white/10 overflow-hidden select-none"
      onMouseEnter={() => {
        setIsHovered(true);
        sound.playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor="VELOCITY"
    >
      {/* Top Kinetic Ribbon (Direction: Leftwards) */}
      <div className="flex whitespace-nowrap will-change-transform mb-6" ref={topTrackRef}>
        <span className="text-4xl sm:text-5xl md:text-7xl font-black font-display tracking-tight text-white uppercase opacity-95">
          {text1.repeat(4)}
        </span>
      </div>

      {/* Center Hairline Indicator with Coordinate Marker & Interactive Gauge */}
      <div className="max-w-7xl mx-auto px-6 my-4 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-zinc-500 tracking-widest uppercase">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-[#FF4500] shadow-[0_0_8px_#FF4500] animate-pulse" />
          <span className="text-zinc-300 font-bold">KINETIC_MARQUEE // VELOCITY_SCRUB</span>
          <span className="text-zinc-700">·</span>
          <span className="text-emerald-400 font-bold tabular-nums">VELOCITY: {currentKmh} KM/H</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline">[SCROLL DYNAMICALLY ACCELERATES RIBBONS]</span>
          <button
            onClick={cycleMultiplier}
            className="px-2.5 py-1 bg-white/5 border border-white/20 text-white font-mono text-[10px] hover:border-white cursor-pointer flex items-center gap-1.5 transition-none"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>HIZ ÇARPANI: {speedMultiplier}x</span>
          </button>
        </div>
      </div>

      {/* Bottom Kinetic Ribbon (Direction: Rightwards) */}
      <div className="flex whitespace-nowrap will-change-transform" ref={bottomTrackRef}>
        <span className="text-3xl sm:text-4xl md:text-6xl font-mono tracking-widest text-zinc-400 uppercase opacity-75">
          {text2.repeat(4)}
        </span>
      </div>

      {/* Subtle Depth Scrims on Edges */}
      <div className="absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-[#0A0A0A] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none" />
    </div>
  );
}
