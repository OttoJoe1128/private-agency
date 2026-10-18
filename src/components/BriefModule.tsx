import React, { useState } from 'react';
import { SystemBriefPayload } from '../types/index.ts';
import { Send, FileJson, Check, Copy, Download, Terminal, CheckCircle2, Code2 } from 'lucide-react';

export default function BriefModule() {
  const [formData, setFormData] = useState({
    systemNeed: 'iot-hardware',
    throughputScale: 'ultra-low-latency',
    physicalIntegration: 'rs485-modbus',
    timelineScale: 'production-8w',
    clientEntity: 'Nova Agro Corp',
    contactEndpoint: 'mimarlik@nova-agro.io',
    architecturalNotes: 'ESP32 ve RS485 Modbus sensör hattı üzerinde 120Ω sonlandırma ile deterministik gecikme hedefleniyor.',
  });

  const [activeView, setActiveView] = useState<'json' | 'cli' | 'pydantic'>('json');
  const [submittedReceipt, setSubmittedReceipt] = useState<SystemBriefPayload | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const getSystemNeedLabel = (val: string) => {
    switch (val) {
      case 'iot-hardware':
        return 'Physical Computing & IoT Sensör Ağları';
      case 'distributed-web':
        return 'Yüksek Trafikli Dağıtık Web Ekosistemi';
      case 'spatial-3d':
        return 'WebGL / Three.js 3D Spatial Arayüz';
      case 'operational-sop':
        return 'Mekansal Mimari & SOP Operasyon Motoru';
      default:
        return val;
    }
  };

  const getThroughputLabel = (val: string) => {
    switch (val) {
      case 'ultra-low-latency':
        return 'Ultra Düşük Gecikme (< 15ms P99)';
      case 'high-traffic':
        return 'Yüksek Eşzamanlı Trafik (100k+ req/sec)';
      case 'realtime-telemetry':
        return 'Canlı Telemetri & WebSocket Yayını';
      case 'standard-api':
        return 'Standart REST API Mimarisi';
      default:
        return val;
    }
  };

  const getPhysicalLabel = (val: string) => {
    switch (val) {
      case 'rs485-modbus':
        return 'RS485 Diferansiyel Veri Yolu & Modbus-RTU';
      case 'esp32-freertos':
        return 'ESP32 / ESP-IDF FreeRTOS Düğümleri';
      case 'pure-digital':
        return 'Yalın Dijital / Tarayıcı İçi Donanım Hızlandırma';
      case 'hybrid-iot':
        return 'Hibrit Bulut & Saha Ağ Geçidi';
      default:
        return val;
    }
  };

  const currentPayload: SystemBriefPayload = {
    system_need: getSystemNeedLabel(formData.systemNeed),
    throughput_scale: getThroughputLabel(formData.throughputScale),
    physical_integration: getPhysicalLabel(formData.physicalIntegration),
    timeline_scale: formData.timelineScale,
    client_entity: formData.clientEntity || 'Bilinmeyen Kurum / Bireysel Girişimci',
    contact_endpoint: formData.contactEndpoint || 'tanimsiz@endpoint.com',
    architectural_notes: formData.architecturalNotes || 'Özel mimari kısıtlama belirtilmedi.',
    timestamp: new Date().toISOString(),
    specification_id: 'SPEC-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
  };

  const activePayload = submittedReceipt || currentPayload;

  const cliCommand = `# Sistem Teslim Fişi CLI İletim Komutu
curl -X POST "https://api.systems.agency/v1/system-brief" \\
  -H "Content-Type: application/json" \\
  -H "X-Client-Spec-ID: ${activePayload.specification_id}" \\
  -d '${JSON.stringify(activePayload, null, 2)}'`;

  const pydanticSchema = `# Pydantic v2 / FastAPI Strict Validation Schema
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime

class SystemBriefRequest(BaseModel):
    specification_id: str = Field(..., pattern=r"^SPEC-[A-Z0-9]+$")
    system_need: str = Field(description="Domain category for architectural scope")
    throughput_scale: str = Field(description="Target SLA latency and concurrence")
    physical_integration: str = Field(description="Hardware/Bus level topology")
    timeline_scale: str
    client_entity: str = Field(min_length=2)
    contact_endpoint: str
    architectural_notes: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        frozen = True
        extra = "forbid"`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedReceipt(currentPayload);
  };

  const handleCopy = () => {
    const textToCopy =
      activeView === 'json'
        ? JSON.stringify(activePayload, null, 2)
        : activeView === 'cli'
        ? cliCommand
        : pydanticSchema;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activePayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `system_spec_${activePayload.specification_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <section id="brief-module" className="py-20 border-b border-white/10 bg-[#060709] architectural-grid">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">
              <span>Mimarını Sürece Dahil Et</span>
              <span aria-hidden="true">·</span>
              <span>Rasyonel Sistem Briefi</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-display">
              Teknik İhtiyaç Toplama Motoru
            </h2>
          </div>
          <div className="max-w-md text-xs font-mono text-zinc-400 bg-[#090b0e] p-4 border border-white/10">
            <span className="text-emerald-400 font-bold block mb-1">CANLI PYDANTIC TELEMETRİSİ:</span>
            Parametreleri değiştirdiğiniz anda sağ paneldeki `/api/v1/system-brief` şeması deterministik olarak güncellenir.
          </div>
        </div>

        {/* 2-Column Interface: Left Form Parameters, Right Live Architectural JSON */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Parameters */}
          <div className="lg:col-span-7 bg-[#090b0e] border border-white/10 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. System Need Selection */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                  1. Temel Sistem İhtiyacı (system_need)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'iot-hardware', label: 'Physical Computing & IoT' },
                    { id: 'distributed-web', label: 'Dağıtık Web & Mikroservis' },
                    { id: 'spatial-3d', label: 'WebGL / Three.js Spatial' },
                    { id: 'operational-sop', label: 'Mekansal Mimari & SOP' },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setFormData({ ...formData, systemNeed: opt.id })}
                      className={`p-3 text-left border text-xs font-mono transition-none cursor-pointer ${
                        formData.systemNeed === opt.id
                          ? 'border-white bg-white text-black font-semibold'
                          : 'border-white/10 text-zinc-300 bg-[#060709] hover:border-white/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Throughput Scale Selection */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                  2. Veri Trafiği ve Gecikme Skalası (throughput_scale)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'ultra-low-latency', label: '< 15ms Ultra Düşük Gecikme' },
                    { id: 'high-traffic', label: '100k+ req/sec Eşzamanlı Yük' },
                    { id: 'realtime-telemetry', label: 'Gerçek Zamanlı Telemetri / WS' },
                    { id: 'standard-api', label: 'Standart REST API Mimarisi' },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setFormData({ ...formData, throughputScale: opt.id })}
                      className={`p-3 text-left border text-xs font-mono transition-none cursor-pointer ${
                        formData.throughputScale === opt.id
                          ? 'border-white bg-white text-black font-semibold'
                          : 'border-white/10 text-zinc-300 bg-[#060709] hover:border-white/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Physical Integration Selection */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                  3. Fiziksel ve Donanım Entegrasyonu (physical_integration)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'rs485-modbus', label: 'RS485 Veri Yolu / Modbus-RTU' },
                    { id: 'esp32-freertos', label: 'ESP32 Gömülü FreeRTOS' },
                    { id: 'pure-digital', label: 'Yalın Dijital / Tarayıcı API' },
                    { id: 'hybrid-iot', label: 'Hibrit Bulut & Saha Gateway' },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setFormData({ ...formData, physicalIntegration: opt.id })}
                      className={`p-3 text-left border text-xs font-mono transition-none cursor-pointer ${
                        formData.physicalIntegration === opt.id
                          ? 'border-white bg-white text-black font-semibold'
                          : 'border-white/10 text-zinc-300 bg-[#060709] hover:border-white/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Contact & Entity Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                    Kurum / Şirket / Ad Soyad
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Studio Demirkaya"
                    value={formData.clientEntity}
                    onChange={(e) => setFormData({ ...formData, clientEntity: e.target.value })}
                    className="w-full bg-[#060709] border border-white/15 px-3 py-2.5 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                    İletişim Kanalı (E-Posta / Telegram)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ornek@alanadi.com"
                    value={formData.contactEndpoint}
                    onChange={(e) => setFormData({ ...formData, contactEndpoint: e.target.value })}
                    className="w-full bg-[#060709] border border-white/15 px-3 py-2.5 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* 5. Architectural Notes */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                  Mimari Notlar ve Özel Kısıtlamalar
                </label>
                <textarea
                  rows={3}
                  placeholder="Hedef platform kısıtları, mevcut sensör hatları veya dağıtım hedefleri..."
                  value={formData.architecturalNotes}
                  onChange={(e) => setFormData({ ...formData, architecturalNotes: e.target.value })}
                  className="w-full bg-[#060709] border border-white/15 p-3 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-white"
                />
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-200 transition-none border border-white cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Sistem Briefini Doğrula ve Mimarını Dahil Et</span>
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Live FastAPI/Pydantic JSON Spec & Architectural Receipt */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* View Switcher Tabs (JSON / CLI / Pydantic) */}
            <div className="bg-[#090b0e] border border-white/10 p-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span className="text-white font-bold">/api/v1/system-brief</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveView('json')}
                    className={`px-2 py-1 text-[11px] font-mono cursor-pointer ${
                      activeView === 'json' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    JSON
                  </button>
                  <button
                    onClick={() => setActiveView('cli')}
                    className={`px-2 py-1 text-[11px] font-mono cursor-pointer ${
                      activeView === 'cli' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    CLI (cURL)
                  </button>
                  <button
                    onClick={() => setActiveView('pydantic')}
                    className={`px-2 py-1 text-[11px] font-mono cursor-pointer ${
                      activeView === 'pydantic' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Pydantic v2
                  </button>
                </div>
              </div>

              {/* Code/Payload Viewport */}
              <pre className="text-xs font-mono text-zinc-300 overflow-x-auto p-4 bg-[#060709] border border-white/5 leading-relaxed max-h-[380px]">
                {activeView === 'json' && JSON.stringify(activePayload, null, 2)}
                {activeView === 'cli' && cliCommand}
                {activeView === 'pydantic' && pydanticSchema}
              </pre>

              {/* Action Buttons: Copy / Download Receipt */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 border border-white/20 text-xs font-mono text-zinc-300 hover:text-white hover:border-white/40 flex items-center gap-1.5 transition-none cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Kopyalandı' : 'Panoya Kopyala'}</span>
                </button>

                <button
                  onClick={handleDownloadReceipt}
                  className="px-3 py-2 border border-white/20 text-xs font-mono text-zinc-300 hover:text-white hover:border-white/40 flex items-center gap-1.5 transition-none cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Sistem Teslim Fişi (.json) İndir</span>
                </button>
              </div>
            </div>

            {/* Receipt Modal Confirmation Box when Submitted */}
            {submittedReceipt && (
              <div className="p-5 bg-emerald-950/20 border border-emerald-500/40 text-xs font-mono text-emerald-300">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>MİMARİ BREIF BAŞARIYLA ONAYLANDI</span>
                </div>
                <p className="text-zinc-300 leading-relaxed mb-3">
                  Sistem spesifikasyonu <span className="text-white font-bold">{submittedReceipt.specification_id}</span> kimliği ile kaydedildi. Mühendislik ekibimiz belirlenen parametreleri inceleyerek iletişim noktanıza 24 saat içinde dönüş yapacaktır.
                </p>
                <div className="text-[11px] text-zinc-500">
                  Zaman Damgası: {submittedReceipt.timestamp}
                </div>
              </div>
            )}

            {/* Systems Theory Architectural Guarantee */}
            <div className="p-5 bg-[#0e1117] border border-white/10 text-xs text-zinc-400 leading-relaxed font-mono">
              <span className="text-white block font-bold mb-1">MİMARİ TAAHHÜT:</span>
              Gereksiz yazılım soyutlamaları (abstraction bloat) kullanılmaz. Projeniz doğrudan bare-metal veya optimize edilmiş hafif mikroservisler üzerinde deterministik gecikme sınırları ile devreye alınır.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
