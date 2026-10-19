import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/soundEngine.ts';
import {
  Terminal,
  X,
  CornerDownLeft,
  Sparkles,
  Compass,
  Cpu,
  ArrowUpRight,
  HelpCircle,
  FolderGit2,
  Sliders,
  Trash2,
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'sliss';
  text: string;
  displayedText?: string;
  isTyping?: boolean;
  navTarget?: string | null;
  timestamp: string;
  isSystemCommand?: boolean;
}

interface CommandPaletteProps {
  onNavigate: (sectionId: string) => void;
}

const BUILT_IN_COMMANDS: Record<string, { desc: string; handler: (onNav: (id: string) => void) => { text: string; navTarget?: string } }> = {
  '/help': {
    desc: 'Tüm komutları ve terminal yeteneklerini listeler',
    handler: () => ({
      text: `SLISS CORE // KOMUT KILAVUZU:
  /help       - Bu yardım menüsünü listeler.
  /projects   - 4 seçili mühendislik projesini ve simülatörleri dökümler.
  /telemetry  - 3D GitHub katkı matrisi ve R&D laboratuvarına gider.
  /brief      - Teknik şartname ve Pydantic brief motoruna gider.
  /stack      - Ajansın kullandığı çekirdek teknoloji omurgasını listeler.
  /clear      - Terminal log tamponunu sıfırlar.

* Ayrıca serbest doğal dille soru sorabilir veya hata/terminal logu yapıştırarak anlık kök neden teşhisi alabilirsiniz.`,
    }),
  },
  '/projects': {
    desc: 'Seçili projeleri ve 3D simülatörleri listeler',
    handler: (onNav) => {
      onNav('case-studies');
      return {
        text: `MÜHENDİSLİK PROJELERİ VE 3D SİMÜLATÖRLER:
  1. Nova System: ESP32 Modbus-RTU Toprak Telemetrisi & 1.2km Diferansiyel Veri Yolu [MacBook 3D]
  2. LensAI & SudokuMap: 9x9 Bit-Masking Tensör Matris Ayrıştırıcı [iPhone 16 Pro 3D]
  3. Brook Mountain Resort: 120 Dönüm Mekânsal Topoloji & Dijital SOP Motoru [MacBook 3D]
  4. 3D Flight Sim: Web Worker & OffscreenCanvas İzolasyonlu 6-DOF Uçuş Motoru [MacBook 3D]

Navigasyon icra edildi: #case-studies`,
        navTarget: 'case-studies',
      };
    },
  },
  '/telemetry': {
    desc: '3D GitHub telemetri matrisi ve R&D laboratuvarına gider',
    handler: (onNav) => {
      onNav('github-telemetry');
      return {
        text: `TELEMETRİ HATTI:
  - Kullanıcı: OttoJoe1128
  - GraphQL API: 365 Günlük Katkı Takvimi & Monolitler
  - R&D Lab: ESP32 Prosedürel 3D Model & Parçacık Simülasyonu

Navigasyon icra edildi: #github-telemetry`,
        navTarget: 'github-telemetry',
      };
    },
  },
  '/brief': {
    desc: 'Teknik şartname ve brief motoruna gider',
    handler: (onNav) => {
      onNav('brief-module');
      return {
        text: `SİSTEM BRİEF MOTORU AKTİF:
  - Linear.app estetiğinde interaktif parametre seçimi
  - Canlı Pydantic JSON şartname çıktısı (/api/v1/system-brief)

Navigasyon icra edildi: #brief-module`,
        navTarget: 'brief-module',
      };
    },
  },
  '/stack': {
    desc: 'Çekirdek teknoloji omurgasını listeler',
    handler: () => ({
      text: `ÇEKİRDEK TEKNOLOJİ OMURGASI:
  • Gömülü Sistemler & Donanım: ESP32, ESP-IDF C++, FreeRTOS, RS485 Modbus-RTU (120Ω), CRC16
  • Dağıtık Arka Plan: FastAPI (Python 3.12), Go, PostgreSQL (Bağlantı Havuzlama), Redis, Firebase Firestore
  • Mekânsal & WebGL: Three.js, React Three Fiber, Web Worker, OffscreenCanvas, GLSL Shaders, GSAP ScrollTrigger, Lenis
  • Mimari Standart: Sıfır gürültü, yüksek eşzamanlılık, deterministik veri hatları`,
    }),
  },
};

