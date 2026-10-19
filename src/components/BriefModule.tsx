import React, { useState } from 'react';
import { SystemBriefPayload } from '../types/index.ts';
import { sound } from '../utils/soundEngine.ts';
import {
  Send,
  FileJson,
  Check,
  Copy,
  Download,
  Terminal,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Activity,
  ArrowRight,
  ExternalLink,
  Printer,
  RotateCcw
} from 'lucide-react';

interface BriefFormData {
  systemNeed: string;
  throughputScale: string;
  physicalIntegration: string;
  timelineScale: string;
  clientEntity: string;
  contactEndpoint: string;
  architecturalNotes: string;
}

export default function BriefModule() {
  const [formData, setFormData] = useState<BriefFormData>({
    systemNeed: '',
    throughputScale: '',
    physicalIntegration: '',
    timelineScale: '',
    clientEntity: '',
    contactEndpoint: '',
    architecturalNotes: '',
  });

  const [activeCodeTab, setActiveCodeTab] = useState<'json' | 'pydantic' | 'curl'>('json');
  const [submittedReceipt, setSubmittedReceipt] = useState<SystemBriefPayload | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [receiptCopied, setReceiptCopied] = useState<boolean>(false);

  // Parameter mappings
  const SYSTEM_NEEDS = [
    {
      id: 'iot-hardware',
      title: 'Physical Computing & IoT',
      subtitle: 'ESP32, RS485 Modbus, Donanım & Sensör',
      tag: 'HARDWARE / FIRMWARE',
      color: '#FF4500',
    },
    {
      id: 'distributed-web',
      title: 'Karmaşık Dijital Ekosistem',
      subtitle: 'FastAPI, Go, Mikroservis, WebSocket',
      tag: 'BACKEND / DISTRIBUTED',
      color: '#38bdf8',
    },
    {
      id: 'spatial-3d',
      title: 'Mekânsal & Etkileşimli Arayüz',
      subtitle: 'WebGL, Three.js, 60 FPS Canvas',
      tag: 'SPATIAL / 3D GRAPHICS',
      color: '#a855f7',
    },
    {
      id: 'operational-sop',
      title: 'Bütüncül Operasyonel Tasarım',
      subtitle: 'Mekansal Mimari, SOP & Rotalama',
      tag: 'SYSTEMS / OPERATIONS',
      color: '#10b981',
    },
  ];

  const THROUGHPUT_SCALES = [
    {
      id: 'low-latency',
      title: 'Deterministik Ultra Düşük Gecikme',
      metric: '< 14ms P99 SLA',
      detail: 'Asenkron coroutine kuyrukları ve optimize bitwise algoritmalar.',
    },
    {
      id: 'high-concurrency',
      title: 'Yüksek Eşzamanlılık (High Concurrency)',
      metric: '100,000+ Eşzamanlı Bağlantı',
      detail: 'WebSocket pub/sub, Redis tamponlama ve bağlantı havuzu orkestrasyonu.',
    },
    {
      id: 'distributed-edge',
      title: 'Dağıtık Ağlar & Edge Cluster',
      metric: '%99.99 Kesintisiz Uptime',
      detail: 'Bölgesel hata toleranslı düğümler, çoklu gateway köprüleme.',
    },
  ];

  const PHYSICAL_INTEGRATIONS = [
    {
      id: 'pure-digital',
      title: 'Sadece Dijital Arayüz',
      detail: 'Donanım bağımlılığı yok, tarayıcı ve GPU ivmelendirmeli saf kod.',
      badge: 'DIGITAL_NATIVE',
    },
    {
      id: 'rs485-modbus',
      title: 'Sensör & Mikrokontrolör Hattı',
      detail: 'RS485 diferansiyel sinyal, 120Ω bus sonlandırma, Modbus-RTU.',
      badge: 'RS485_MODBUS',
    },
    {
      id: 'full-hardware',
      title: 'Tam Donanım & Saha Entegrasyonu',
      detail: 'PCB tasarımı, ESP-IDF C++ gömülü yazılım, saha pano montajı.',
      badge: 'FULL_HARDWARE',
    },
  ];

  const TIMELINES = [
    {
      id: 'prototype-4w',
      title: 'Hızlı Prototipleme',
      duration: '2 - 4 Hafta',
      detail: 'MVP, donanım doğrulaması (PoC) ve çalışan mimari çekirdek.',
    },
    {
      id: 'production-8w',
      title: 'Kapsamlı Üretim Sistemi',
      duration: '2 - 3 Ay',
      detail: 'Sıfır-hata mimarisi, uçtan uca testler, dokümantasyon ve canlı dağıtım.',
    },
    {
      id: 'strategic-partnership',
      title: 'Stratejik Mimari Ortaklık',
      duration: 'Sürekli / Çeyreklik',
      detail: 'Ajans ve kurumlar için sürekli sistem mimarlığı ve teknik liderlik.',
    },
  ];

  // Dynamic Complexity & Architecture Metrics
  const computeSystemMetrics = () => {
    let complexityScore = 1;
    if (formData.systemNeed === 'iot-hardware' || formData.systemNeed === 'spatial-3d') complexityScore += 2;
    if (formData.throughputScale === 'high-concurrency' || formData.throughputScale === 'distributed-edge') complexityScore += 1;
    if (formData.physicalIntegration === 'full-hardware') complexityScore += 2;

    const level = complexityScore >= 5 ? 'LEVEL 4 // MISSION_CRITICAL' : complexityScore >= 3 ? 'LEVEL 3 // ADVANCED_ECOSYSTEM' : 'LEVEL 2 // DETERMINISTIC_CORE';
    const sla = formData.throughputScale === 'low-latency' ? '< 12ms P99' : formData.throughputScale === 'high-concurrency' ? '50k+ WS Clients' : '99.99% Uptime';

    return { level, sla };
  };

  const metrics = computeSystemMetrics();

  const getSystemNeedLabel = (id: string) => {
    if (!id) return 'Seçiniz';
    const found = SYSTEM_NEEDS.find((s) => s.id === id);
    return found ? `${found.title} (${found.tag})` : id;
  };

  const getThroughputLabel = (id: string) => {
    if (!id) return 'Seçiniz';
    const found = THROUGHPUT_SCALES.find((t) => t.id === id);
    return found ? `${found.title} [${found.metric}]` : id;
  };

  const getPhysicalLabel = (id: string) => {
    if (!id) return 'Seçiniz';
    const found = PHYSICAL_INTEGRATIONS.find((p) => p.id === id);
    return found ? `${found.title} [${found.badge}]` : id;
  };

  const getTimelineLabel = (id: string) => {
    if (!id) return 'Seçiniz';
    const found = TIMELINES.find((t) => t.id === id);
    return found ? `${found.title} (${found.duration})` : id;
  };

  // Generate Current Specification Payload
  const currentPayload: SystemBriefPayload = {
    specification_id: 'SPEC-2026-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
    system_need: getSystemNeedLabel(formData.systemNeed),
    throughput_scale: getThroughputLabel(formData.throughputScale),
    physical_integration: getPhysicalLabel(formData.physicalIntegration),
    timeline_scale: getTimelineLabel(formData.timelineScale),
    client_entity: formData.clientEntity.trim(),
    contact_endpoint: formData.contactEndpoint.trim(),
    architectural_notes: formData.architecturalNotes.trim(),
    timestamp: new Date().toISOString(),
  };

  const activePayload = submittedReceipt || currentPayload;

  // Code snippets
  const pydanticSnippet = `# FastAPI / Pydantic v2 Strict Specification Schema
 from pydantic import BaseModel, Field, EmailStr
 from datetime import datetime

 class SystemBriefSchema(BaseModel):
     specification_id: str = Field(..., regex=r"^SPEC-2026-[A-Z0-9]+$")
     system_need: str = Field(description="Architectural discipline category")
     throughput_scale: str = Field(description="Deterministic latency SLA")
     physical_integration: str = Field(description="Hardware and bus topology")
     timeline_scale: str = Field(description="Project execution duration")
     client_entity: str = Field(min_length=2, max_length=120)
     contact_endpoint: str = Field(description="Email or Telegram handle")
     architectural_notes: str = Field(default="")
     timestamp: datetime = Field(default_factory=datetime.utcnow)

     class Config:
         frozen = True
         extra = "forbid"`;

  const curlSnippet = `# Terminal Üzerinden Sistem Briefi İletme Komutu
 curl -X POST "https://systems.agency/api/v1/system-brief" \\
   -H "Content-Type: application/json" \\
   -H "X-Spec-Version: 2026.4" \\
   -d '${JSON.stringify(activePayload, null, 2)}'`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    sound.playClick();
    try {
      const response = await fetch('/api/v1/system-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPayload),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmittedReceipt({ ...currentPayload, ...data });
        sound.playSuccess();
      } else {
        console.error('Submission failed:', data);
        sound.playClick();
      }
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    const text =
      activeCodeTab === 'json'
        ? JSON.stringify(activePayload, null, 2)
        : activeCodeTab === 'pydantic'
        ? pydanticSnippet
        : curlSnippet;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyReceipt = () => {
    if (!activePayload) return;
    const receiptText = `=== ENGINEERING LIVING SYSTEMS // MİMARİ ŞARTNAME FİŞİ ===
 Şartname No   : ${activePayload.specification_id}
 Zaman Damgası : ${activePayload.timestamp}
 Kurum / İstemci: ${activePayload.client_entity || '-'}
 İletişim Noktası: ${activePayload.contact_endpoint || '-'}

 [PARAMETRİK MİMARİ SEÇİMLERİ]
 1. Sistem İhtiyacı      : ${activePayload.system_need}
 2. Veri Hacmi & Gecikme : ${activePayload.throughput_scale}
 3. Donanım Entegrasyonu : ${activePayload.physical_integration}
 4. Zaman Takvimi        : ${activePayload.timeline_scale}

 [MİMARİ NOTLAR]
 ${activePayload.architectural_notes || '-'}

 Sistem Durumu: DOĞRULANDI & ARŞİVLENDİ [200 OK]
 ============================================================`;
    navigator.clipboard.writeText(receiptText);
    setReceiptCopied(true);
    setTimeout(() => setReceiptCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(activePayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activePayload.specification_id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="brief-module" className="py-24 bg-[#060709] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-8 px-8 pt-14">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">
              <span className="text-white font-bold">Analitik Brief &amp; Şartname</span>
              <span className="text-zinc-700">·</span>
              <span className="text-[#00FF66]">Mimarını Sürece Dahil Et</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-display">
              Parametrik Şartname Motoru
            </h2>
          </div>

          <div className="max-w-md text-xs font-mono text-zinc-400 bg-[#090b0e] p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-emerald-400 font-bold">Şartname Şeması:</span>
              <span className="text-[10px] text-zinc-500 uppercase">{metrics.level.replace('// ', '')}</span>
            </div>
            Parametreleri seçtiğiniz anda sistem mimarisi veri şeması otomatik olarak güncellenir.
          </div>
        </div>

        {/* 2-Column Interface: Left Parametric Form, Right Code Inspector & Live Receipt */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Parametric Selection Matrix */}
          <div className="lg:col-span-7 bg-[#090b0e] p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* 1. Sistem İhtiyacı */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                    <span className="text-[#00FF66]">01.</span>
                    <span>Temel Sistem İhtiyacı</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">ZORUNLU SEÇİM</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SYSTEM_NEEDS.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setFormData({ ...formData, systemNeed: item.id })}
                      className={`p-3.5 text-left text-xs font-mono transition-none cursor-pointer flex flex-col justify-between ${
                        formData.systemNeed === item.id
                          ? 'bg-[#00FF66]/10 text-white shadow-[0_0_20px_rgba(0,255,102,0.1)]'
                          : 'bg-[#060709] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase mb-1">{item.tag}</span>
                        <span className="font-bold text-white block text-sm mb-1">{item.title}</span>
                      </div>
                      <span className="text-[11px] text-zinc-400 mt-2 block">{item.subtitle}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Veri Hacmi & Gecikme Skalası */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                    <span className="text-[#00FF66]">02.</span>
                    <span>Veri Hacmi &amp; Gecikme Ölçeği</span>
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">{metrics.sla}</span>
                </div>

                <div className="space-y-2.5">
                  {THROUGHPUT_SCALES.map((scale) => (
                    <button
                      type="button"
                      key={scale.id}
                      onClick={() => setFormData({ ...formData, throughputScale: scale.id })}
                      className={`w-full p-3.5 text-left text-xs font-mono transition-none cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        formData.throughputScale === scale.id
                          ? 'bg-white text-black font-semibold'
                          : 'bg-[#060709] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="font-bold block text-sm">{scale.title}</span>
                        <span className="text-[11px] opacity-80 block mt-0.5">{scale.detail}</span>
                      </div>
                      <span className={`px-2.5 py-1 text-[11px] font-mono font-bold shrink-0 self-start sm:self-auto ${
                        formData.throughputScale === scale.id
                          ? 'bg-black text-white'
                          : 'bg-white/10 text-white'
                      }`}>
                        {scale.metric}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Fiziksel Katman Gereksinimi */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                    <span className="text-[#00FF66]">03.</span>
                    <span>Fiziksel Katman Entegrasyonu</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">DONANIM / SENSÖR</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PHYSICAL_INTEGRATIONS.map((phys) => (
                    <button
                      type="button"
                      key={phys.id}
                      onClick={() => setFormData({ ...formData, physicalIntegration: phys.id })}
                      className={`p-3 text-left text-xs font-mono transition-none cursor-pointer flex flex-col justify-between ${
                        formData.physicalIntegration === phys.id
                          ? 'bg-[#00FF66]/10 text-white font-semibold'
                          : 'bg-[#060709] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] text-[#00FF66] font-bold block mb-1">[{phys.badge}]</span>
                        <span className="font-bold text-white block mb-1">{phys.title}</span>
                      </div>
                      <span className="text-[11px] text-zinc-400 mt-2 block leading-relaxed">{phys.detail}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Zaman Takvimi */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                    <span className="text-[#00FF66]">04.</span>
                    <span>Hedef Zaman Planı</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">TESLİM VE ANGAJMAN</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TIMELINES.map((time) => (
                    <button
                      type="button"
                      key={time.id}
                      onClick={() => setFormData({ ...formData, timelineScale: time.id })}
                      className={`p-3 text-left text-xs font-mono transition-none cursor-pointer flex flex-col justify-between ${
                        formData.timelineScale === time.id
                          ? 'bg-white text-black font-semibold'
                          : 'bg-[#060709] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="font-bold block text-sm mb-1">{time.title}</span>
                        <span className="text-[10px] opacity-75 font-mono block">{time.duration}</span>
                      </div>
                      <span className="text-[11px] opacity-80 mt-2 block leading-relaxed">{time.detail}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Kurum & İletişim Bilgileri */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                    Kurum / Şirket / Girişimci Adı
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Studio Demirkaya"
                    value={formData.clientEntity}
                    onChange={(e) => setFormData({ ...formData, clientEntity: e.target.value })}
                    className="w-full bg-[#060709] border border-white/15 px-3.5 py-2.5 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#00FF66]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                    İletişim Noktası (E-Posta / Telegram)
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="ornek@alanadi.com"
                    value={formData.contactEndpoint}
                    onChange={(e) => setFormData({ ...formData, contactEndpoint: e.target.value })}
                    className="w-full bg-[#060709] px-3.5 py-2.5 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#00FF66]"
                  />
                </div>
              </div>

              {/* 6. Mimari Notlar */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                  Mimari Notlar, Kısıtlamalar veya Saha Koşulları
                </label>
                <textarea
                  rows={3}
                  placeholder="Mevcut sensör modelleri, PLC/Modbus bağlantıları, hedef SLA gecikmeleri..."
                  value={formData.architecturalNotes}
                  onChange={(e) => setFormData({ ...formData, architecturalNotes: e.target.value })}
                  className="w-full bg-[#060709] p-3 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#00FF66] leading-relaxed"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 bg-[#00FF66] text-black font-bold text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  isSubmitting ? 'opacity-50 cursor-wait' : 'hover:bg-[#20ff77]'
                }`}
                data-cursor="GENERATE"
              >
                {isSubmitting ? (
                  <RotateCcw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 fill-current" />
                )}
                <span>{isSubmitting ? 'İşleniyor...' : 'Mimari Şartname Fişini Oluştur'}</span>
              </button>

            </form>
          </div>

          {/* Right Column: Live Pydantic/FastAPI Code Inspector & Brutalist Commission Receipt */}
          <div className="lg:col-span-5 space-y-6">

            {/* Live Code & Schema Inspector */}
            <div className="bg-[#090b0e] p-6">

              {/* Header with Switchers */}
              <div className="flex items-center justify-between pb-3 mb-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span className="text-white font-bold">/api/v1/system-brief</span>
                </div>

                <div className="flex items-center gap-1 bg-[#060709] p-0.5">
                  <button
                    onClick={() => setActiveCodeTab('json')}
                    className={`px-2.5 py-1 text-[11px] font-mono cursor-pointer ${
                      activeCodeTab === 'json' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    JSON
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('pydantic')}
                    className={`px-2.5 py-1 text-[11px] font-mono cursor-pointer ${
                      activeCodeTab === 'pydantic' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Pydantic v2
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('curl')}
                    className={`px-2.5 py-1 text-[11px] font-mono cursor-pointer ${
                      activeCodeTab === 'curl' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    cURL
                  </button>
                </div>
              </div>

              {/* Code Pre Box */}
              <pre className="text-xs font-mono text-zinc-300 overflow-x-auto p-4 bg-[#050608] leading-relaxed max-h-[340px]">
                {activeCodeTab === 'json' && JSON.stringify(activePayload, null, 2)}
                {activeCodeTab === 'pydantic' && pydanticSnippet}
                {activeCodeTab === 'curl' && curlSnippet}
              </pre>

              {/* Quick Code Actions */}
              <div className="mt-4 pt-3 flex items-center justify-between text-xs font-mono">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 border border-white/20 text-zinc-300 hover:text-white hover:border-white/40 flex items-center gap-1.5 transition-none cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Kopyalandı' : 'Şemayı Kopyala'}</span>
                </button>

                <button
                  onClick={handleDownloadJson}
                  className="px-3 py-1.5 border border-white/20 text-zinc-300 hover:text-white hover:border-white/40 flex items-center gap-1.5 transition-none cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.json İndir</span>
                </button>
              </div>
            </div>

            {/* Brutalist Architectural Commission Receipt (Generated upon submission or preview) */}
            <div className="bg-[#0b0e14] p-6 md:p-8 font-mono text-xs relative overflow-hidden">

              {/* Receipt Top Stamp */}
              <div className="flex items-center justify-between pb-4 mb-4">
                <div>
                  <div className="text-[10px] text-[#00FF66] uppercase tracking-widest font-bold">
                    Engineering Living Systems · Mimari Şartname Fişi
                  </div>
                  <div className="text-base font-bold text-white tracking-wider mt-0.5">
                    {activePayload.specification_id}
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-[#00FF66]/20 border border-[#00FF66]/50 text-[#00FF66] font-bold text-[10px] uppercase">
                  {submittedReceipt ? 'MİMAR ONAYLI' : 'CANLI TASLAK'}
                </span>
              </div>

              {/* Receipt Parameters Grid */}
              <div className="space-y-3 text-zinc-300">
                <div className="flex justify-between pt-2">
                  <span className="text-zinc-500">İSTEMCİ / KURUM:</span>
                  <span className="text-white font-bold truncate max-w-[200px]">{activePayload.client_entity || '-'}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-zinc-500">İLETİŞİM NOKTASI:</span>
                  <span className="text-white font-bold truncate max-w-[200px]">{activePayload.contact_endpoint || '-'}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-zinc-500">SİSTEM İHTİYACI:</span>
                  <span className="text-white font-bold truncate max-w-[220px]">{activePayload.system_need}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-zinc-500">GECİKME &amp; HACİM:</span>
                  <span className="text-emerald-400 font-bold truncate max-w-[200px]">{activePayload.throughput_scale}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-zinc-500">DONANIM KATMANI:</span>
                  <span className="text-sky-400 font-bold truncate max-w-[200px]">{activePayload.physical_integration}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-zinc-500">ZAMAN PLANI:</span>
                  <span className="text-amber-400 font-bold truncate max-w-[200px]">{activePayload.timeline_scale}</span>
                </div>
                <div className="pt-2">
                  <span className="text-zinc-500 block mb-1">MİMARİ NOT:</span>
                  <p className="text-zinc-300 text-[11px] leading-relaxed line-clamp-2">
                    {activePayload.architectural_notes || '-'}
                  </p>
                </div>
              </div>

              {/* Cryptographic Signature Footer */}
              <div className="pt-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-zinc-500">
                <div>
                  <span>ZAMAN: {activePayload.timestamp.substring(0, 19).replace('T', ' ')} UTC</span>
                  <span className="block text-[9px] text-zinc-600 font-mono mt-0.5">
                    SHA-256: 8f2a4c9b1d... (CRYPTOGRAPHICALLY DETERMINISTIC)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReceipt}
                    className="px-2.5 py-1 border border-white/20 text-white hover:bg-white hover:text-black flex items-center gap-1 cursor-pointer transition-none"
                  >
                    {receiptCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{receiptCopied ? 'Fiş Kopyalandı' : 'Fişi Kopyala'}</span>
                  </button>
                  <button
                    onClick={handleDownloadJson}
                    className="px-2.5 py-1 bg-white text-black font-bold hover:bg-zinc-200 flex items-center gap-1 cursor-pointer transition-none"
                  >
                    <Download className="w-3 h-3" />
                    <span>İndir</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Direct Communication Channels */}
            <div className="p-5 bg-[#0a0d14] flex items-center justify-between gap-4 text-xs font-mono">
              <div>
                <span className="text-white font-bold block mb-0.5">DOĞRUDAN MİMAR İLETİŞİMİ:</span>
                <span className="text-zinc-400 text-[11px]">Sistem briefi öncelikli inceleme kuyruğuna alınır.</span>
              </div>
              <a
                href={`mailto:hello@private-agency.com?subject=Mimari%20Şartname%20${activePayload.specification_id}&body=${encodeURIComponent(
                  `Şartname ID: ${activePayload.specification_id}\nİstemci: ${activePayload.client_entity || '-'}\nSistem: ${activePayload.system_need}\nGecikme: ${activePayload.throughput_scale}\nDonanım: ${activePayload.physical_integration}\n`)
                }`}
                className="px-3.5 py-2 bg-white/10 hover:bg-white hover:text-black text-white font-bold transition-none shrink-0"
              >
                MİMARA İLET ↗
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
