import { useState, useEffect } from 'react';
import LivingTopologyCanvas from './LivingTopologyCanvas.tsx';
import { sound } from '../utils/soundEngine.ts';
import { ArrowDownRight, Compass, Terminal, Crosshair, Sparkles } from 'lucide-react';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const [hoveredCta, setHoveredCta] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCtaClick = (sectionId: string, actionName: string) => {
    sound.playWarp();
    onNavigate(sectionId);
  };

  const titleWords = ['Engineering', 'Living', 'Systems.'];

  return (
    <section id="hero" className="relative pt-12 pb-24 md:pt-20 md:pb-36 border-b border-white/10 architectural-grid overflow-hidden bg-[#0D0D0D]">
      
      {/* Blueprint Corner Architectural Crosshairs */}
      <div className="absolute top-4 left-6 text-zinc-600 font-mono text-[11px] select-none flex items-center gap-2 pointer-events-none">
        <span className="text-[#FF4500] font-bold">+</span>
        <span>[01 / HERO_FRAMEWORK]</span>
      </div>

      <div className="absolute top-4 right-6 text-zinc-600 font-mono text-[11px] select-none flex items-center gap-2 pointer-events-none">
        <span>GRID: 48x48 // 1px_HAIRLINE</span>
        <span className="text-[#FF4500] font-bold">+</span>
      </div>

      <div className="absolute bottom-4 left-6 text-zinc-600 font-mono text-[11px] select-none flex items-center gap-2 pointer-events-none">
        <span className="text-[#FF4500] font-bold">+</span>
        <span>LAT: 39.9208° N // LON: 32.8541° E</span>
      </div>

      <div className="absolute bottom-4 right-6 text-zinc-600 font-mono text-[11px] select-none flex items-center gap-2 pointer-events-none">
        <span>DMA_STATUS: LATCHED</span>
        <span className="text-[#FF4500] font-bold">+</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Architectural Header Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-12 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#FF4500] animate-pulse" />
            <span className="text-white font-bold tracking-wider">SYSTEM_READY // 200 OK</span>
            <span className="text-zinc-600" aria-hidden="true">·</span>
            <span className="text-zinc-400">TICK: 16.6ms (60 FPS)</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>REGISTER_MAP: 0x00FF</span>
            <span className="text-zinc-600" aria-hidden="true">·</span>
            <span className="text-zinc-400">RS485: 120Ω TERMINATED</span>
          </div>
        </div>

        {/* Hero Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Massive Editorial Typography with Split-Type Stagger */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Kicker */}
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-6 overflow-hidden">
                <span className="inline-block transition-transform duration-700 delay-100 transform translate-y-0">
                  Architecture
                </span>
                <span aria-hidden="true" className="text-zinc-600">/</span>
                <span className="inline-block transition-transform duration-700 delay-200 transform translate-y-0">
                  Spatial Systems
                </span>
                <span aria-hidden="true" className="text-zinc-600">/</span>
                <span className="inline-block transition-transform duration-700 delay-300 transform translate-y-0">
                  Physical Computing
                </span>
              </div>

              {/* Massive Split-Type Staggered H1 Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-[0.98] font-display text-balance mb-14 md:mb-18">
                {titleWords.map((word, wIdx) => (
                  <span key={wIdx} className="inline-block overflow-hidden mr-3 sm:mr-5">
                    <span
                      className={`inline-block transition-transform duration-1000 ease-out transform ${
                        mounted ? 'translate-y-0' : 'translate-y-full'
                      }`}
                      style={{ transitionDelay: `${wIdx * 180 + 100}ms` }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </h1>

              {/* Strict Max-Width Editorial Manifesto */}
              <div className="max-w-xl pr-4">
                <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed mb-10">
                  Hazır şablonlar üretmeyip, dijital arayüzlerden (Next.js, Canvas) fiziksel sensör ağlarına (ESP32) kadar amaca yönelik ekosistemler kuruyoruz. Sistemin her katmanı – donanım düzeyindeki Modbus register iletişiminden 60 FPS spatial arayüzlere – canlı ve rasyonel bir bütün olarak nefes alır.
                </p>

                {/* CTAs with Blunt Grids and Cyber-tactile Sound */}
                <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-4 mb-4">
                  <button
                    onClick={() => handleCtaClick('case-studies', 'works')}
                    onMouseEnter={() => {
                      setHoveredCta('works');
                      sound.playHover();
                    }}
                    onMouseLeave={() => setHoveredCta(null)}
                    className="px-8 py-4 bg-white text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-3 hover:bg-zinc-200 transition-none border border-white cursor-pointer active:scale-95"
                    data-cursor="NAVIGATE"
                  >
                    <span>Sistemleri İncele</span>
                    <ArrowDownRight className="w-4 h-4 text-black" />
                  </button>

                  <button
                    onClick={() => handleCtaClick('capabilities', 'caps')}
                    onMouseEnter={() => {
                      setHoveredCta('caps');
                      sound.playHover();
                    }}
                    onMouseLeave={() => setHoveredCta(null)}
                    className="px-8 py-4 border border-white/30 text-white font-mono text-xs tracking-wider uppercase flex items-center gap-3 hover:bg-white/10 hover:border-white transition-none cursor-pointer active:scale-95"
                    data-cursor="WARP 3D"
                  >
                    <span>Mimariyi Keşfet</span>
                    <Compass className="w-4 h-4 text-zinc-300" />
                  </button>
                </div>

                {/* Systemic Status Event Bus Bar */}
                <div className="text-[11px] font-mono text-zinc-500 h-5 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-zinc-600" />
                  <span>
                    {hoveredCta === 'works' && 'DISPATCH: NAVIGATE_WORKS // HORIZONTAL_PINNING_READY'}
                    {hoveredCta === 'caps' && 'DISPATCH: NAVIGATE_CAPS // CARD_STACKING_READY'}
                    {!hoveredCta && 'AWAITING_INPUT // EVENT_BUS: ACTIVE'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Blueprint Canvas Mount */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="relative border border-white/15 bg-[#090b0e] p-2">
              <div className="flex items-center justify-between px-3 py-2 bg-[#060709] border-b border-white/10 text-[10px] font-mono text-zinc-500 mb-2">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Crosshair className="w-3 h-3 text-[#FF4500]" />
                  <span>TOPOLOGY_BLUEPRINT // 60 FPS</span>
                </span>
                <span>INTERACTIVE NODES</span>
              </div>
              <LivingTopologyCanvas />
            </div>
          </div>

        </div>

        {/* Full-width Technical Metric Strip Below Split */}
        <div className="mt-20 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col border-l border-white/15 pl-4">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Render Loop</span>
            <span className="text-2xl font-bold text-white font-mono tabular-nums">Lenis + GSAP</span>
            <span className="text-xs text-zinc-400 mt-1">autoRaf: false // lagSmoothing: 0</span>
          </div>

          <div className="flex flex-col border-l border-white/15 pl-4">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Worker Isolation</span>
            <span className="text-2xl font-bold text-white font-mono tabular-nums">OffscreenCanvas</span>
            <span className="text-xs text-zinc-400 mt-1">0ms Main Thread Blocking</span>
          </div>

          <div className="flex flex-col border-l border-white/15 pl-4">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Bus Telemetry</span>
            <span className="text-2xl font-bold text-white font-mono tabular-nums">RS485 120Ω</span>
            <span className="text-xs text-zinc-400 mt-1">Modbus-RTU &amp; CRC16</span>
          </div>

          <div className="flex flex-col border-l border-white/15 pl-4">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Specification Engine</span>
            <span className="text-2xl font-bold text-white font-mono tabular-nums">Pydantic v2</span>
            <span className="text-xs text-zinc-400 mt-1">/api/v1/system-brief API</span>
          </div>
        </div>

      </div>
    </section>
  );
}
