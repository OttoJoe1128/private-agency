import React from 'react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0D0D0D]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark with industrial orange accent */}
        <button
          onClick={() => onNavigate('hero')}
          className="text-base md:text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors whitespace-nowrap shrink-0 text-left font-display cursor-pointer flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-[#FF4500]" />
          <span>Engineering Living Systems</span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium uppercase tracking-wider text-zinc-400">
          <button
            onClick={() => onNavigate('manifesto')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Manifesto
          </button>
          <button
            onClick={() => onNavigate('capabilities')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Disiplinler
          </button>
          <button
            onClick={() => onNavigate('case-studies')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Vakalar
          </button>
          <button
            onClick={() => onNavigate('brief-module')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Brief Modülü
          </button>
          <button
            onClick={() => onNavigate('git-deploy')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer text-zinc-300"
          >
            GitHub Dağıtım
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('brief-module')}
            className="px-4 py-2 text-xs font-medium text-black bg-white hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Mimarını Dahil Et
          </button>
        </div>
      </div>
    </header>
  );
}
