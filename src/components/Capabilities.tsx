import { Capability } from '../types/index.ts';
import { Layers, Cpu, Globe, Boxes, CheckCircle2, ArrowDown } from 'lucide-react';

const CAPABILITIES: Capability[] = [
  {
    id: 'digital-ecosystems',
    index: '01',
    title: 'Complex Digital Ecosystems',
    tagline: 'Dağıtık Sunucu Mimarileri ve Yüksek Veri Trafiği Yönetimi',
    technologies: ['FastAPI', 'Go', 'Firebase', 'PostgreSQL', 'Docker', 'Redis', 'WebSockets'],
    description:
      'Gereksiz katmanlardan arındırılmış, deterministik ve yüksek eşzamanlı veri hatları inşa ediyoruz. Mikroservisler, asenkron kuyruklar ve gerçek zamanlı senkronizasyon ile sıfır veri kaybı ve düşük gecikme garantisi sunuyoruz.',
    architecturePoints: [
      'Pydantic doğrulamalı FastAPI ve Go tabanlı tip-güvenli servisler',
      'Yüksek hacimli veri yükleri için PostgreSQL bağlantı havuzlama ve Redis tamponlama',
      'Firebase canlı dağıtım katmanı ile anlık çoklu kullanıcı senkronizasyonu',
      'Docker ve konteyner orkestrasyonu ile mikroservis ölçekleme',
    ],
    systemMetric: '< 14ms',
    systemMetricLabel: 'P99 Gecikme Süresi',
  },
  {
    id: 'spatial-interactive',
    index: '02',
    title: 'Spatial & Interactive Experiences',
    tagline: 'WebGL, Three.js ve 60 FPS Kararlı 3D Arayüzler',
    technologies: ['WebGL', 'Three.js', 'React Three Fiber', 'GSAP', 'OffscreenCanvas', 'GLSL Shaders'],
    description:
      'Ana iş parçacığını (main thread) bloke etmeyen mimarilerle akıcı mekansal deneyimler tasarlıyoruz. Matematiksel kamera projeksiyonları, hafif shader kodları ve GPU hızlandırmalı görselleştirmeler ile web üzerinde oyun motoru akıcılığı sağlıyoruz.',
    architecturePoints: [
      'Ana UI tepkiselliğini korumak için Web Worker & OffscreenCanvas izolasyonu',
      'Optimize edilmiş geometri tamponları (BufferGeometry) ve instanced rendering',
      'GSAP Ticker ve rAF döngüsü ile karesel atlamasız (INP dostu) animasyon senkronizasyonu',
      'Özel GLSL vertex ve fragment shaderları ile dinamik ışık ve parçacık fiziği',
    ],
    systemMetric: '60 FPS',
    systemMetricLabel: 'Kararlı Ekran Akıcılığı',
  },
  {
    id: 'physical-computing',
    index: '03',
    title: 'Physical Computing & IoT',
    tagline: 'ESP32, ESP-IDF, Modbus-RTU ve Donanım Entegrasyonu',
    technologies: ['ESP32', 'ESP-IDF', 'C/C++', 'Modbus-RTU', 'RS485', 'MQTT', 'FreeRTOS'],
    description:
      'Yazılımı ekranların ötesine, fiziksel dünyaya taşıyoruz. Endüstriyel sensör hatları, diferansiyel sinyal kablolamaları ve mikrodenetleyici düzeyinde gömülü yazılımlarla tarım, enerji ve otomasyon sahalarını yaşayan sistemlere dönüştürüyoruz.',
    architecturePoints: [
      'ESP32 FreeRTOS üzerinde deterministik görev önceliklendirmesi ve donanım kesmeleri (ISR)',
      'Gürültülü endüstriyel ortamlarda güvenli telemetri için RS485 Modbus-RTU protokolü',
      'CRC16 hata doğrulama döngüsü ile sıfır bozuk paket iletimi',
      'Düşük güç tüketimli (Deep Sleep) telemetri yayını ve MQTT köprüleme',
    ],
    systemMetric: '1.2 km',
    systemMetricLabel: 'RS485 Sinyal Mesafesi',
  },
  {
    id: 'operational-design',
    index: '04',
    title: 'Holistic Operational Design',
    tagline: 'Mekansal İş Akışları, Yerleşim Mimarisi ve SOP Dokümantasyonu',
    technologies: ['Spatial Planning', 'SOP Engine', 'Workflow Topology', 'Figma', 'System Architecture'],
    description:
      'Fiziksel tesisler, stüdyolar ve operasyonel merkezler için mimari yerleşimden dijital operasyon protokollerine uzanan bütüncül sistemler kurguluyoruz. İnsan trafiği, servis süreleri ve görev hiyerarşisi matematiksel bir mantıkla optimize edilir.',
    architecturePoints: [
      'Mekansal sirkülasyon ve personel akış darboğazlarının tespiti ve yeniden yapılandırılması',
      'Standard Operating Procedure (SOP) kurallarının dijital kontrol matrisine dönüştürülmesi',
      'Fiziksel mekan ile dijital sipariş/hizmet süreçlerinin sıfır sürtünmeyle entegrasyonu',
      'Denetlenebilir operasyonel şeffaflık ve zaman kaybını minimize eden rotalama',
    ],
    systemMetric: '%42',
    systemMetricLabel: 'Operasyonel Hız Artışı',
  },
];

