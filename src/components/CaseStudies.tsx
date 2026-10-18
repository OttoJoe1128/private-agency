import { useState, useRef, useEffect } from 'react';
import { CaseStudy } from '../types/index.ts';
import ThreeFlightSim from './ThreeFlightSim.tsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ShieldAlert,
  Cpu,
  ArrowUpRight,
  Zap,
  RefreshCw,
  CheckCircle,
  Code,
  FileCode,
  Activity,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'nova-system',
    category: 'Tarım & Endüstriyel IoT',
    client: 'Nova Agro Systems',
    title: 'Nova System: RS485 Modbus Toprak Telemetrisi & ESP32 Sürücü Mimarisi',
    kicker: '01 // NOVA AGRO',
    timeline: '14 Hafta (Donanım + Arayüz)',
    problem:
      'Geniş ölçekli sera alanlarında toprak tuzlanması, kontrolsüz sulama ve yüksek elektromanyetik parazit (EMI) nedeniyle kablosuz sensörlerin sinyal kaybı yaşaması. Standart IoT çiplerinin asit ve neme dayanamaması.',
    approach:
      'Kablosuz paket kaybını ortadan kaldırmak için diferansiyel sinyal taşıyan RS485 endüstriyel veri yolu ve Modbus-RTU protokolüne geçildi. ESP-IDF üzerinde FreeRTOS zamanlayıcısıyla deterministik bir C++ Modbus sürücüsü geliştirildi.',
    systemInstalled:
      'ESP32 tabanlı master denetleyici, 8 kanallı galvanik izoleli RS485 alıcı-verici, Modbus-RTU register haritası (Toprak Nemi, Sıcaklık, pH, EC iletkenlik), 120Ω sonlandırma dirençleri ve canlı dashboard.',
    techStack: ['ESP32', 'ESP-IDF C++', 'Modbus-RTU', 'RS485 Half-Duplex', 'FastAPI', 'WebSocket'],
    metrics: [
      { label: 'Ölçüm Güvenilirliği', value: '%99.98' },
      { label: 'Su & Gübre Tasarrufu', value: '%34' },
      { label: 'Veri Yolu Menzili', value: '1.2 km' },
      { label: 'Sensör Okuma Periyodu', value: '250 ms' },
    ],
    accentColor: '#FF4500',
  },
  {
    id: 'lensai-sudokumap',
    category: 'Yüksek Performanslı Dağıtık Web',
    client: 'LensAI Global',
    title: 'LensAI & SudokuMap: Dağıtık Matris Ayrıştırma & Canlı Firebase Leaderboard',
    kicker: '02 // LENSAI ENGINE',
    timeline: '8 Hafta',
    problem:
      'Görüntü tabanlı 9x9 matris çözümlerinde istemci cihazların işlemci darboğazına girmesi, karmaşık geri izleme (backtracking) algoritmalarının UI tepkiselliğini dondurması ve eşzamanlı binlerce oyuncunun anlık skor senkronizasyonunda veritabanı kilitlenmesi.',
    approach:
      'Hesaplama yükünü asenkron FastAPI mikroservisine devreden boru hattı kuruldu. Matris kısıtları bit-masking optimizasyonuyla C-seviyesi hızda çözüldü. Canlı skorlar için Firebase Firestore dağıtık liderlik mimarisi entegre edildi.',
    systemInstalled:
      'Pydantic doğrulamalı FastAPI REST & WebSocket uç noktası, tensör matris doğrulama servisi, Firebase distributed transaction tabanlı anlık skor tablosu ve 60 FPS Canvas oyun ızgarası.',
    techStack: ['FastAPI', 'Python 3.12', 'Firebase', 'PostgreSQL', 'WebSockets', 'React 19'],
    metrics: [
      { label: 'Algoritma Çözüm Süresi', value: '1.8 ms' },
      { label: 'API Uçtan Uca Gecikme', value: '12 ms' },
      { label: 'Eşzamanlı Oyuncu', value: '50,000+' },
      { label: 'CPU Kullanım Düşüşü', value: '%68' },
    ],
    accentColor: '#38bdf8',
  },
  {
    id: 'brook-resort',
    category: 'Mekansal & Operasyonel Tasarım',
    client: 'Brook Mountain Resort',
    title: 'Brook Resort: 120 Dönüm Tesis Mimarisi & SOP Standartlaştırma Motoru',
    kicker: '03 // BROOK SPATIAL',
    timeline: '12 Hafta',
    problem:
      'Doğal vadi arazisinde dağınık 42 villa, spa merkezi ve açık rekreasyon ünitelerinde personel hareketlerinin plansız olması, oda servisi sürelerinin 45 dakikayı aşması ve departmanlar arası operasyonel el sıkışma standartlarının eksikliği.',
    approach:
      'Mekansal akış ısı haritaları çıkartılarak lojistik sirkülasyon hatları yeniden düzenlendi. Tüm servis ve karşılama süreçleri dijital SOP (Standard Operating Procedure) kurallarına dönüştürülerek personelin adım adım izleyebileceği interaktif görev matrisine bağlandı.',
    systemInstalled:
      '6 bölgeye ayrılmış mekansal harita ve sirkülasyon rotalama planı, dijital SOP denetim paneli, oda servis süresi takip sistemi ve yöneticiler için gerçek zamanlı operasyonel verimlilik konsolu.',
    techStack: ['Spatial Topology', 'SOP Matrix', 'Next.js App', 'PostgreSQL', 'Figma Blueprint'],
    metrics: [
      { label: 'Servis Süresi Düşüşü', value: '-22 dk' },
      { label: 'Personel Verimliliği', value: '+%42' },
      { label: 'Müşteri Memnuniyeti', value: '4.9 / 5.0' },
      { label: 'SOP Uyumluluk Oranı', value: '%97.4' },
    ],
    accentColor: '#10b981',
  },
  {
    id: 'flight-sim',
    category: 'Avangart Web & 3D Spatial',
    client: 'Derin Demirkaya',
    title: 'Derin Demirkaya: Web Worker & OffscreenCanvas 3D Uçuş Simülatörü',
    kicker: '04 // FLIGHT 3D',
    timeline: '6 Hafta',
    problem:
      'Ağır 3D simülasyon ve drone aerodinamik hesaplamalarının tarayıcı ana iş parçacığında çalışarak web sayfasında karesel atlamalara (INP düşüşü, jank) ve kullanıcı etkileşiminde gecikmelere sebep olması.',
    approach:
      'Tüm Three.js render döngüsü ve aerodinamik simülasyon mantığı `OffscreenCanvas` ve Web Workers üzerine taşındı. Ana DOM iş parçacığı yalnızca minimal girdi transferi yaparak 60 FPS sabit akıcılık sağlandı.',
    systemInstalled:
      'WebGL / Three.js 6 eksenli drone simülasyonu, irtifa ve açı telemetri göstergeleri, dinamik tel çerçeve/katı model dönüştürücüsü ve karesel atlamasız mimari.',
    techStack: ['Three.js', 'WebGL', 'OffscreenCanvas', 'Web Workers', 'GSAP', 'TypeScript'],
    metrics: [
      { label: 'Sabit Render Hızı', value: '60 FPS' },
      { label: 'Main Thread Yükü', value: '< %4' },
      { label: 'Input Latency', value: '4.2 ms' },
      { label: 'Buffer Hafıza Boyutu', value: '18 MB' },
    ],
    accentColor: '#a855f7',
  },
];

