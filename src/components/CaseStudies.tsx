import { useState, useRef, useEffect } from 'react';
import { CaseStudy } from '../types/index.ts';
import ThreeFlightSim from './ThreeFlightSim.tsx';
import DeviceSimulator3D from './DeviceSimulator3D.tsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ShieldAlert,
  Cpu,
  ArrowUpRight,
  Zap,
  CheckCircle,
  Activity,
  Terminal,
  FileCode,
  Layers,
  MapPin,
  Clock,
  Play,
  RotateCcw,
  X,
  Maximize2,
  ChevronRight,
  ExternalLink,
  Check,
  Copy
} from 'lucide-react';
import { CASE_STUDIES } from '../data/caseStudies';

gsap.registerPlugin(ScrollTrigger);

export default function CaseStudies() {
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);
  const [deepDiveProject, setDeepDiveProject] = useState<CaseStudy | null>(null);
  const [activeDeepDiveTab, setActiveDeepDiveTab] = useState<'architecture' | 'logs' | 'specs'>('architecture');
  const [copiedLog, setCopiedLog] = useState<boolean>(false);

  // Nova Agro Simulator States
  const [novaTab, setNovaTab] = useState<'driver' | 'crc16' | 'registers'>('driver');
  const [crcInputHex, setCrcInputHex] = useState<string>('01 03 00 00 00 04');
  const [novaSensorValues, setNovaSensorValues] = useState({
    moisture: 38.4,
    temp: 21.8,
    ph: 6.42,
    ec: 1.18,
    pumpActive: false,
  });

  // LensAI Matrix Solver States
  const [sudokuGrid, setSudokuGrid] = useState<number[][]>([
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ]);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [solveStats, setSolveStats] = useState<{ timeMs: number; iterations: number } | null>(null);

  // Brook Resort Topology State
  const [selectedZone, setSelectedZone] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slideInnerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // GSAP 2-Axis Orchestration:
  // 1. Vertical scroll reveals the complete project (header, metrics, 3D device simulator)
  // 2. Once the bottom is reached, horizontal scrub transitions to the next project
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const totalPanels = CASE_STUDIES.length;

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline();

      CASE_STUDIES.forEach((_, idx) => {
        const inner = slideInnerRefs.current[idx];
        const viewH = (container.clientHeight || window.innerHeight) - 65;
        const scrollH = inner ? inner.scrollHeight : viewH;
        const maxScrollY = Math.max(0, scrollH - viewH + 100);

        // Phase 1: Vertical scroll of current project to reveal the full 3D device simulator
        if (maxScrollY > 15) {
          masterTl.to(inner, {
            y: -maxScrollY,
            ease: 'none',
            duration: 1.6,
          });
        } else {
          masterTl.to({}, { duration: 0.4 });
        }

        // Phase 2: Horizontal glide to the next project
        if (idx < totalPanels - 1) {
          masterTl.to(track, {
            x: () => -(idx + 1) * window.innerWidth,
            ease: 'power2.inOut',
            duration: 1.2,
          });
        }
      });

      const totalScrollDuration = CASE_STUDIES.length * 2000;

      ScrollTrigger.create({
        animation: masterTl,
        trigger: container,
        start: 'top top',
        end: () => `+=${totalScrollDuration}`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const idx = Math.min(totalPanels - 1, Math.floor(p * totalPanels));
          setActiveProjectIndex(idx);
        },
      });
    }, container);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, []);

  // Keyboard navigation for projects
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (deepDiveProject) {
        if (e.key === 'Escape') setDeepDiveProject(null);
        return;
      }
      if (e.key === 'ArrowRight' && activeProjectIndex < CASE_STUDIES.length - 1) {
        jumpToProject(activeProjectIndex + 1);
      } else if (e.key === 'ArrowLeft' && activeProjectIndex > 0) {
        jumpToProject(activeProjectIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProjectIndex, deepDiveProject]);

  const jumpToProject = (idx: number) => {
    setActiveProjectIndex(idx);
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const totalScrollDuration = CASE_STUDIES.length * 2000;
    const progressTarget = idx / (CASE_STUDIES.length || 1);
    const targetScroll = containerTop + progressTarget * totalScrollDuration;
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  // Nova Agro Actions
  const togglePump = () => {
    setNovaSensorValues((prev) => ({
      ...prev,
      pumpActive: !prev.pumpActive,
      moisture: prev.pumpActive ? Math.max(20, prev.moisture - 1.8) : Math.min(85, prev.moisture + 5.2),
    }));
  };

  const randomizeTelemetry = () => {
    setNovaSensorValues({
      moisture: Number((32 + Math.random() * 14).toFixed(1)),
      temp: Number((20 + Math.random() * 5).toFixed(1)),
      ph: Number((6.1 + Math.random() * 0.7).toFixed(2)),
      ec: Number((1.05 + Math.random() * 0.35).toFixed(2)),
      pumpActive: false,
    });
  };

  const computeCrc16Modbus = (hexStr: string): string => {
    try {
      const bytes = hexStr
        .replace(/[^0-9a-fA-F]/g, '')
        .match(/.{1,2}/g)
        ?.map((b) => parseInt(b, 16)) || [];
      if (bytes.length === 0) return '0x0000';

      let crc = 0xffff;
      for (let pos = 0; pos < bytes.length; pos++) {
        crc ^= bytes[pos];
        for (let i = 8; i !== 0; i--) {
          if ((crc & 0x0001) !== 0) {
            crc >>= 1;
            crc ^= 0xa001;
          } else {
            crc >>= 1;
          }
        }
      }
      const low = crc & 0xff;
      const high = (crc >> 8) & 0xff;
      return `0x${low.toString(16).padStart(2, '0').toUpperCase()} 0x${high.toString(16).padStart(2, '0').toUpperCase()}`;
    } catch {
      return 'CALC_ERROR';
    }
  };

  // LensAI Matrix Solver Runner
  const runSudokuSolver = () => {
    setIsSolving(true);
    const start = performance.now();
    setTimeout(() => {
      // Deterministic solved 9x9 board
      const solved = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ];
      setSudokuGrid(solved);
      const elapsed = Number((performance.now() - start).toFixed(2));
      setSolveStats({ timeMs: Math.max(1.8, elapsed), iterations: 142 });
      setIsSolving(false);
    }, 450);
  };

  const resetSudokuGrid = () => {
    setSudokuGrid([
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ]);
    setSolveStats(null);
  };

  // Copy Logs
  const copyTerminalLogs = (logs: string[]) => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  const zones = [
    { id: 1, name: 'VİLLALAR (ZONE 01)', transitTime: '4.2 dk', staffActive: 8, status: 'NOMINAL', desc: 'Kuzey sırtındaki 42 bağımsız konut.' },
    { id: 2, name: 'MUTFAK MERKEZİ (ZONE 02)', transitTime: '1.0 dk', staffActive: 14, status: 'BUSY', desc: 'Lojistik çıkış ve yemek hazırlık merkezi.' },
    { id: 3, name: 'VADİ & SPA (ZONE 03)', transitTime: '3.5 dk', staffActive: 6, status: 'NOMINAL', desc: 'Hidroterapi ve masaj üniteleri.' },
    { id: 4, name: 'HELİPAD & KARŞILAMA (ZONE 04)', transitTime: '6.0 dk', staffActive: 3, status: 'IDLE', desc: 'VIP giriş ve transfer noktası.' },
    { id: 5, name: 'ORGANİK TARLA (ZONE 05)', transitTime: '5.1 dk', staffActive: 4, status: 'NOMINAL', desc: 'Tarladan sofraya hammadde kaynağı.' },
    { id: 6, name: 'GÜVENLİK KAPISI (ZONE 06)', transitTime: '7.8 dk', staffActive: 2, status: 'NOMINAL', desc: 'Ana giriş kontrol ve plaka tanıma.' },
  ];

  return (
    <section
      id="case-studies"
      ref={containerRef}
      className="relative min-h-screen bg-[#0D0D0D] overflow-hidden"
      data-cursor="SCROLL X"
    >
      {/* Top Architectural Navigation & Telemetry Bar */}
      <div className="z-30 w-full bg-[#0D0D0D]/95 backdrop-blur px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400">
            <span className="w-2 h-2 bg-[#FF4500]" />
            <span className="text-white font-bold">Seçili Projeler</span>
          </div>
          <span className="text-xs font-mono text-zinc-700 hidden sm:inline">·</span>
          <div className="text-xs font-mono text-zinc-400 tabular-nums">
            {activeProjectIndex + 1} / {CASE_STUDIES.length}
          </div>
        </div>

        {/* Quick Project Jump Controls */}
        <div className="flex items-center gap-2">
          {CASE_STUDIES.map((cs, idx) => (
            <button
              key={cs.id}
              onClick={() => jumpToProject(idx)}
              className={`px-3 py-1 text-xs font-mono transition-none cursor-pointer ${
                activeProjectIndex === idx
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              0{idx + 1}. {cs.client}
            </button>
          ))}
        </div>
      </div>

      {/* Sequential 2-Axis Orchestration Track: Width is precisely 100vw * total panels */}
      <div
        ref={trackRef}
        className="flex h-[calc(100vh-65px)] will-change-transform"
        style={{ width: `${CASE_STUDIES.length * 100}vw` }}
      >
        {CASE_STUDIES.map((project, idx) => (
          <div
            key={project.id}
            className="w-screen h-full shrink-0 overflow-hidden relative px-4 sm:px-8 lg:px-12 flex flex-col select-text"
          >
            {/* Inner Project Content: Translated on Y by GSAP to reveal full 3D device simulator */}
            <div
              ref={(el) => {
                slideInnerRefs.current[idx] = el;
              }}
              className="w-full max-w-7xl mx-auto py-8 sm:py-10 will-change-transform pb-64"
            >
              
              {/* Asymmetric Magazine Layout: Bold Editorial Header */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start pb-8 mb-8">
                
                {/* Left Column: Gigantic Project Number & Title */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                      <span className="text-[#FF4500] font-bold">↳</span>
                      <span>{project.category}</span>
                      <span aria-hidden="true" className="text-zinc-700">·</span>
                      <span>{project.timeline}</span>
                    </div>

                    <div className="text-5xl sm:text-6xl lg:text-7xl font-black font-display text-white tracking-tight leading-[0.95] mb-4">
                      {project.client}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-zinc-300 font-display mb-6">
                      {project.title}
                    </h3>

                    {/* Clip-Path Expansion Trigger Button */}
                    <button
                      onClick={() => setDeepDiveProject(project)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#14171f] hover:bg-[#1a202c] border border-white/20 hover:border-white text-xs font-mono text-white font-bold transi[...]
                      data-cursor="INSPECT"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#00FF66] group-hover:scale-110 transition-transform" />
                      <span>Mimari İnceleme &amp; Detaylar</span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Tech Stack Unboxed */}
                  <div className="pt-6 mt-6">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                      Kullanılan Teknolojiler:
                    </span>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-300">
                      {project.techStack.map((tech, tIdx) => (
                        <span key={tech} className="inline-flex items-center">
                          <span className="text-white font-medium">{tech}</span>
                          {tIdx < project.techStack.length - 1 && (
                            <span className="text-zinc-600 ml-2" aria-hidden="true">/</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: 3-Part Framework Problem / Approach / System */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#090b0e] p-5 border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-rose-400 uppercase tracking-wider mb-2">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Problem</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                        {project.problem}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#090b0e] p-5 border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Yaklaşım</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                        {project.approach}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#090b0e] p-5 border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Sistem</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                        {project.systemInstalled}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Metrics Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#090b0e] mb-8">
                {project.metrics.map((m, mIdx) => (
                  <div key={mIdx}>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">{m.label}</span>
                    <span className="text-xl lg:text-2xl font-bold text-white font-mono tabular-nums">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Specialized 3D Device Demonstrator Per Project */}

              {/* SLIDE 01: Nova Agro Systems - 3D MacBook Pro Simulator */}
              {project.id === 'nova-system' && (
                <DeviceSimulator3D
                  deviceType="macbook"
                  accentColor={project.accentColor}
                  client={project.client}
                  title={project.title}
                >
                  <div className="w-full h-full p-6 bg-[#060709] text-xs font-mono">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
                      <div className="flex items-center gap-3">
                        <Cpu className="w-4 h-4 text-[#FF4500]" />
                        <span className="text-white font-bold">
                          RS485 Modbus Telemetrisi &amp; ESP32 Sürücüsü
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={randomizeTelemetry}
                          className="px-3 py-1 border border-white/20 text-zinc-300 hover:text-white cursor-pointer bg-white/5"
                        >
                          Telemetri Yenile
                        </button>
                        <button
                          onClick={togglePump}
                          className={`px-3 py-1 font-semibold cursor-pointer ${
                            novaSensorValues.pumpActive ? 'bg-emerald-500 text-black' : 'bg-white text-black'
                          }`}
                        >
                          {novaSensorValues.pumpActive ? 'Sulama Pompası [AKTİF]' : 'Sulama Pompası Başlat'}
                        </button>
                      </div>
                    </div>

                    {/* Registers */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      <div className="bg-[#0b0e14] p-3 border border-white/10">
                        <span className="text-[10px] text-zinc-500 block">TOPRAK NEMİ</span>
                        <span className="text-xl font-bold text-white tabular-nums">{novaSensorValues.moisture}%</span>
                      </div>
                      <div className="bg-[#0b0e14] p-3 border border-white/10">
                        <span className="text-[10px] text-zinc-500 block">SICAKLIK</span>
                        <span className="text-xl font-bold text-white tabular-nums">{novaSensorValues.temp} °C</span>
                      </div>
                      <div className="bg-[#0b0e14] p-3 border border-white/10">
                        <span className="text-[10px] text-zinc-500 block">pH DEĞERİ</span>
                        <span className="text-xl font-bold text-white tabular-nums">{novaSensorValues.ph}</span>
                      </div>
                      <div className="bg-[#0b0e14] p-3 border border-white/10">
                        <span className="text-[10px] text-zinc-500 block">EC İLETKENLİK</span>
                        <span className="text-xl font-bold text-white tabular-nums">{novaSensorValues.ec} mS/cm</span>
                      </div>
                    </div>

                    {/* Driver Tabs */}
                    <div className="border border-white/10 bg-[#090b0e]">
                      <div className="flex border-b border-white/10 text-xs">
                        <button
                          onClick={() => setNovaTab('driver')}
                          className={`px-4 py-2 cursor-pointer ${novaTab === 'driver' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                        >
                          driver_modbus_rs485.cpp
                        </button>
                        <button
                          onClick={() => setNovaTab('crc16')}
                          className={`px-4 py-2 cursor-pointer ${novaTab === 'crc16' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                        >
                          CRC16 Doğrulayıcı
                        </button>
                        <button
                          onClick={() => setNovaTab('registers')}
                          className={`px-4 py-2 cursor-pointer ${novaTab === 'registers' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                        >
                          Modbus Register Haritası
                        </button>
                      </div>

                      <div className="p-4 text-xs">
                        {novaTab === 'driver' && (
                          <pre className="text-zinc-300 overflow-x-auto p-3 bg-[#050608] border border-white/5 leading-relaxed">{`ESP_ERROR_CHECK(uart_set_mode(UART_NUM_2, UART_MODE_RS485_HALF_DUPLEX));
ESP_ERROR_CHECK(uart_set_pin(UART_NUM_2, 17, 16, 4, UART_PIN_NO_CHANGE));
// 120Ω sonlandırma dirençleri ile 1.2km diferansiyel hat iletimi
uint8_t request_frame[] = { 0x01, 0x03, 0x00, 0x00, 0x00, 0x04, 0x44, 0x09 };
uart_write_bytes(UART_NUM_2, (const char*)request_frame, sizeof(request_frame));`}</pre>
                        )}

                        {novaTab === 'crc16' && (
                          <div className="space-y-3">
                            <span className="text-zinc-400 block">Modbus Hex Çerçevesi girin:</span>
                            <div className="flex flex-wrap items-center gap-3">
                              <input
                                type="text"
                                value={crcInputHex}
                                onChange={(e) => setCrcInputHex(e.target.value)}
                                className="bg-[#0b0e14] border border-white/20 px-3 py-1.5 text-xs text-white w-72"
                              />
                              <span className="text-emerald-400 font-bold bg-emerald-950/40 px-3 py-1.5 border border-emerald-500/30">
                                HESAPLANAN CRC: {computeCrc16Modbus(crcInputHex)}
                              </span>
                            </div>
                          </div>
                        )}

                        {novaTab === 'registers' && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-zinc-300">
                            <div className="p-2.5 bg-[#050608] border border-white/10">
                              <span className="text-zinc-500 block">REG 0x0000</span>
                              <span className="text-white font-bold">Toprak Nemi (x10)</span>
                            </div>
                            <div className="p-2.5 bg-[#050608] border border-white/10">
                              <span className="text-zinc-500 block">REG 0x0001</span>
                              <span className="text-white font-bold">Sıcaklık (°C x10)</span>
                            </div>
                            <div className="p-2.5 bg-[#050608] border border-white/10">
                              <span className="text-zinc-500 block">REG 0x0002</span>
                              <span className="text-white font-bold">pH Değeri (x100)</span>
                            </div>
                            <div className="p-2.5 bg-[#050608] border border-white/10">
                              <span className="text-zinc-500 block">REG 0x0003</span>
                              <span className="text-white font-bold">EC İletkenlik</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </DeviceSimulator3D>
              )}

              {/* SLIDE 02: LensAI & SudokuMap - 3D iPhone 16 Pro Simulator */}
              {project.id === 'lensai-sudokumap' && (
                <DeviceSimulator3D
                  deviceType="iphone"
                  accentColor={project.accentColor}
                  client={project.client}
                  title={project.title}
                >
                  <div className="w-full h-full p-4 bg-[#090b0e] text-xs font-mono flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10 mb-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-[#38bdf8]" />
                          <span className="text-white font-bold text-[11px]">
                            FastAPI Bit-Masking
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={resetSudokuGrid}
                            className="px-2 py-0.5 border border-white/20 text-[10px] text-zinc-300 hover:text-white cursor-pointer"
                          >
                            Sıfırla
                          </button>
                          <button
                            onClick={runSudokuSolver}
                            disabled={isSolving}
                            className="px-2.5 py-0.5 bg-[#38bdf8] text-black font-bold text-[10px] cursor-pointer flex items-center gap-1 hover:bg-[#60a5fa]"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>{isSolving ? '...' : 'Çöz'}</span>
                          </button>
                        </div>
                      </div>

                      {/* 9x9 Interactive Matrix Grid */}
                      <div className="flex justify-center mb-4">
                        <div className="grid grid-cols-9 gap-0.5 bg-zinc-800 p-1 border border-white/30 w-full max-w-[270px] aspect-square">
                          {sudokuGrid.map((row, rIdx) =>
                            row.map((cell, cIdx) => (
                              <div
                                key={`${rIdx}-${cIdx}`}
                                className={`flex items-center justify-center font-mono text-[10px] font-bold aspect-square ${
                                  cell !== 0 ? 'bg-[#0f141c] text-white' : 'bg-[#06080b] text-zinc-600'
                                } ${
                                  (Math.floor(rIdx / 3) + Math.floor(cIdx / 3)) % 2 === 0
                                    ? 'border border-white/5'
                                    : 'border border-white/10'
                                }`}
                              >
                                {cell !== 0 ? cell : '·'}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Benchmark Metrics */}
                    <div className="space-y-2 text-[10px]">
                      <div className="bg-[#060709] p-2.5 border border-white/10 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Çözüm Süresi (P99):</span>
                          <span className="text-emerald-400 font-bold tabular-nums">
                            {solveStats ? `${solveStats.timeMs} ms` : '1.82 ms'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Düğüm Budama:</span>
                          <span className="text-white font-bold">%94.2</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Firebase Transaction:</span>
                          <span className="text-sky-400 font-bold">10.4 ms</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Eşzamanlı Oyuncu:</span>
                          <span className="text-amber-400 font-bold">50,000+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DeviceSimulator3D>
              )}

              {/* SLIDE 03: Brook Mountain Resort - 3D MacBook Pro Simulator */}
              {project.id === 'brook-resort' && (
                <DeviceSimulator3D
                  deviceType="macbook"
                  accentColor={project.accentColor}
                  client={project.client}
                  title={project.title}
                >
                  <div className="w-full h-full p-6 bg-[#090b0e] text-xs font-mono flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-[#10b981]" />
                          <span className="text-white font-bold">
                            120 Dönüm Tesis Topolojisi &amp; Dijital SOP Rotalama
                          </span>
                        </div>
                        <span className="text-zinc-500">
                          Bölge Seçerek Lojistik Süreleri İnceleyin
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Zone Cards */}
                        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {zones.map((zone) => (
                            <button
                              key={zone.id}
                              onClick={() => setSelectedZone(zone.id)}
                              className={`p-3 text-left border text-xs font-mono transition-none cursor-pointer ${
                                selectedZone === zone.id
                                  ? 'border-[#10b981] bg-[#10b981]/15 text-white'
                                  : 'border-white/10 bg-[#060709] text-zinc-400 hover:text-white hover:border-white/20'
                              }`}
                            >
                              <span className="text-[10px] text-zinc-500 block">ZONE 0{zone.id}</span>
                              <span className="font-bold block truncate mt-0.5">{zone.name.split(' ')[0]}</span>
                              <div className="mt-2 text-[11px] text-zinc-300">
                                Transit: <span className="text-emerald-400 font-bold">{zone.transitTime}</span>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Zone Details & SOP Rule */}
                        <div className="md:col-span-5 bg-[#060709] p-4 border border-white/10 flex flex-col justify-between text-xs font-mono">
                          <div>
                            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                              <span className="text-white font-bold">{zones[selectedZone - 1].name}</span>
                              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px]">
                                {zones[selectedZone - 1].status}
                              </span>
                            </div>
                            <p className="text-zinc-400 text-xs mb-3 leading-relaxed">
                              {zones[selectedZone - 1].desc}
                            </p>
                            <div className="space-y-1.5 text-zinc-300">
                              <div className="flex justify-between">
                                <span className="text-zinc-500">Aktif Görevli:</span>
                                <span className="text-white font-bold">{zones[selectedZone - 1].staffActive} Personel</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500">Mutfak Hub Mesafesi:</span>
                                <span className="text-white font-bold">{zones[selectedZone - 1].transitTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500">SOP Standart Kodu:</span>
                                <span className="text-[#10b981] font-bold">SOP-DISPATCH-0{selectedZone}</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/10 mt-3 text-[11px] text-zinc-500">
                            Oda servisi süresi 45 dakikadan 23 dakikaya indirilmiştir (%48 hızlanma).
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DeviceSimulator3D>
              )}

              {/* SLIDE 04: Derin Demirkaya 3D Flight Sim - 3D MacBook Pro Simulator */}
              {project.id === 'flight-sim' && (
                <DeviceSimulator3D
                  deviceType="macbook"
                  accentColor={project.accentColor}
                  client={project.client}
                  title={project.title}
                >
                  <div className="w-full h-full p-4 bg-[#07080a]" data-cursor="DRAG 3D">
                    <ThreeFlightSim />
                  </div>
                </DeviceSimulator3D>
              )}

              {/* Bottom Visual Transition Cue */}
              <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>
                    Proje 0{idx + 1} / 0{CASE_STUDIES.length} Sonu • {project.client}
                  </span>
                </div>
                {idx < CASE_STUDIES.length - 1 ? (
                  <div className="flex items-center gap-2 text-[#00FF66]">
                    <span>Kaydırmaya devam ederek sonraki projeye geçin</span>
                    <ChevronRight className="w-4 h-4 animate-pulse" />
                  </div>
                ) : (
                  <span className="text-zinc-500">Seçili Projelerin Sonu</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clip-Path Expansion Reveal: Fullscreen Architectural Deep Dive Modal */}
      {deepDiveProject && (
        <div
          className="fixed inset-0 z-50 bg-[#050608]/98 backdrop-blur-2xl flex flex-col overflow-y-auto animate-in fade-in duration-300"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          }}
        >
          {/* Top Bar of Deep Dive Modal */}
          <div className="sticky top-0 z-20 w-full bg-[#0a0d12] border-b border-white/10 px-6 sm:px-10 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-white/10 text-white font-mono text-xs font-bold border border-white/20">
                {deepDiveProject.kicker}
              </span>
              <div>
                <h4 className="text-white font-display font-bold text-lg hidden sm:block">
                  {deepDiveProject.title}
                </h4>
                <span className="text-xs font-mono text-zinc-400 block sm:hidden">
                  MİMARİ İNCELEME
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeepDiveProject(null)}
                className="p-2 border border-white/20 hover:border-white text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">KAPAT [ESC]</span>
              </button>
            </div>
          </div>

          {/* Deep Dive Content Container */}
          <div className="w-full max-w-6xl mx-auto p-6 sm:p-10 flex-1">
            
            {/* Top Overview Banner */}
            <div className="bg-[#080a0e] border border-white/10 p-6 md:p-8 mb-8">
              <div className="text-xs font-mono text-[#00FF66] uppercase tracking-widest mb-2">
                SİSTEM MİMARİSİ &amp; KAPSAM GENEL BAKIŞI
              </div>
              <p className="text-base sm:text-lg text-zinc-200 font-normal leading-relaxed mb-6">
                {deepDiveProject.deepDive?.summary || deepDiveProject.approach}
              </p>

              {/* Deliverables List */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-2">
                  Temel Çıktılar ve Mühendislik Katmanları:
                </span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {deepDiveProject.deepDive?.keyDeliverables.map((del, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2.5 text-xs font-mono text-zinc-300">
                      <Check className="w-4 h-4 text-[#00FF66] shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Deep Dive Navigation Tabs */}
            <div className="flex border-b border-white/10 mb-6 text-xs font-mono">
              <button
                onClick={() => setActiveDeepDiveTab('architecture')}
                className={`px-5 py-2.5 cursor-pointer flex items-center gap-2 ${
                  activeDeepDiveTab === 'architecture'
                    ? 'border-b-2 border-[#00FF66] text-white font-bold bg-white/5'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Teknik Mimari Katmanları</span>
              </button>
              <button
                onClick={() => setActiveDeepDiveTab('logs')}
                className={`px-5 py-2.5 cursor-pointer flex items-center gap-2 ${
                  activeDeepDiveTab === 'logs'
                    ? 'border-b-2 border-[#00FF66] text-white font-bold bg-white/5'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Canlı Terminal Logları</span>
              </button>
              <button
                onClick={() => setActiveDeepDiveTab('specs')}
                className={`px-5 py-2.5 cursor-pointer flex items-center gap-2 ${
                  activeDeepDiveTab === 'specs'
                    ? 'border-b-2 border-[#00FF66] text-white font-bold bg-white/5'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Donanım &amp; Protokol Spesifikasyonları</span>
              </button>
            </div>

            {/* Tab 1: Architecture Layers */}
            {activeDeepDiveTab === 'architecture' && (
              <div className="space-y-4 font-mono text-xs">
                {deepDiveProject.deepDive?.technicalArchitecture.map((arch, aIdx) => (
                  <div key={aIdx} className="p-4 bg-[#080a0e] border border-white/10 flex items-start gap-4">
                    <span className="px-2 py-1 bg-white/10 text-[#00FF66] font-bold">
                      KATMAN 0{aIdx + 1}
                    </span>
                    <span className="text-zinc-200 text-sm leading-relaxed">{arch}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Terminal Logs */}
            {activeDeepDiveTab === 'logs' && (
              <div className="bg-[#050608] border border-white/15 p-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 text-xs font-mono">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sistem Çalışma Zamanı Logları</span>
                  </div>
                  <button
                    onClick={() => copyTerminalLogs(deepDiveProject.deepDive?.terminalLogs || [])}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-white cursor-pointer px-2 py-1 border border-white/10"
                  >
                    {copiedLog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLog ? 'Kopyalandı' : 'Logları Kopyala'}</span>
                  </button>
                </div>
                <div className="space-y-2 font-mono text-xs text-zinc-300">
                  {deepDiveProject.deepDive?.terminalLogs.map((log, lIdx) => (
                    <div key={lIdx} className="flex items-start gap-3">
                      <span className="text-zinc-600 select-none">{String(lIdx + 1).padStart(2, '0')}</span>
                      <span className="text-emerald-400">{'>'}</span>
                      <span className="text-zinc-200">{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Hardware & Protocol Specs */}
            {activeDeepDiveTab === 'specs' && (
              <div className="border border-white/10 bg-[#080a0e] divide-y divide-white/10 font-mono text-xs">
                {deepDiveProject.deepDive?.hardwareOrProtocolSpecs?.map((spec, sIdx) => (
                  <div key={sIdx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-zinc-400 uppercase">{spec.label}</span>
                    <span className="text-white font-bold text-sm tabular-nums">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
