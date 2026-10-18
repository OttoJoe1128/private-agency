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
    deepDive: {
      summary: '1.2 km mesafede diferansiyel gerilim (|VA - VB| >= 200mV) ile çalışan, parazit bağışıklı endüstriyel tarım otomasyon mimarisi.',
      keyDeliverables: [
        'ESP32 WROOM-32E tabanlı galvanik izoleli RS485 master anakart tasarımı',
        'ESP-IDF C++ FreeRTOS deterministik Modbus-RTU okuma/yazma sürücüsü',
        'Toprak Nemi, Sıcaklık, pH ve EC (Elektriksel İletkenlik) register haritası',
        '120Ω hat sonlandırma dirençleri ve CRC16 paket hata doğrulama döngüsü',
        'FastAPI & WebSocket tabanlı gerçek zamanlı telemetri izleme ve pompa kontrol paneli',
      ],
      technicalArchitecture: [
        'Fiziksel Katman: RS485 Diferansiyel İletim (A/B Hatları, Twisted Pair, Ekranlı Kablo)',
        'Protokol: Modbus-RTU Master-Slave (Baudrate: 9600, Data Bits: 8, Parity: None, Stop: 1)',
        'Gömülü Yazılım: ESP-IDF v5.3, FreeRTOS Preemptive Multitasking, Hardware Timer ISR',
        'Bulut Köprüsü: MQTT over TLS ile yerel gatewayden FastAPI arka plan servisine telemetri aktarımı',
      ],
      terminalLogs: [
        '[BOOT] ESP32-WROOM-32E initialized @ 240MHz',
        '[UART2] Configured for RS485 HALF-DUPLEX mode (TX:17, RX:16, RTS:4)',
        '[MODBUS] Polling Slave 0x01 (Soil Probe A) ... ACK received (8 bytes)',
        '[CRC16] Frame verified: 0x44 0x09 (Match OK)',
        '[SENSORS] Moisture: 38.4% | Temp: 21.8°C | pH: 6.42 | EC: 1.18 mS/cm',
        '[RELAY] Solenoid Valve #03 status: LATCHED_OPEN (Duty: 100%)',
      ],
      hardwareOrProtocolSpecs: [
        { label: 'Mikrodenetleyici', value: 'ESP32 Dual-Core Xtensa LX6 @ 240MHz' },
        { label: 'RS485 Alıcı-Verici', value: 'MAX13487E (Otomatik Yön Kontrollü, 15kV ESD)' },
        { label: 'İzolasyon', value: 'Optokuplörlü 2500Vrms Galvanik Ayrım' },
        { label: 'Bus Empedansı', value: '120Ω Diferansiyel Hat Sonlandırma' },
        { label: 'Protokol Standardı', value: 'Modbus-RTU over RS485' },
      ],
    },
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
    deepDive: {
      summary: 'Bit-masking kısıt yayılımı (constraint propagation) ve Firebase dağıtık transaction yapısıyla 50k+ eşzamanlı oyuncuyu milisaniyelik gecikmeyle yöneten rekabetçi bulut oyun omurgası.',
      keyDeliverables: [
        'Asenkron Python 3.12 & FastAPI matris çözüm motoru (Bitwise Backtracking)',
        'Pydantic v2 ile girdi doğrulama ve < 2ms çözüm garantisi',
        'Firebase Firestore atomik batch write ve distributed counter mimarisi',
        'İstemci tarafında Web Worker destekli Canvas ızgara görselleştirmesi',
        'Yüksek eşzamanlı WebSocket bağlantıları için Redis pub/sub katmanı',
      ],
      technicalArchitecture: [
        'Algoritma: 9x9 Matris Bit-masking (Satır, Sütun ve 3x3 Blok için 9-bit register)',
        'Arka Plan: FastAPI (Uvicorn + uvloop), Asenkron Coroutine Havuzu (Worker Pool: 16)',
        'Veritabanı & Dağıtım: Cloud Firestore + Cloud MemoryStore (Redis)',
        'Ön Yüz: HTML5 Canvas 60 FPS Render + WebSocket Çift Yönlü Skor Akışı',
      ],
      terminalLogs: [
        '[SERVER] FastAPI worker pool active (16 workers on uvloop)',
        '[SOLVER] Matrix input received: 48 clues given (Difficulty: MASTER)',
        '[BITMASK] Initial candidates propagated: 122 bitwise operations',
        '[SEARCH] Backtracking search initiated (Max Depth: 33)',
        '[BENCHMARK] Matrix solved in 1.821 ms (0 branch regressions)',
        '[FIREBASE] Distributed transaction committed: Leaderboard rank #14 updated',
      ],
      hardwareOrProtocolSpecs: [
        { label: 'Matris Çözüm Süresi', value: 'P99: 1.82 ms / P50: 0.94 ms' },
        { label: 'Bitwise Operasyon Sayısı', value: '~140 operasyon / çözüm' },
        { label: 'Asenkron İş Parçacığı', value: 'uvloop event loop' },
        { label: 'WebSocket Eşzamanlılık', value: '50,000+ aktif soket' },
        { label: 'Veritabanı Yazma Gecikmesi', value: '< 15 ms (Firebase Atomik)' },
      ],
    },
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
    deepDive: {
      summary: '120 dönümlük doğal vadi arazisinde personel trafiğini ve servis darboğazlarını matematiksel topoloji analiziyle çözen, SOP motorlu mekansal operasyon sistemi.',
      keyDeliverables: [
        '120 dönüm arazi üzerinde 6 ana bölge (Zone 01-06) topolojik sirkülasyon haritası',
        'Dijital SOP (Standard Operating Procedure) motoru ve tablet görev matrisi',
        'Mutfak lojistik merkezinden villalara golf arabası rotalama optimizasyonu',
        'Oda servisi sipariş-teslimat süresini 45 dakikadan 23 dakikaya düşüren kuyruk mimarisi',
        'Canlı servis ısı haritası ve operasyonel gecikme alarm sistemi',
      ],
      technicalArchitecture: [
        'Topolojik Analiz: Dijkstra & A* ağırlıklı mesafe matrisi (Eğim ve yol yüzeyi faktörlü)',
        'SOP Kural Motoru: Durum makineleri (State Machines: Pending -> Prep -> En Route -> Delivered)',
        'Veri Modeli: PostgreSQL 16 + PostGIS mekansal indeksleme',
        'Ön Yüz: Mobil tabletler için hafif PWA, anlık durum güncellemeleri',
      ],
      terminalLogs: [
        '[DISPATCH] Order #892 received from Villa 14 (Zone 01: North Ridge)',
        '[ROUTER] Optimal transit path computed: Kitchen Hub -> Spine Trail B -> Ridge Loop',
        '[ESTIMATE] Distance: 480m | Grade: +8% | Estimated Transit: 4.2 mins',
        '[SOP-04] Service staff member dispatched: Team 02 (Electric Cart #4)',
        '[TELEMETRY] Checkpoint passed: Valley Bridge (Timestamp: 14:22:18)',
        '[COMPLETE] Delivery confirmed: Elapsed 18.4 mins (SOP Target: < 25 mins) [OK]',
      ],
      hardwareOrProtocolSpecs: [
        { label: 'Toplam Tesis Alanı', value: '120 Dönüm (485,000 m²)' },
        { label: 'Toplam Konaklama Ünitesi', value: '42 Villa + 8 Özel Süit' },
        { label: 'Maksimum Lojistik Mesafe', value: '1.4 km (Mutfak - Zirve Villa)' },
        { label: 'Ortalama Servis Süresi', value: '23 Dakika (Önce: 45 dk)' },
        { label: 'SOP Kural Sayısı', value: '64 Aktif Dijital Protokol' },
      ],
    },
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
    deepDive: {
      summary: 'OffscreenCanvas ve Web Worker thread izolasyonu ile sıfır jank garantisi sunan, 6-eksenli 3D drone uçuş telemetri simülasyonu.',
      keyDeliverables: [
        'Web Worker içinde çalışan izole Three.js & Canvas render döngüsü',
        'Pitch, roll, yaw ve irtifa açılarını işleyen 6-DOF aerodinamik fizik modeli',
        'Sayfa scroll hızına duyarlı (timeline scrubbed) dinamik kamera açısı süzülmesi',
        'Dinamik tel çerçeve (wireframe) ve katı gövde (solid mesh) matris dönüştürücüsü',
        'Main thread CPU kullanımını %4 altına indiren transferControlToOffscreen boru hattı',
      ],
      technicalArchitecture: [
        'İş Parçacığı Ayrımı: Main Thread (UI Events & DOM) <-> Dedicated Worker (Render & Physics)',
        'Mesajlaşma Protokolü: Yapılandırılmış Klonlama (Structured Clone / SharedArrayBuffer)',
        '3D Motor: Three.js r162 BufferGeometry & Catmull-Rom Trajectory Curves',
        'GPU Fallback: WebGL devre dışı olduğunda 2D Canvas perspektif projeksiyonu',
      ],
      terminalLogs: [
        '[WORKER] Dedicated Web Worker spawned on isolated thread',
        '[CANVAS] Control transferred to OffscreenCanvas (500x320 @ 2x DPR)',
        '[PHYSICS] 6-DOF rigid body model initialized (Mass: 1.2kg, Thrust/Weight: 2.4)',
        '[TICKER] 60 FPS stable (Frametime: 16.6ms | Main thread jank: 0ms)',
        '[SCRUB] Scroll velocity scrub registered: Tilt delta applied smoothly',
        '[STATUS] Flight attitude nominal (Altitude: 140m | Pitch: 0° | Roll: 0°)',
      ],
      hardwareOrProtocolSpecs: [
        { label: 'Render Kare Hızı', value: '60 FPS Sabit (0 Frame Drop)' },
        { label: 'Main Thread Engelleme', value: '0 ms (Tamamen Arka Plan Worker)' },
        { label: 'Fizik Güncelleme Hızı', value: '120 Hz İç Döngü' },
        { label: 'Bellek Ayak İzi', value: '< 20 MB Heap Kullanımı' },
        { label: 'Giriş Gecikmesi', value: '< 4.5 ms' },
      ],
    },
  },
];

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

  // GSAP Horizontal Pinning Setup
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
        end: () => `+=${window.innerWidth * (totalPanels - 1) * 1.3}`,
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
    const scrollDistance = window.innerWidth * idx * 1.3;
    window.scrollTo({
      top: containerTop + scrollDistance,
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
      className="relative min-h-screen bg-[#0D0D0D] border-b border-white/10 overflow-hidden"
      data-cursor="SCROLL X"
    >
      {/* Top Architectural Navigation & Telemetry Bar */}
      <div className="z-30 w-full bg-[#0D0D0D]/95 backdrop-blur border-b border-white/10 px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500">
            <span className="w-2 h-2 bg-[#FF4500] shadow-[0_0_8px_#FF4500]" />
            <span className="text-white font-bold">FAZ 3: SELECTED WORKS // HORIZONTAL PINNING RAYI</span>
          </div>
          <span className="text-xs font-mono text-zinc-700 hidden sm:inline">/</span>
          <div className="text-xs font-mono text-[#FF4500] font-bold tabular-nums">
            0{activeProjectIndex + 1} // 0{CASE_STUDIES.length}
          </div>
        </div>

        {/* Quick Project Jump Controls */}
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

      {/* Horizontal Sliding Track with Massive Inter-Project Breathing Gap (gap-[18vw]) */}
      <div
        ref={trackRef}
        className="flex h-[calc(100vh-65px)] w-[480vw] gap-[18vw] will-change-transform pl-8 pr-[18vw]"
      >
        {CASE_STUDIES.map((project, idx) => (
          <div
            key={project.id}
            className="w-[95vw] lg:w-[86vw] h-full py-6 md:py-10 flex flex-col justify-between overflow-y-auto shrink-0 select-text"
          >
            <div className="w-full max-w-7xl mx-auto">
              
              {/* Asymmetric Magazine Layout: Bold Editorial Header */}
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

                    {/* Clip-Path Expansion Trigger Button */}
                    <button
                      onClick={() => setDeepDiveProject(project)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#14171f] hover:bg-[#1a202c] border border-white/20 hover:border-white text-xs font-mono text-white font-bold transition-all cursor-pointer group"
                      data-cursor="INSPECT"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#00FF66] group-hover:scale-110 transition-transform" />
                      <span>MİMARİ İNCELEME // DEEP DIVE</span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Tech Stack Unboxed */}
                  <div className="pt-6 border-t border-white/10 mt-6">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#090b0e] border border-white/10 mb-8">
                {project.metrics.map((m, mIdx) => (
                  <div key={mIdx}>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">{m.label}</span>
                    <span className="text-xl lg:text-2xl font-bold text-white font-mono tabular-nums">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Specialized Demonstrator Per Project */}

              {/* SLIDE 01: Nova Agro Systems - RS485 & Telemetry Simulator */}
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

                  {/* Driver Tabs */}
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
                        onClick={() => setNovaTab('registers')}
                        className={`px-4 py-2 cursor-pointer ${novaTab === 'registers' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                      >
                        Modbus Register Haritası
                      </button>
                    </div>

                    <div className="p-4 text-xs font-mono">
                      {novaTab === 'driver' && (
                        <pre className="text-zinc-300 overflow-x-auto p-3 bg-[#050608] border border-white/5 leading-relaxed">
{`ESP_ERROR_CHECK(uart_set_mode(UART_NUM_2, UART_MODE_RS485_HALF_DUPLEX));
ESP_ERROR_CHECK(uart_set_pin(UART_NUM_2, 17, 16, 4, UART_PIN_NO_CHANGE));
// 120Ω sonlandırma dirençleri ile 1.2km diferansiyel hat iletimi
uint8_t request_frame[] = { 0x01, 0x03, 0x00, 0x00, 0x00, 0x04, 0x44, 0x09 };
uart_write_bytes(UART_NUM_2, (const char*)request_frame, sizeof(request_frame));`}
                        </pre>
                      )}

                      {novaTab === 'crc16' && (
                        <div className="space-y-3">
                          <span className="text-zinc-400 block">Modbus Hex Çerçevesi girin (CRC16 son 2 bayt otomatik hesaplanır):</span>
                          <div className="flex flex-wrap items-center gap-3">
                            <input
                              type="text"
                              value={crcInputHex}
                              onChange={(e) => setCrcInputHex(e.target.value)}
                              className="bg-[#0b0e14] border border-white/20 px-3 py-1.5 text-xs text-white font-mono w-72"
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
              )}

              {/* SLIDE 02: LensAI & SudokuMap - 9x9 Live Matrix Constraint Solver */}
              {project.id === 'lensai-sudokumap' && (
                <div className="border border-white/10 bg-[#090b0e] p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-[#38bdf8]" />
                      <span className="text-xs font-mono text-white font-bold">
                        FASTAPI BIT-MASKING ENGINE // 9x9 MATRIX CONSTRAINT SOLVER
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={resetSudokuGrid}
                        className="px-3 py-1 border border-white/20 text-xs font-mono text-zinc-300 hover:text-white cursor-pointer"
                      >
                        Sıfırla
                      </button>
                      <button
                        onClick={runSudokuSolver}
                        disabled={isSolving}
                        className="px-4 py-1 bg-[#38bdf8] text-black font-mono font-bold text-xs cursor-pointer flex items-center gap-1.5 hover:bg-[#60a5fa]"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{isSolving ? 'Çözülüyor...' : 'Kısıt Algoritmasını Çalıştır'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    
                    {/* 9x9 Interactive Matrix Grid */}
                    <div className="lg:col-span-6 flex justify-center">
                      <div className="grid grid-cols-9 gap-0.5 bg-zinc-800 p-1 border-2 border-white/30 max-w-[320px] w-full aspect-square">
                        {sudokuGrid.map((row, rIdx) =>
                          row.map((cell, cIdx) => (
                            <div
                              key={`${rIdx}-${cIdx}`}
                              className={`flex items-center justify-center font-mono text-sm font-bold aspect-square ${
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

                    {/* Benchmark Metrics & Coroutine Metrics */}
                    <div className="lg:col-span-6 space-y-4 text-xs font-mono">
                      <div className="bg-[#060709] p-4 border border-white/10 space-y-2">
                        <span className="text-zinc-500 block uppercase">ALGORİTMA PERFORMANS METRİKLERİ:</span>
                        <div className="flex justify-between items-center py-1 border-b border-white/5">
                          <span className="text-zinc-400">Çözüm Süresi (P99):</span>
                          <span className="text-emerald-400 font-bold tabular-nums">
                            {solveStats ? `${solveStats.timeMs} ms` : '1.82 ms (Ortalama)'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-white/5">
                          <span className="text-zinc-400">Geri İzleme Düğüm Budama:</span>
                          <span className="text-white font-bold">%94.2 (Bit-masking)</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-white/5">
                          <span className="text-zinc-400">Firebase Skor Transaction:</span>
                          <span className="text-sky-400 font-bold">10.4 ms (Distributed)</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-zinc-400">Eşzamanlı WebSocket İstemcisi:</span>
                          <span className="text-amber-400 font-bold">50,000+ Aktif</span>
                        </div>
                      </div>

                      <div className="text-zinc-400 text-xs leading-relaxed bg-[#060709]/60 p-3 border border-white/5">
                        İstemci tarafında ağır hesaplamaları çalıştırmak yerine FastAPI mikroservisinde 9-bit register seviyesinde bitwise kısıt yayılımı uygulanır. Böylece düşük donanımlı mobil cihazlarda bile 0 jank ile sonuç üretilir.
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* SLIDE 03: Brook Mountain Resort - 120-Acre Spatial Topology */}
              {project.id === 'brook-resort' && (
                <div className="border border-white/10 bg-[#090b0e] p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#10b981]" />
                      <span className="text-xs font-mono text-white font-bold">
                        120 DÖNÜM TOPOLOJİ &amp; DİJİTAL SOP ROTALAMA MOTORU
                      </span>
                    </div>
                    <span className="text-xs font-mono text-zinc-500">
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
              )}

              {/* SLIDE 04: Derin Demirkaya 3D Flight Sim */}
              {project.id === 'flight-sim' && (
                <div data-cursor="DRAG 3D">
                  <ThreeFlightSim />
                </div>
              )}

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
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>SYSTEM_RUNTIME_TRACE_DIAGNOSTICS</span>
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
