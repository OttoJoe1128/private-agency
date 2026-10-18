import { useState } from 'react';
import { Building2, Github, ExternalLink, Code2, Award, Edit3, Check } from 'lucide-react';

interface AgencyRecord {
  id: string;
  name: string;
  role: string;
  period: string;
  deliverables: string[];
  focusArea: string;
  keyOutcome: string;
}

interface GitRepoRecord {
  name: string;
  stars: number;
  forks: number;
  language: string;
  description: string;
  link: string;
}

export default function AgencyShowcase() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [agencies, setAgencies] = useState<AgencyRecord[]>([
    {
      id: 'agency-1',
      name: 'Kolektif Creative Labs',
      role: 'Lead Creative Developer & Systems Architect',
      period: '2023 — 2025',
      deliverables: [
        'Awwwards SOTD ödüllü 3D etkileşimli marka deneyimleri (Three.js & Canvas)',
        'Yüksek eşzamanlı video streaming ve ses senkronizasyon boru hattı',
        'Mikro-animasyon ve GSAP ticker tabanlı sıfır-jank arayüz standardizasyonu',
      ],
      focusArea: 'Avangart Web, WebGL ve Yaratıcı Mühendislik',
      keyOutcome: '3 Uluslararası Web Ödülü, 450k+ Tekil Ziyaretçi Deneyimi',
    },
    {
      id: 'agency-2',
      name: 'Vanguard Industrial Systems',
      role: 'IoT & Hardware Systems Engineer',
      period: '2021 — 2023',
      deliverables: [
        'ESP32 ve RS485 Modbus-RTU tabanlı tarım ve fabrika sensör telemetrisi',
        'FastAPI ve MQTT broker köprüleri ile endüstriyel PLC entegrasyonu',
        'SOP operasyonel matrisleri ve saha teknisyeni mobil web arayüzleri',
      ],
      focusArea: 'Fiziksel Hesaplama, Gömülü Sistemler ve SOP Mimarisi',
      keyOutcome: '%38 Enerji ve Zaman Verimliliği Artışı, 12 Tesis Kurulumu',
    },
  ]);

  const [githubRepos] = useState<GitRepoRecord[]>([
    {
      name: 'esp32-modbus-rtu-driver',
      stars: 142,
      forks: 28,
      language: 'C++',
      description: 'Galvanik izoleli RS485 hatları için FreeRTOS tabanlı deterministik Modbus-RTU master sürücüsü.',
      link: '#',
    },
    {
      name: 'three-offscreen-worker-engine',
      stars: 384,
      forks: 67,
      language: 'TypeScript',
      description: 'Web Workers ve OffscreenCanvas üzerinde 60 FPS çalışan hafif 3D uzay ve fizik motoru.',
      link: '#',
    },
    {
      name: 'fastapi-pydantic-telemetry-bus',
      stars: 215,
      forks: 34,
      language: 'Python',
      description: 'Düşük gecikmeli telemetri akışları ve Firebase eşitlemesi için asenkron Pydantic v2 boru hattı.',
      link: '#',
    },
  ]);

  const updateAgency = (idx: number, field: keyof AgencyRecord, value: string) => {
    const updated = [...agencies];
    (updated[idx] as any)[field] = value;
    setAgencies(updated);
  };

  return (
    <section id="manifesto" className="py-20 border-b border-white/10 bg-[#060709]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">
              <span>Mühendislik Arka Planı</span>
              <span aria-hidden="true">·</span>
              <span>2 Farklı Ajans Deneyimi &amp; GitHub</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-display">
              Çalışılan Ajanslar &amp; Açık Kaynak
            </h2>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 border border-white/20 text-xs font-mono text-zinc-300 hover:text-white hover:border-white/40 flex items-center gap-2 transition-colors cursor-pointer"
          >
            {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Düzenlemeyi Bitir' : 'Ajans Bilgilerini Özelleştir'}</span>
          </button>
        </div>

        {/* 2 Agency Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {agencies.map((agency, idx) => (
            <div key={agency.id} className="border border-white/10 bg-[#090b0e] p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <Building2 className="w-4 h-4 text-zinc-400" />
                    <span>AJANS 0{idx + 1}</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">{agency.period}</span>
                </div>

                {isEditing ? (
                  <div className="space-y-3 mb-6">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-500 block mb-1">Ajans Adı</label>
                      <input
                        type="text"
                        value={agency.name}
                        onChange={(e) => updateAgency(idx, 'name', e.target.value)}
                        className="w-full bg-[#060709] border border-white/20 px-3 py-1.5 text-sm font-bold text-white font-display"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-500 block mb-1">Unvan / Rol</label>
                      <input
                        type="text"
                        value={agency.role}
                        onChange={(e) => updateAgency(idx, 'role', e.target.value)}
                        className="w-full bg-[#060709] border border-white/20 px-3 py-1.5 text-xs font-mono text-zinc-300"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-500 block mb-1">Odak Alanı</label>
                      <input
                        type="text"
                        value={agency.focusArea}
                        onChange={(e) => updateAgency(idx, 'focusArea', e.target.value)}
                        className="w-full bg-[#060709] border border-white/20 px-3 py-1.5 text-xs text-zinc-400"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-white tracking-tight font-display mb-1">
                      {agency.name}
                    </h3>
                    <div className="text-xs font-mono text-zinc-400 mb-4">{agency.role}</div>
                    <div className="text-sm text-zinc-300 mb-6 leading-relaxed">
                      {agency.focusArea}
                    </div>
                  </>
                )}

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block">
                    Geliştirilen Ürünler ve Teslimatlar:
                  </span>
                  <ul className="space-y-2 text-xs text-zinc-300 leading-relaxed font-mono">
                    {agency.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <span className="text-zinc-600">↳</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500">SOMUT ÇIKTI:</span>
                <span className="text-white font-medium">{agency.keyOutcome}</span>
              </div>
            </div>
          ))}
        </div>

        {/* GitHub Repositories Strip */}
        <div className="border border-white/10 bg-[#060709] p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <Github className="w-5 h-5 text-white" />
              <div>
                <h4 className="text-base font-bold text-white font-display">Açık Kaynak Sistem Mimarisi &amp; Depolar</h4>
                <span className="text-xs font-mono text-zinc-500">Açık kodlu donanım sürücüleri ve 3D grafik kütüphaneleri</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
              <span>740+ STARS TOPLAMI</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">AKTİF REPOLAR</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {githubRepos.map((repo, idx) => (
              <div key={idx} className="bg-[#090b0e] border border-white/10 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-white font-semibold flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-zinc-400" />
                      {repo.name}
                    </span>
                    <span className="text-zinc-500">{repo.language}</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4 font-mono">
                    {repo.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] font-mono text-zinc-500">
                  <span>★ {repo.stars} stars</span>
                  <span>⑂ {repo.forks} forks</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
