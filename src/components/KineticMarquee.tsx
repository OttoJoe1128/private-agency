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
      scrollVelocity.current += delta * 0.15;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    let animId: number;
    const baseSpeed = 0.9;

    const tick = () => {
      scrollVelocity.current *= 0.91;

      const currentVelocity = scrollVelocity.current;
      const topSpeed = baseSpeed + Math.abs(currentVelocity);
      const bottomSpeed = baseSpeed + Math.abs(currentVelocity);

      topPos.current -= topSpeed;
      bottomPos.current += bottomSpeed;

      if (topTrackRef.current) {
        topTrackRef.current.style.transform = `translate3d(${topPos.current % 1400}px, 0, 0)`;
      }

      if (bottomTrackRef.current) {
        bottomTrackRef.current.style.transform = `translate3d(${-1400 + (bottomPos.current % 1400)}px, 0, 0)`;
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
    <div className="relative py-16 md:py-24 bg-[#0A0A0A] border-y border-white/10 overflow-hidden select-none">
      {/* Top Kinetic Ribbon */}
      <div className="flex whitespace-nowrap will-change-transform mb-6" ref={topTrackRef}>
        <span className="text-3xl sm:text-4xl md:text-6xl font-black font-display tracking-tight text-white uppercase">
          {text1.repeat(4)}
        </span>
      </div>

      {/* Center Hairline Indicator with Coordinate Marker */}
      <div className="max-w-7xl mx-auto px-6 my-4 flex items-center justify-between text-[11px] font-mono text-zinc-500 tracking-widest uppercase">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#FF4500]" />
          <span>VELOCITY_SCRUB // GSAP_TICKER_SYNC</span>
        </span>
        <span className="hidden sm:inline">[SECTION_BREAK // DISCIPLINE_TRANSITION]</span>
        <span>AXIS_X: CONTRAST_MAX</span>
      </div>

      {/* Bottom Kinetic Ribbon */}
      <div className="flex whitespace-nowrap will-change-transform" ref={bottomTrackRef}>
        <span className="text-2xl sm:text-3xl md:text-5xl font-mono tracking-widest text-zinc-400 uppercase">
          {text2.repeat(4)}
        </span>
      </div>

      {/* Subtle Depth Scrims */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none" />
    </div>
  );
}
