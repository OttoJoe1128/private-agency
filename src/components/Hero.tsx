import { useState, useEffect } from 'react';
import LivingTopologyCanvas from './LivingTopologyCanvas.tsx';
import { sound } from '../utils/soundEngine.ts';
import { ArrowDownRight, Compass } from 'lucide-react';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCtaClick = (sectionId: string) => {
    sound.playWarp();
    onNavigate(sectionId);
  };

  const titleWords = ['Engineering', 'Living', 'Systems.'];

  return (
    <section id="hero" className="relative pt-16 pb-24 md:pt-24 md:pb-32 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Hero Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Massive Editorial Typography */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Massive Split-Type Staggered H1 Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-[0.98] font-display text-balance mb-10 md:mb-14">
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
                  Hazır şablonlar üretmeyip, dijital arayüzlerden fiziksel sensör ağlarına kadar amaca yönelik ekosistemler kuruyoruz. Sistemin her katmanı – donanım düzeyindeki Modbus register iletişiminden 60 FPS mekansal arayüzlere – canlı ve rasyonel bir bütün olarak nefes alır.
                </p>

                {/* Clean CTAs */}
                <div className="pt-8 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => handleCtaClick('case-studies')}
                    onMouseEnter={() => sound.playHover()}
                    className="px-8 py-4 bg-white text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-3 hover:bg-zinc-200 transition-colors cursor-pointer active:scale-95"
                    data-cursor="NAVIGATE"
                  >
                    <span>Sistemleri İncele</span>
                    <ArrowDownRight className="w-4 h-4 text-black" />
                  </button>

                  <button
                    onClick={() => handleCtaClick('capabilities')}
                    onMouseEnter={() => sound.playHover()}
                    className="px-8 py-4 bg-white/10 text-white font-mono text-xs tracking-wider uppercase flex items-center gap-3 hover:bg-white/20 transition-colors cursor-pointer active:scale-95"
                    data-cursor="WARP 3D"
                  >
                    <span>Disiplinleri Keşfet</span>
                    <Compass className="w-4 h-4 text-zinc-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Blueprint Canvas Mount */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="relative bg-[#090b0e] p-2">
              <div className="flex items-center justify-between px-3 py-2 bg-[#060709] text-xs font-mono text-zinc-400 mb-2">
                <span className="font-medium text-white">Etkileşimli Ağ Topolojisi</span>
                <span className="text-zinc-500 text-[11px]">Canlı Simülasyon</span>
              </div>
              <LivingTopologyCanvas />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