export default function CaseStudies() {
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);
  const [novaTab, setNovaTab] = useState<'driver' | 'crc16' | 'noise-field'>('driver');
  const [crcInputHex, setCrcInputHex] = useState<string>('01 03 00 00 00 04');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [novaSensorValues, setNovaSensorValues] = useState({
    moisture: 38.4,
    temp: 21.8,
    ph: 6.42,
    ec: 1.18,
    pumpActive: false,
  });

  const togglePump = () => {
    setNovaSensorValues((prev) => ({
      ...prev,
      pumpActive: !prev.pumpActive,
      moisture: prev.pumpActive ? prev.moisture - 1.2 : prev.moisture + 3.5,
    }));
  };

  const randomizeTelemetry = () => {
    setNovaSensorValues({
      moisture: Number((35 + Math.random() * 8).toFixed(1)),
      temp: Number((20 + Math.random() * 4).toFixed(1)),
      ph: Number((6.2 + Math.random() * 0.5).toFixed(2)),
      ec: Number((1.1 + Math.random() * 0.2).toFixed(2)),
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

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const totalPanels = CASE_STUDIES.length;

    const ctx = gsap.context(() => {
      const pinTrigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: () => `+=${window.innerWidth * (totalPanels - 1) * 1.2}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const index = Math.min(
            totalPanels - 1,
            Math.floor(self.progress * totalPanels)
          );
          setActiveProjectIndex(index);

          const targetX = -self.progress * (100 * (totalPanels - 1) / totalPanels);
          gsap.set(track, { xPercent: targetX });
        },
      });

      return () => {
        pinTrigger.kill();
      };
    }, container);

    return () => ctx.revert();
  }, []);

  const jumpToProject = (idx: number) => {
    setActiveProjectIndex(idx);
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const scrollDistance = window.innerWidth * idx * 1.2;
    window.scrollTo({
      top: containerTop + scrollDistance,
      behavior: 'smooth',
    });
  };

  return (
    <section
      id="case-studies"
      ref={containerRef}
      className="relative min-h-screen bg-[#0D0D0D] border-b border-white/10 overflow-hidden"
      data-cursor="SCROLL X"
    >
      {/* Top Architectural Progress Bar */}
      <div className="z-30 w-full bg-[#0D0D0D]/95 backdrop-blur border-b border-white/10 px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500">
            <span className="w-2 h-2 bg-[#FF4500]" />
            <span className="text-white font-bold">SELECTED WORKS // HORIZONTAL DERGİ MİZANPAJI</span>
          </div>
          <span className="text-xs font-mono text-zinc-700">/</span>
          <div className="text-xs font-mono text-[#FF4500] font-bold tabular-nums">
            0{activeProjectIndex + 1} // 0{CASE_STUDIES.length}
          </div>
        </div>

        {/* Quick Jump Buttons */}
        <div className="flex items-center gap-2">
          {CASE_STUDIES.map((cs, idx) => (
            <button
              key={cs.id}
              onClick={() => jumpToProject(idx)}
              className={`px-3 py-1 text-xs font-mono transition-none cursor-pointer border ${
                activeProjectIndex === idx
                  ? 'border-white bg-white text-black font-bold'
                  : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
              }`}
            >
              0{idx + 1}. {cs.client}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Sliding Track with Massive Inter-Project Breathing Gap (gap-[16vw]) */}
      <div
        ref={trackRef}
        className="flex h-[calc(100vh-65px)] w-[460vw] gap-[16vw] will-change-transform pl-8 pr-[16vw]"
      >
        {CASE_STUDIES.map((project, idx) => (
          <div
            key={project.id}
            className="w-[95vw] lg:w-[88vw] h-full py-8 md:py-12 flex flex-col justify-between overflow-y-auto shrink-0"
            data-cursor="VIEW PROJECT"
          >
            <div className="w-full max-w-7xl mx-auto">
              
              {/* Asymmetric Magazine Layout: Massive Typographic Headline Left, Tech Console Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start pb-8 border-b border-white/10 mb-8">
                
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
                      {project.kicker}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-zinc-300 font-display mb-6">
                      {project.title}
                    </h3>
                  </div>

                  {/* Tech Stack Unboxed */}
                  <div className="pt-4 border-t border-white/10">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                      MİMARİ YIĞIN:
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

                {/* Right Column: 3-Part Framework Problem/Approach/System */}
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#090b0e] border border-white/10 mb-8">
                {project.metrics.map((m, mIdx) => (
                  <div key={mIdx}>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">{m.label}</span>
                    <span className="text-xl lg:text-2xl font-bold text-white font-mono tabular-nums">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Specialized Demonstrator per Slide */}
              {project.id === 'nova-system' && (
                <div className="border border-white/10 bg-[#060709] p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-4 h-4 text-[#FF4500]" />
                      <span className="text-xs font-mono text-white font-bold">
                        ESP32_IDF_V5.3 // RS485_MODBUS_TELEMETRY (120Ω LATCHED)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={randomizeTelemetry}
                        className="px-3 py-1 border border-white/20 text-xs font-mono text-zinc-300 hover:text-white cursor-pointer"
                      >
                        Telemetri Yenile
                      </button>
                      <button
                        onClick={togglePump}
                        className={`px-3 py-1 text-xs font-mono font-semibold cursor-pointer ${
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
                      <span className="text-[10px] font-mono text-zinc-500 block">TOPRAK NEMİ</span>
                      <span className="text-xl font-bold font-mono text-white tabular-nums">{novaSensorValues.moisture}%</span>
                    </div>
                    <div className="bg-[#0b0e14] p-3 border border-white/10">
                      <span className="text-[10px] font-mono text-zinc-500 block">SICAKLIK</span>
                      <span className="text-xl font-bold font-mono text-white tabular-nums">{novaSensorValues.temp} °C</span>
                    </div>
                    <div className="bg-[#0b0e14] p-3 border border-white/10">
                      <span className="text-[10px] font-mono text-zinc-500 block">pH DEĞERİ</span>
                      <span className="text-xl font-bold font-mono text-white tabular-nums">{novaSensorValues.ph}</span>
                    </div>
                    <div className="bg-[#0b0e14] p-3 border border-white/10">
                      <span className="text-[10px] font-mono text-zinc-500 block">EC İLETKENLİK</span>
                      <span className="text-xl font-bold font-mono text-white tabular-nums">{novaSensorValues.ec} mS/cm</span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border border-white/10 bg-[#090b0e]">
                    <div className="flex border-b border-white/10 text-xs font-mono">
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
                        onClick={() => setNovaTab('noise-field')}
                        className={`px-4 py-2 cursor-pointer ${novaTab === 'noise-field' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                      >
                        120Ω &amp; Saha Gerçekliği
                      </button>
                    </div>

                    <div className="p-4 text-xs font-mono">
                      {novaTab === 'driver' && (
                        <pre className="text-zinc-300 overflow-x-auto p-3 bg-[#050608] border border-white/5 leading-relaxed">
{`ESP_ERROR_CHECK(uart_set_mode(UART_NUM_2, UART_MODE_RS485_HALF_DUPLEX));
ESP_ERROR_CHECK(uart_set_pin(UART_NUM_2, 17, 16, 4, UART_PIN_NO_CHANGE));
// Half-duplex hardware-driven direction switch on pin 4`}
                        </pre>
                      )}

                      {novaTab === 'crc16' && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={crcInputHex}
                              onChange={(e) => setCrcInputHex(e.target.value)}
                              className="bg-[#0b0e14] border border-white/20 px-3 py-1 text-xs text-white w-64"
                            />
                            <span className="text-emerald-400 font-bold">CRC16: {computeCrc16Modbus(crcInputHex)}</span>
                          </div>
                        </div>
                      )}

                      {novaTab === 'noise-field' && (
                        <div className="space-y-2 text-zinc-300">
                          <div>• 120Ω hat sonlandırma direnci ile 1.2km hat boyu yansıma sönümleme.</div>
                          <div>• |VA - VB| ≥ ±200 mV diferansiyel eşiği ile EMI parazit bağışıklığı.</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {project.id === 'lensai-sudokumap' && (
                <div className="border border-white/10 bg-[#090b0e] p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="bg-[#060709] p-4 border border-white/10">
                      <span className="text-xs font-mono text-zinc-400 block mb-2">FASTAPI ASYNC COROUTINE PIPELINE</span>
                      <div className="space-y-1.5 text-xs font-mono text-zinc-300">
                        <div className="flex justify-between"><span>Solve Latency:</span><span className="text-emerald-400">1.82 ms</span></div>
                        <div className="flex justify-between"><span>Firebase Sync:</span><span className="text-white">10.4 ms</span></div>
                        <div className="flex justify-between"><span>Subscribers:</span><span className="text-amber-400">50,000+ WS</span></div>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-zinc-400 leading-relaxed">
                      C-seviyesi bit-masking optimizasyonu ile tarayıcı CPU'sunu kilitlemeden asenkron coroutine havuzu üzerinden 14ms altında deterministik yanıt süresi.
                    </div>
                  </div>
                </div>
              )}

              {project.id === 'brook-resort' && (
                <div className="border border-white/10 bg-[#090b0e] p-6">
                  <div className="grid grid-cols-3 gap-3 text-xs font-mono mb-4">
                    <div className="bg-[#060709] p-3 border border-white/10"><span>BÖLGE 01: VİLLALAR</span><span className="text-white block mt-1 font-bold">42 Ünite</span></div>
                    <div className="bg-[#060709] p-3 border border-white/10"><span>BÖLGE 02: MUTFAK HUB</span><span className="text-white block mt-1 font-bold">Lojistik Merkez</span></div>
                    <div className="bg-[#060709] p-3 border border-white/10"><span>BÖLGE 03: VADİ &amp; SPA</span><span className="text-white block mt-1 font-bold">Rekreasyon</span></div>
                  </div>
                  <div className="text-xs font-mono text-zinc-400">
                    SOP-ROOM-04 ve SOP-LOG-02 dijitalleştirilmiş servis süreleriyle ortalama oda servisi 45 dakikadan 23 dakikaya indirilmiştir.
                  </div>
                </div>
              )}

              {project.id === 'flight-sim' && (
                <div data-cursor="DRAG 3D">
                  <ThreeFlightSim />
                </div>
              )}

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
