# Engineering Living Systems — Awwwards Düzeyi Scroll & FX Mimarisi

Awwwards jürisi ve ödüllü ajans standartlarında; yatay pinning (horizontal scroll), kart istifleme (card stacking), scroll ile senkronize 3D rotasyon scrubbing, hıza duyarlı kinetik tipografi ve manyetik imleç (spring physics cursor) entegrasyonu uygulama planı.

---

### Kullanıcı Onayı ve Kritik Kararlar

> [!IMPORTANT]
> Kullanıcının netleştirdiği kritik tasarım tercihleri:
> 1. **Yatay Kaydırma (Horizontal Pinning):** Awwwards SOTD ödüllü ajansların (Locomotive, Active Theory) kullandığı pürüzsüz GSAP ScrollTrigger pinning altyapısı; hem dikey tekerlek hareketiyle akıcı X-ekseni scrubbing hem de mimari indeks (`01 / 04`) atlama denetimleri ile kişiselleştirilecektir.
> 2. **Özel Manyetik İmleç:** Dokunmatik cihazlarda (mobil/tablet) tamamen gizlenip masaüstünde `mix-blend-mode: difference` ve yay (spring) fiziğiyle dinamik durumlar ("VIEW PROJECT", "DRAG 3D", "INITIATE") alacaktır.
> 3. **Kinetik Tipografi (Marquee):** Scroll hızına göre dinamik olarak ivmelenen, zıt yönlü akıcı editoryal şeritler kurgulanacaktır.

---

### 1. Genel Bakış ve Deneyim Konsepti

Bu aşama, mevcut çalışan tüm modülleri (Nova System Modbus telemetrisi, FastAPI/Pydantic brief motoru, Three.js 3D simülatörü, ajans vitrini) koruyarak üzerine Awwwards düzeyinde akıcı scroll koreografisi ve görsel derinlik katmanları ekler:
- Sayfa aşağı kaydırıldığında Selected Works bölümü ekrana kilitlenir (pin) ve yatay galeriye dönüşür.
- Disiplinler bölümü aşağı kaydıkça kartlar arkada küçülerek (scale: 0.92, opacity: 0.6) birbirinin üzerine katlanır (card stacking).
- 3D Flight Sim ve Living Topology, kullanıcının scroll derinliğine bağlı olarak gerçek zamanlı döner (timeline scrubbing).
- Özel manyetik imleç, etkileşimli yüzeylere yaklaştığında yay fiziğiyle genişleyerek bağlamsal etiketler gösterir.

---

### 2. Kullanıcı Deneyimi ve Görsel Tasarım

```
┌────────────────────────────────────────────────────────────────────────┐
│  MAGNETIC CURSOR (Desktop only, spring physics, mix-blend: difference) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  HERO & KINETIC TYPOGRAPHY MARQUEE                                     │
│  "ENGINEERING LIVING SYSTEMS" zıt yönlü hız duyarlı çift şerit         │
│  Maskeli dikey yükselme (Split character reveal)                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  CAPABILITIES: CARD STACKING / OVERLAP                                 │
│  4 Ana disiplin dikey scroll'da yapışır, önceki kart küçülerek katlanır│
│  (scale: 0.92, blur/opacity transition)                                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  SELECTED WORKS: HORIZONTAL PINNING (GSAP ScrollTrigger)              │
│  Dikey scroll durur, ekran pinlenir, 4 vaka yatay (X ekseninde) akar   │
│  İnteraktif index [01 / 04] ve pürüzsüz timeline scrubbing             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  SCROLL-DRIVEN 3D FLIGHT SIM & OFFSCREEN WORKER                       │
│  Scroll pozisyonu değiştikçe modelin pitch/yaw açısı dinamik döner     │
│  Ana thread yükü: %0 (OffscreenCanvas izole)                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  BRIEF ENGINE & GIT TERMINAL DEPLOYMENT                                │
│  Canlı Pydantic önizlemesi ve kopyalanabilir Git komut seti korunur    │
└────────────────────────────────────────────────────────────────────────┘
```

#### Görsel Hiyerarşi ve FX Detayları
- **Manyetik İmleç & Spring Fiziği:** 
  - Standart imleç gizlenir (`cursor-none` masaüstü).
  - Dış halka 150ms gecikmeli yay fiziğiyle takip eder.
  - Hover context'leri: Proje kartlarında `"VIEW PROJECT"`, 3D Canvas üzerinde `"DRAG 3D"`, Brief butonunda `"INITIATE"`.
- **Hıza Duyarlı Kinetik Tipografi:**
  - `Lenis` ve `gsap.ticker` hız deltasını dinleyerek scroll yapıldığında marquee hızı 3 katına çıkar, durunca nazikçe baz hıza yerleşir.
- **Yatay Pinning (Horizontal Scroll):**
  - Toplam 4 amiral vaka (Nova System, LensAI, Brook Resort, 3D Flight Sim) yatay bir ray üzerine dizilir.
  - GSAP `ScrollTrigger.create({ trigger, pin: true, scrub: 1, end: () => "+=" + trackWidth })` ile karesel atlamasız akış sağlanır.
- **Card Stacking / Overlap:**
  - 4 Disiplin kartı dikeyde `sticky top-24` ve ScrollTrigger scale interpolasyonuyla kart katlanma hissi verir.

---

### 3. Teknik Mimari ve Kod Planı

1. **Adım 1: Scroll & Animasyon Altyapısı (GSAP ScrollTrigger Kurulumu)**
   - GSAP `ScrollTrigger` eklentisini Lenis ile kusursuz senkronize etmek (`ScrollTrigger.update`, `ScrollTrigger.scrollerProxy`).
   - `prefers-reduced-motion` aktif olduğunda pinning ve ağır transformasyonları devre dışı bırakıp düz dikey akışa dönüştürme.

2. **Adım 2: Manyetik İmleç Bileşeni (`CustomCursor.tsx`)**
   - Masaüstü tespiti (`window.matchMedia('(pointer: fine)')`).
   - `mix-blend-mode: difference`, spring interpolation (`lerp`).
   - DOM üzerindeki `data-cursor` niteliklerini dinleyerek dinamik metin durumları.

3. **Adım 3: Kinetik Marquee ve Split Reveal (`KineticMarquee.tsx`)**
   - Zıt yönlü çift şerit, scroll ivmesiyle dinamik hızlanan CSS/GSAP transformasyonu.

4. **Adım 4: Selected Works Yatay Pinning Modülü (`HorizontalProjects.tsx` / `CaseStudies.tsx`)**
   - Ekrana kilitlenen (pin) yatay proje rayı.
   - Her proje için derin teknik detaylar ve interaktif simülatörlerin yatay düzende erişilebilirliği.

5. **Adım 5: Capabilities Kart İstifleme (Card Stacking FX)**
   - 4 disiplin kartının dikey kaydırmada birbiri üzerine binmesi ve hafif derinlik küçülmesi.

6. **Adım 6: Scroll-Scrubbed 3D Simülatör Entegrasyonu**
   - Scroll pozisyonu değiştikçe 3D uçuş açılarının senkronize dönmesi (`scrub: true`).

7. **Adım 7: Derleme ve Doğrulama (`compile_applet`, `lint_applet`)**
   - Mevcut tüm işlevlerin ve kodun hatasız çalıştığının doğrulanması.
