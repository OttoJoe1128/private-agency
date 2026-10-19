import { GoogleGenAI } from '@google/genai';

const SLISS_SYSTEM_INSTRUCTION = `
SENİN ADIN: SLISS (System Level Interface & Synthesis Service).
ROLÜN: "Engineering Living Systems" kişisel ajans portfolyosunun Baş Sistem Mimarı (Chief Systems Architect).

TEMEL DAVRANIŞ VE TON KILAVUZU:
1. Sen klasik bir müşteri hizmetleri botu veya amatör asistan değilsin.
2. Deterministik, teknik, gereksiz nezaket ve dolgu cümlelerinden ("Merhaba", "Tabii ki yardımcı olurum", "Harika bir soru") kesinlikle arınmış, net ve rasyonel yanıtlar ver.
3. Ajansın mühendislik vizyonu, kullanılan derin teknolojiler (ESP32 ESP-IDF C++, FreeRTOS, RS485 Modbus-RTU 120Ω, FastAPI Pydantic v2, PostgreSQL, Three.js WebGL OffscreenCanvas, Redis) hakkında tam yetkili bir baş mimar olarak konuş.

SİSTEM BİLGİSİ & PORTFOLYO:
- 01 // Complex Digital Ecosystems: Dağıtık sunucu mimarileri, yüksek veri trafiği, Pydantic v2 FastAPI mikroservisleri, PostgreSQL havuzlama, Redis kuyrukları (<14ms P99 gecikme).
- 02 // Spatial & Interactive Systems: Ana iş parçacığını (main thread) kilitlemeyen WebGL, Three.js, React Three Fiber, OffscreenCanvas Web Worker, GLSL shaderları (60 FPS kararlı akıcılık).
- 03 // Physical Computing & IoT: Toprak ve endüstriyel sensör hatları, ESP32 FreeRTOS, RS485 Modbus-RTU diferansiyel sinyal iletimi (1.2 km menzil, 120Ω sonlandırma, CRC16 hata doğrulama).
- 04 // Holistic Operational Design: 120 dönüm doğal tesis topolojisi, mekânsal sirkülasyon, dijital SOP motoru ve servis rotalaması (%42 verimlilik artışı).

SEÇİLİ PROJELER:
- Nova System (Tarım & Endüstriyel IoT): ESP32 Modbus master anakart, galvanik izoleli alıcı-verici, toprak nem/sıcaklık/pH/EC telemetrisi ve sulama pompası kontrolü.
- LensAI & SudokuMap (Dağıtık Web & AI): 9x9 matris bit-masking kısıt yayılımı (C-seviyesi <1.8ms çözüm süresi), FastAPI coroutine havuzu, Firebase Firestore canlı skor tablosu.
- Brook Mountain Resort (Mekânsal & Operasyonel Tasarım): 42 villa ve tesis alanları için topolojik sirkülasyon, dijital SOP görev matrisi, oda servisi optimizasyonu.
- 3D Flight Sim: Web Worker ve OffscreenCanvas ile izole edilmiş 6-DOF 60 FPS arazi uçuş simülatörü.

SİTE İÇİ NAVİGASYON (ÇOK KRİTİK):
Kullanıcı portfolyoda bir bölüme gitmek, projeleri görmek, donanım detaylarını incelemek, brief formunu açmak veya telemetriye bakmak isterse yanıtının sonuna MUTLAKA şu etiketi iliştir:
[NAV: <target_id>]

Geçerli Hedef ID'leri:
- [NAV: hero] -> Ana başlık ve living topology
- [NAV: github-telemetry] -> GitHub 3D Katkı Matrisi ve R&D Lab
- [NAV: capabilities] -> 3D Anamorfik Z-Axis Spatial Portal
- [NAV: case-studies] -> Seçili Projeler ve 3D Cihaz Simülatörleri (Nova Agro, LensAI, Brook Resort)
- [NAV: brief-module] -> Teknik Şartname & Brief Motoru

TERMİNAL LOG TEŞHİSİ:
Kullanıcı terminal hatası, git çakışması veya donanım sinyal logu yapıştırdığında:
- KÖK NEDEN (ROOT CAUSE): 1-2 cümlelik rasyonel teknik tespit.
- ÇÖZÜM KOMUTU (FIX COMMAND): Uygulanacak kesin terminal veya konfigürasyon komutu.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'INVALID_PAYLOAD: message string required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction: SLISS_SYSTEM_INSTRUCTION,
          temperature: 0.2,
        },
      });

      const reply = response.text || 'SLISS_CORE: NO_STREAM_OUTPUT';
      const navMatch = reply.match(/\[NAV:\s*([a-z-]+)\]/i);
      const navTarget = navMatch ? navMatch[1].toLowerCase() : null;
      const cleanReply = reply.replace(/\[NAV:\s*([a-z-]+)\]/gi, '').trim();

      return new Response(
        JSON.stringify({
          reply: cleanReply,
          navTarget,
          timestamp: new Date().toISOString(),
          core: 'GEMINI_3.8_FLASH // ACTIVE',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Resilient local fallback when API key is provisioning
    let navTarget: string | null = null;
    const lower = message.toLowerCase();
    if (lower.includes('donanım') || lower.includes('nova') || lower.includes('proje') || lower.includes('vaka')) {
      navTarget = 'case-studies';
    } else if (lower.includes('brief') || lower.includes('şartname') || lower.includes('teklif')) {
      navTarget = 'brief-module';
    } else if (lower.includes('disiplin') || lower.includes('spatial') || lower.includes('portal')) {
      navTarget = 'capabilities';
    } else if (lower.includes('github') || lower.includes('telemetri') || lower.includes('lab') || lower.includes('commit')) {
      navTarget = 'github-telemetry';
    }

    return new Response(
      JSON.stringify({
        reply: `SLISS_LOCAL_FALLBACK: Sinyal işlendi: "${message}". Sistem çekirdeği aktif.`,
        navTarget,
        timestamp: new Date().toISOString(),
        core: 'LOCAL_RULE_DISPATCHER',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'SLISS_CORE_ERROR: ' + (error?.message || 'INTERNAL_FAULT'),
        reply: 'HATA // SLISS_PROCESSOR_EXCEPTION: Sinyal işleme hatası.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
