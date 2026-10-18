import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SLISS_SYSTEM_INSTRUCTION = `
SENİN ADIN: SLISS (System Level Interface & Synthesis Service).
ROLÜN: "Engineering Living Systems" stüdyosunun merkezi komut satırı çekirdeği (AI Core & Command Palette).

DAVRANIŞ KURALLARI (KRİTİK):
1. Pazarlama lafları, dolgu cümleler ve gereksiz nezaket kalıpları (örn. "Merhaba", "Tabii ki yardımcı olurum", "Harika bir soru", "Umarım iyisinizdir") KESİNLİKLE KULLANILMAYACAKTIR.
2. Dilin: Soğuk, rasyonel, deterministik, yüksek mühendislik ve sistem mimarisi terminolojisine dayalıdır.
3. Yanıtların kompakt, maddeleme odaklı ve doğrudan hedefe yöneliktir.

SİSTEM BİLGİSİ:
- 01 // Complex Digital Ecosystems: FastAPI, Go, Firebase, Docker, PostgreSQL (<14ms P99 SLA).
- 02 // Spatial & Interactive Experiences: WebGL, Three.js, OffscreenCanvas Web Worker, 60 FPS INP-dostu mimari.
- 03 // Physical Computing & IoT: ESP32 FreeRTOS, ESP-IDF C++, RS485 half-duplex, 120Ω hat sonlandırma, Modbus-RTU, CRC16.
- 04 // Holistic Operational Design: 120 dönüm mekansal sirkülasyon, dijital SOP motoru.
- Seçilmiş Vakalar:
  - Nova System: Toprak nemi/sıcaklık/pH/EC telemetrisi, galvanik izoleli RS485 hattı.
  - LensAI & SudokuMap: 9x9 tensör matris ayrıştırma, FastAPI asenkron coroutine, Firebase realtime leaderboard.
  - Brook Resort: 42 villa sirkülasyon haritası, SOP standartları.
  - Derin Demirkaya 3D Flight Sim: Web Worker + OffscreenCanvas 3D drone simülasyonu.
- Brief Motoru: "Mimarını Sürece Dahil Et" (/api/v1/system-brief).

SİTE İÇİ NAVİGASYON (ÇOK ÖNEMLİ):
Eğer kullanıcı site içinde bir bölümü görmek, oraya gitmek veya o konudaki projeleri açmak isterse (örn: "donanım projelerini göster", "brief formuna git", "3D simülatörü aç", "disiplinleri incele"), yanıtının sonuna MUTLAKA şu formatta bir etiket ekle:
[NAV: <target>]
Hedefler:
- [NAV: case-studies] (Vakalar veya donanım/nova projeleri için)
- [NAV: capabilities] (Disiplinler / sistem katmanları için)
- [NAV: brief-module] (Teknik brief formu için)
- [NAV: manifesto] (Ajans geçmişi ve açık kaynak repolar için)
- [NAV: hero] (Ana sayfa / giriş için)

TERMİNAL LOG TEŞHİSİ:
Kullanıcı bir terminal çıktısı veya hata logu yapıştırdığında (örn: git push hatası, UART timeout, permission denied, port in use):
- KÖK NEDEN (ROOT CAUSE): 1-2 cümleyle rasyonel teknik açıklama.
- ÇÖZÜM KOMUTU (FIX COMMAND): Tek satırlık kesin komut.
`;

// SLISS Chat API Endpoint
app.post('/api/sliss/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'INVALID_PAYLOAD: message string required' });
      return;
    }

    // Call Gemini API using modern @google/genai SDK
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction: SLISS_SYSTEM_INSTRUCTION,
          temperature: 0.2, // Deterministik, rasyonel ton
        },
      });

      const reply = response.text || 'SLISS_CORE: NO_STREAM_OUTPUT';

      // Parse [NAV: <target>] tag if present
      const navMatch = reply.match(/\[NAV:\s*([a-z-]+)\]/i);
      const navTarget = navMatch ? navMatch[1].toLowerCase() : null;
      const cleanReply = reply.replace(/\[NAV:\s*([a-z-]+)\]/gi, '').trim();

      res.json({
        reply: cleanReply,
        navTarget,
        timestamp: new Date().toISOString(),
        core: 'GEMINI_3.8_FLASH // ACTIVE',
      });
      return;
    }

    // Fallback if API key is in provisioning
    res.json({
      reply: `SLISS_LOCAL_FALLBACK: Komut alındı: "${message}". Sistem çekirdeği aktif, ancak harici model anahtarı beklemede. Bölümlere erişmek için komut listesini kullanabilirsiniz.`,
      navTarget: message.toLowerCase().includes('donanım') || message.toLowerCase().includes('proje')
        ? 'case-studies'
        : message.toLowerCase().includes('brief')
        ? 'brief-module'
        : message.toLowerCase().includes('disiplin')
        ? 'capabilities'
        : null,
      timestamp: new Date().toISOString(),
      core: 'LOCAL_RULE_DISPATCHER',
    });
  } catch (error: any) {
    console.error('SLISS API Error:', error);
    res.status(500).json({
      error: 'SLISS_CORE_ERROR: ' + (error?.message || 'INTERNAL_FAULT'),
      reply: 'HATA // SLISS_PROCESSOR_EXCEPTION: Sinyal işleme hatası. Parametreleri doğrulayın.',
    });
  }
});

// Vite Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[SLISS CORE] Running at http://localhost:${port}`);
  });
}

startServer();