export default function Capabilities() {
  const getIcon = (id: string) => {
    switch (id) {
      case 'digital-ecosystems':
        return <Globe className="w-5 h-5 text-sky-400" />;
      case 'spatial-interactive':
        return <Boxes className="w-5 h-5 text-purple-400" />;
      case 'physical-computing':
        return <Cpu className="w-5 h-5 text-[#FF4500]" />;
      case 'operational-design':
        return <Layers className="w-5 h-5 text-emerald-400" />;
      default:
        return <Boxes className="w-5 h-5" />;
    }
  };

  return (
    <section id="capabilities" className="py-24 md:py-36 border-b border-white/10 bg-[#0D0D0D] architectural-grid">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
              <span className="w-2 h-2 bg-[#FF4500]" />
              <span>Sistem Mimarisi</span>
              <span aria-hidden="true" className="text-zinc-700">/</span>
              <span>4 Ana Disiplin Katmanı</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight font-display">
              Disiplinler ve Mühendislik Katmanları
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 bg-[#060709] px-4 py-2.5 border border-white/10">
            <ArrowDown className="w-3.5 h-3.5 text-[#FF4500] animate-bounce" />
            <span>KART İSTİFLEME (SCALE 0.94 / OPACITY 0.5): AŞAĞI KAYDIRIN</span>
          </div>
        </div>

        {/* Breathing Space Narrowed Container (w-[88vw] max-w-5xl centered) */}
        <div className="w-full max-w-5xl mx-auto space-y-16 relative pb-20">
          {CAPABILITIES.map((cap, idx) => (
            <div
              key={cap.id}
              style={{
                top: `${80 + idx * 28}px`,
              }}
              className="sticky z-10 border border-white/20 bg-[#090b0e] shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-10 md:p-16 transition-all duration-300"
            >
              {/* Card Header Strip */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-10">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-white px-3 py-1 bg-white/10 border border-white/20">
                    DISCIPLINE {cap.index}
                  </span>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                    LAYER 0{idx + 1} // 04
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-500 hidden sm:inline">CAPABILITY_FRAME</span>
                  {getIcon(cap.id)}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Left Column: Title, Narrative & Tech Stack */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-display tracking-tight">
                      {cap.title}
                    </h3>
                    <div className="text-sm font-mono text-[#FF4500] mb-6">
                      {cap.tagline}
                    </div>

                    <p className="text-base text-zinc-300 leading-relaxed mb-8 font-normal">
                      {cap.description}
                    </p>
                  </div>

                  {/* Unboxed Tech Stack Separators */}
                  <div className="pt-6 border-t border-white/10">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-2">
                      Teknoloji ve Protokol Yığını:
                    </span>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-mono text-zinc-300">
                      {cap.technologies.map((tech, tIdx) => (
                        <span key={tech} className="inline-flex items-center">
                          <span className="text-white font-medium">{tech}</span>
                          {tIdx < cap.technologies.length - 1 && (
                            <span className="text-zinc-600 ml-3" aria-hidden="true">/</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Invariants & Operational Metric */}
                <div className="lg:col-span-5 bg-[#050608] p-6 lg:p-8 border border-white/10 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block mb-4">
                      Mimari İlkeler &amp; Uygulama Kriterleri
                    </span>

                    <ul className="space-y-3.5 mb-8">
                      {cap.architecturePoints.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Metric Box */}
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">{cap.systemMetricLabel}</div>
                      <div className="text-3xl font-bold text-white font-mono tabular-nums">{cap.systemMetric}</div>
                    </div>
                    <div className="text-right text-[10px] font-mono text-zinc-500 max-w-[140px]">
                      AŞILAMAZ MİMARİ EŞİK
                    </div>
                  </div>

                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
