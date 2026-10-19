import { useEffect, useRef } from 'react';

export default function KineticMarquee() {
  const topTrackRef = useRef<HTMLDivElement | null>(null);
  const bottomTrackRef = useRef<HTMLDivElement | null>(null);

  const topPos = useRef<number>(0);
  const bottomPos = useRef<number>(0);
  const scrollVelocity = useRef<number>(0);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;
      scrollVelocity.current += delta * 0.16;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    let animId: number;

    const tick = () => {
      // Friction / Deceleration
      scrollVelocity.current *= 0.92;

      const baseSpeed = 0.85;
      const absVelocity = Math.abs(scrollVelocity.current);
      const effectiveSpeed = baseSpeed + absVelocity * 0.55;

      topPos.current -= effectiveSpeed;
      bottomPos.current += effectiveSpeed * 1.1;

      if (topTrackRef.current) {
        topTrackRef.current.style.transform = `translate3d(${topPos.current % 1800}px, 0, 0)`;
      }

      if (bottomTrackRef.current) {
        bottomTrackRef.current.style.transform = `translate3d(${-1800 + (bottomPos.current % 1800)}px, 0, 0)`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  const text1 = "ENGINEERING LIVING SYSTEMS · 60 FPS WEBGL · RS485 MODBUS · BARE-METAL · DETERMINISTIC ARCHITECTURE · ";
  const text2 = "PHYSICAL COMPUTING · ESP-IDF FREERTOS · OFFSCREEN CANVAS · ZERO ABSTRACTION BLOAT · SOP TOPOLOGY · ";

  return (
    <div className="relative py-14 md:py-20 bg-[#0A0A0A] overflow-hidden select-none">
      {/* Top Kinetic Ribbon */}
      <div className="flex whitespace-nowrap will-change-transform mb-4 md:mb-6" ref={topTrackRef}>
        <span className="text-4xl sm:text-5xl md:text-7xl font-black font-display tracking-tight text-white uppercase opacity-95">
          {text1.repeat(4)}
        </span>
      </div>

      {/* Bottom Kinetic Ribbon */}
      <div className="flex whitespace-nowrap will-change-transform" ref={bottomTrackRef}>
        <span className="text-3xl sm:text-4xl md:text-6xl font-mono tracking-widest text-zinc-500 uppercase opacity-75">
          {text2.repeat(4)}
        </span>
      </div>

      {/* Subtle Depth Scrims on Edges */}
      <div className="absolute inset-y-0 left-0 w-32 md:w-48 bg-gradient-to-r from-[#0A0A0A] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 md:w-48 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none" />
    </div>
  );
}
