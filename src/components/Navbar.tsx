import { useState } from 'react';
import { sound } from '../utils/soundEngine.ts';
import { Volume2, VolumeX, Sparkles, Terminal } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleNav = (sectionId: string) => {
    sound.playClick();
    onNavigate(sectionId);
  };

  const triggerSliss = () => {
    sound.playTerminal();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0D0D0D]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        
        {/* Zone 1: Single text element wordmark with industrial orange accent */}
        <button
          onClick={() => handleNav('hero')}
          onMouseEnter={() => sound.playHover()}
          className="text-base md:text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors whitespace-nowrap shrink-0 text-left font-display cursor-pointer flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-[#FF4500]" />
          <span>Engineering Living Systems</span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium uppercase tracking-wider text-zinc-400">
          <button
            onClick={() => handleNav('hero')}
            onMouseEnter={() => sound.playHover()}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Manifesto
          </button>
          <button
            onClick={() => handleNav('capabilities')}
            onMouseEnter={() => sound.playHover()}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Disiplinler
          </button>
          <button
            onClick={() => handleNav('case-studies')}
            onMouseEnter={() => sound.playHover()}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Vakalar
          </button>
          <button
            onClick={() => handleNav('brief-module')}
            onMouseEnter={() => sound.playHover()}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Brief Modülü
          </button>
          <button
            onClick={triggerSliss}
            onMouseEnter={() => sound.playHover()}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer text-[#00FF66] flex items-center gap-1.5 font-mono"
          >
            <span className="w-1.5 h-1.5 bg-[#00FF66] rounded-none animate-pulse" />
            <span>SLISS [⌘K]</span>
          </button>
        </nav>

        {/* Zone 3: Audio Toggle + 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Cybernetic Web Audio Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 border text-xs font-mono transition-none cursor-pointer flex items-center gap-1.5 ${
              !isMuted
                ? 'border-[#00FF66]/50 bg-[#00FF66]/10 text-[#00FF66]'
                : 'border-white/10 text-zinc-500 hover:text-white hover:border-white/20'
            }`}
            title={!isMuted ? 'Sesi Kapat (Mute)' : 'Cyber-Tactile Sesi Aç (Unmute)'}
            data-cursor="AUDIO"
          >
            {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[10px] hidden sm:inline">{!isMuted ? 'FX_ON' : 'MUTED'}</span>
          </button>

          <button
            onClick={() => handleNav('brief-module')}
            onMouseEnter={() => sound.playHover()}
            className="px-4 py-2 text-xs font-medium text-black bg-white hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-mono"
            data-cursor="ENGAGE"
          >
            Mimarını Dahil Et
          </button>
        </div>

      </div>
    </header>
  );
}
