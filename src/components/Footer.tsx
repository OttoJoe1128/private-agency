import React from 'react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="w-full bg-[#090A0C] py-16 text-zinc-400">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[#FF4500]" />
              <span className="text-xl font-bold text-white tracking-tight font-display">
                Engineering Living Systems
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-normal max-w-sm">
              Dijital arayüzlerden fiziksel sensör ağlarına kadar uzanan, amaca yönelik yaşayan ekosistemler.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-wider text-zinc-400">
            <button
              onClick={() => onNavigate('hero')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Başlangıç
            </button>
            <button
              onClick={() => onNavigate('manifesto')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Manifesto
            </button>
            <button
              onClick={() => onNavigate('capabilities')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Disiplinler
            </button>
            <button
              onClick={() => onNavigate('case-studies')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Vaka Analizleri
            </button>
            <button
              onClick={() => onNavigate('brief-module')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Brief Modülü
            </button>
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              className="hover:text-white transition-colors cursor-pointer text-[#00FF66]"
            >
              SLISS Terminal [⌘K]
            </button>
          </nav>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-600">
          <div>
            © {new Date().getFullYear()} Engineering Living Systems. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-2">
            <span>Editorial architecture</span>
            <span aria-hidden="true">·</span>
            <span>Bare-metal &amp; Deterministic</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