export default function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'sliss',
      text: 'SLISS_CORE // ACTIVE: Baş Sistem Mimarı terminali hazır. Doğal dille site içinde gezinebilir ("donanım projelerini aç", "telemetriye git"), teknik sorular sorabilir veya /help yazarak komut listesini görebilirsiniz.',
      displayedText: 'SLISS_CORE // ACTIVE: Baş Sistem Mimarı terminali hazır. Doğal dille site içinde gezinebilir ("donanım projelerini aç", "telemetriye git"), teknik sorular sorabilir veya /help yazarak komut listesini görebilirsiniz.',
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
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Typewriter streaming effect for bot messages
  const startTypewriter = (messageId: string, fullText: string, navTarget?: string | null) => {
    let currentLen = 0;
    const speed = 12; // ms per chunk
    const stepSize = Math.max(1, Math.floor(fullText.length / 80));

    const interval = setInterval(() => {
      currentLen += stepSize;
      if (currentLen >= fullText.length) {
        currentLen = fullText.length;
        clearInterval(interval);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? { ...m, displayedText: fullText, isTyping: false }
              : m
          )
        );

        // Execute navTarget if present after typing finishes
        if (navTarget) {
          sound.playWarp();
          onNavigate(navTarget);
        }
      } else {
        const slice = fullText.slice(0, currentLen);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? { ...m, displayedText: slice, isTyping: true }
              : m
          )
        );
      }
    }, speed);
  };

  const handleSend = async (messageText?: string) => {
    const query = (messageText || input).trim();
    if (!query || loading) return;

    sound.playTerminal();

    // Track command history
    setCommandHistory((prev) => [...prev, query]);
    setHistoryIndex(-1);

    const userMsgId = 'user-' + Date.now();
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: query,
      displayedText: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput('');

    // Check for built-in client commands (/help, /projects, /clear, etc.)
    const cleanCmd = query.toLowerCase();
    if (cleanCmd === '/clear') {
      sound.playClick();
      setMessages([
        {
          id: 'clear-' + Date.now(),
          sender: 'sliss',
          text: 'SLISS_CORE: Terminal log tamponu temizlendi.',
          displayedText: 'SLISS_CORE: Terminal log tamponu temizlendi.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      return;
    }

    if (BUILT_IN_COMMANDS[cleanCmd]) {
      sound.playSuccess();
      const res = BUILT_IN_COMMANDS[cleanCmd].handler(onNavigate);
      const botMsgId = 'sliss-' + Date.now();
      const botMsg: Message = {
        id: botMsgId,
        sender: 'sliss',
        text: res.text,
        displayedText: '',
        isTyping: true,
        navTarget: res.navTarget,
        timestamp: new Date().toLocaleTimeString(),
        isSystemCommand: true,
      };
      setMessages((prev) => [...prev, botMsg]);
      startTypewriter(botMsgId, res.text, res.navTarget);
      return;
    }

    // Call server Gemini API endpoint /api/sliss/chat
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

      const botMsgId = 'sliss-' + Date.now();
      const botMsg: Message = {
        id: botMsgId,
        sender: 'sliss',
        text: slissReply,
        displayedText: '',
        isTyping: true,
        navTarget,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMsg]);
      startTypewriter(botMsgId, slissReply, navTarget);
    } catch {
      sound.playClick();
      const errorMsgId = 'err-' + Date.now();
      const errorText = 'HATA // SLISS_PROCESSOR_EXCEPTION: Sinyal işleme hatası. Parametreleri doğrulayın.';
      setMessages((prev) => [
        ...prev,
        {
          id: errorMsgId,
          sender: 'sliss',
          text: errorText,
          displayedText: errorText,
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

  // Up/Down Arrow Command History recall
  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInput(commandHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex < commandHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[nextIdx]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <>
      {/* Floating Bottom-Right Terminal Trigger Chip (Linear HUD Style) */}
      <button
        onClick={() => {
          sound.playWarp();
          setIsOpen(true);
        }}
        onMouseEnter={() => sound.playHover()}
        className="fixed bottom-6 right-6 z-40 bg-[#090b0e]/92 hover:bg-[#121620] border border-white/20 hover:border-[#00FF66]/60 backdrop-blur-md px-4 py-2.5 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-3 shadow-[0_12px_36px_rgba(0,0,0,0.85)] transition-all cursor-pointer group"
        data-cursor="SLISS"
      >
        <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse" />
        <Terminal className="w-4 h-4 text-[#00FF66]" />
        <span className="font-bold text-white tracking-wider">SLISS Terminal</span>
        <span className="text-[10px] text-zinc-500 font-normal border border-white/10 px-1.5 py-0.5 group-hover:border-white/30">
          ⌘K
        </span>
      </button>

      {/* Glassmorphism Command Palette Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
          {/* Backdrop Click to Close */}
          <div
            className="absolute inset-0"
            onClick={() => {
              sound.playClick();
              setIsOpen(false);
            }}
          />

          <div className="relative w-full max-w-2xl bg-[#090b0e]/98 border border-white/20 shadow-[0_0_60px_rgba(0,255,102,0.08)] flex flex-col max-h-[88vh] overflow-hidden text-xs font-mono z-10">
            {/* Header: Terminal Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#050608] border-b border-white/10">
              <div className="flex items-center gap-2.5 text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-[#00FF66]" />
                <Terminal className="w-3.5 h-3.5 text-[#00FF66]" />
                <span className="text-white font-bold tracking-wider">SLISS AI Terminal</span>
                <span className="text-zinc-600">·</span>
                <span className="text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 border border-white/10">
                  Gemini 3.8 Flash
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-500 hidden sm:inline">ESC İLE KAPAT</span>
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

            {/* Quick Action Suggestion Chips (Commands & Jumps) */}
            <div className="px-5 py-2.5 bg-[#06080b] border-b border-white/10 flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSend('/help')}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-none"
              >
                <HelpCircle className="w-3 h-3 text-[#38bdf8]" />
                <span>/help</span>
              </button>
              <button
                onClick={() => handleSend('/projects')}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-none"
              >
                <Cpu className="w-3 h-3 text-[#FF4500]" />
                <span>/projects</span>
              </button>
              <button
                onClick={() => handleSend('/telemetry')}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-none"
              >
                <FolderGit2 className="w-3 h-3 text-emerald-400" />
                <span>/telemetry</span>
              </button>
              <button
                onClick={() => handleSend('/brief')}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-none"
              >
                <Sparkles className="w-3 h-3 text-[#00FF66]" />
                <span>/brief</span>
              </button>
              <button
                onClick={() => handleSend('/clear')}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-zinc-400 hover:text-white flex items-center gap-1.5 cursor-pointer ml-auto transition-none"
              >
                <Trash2 className="w-3 h-3 text-zinc-500" />
                <span>/clear</span>
              </button>
            </div>

            {/* Message Stream with Typewriter Output */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[420px] bg-[#07090c]/70">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[10px] text-zinc-500">
                    <span className="font-bold text-zinc-400">
                      {msg.sender === 'user' ? 'OPERATOR' : 'SLISS_CORE // CHIEF ARCHITECT'}
                    </span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3 max-w-[92%] leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-white/10 border border-white/20 text-white'
                        : 'bg-[#05070a] border border-white/10 text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                    }`}
                  >
                    {msg.displayedText !== undefined ? msg.displayedText : msg.text}
                    {msg.isTyping && (
                      <span className="inline-block w-2 h-3.5 bg-[#00FF66] ml-1 animate-pulse align-middle" />
                    )}

                    {/* Navigation Dispatch Notice Badge */}
                    {msg.navTarget && !msg.isTyping && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                        <span className="text-[#00FF66] font-bold">
                          NAVİGASYON BAĞLANTISI: #{msg.navTarget}
                        </span>
                        <button
                          onClick={() => {
                            sound.playWarp();
                            onNavigate(msg.navTarget!);
                            setIsOpen(false);
                          }}
                          className="px-2.5 py-1 bg-[#00FF66]/20 border border-[#00FF66]/50 text-[#00FF66] hover:bg-[#00FF66]/30 flex items-center gap-1.5 cursor-pointer font-bold"
                        >
                          <span>BÖLÜME GİT</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-zinc-500 text-xs py-2">
                  <span className="w-2 h-2 bg-[#00FF66] animate-ping" />
                  <span>SLISS_PROCESSOR: Gemini 3.8 Flash çıkarımı yapılıyor...</span>
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
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDownInput}
                placeholder="Komut yazın (/help, /projects) veya doğal dille soru sorun..."
                className="flex-1 bg-transparent border-none text-white placeholder-zinc-600 focus:outline-none text-xs font-mono"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-3.5 py-1.5 bg-[#00FF66] text-black font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-400 cursor-pointer flex items-center gap-1.5"
              >
                <span>İLET</span>
                <CornerDownLeft className="w-3 h-3" />
              </button>
            </form>

            {/* Footer Status Bar */}
            <div className="px-5 py-2 bg-[#030406] border-t border-white/5 flex flex-wrap items-center justify-between text-[10px] text-zinc-500 gap-2">
              <div className="flex items-center gap-3">
                <span>SLISS Core Terminal Mimarisi</span>
                <span>·</span>
                <span>↑↓ Tuşları: Komut Geçmişi</span>
              </div>
              <span>Kapatmak için ESC veya dışarıya tıklayın</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
