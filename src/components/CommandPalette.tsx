import { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/soundEngine.ts';
import { Terminal, Send, X, CornerDownLeft, Sparkles, Compass, ShieldAlert, Cpu, ArrowUpRight } from 'lucide-react';

interface Message {
  sender: 'user' | 'sliss';
  text: string;
  navTarget?: string | null;
  timestamp: string;
  isDiagnostic?: boolean;
}

interface CommandPaletteProps {
  onNavigate: (sectionId: string) => void;
}

export default function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'sliss',
      text: 'SLISS_CORE_INIT: Çekirdek aktif. Sorgu parametresi veya terminal logu girin. Doğal dille site navigasyonu yönetilebilir (Örn: "Donanım projelerini aç", "3D simülasyona git", "Brief motoruna geç").',
      timestamp: '00:00:01',
    },
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Global Keyboard Shortcut: Cmd + K or Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        sound.playWarp();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        sound.playClick();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const query = (messageText || input).trim();
    if (!query || loading) return;

    sound.playTerminal();

    const userMsg: Message = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/sliss/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      const slissReply: string = data.reply || 'SLISS: Yanıt üretilemedi.';
      const navTarget: string | null = data.navTarget || null;

      sound.playSuccess();

      const botMsg: Message = {
        sender: 'sliss',
        text: slissReply,
        navTarget: navTarget,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMsg]);

      // If SLISS detected a direct navigation target, execute it
      if (navTarget) {
        onNavigate(navTarget);
      }
    } catch {
      sound.playClick();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'sliss',
          text: 'HATA // SLISS_SOCKET_FAILURE: Sunucu sinyal yanıtı vermedi. Yerel kurallar ile devam ediliyor.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionText: string, directTarget?: string) => {
    sound.playClick();
    if (directTarget) {
      onNavigate(directTarget);
      setIsOpen(false);
    } else {
      handleSend(actionText);
    }
  };

  return (
    <>
      {/* Floating Bottom-Right Terminal Trigger Chip (Linear.app Style) */}
      <button
        onClick={() => {
          sound.playWarp();
          setIsOpen(true);
        }}
        onMouseEnter={() => sound.playHover()}
        className="fixed bottom-6 right-6 z-40 bg-[#090b0e]/90 hover:bg-[#12161f] border border-white/20 hover:border-[#00FF66]/60 backdrop-blur-md px-4 py-2.5 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all cursor-pointer group"
        data-cursor="SLISS"
      >
        <span className="w-2 h-2 bg-[#00FF66] shadow-[0_0_8px_#00FF66] rounded-none animate-pulse" />
        <span className="font-bold text-white tracking-wider">SLISS // CMD+K</span>
        <span className="text-[10px] text-zinc-500 font-normal border border-white/10 px-1.5 py-0.5 group-hover:border-white/30">
          ⌘K
        </span>
      </button>

      {/* Glassmorphism Command Palette Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9000] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
          
          {/* Backdrop Click to Close */}
          <div className="absolute inset-0" onClick={() => {
            sound.playClick();
            setIsOpen(false);
          }} />

          <div className="relative w-full max-w-2xl bg-[#090b0e]/95 border border-white/20 shadow-[0_0_50px_rgba(0,255,102,0.06)] flex flex-col max-h-[85vh] overflow-hidden text-xs font-mono z-10">
            
            {/* Header: Terminal Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#050608] border-b border-white/10">
              <div className="flex items-center gap-2.5 text-zinc-400">
                <Terminal className="w-3.5 h-3.5 text-[#00FF66]" />
                <span className="text-white font-bold tracking-wider">SLISS // COMMAND_PALETTE</span>
                <span className="text-zinc-600">·</span>
                <span className="text-[10px] text-zinc-500">GEMINI_3.8_AI_CORE</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-500 hidden sm:inline">ESC TO DISMISS</span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsOpen(false);
                  }}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Action Suggestion Chips (Linear Style) */}
            <div className="px-5 py-2.5 bg-[#06080b] border-b border-white/10 flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleQuickAction('Bana donanım projelerini ve Nova System detaylarını göster', 'case-studies')}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-none"
              >
                <Cpu className="w-3 h-3 text-[#FF4500]" />
                <span>&gt; Donanım Projeleri (Nova)</span>
              </button>
              <button
                onClick={() => handleQuickAction('3D Flight Sim simülasyonunu aç', 'case-studies')}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-none"
              >
                <Compass className="w-3 h-3 text-[#38bdf8]" />
                <span>&gt; 3D Uçuş Simülatörü</span>
              </button>
              <button
                onClick={() => handleQuickAction('Teknik brief motoruna git', 'brief-module')}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-none"
              >
                <Sparkles className="w-3 h-3 text-[#00FF66]" />
                <span>&gt; Brief Motoru</span>
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[380px] bg-[#07090c]/50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[10px] text-zinc-500">
                    <span>{msg.sender === 'user' ? 'OPERATOR' : 'SLISS_CORE'}</span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3 max-w-[90%] leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-white/10 border border-white/20 text-white'
                        : 'bg-[#05070a] border border-white/10 text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                    }`}
                  >
                    {msg.text}

                    {/* Navigation Dispatch Notice */}
                    {msg.navTarget && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                        <span className="text-[#00FF66]">
                          DISPATCH_EVENT: #{msg.navTarget}
                        </span>
                        <button
                          onClick={() => {
                            sound.playWarp();
                            onNavigate(msg.navTarget!);
                            setIsOpen(false);
                          }}
                          className="px-2 py-0.5 bg-[#00FF66]/20 border border-[#00FF66]/40 text-[#00FF66] hover:bg-[#00FF66]/30 flex items-center gap-1 cursor-pointer"
                        >
                          <span>GÖRÜNTÜLE</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-zinc-500 text-xs py-2">
                  <span className="w-2 h-2 bg-[#00FF66] animate-ping" />
                  <span>SLISS_PROCESSOR: Sinyal çözümleniyor...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Terminal Command Input Field */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-[#050608] border-t border-white/10 flex items-center gap-3"
            >
              <span className="text-[#00FF66] font-bold pl-2 select-none">
                sliss@systems:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => {
                  sound.playTerminal();
                  setInput(e.target.value);
                }}
                placeholder="Komut, sayfa navigasyonu veya terminal hatası girin..."
                className="flex-1 bg-transparent border-none text-white placeholder-zinc-600 focus:outline-none text-xs font-mono"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-3 py-1.5 bg-white text-black font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-200 cursor-pointer flex items-center gap-1.5"
              >
                <span>İLET</span>
                <CornerDownLeft className="w-3 h-3" />
              </button>
            </form>

            {/* Footer Status Bar */}
            <div className="px-5 py-1.5 bg-[#030406] border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-600">
              <div className="flex items-center gap-3">
                <span>INP_LATENCY: &lt; 8ms</span>
                <span>·</span>
                <span>SYSTEM_ROLE: CREATIVE_TECHNOLOGIST</span>
              </div>
              <span>PRESS ESC OR CLICK OUTSIDE TO CLOSE</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
