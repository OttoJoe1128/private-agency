import { GoogleGenAI } from '@google/genai';

function parseJsonBody(req: any) {
  if (req.body) return req.body;
  return new Promise<any>((resolve, reject) => {
    let s = '';
    req.on?.('data', (chunk: any) => (s += chunk));
    req.on?.('end', () => {
      try {
        resolve(s ? JSON.parse(s) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on?.('error', reject);
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const body = await parseJsonBody(req);
    const message = body?.message;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'INVALID_PAYLOAD: message string required' });
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

      const response: any = await ai.models.generateContent({
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

      return res.status(200).json({
        reply: cleanReply,
        navTarget,
        timestamp: new Date().toISOString(),
        core: 'GEMINI_3.8_FLASH // ACTIVE',
      });
    }

    // Local fallback
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

    return res.status(200).json({
      reply: `SLISS_LOCAL_FALLBACK: Sinyal işlendi: "${message}". Sistem çekirdeği aktif.`,
      navTarget,
      timestamp: new Date().toISOString(),
      core: 'LOCAL_RULE_DISPATCHER',
    });
  } catch (error: any) {
    console.error('api/sliss/chat error:', error);
    return res.status(500).json({ error: 'SLISS_CORE_ERROR: ' + (error?.message || 'INTERNAL_FAULT'), reply: 'HATA // SLISS_PROCESSOR_EXCEPTION: Sinyal işleme hatası.' });
  }
}

// Reuse the original system instruction constant to keep behaviour identical to the app router version.
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
- [NAV: hero]
- [NAV: github-telemetry]
- [NAV: capabilities]
- [NAV: case-studies]
- [NAV: brief-module]

TERMİNAL LOG TEŞHİSİ:
Kullanıcı terminal hatası, git çakışması veya donanım sinyal logu yapıştırdığında:
- KÖK NEDEN (ROOT CAUSE): 1-2 cümlelik rasyonel teknik tespit.
- ÇÖZÜM KOMUTU (FIX COMMAND): Uygulanacak kesin terminal veya konfigürasyon komutu.
`