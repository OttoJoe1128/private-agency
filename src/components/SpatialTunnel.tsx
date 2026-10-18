import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Capability } from '../types/index.ts';
import { Globe, Boxes, Cpu, Layers, CheckCircle2, Compass, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CAPABILITIES: Capability[] = [
  {
    id: 'digital-ecosystems',
    index: '01',
    title: 'Complex Digital Ecosystems',
    tagline: 'Dağıtık Sunucu Mimarileri & Yüksek Veri Trafiği Yönetimi',
    technologies: ['FastAPI', 'Go', 'Firebase', 'PostgreSQL', 'Docker', 'Redis', 'WebSockets'],
    description:
      'Gereksiz katmanlardan arındırılmış, deterministik ve yüksek eşzamanlı veri hatları inşa ediyoruz. Mikroservisler, asenkron coroutine kuyrukları ve gerçek zamanlı senkronizasyon ile sıfır veri kaybı ve düşük gecikme garantisi sunuyoruz.',
    architecturePoints: [
      'Pydantic v2 doğrulamalı FastAPI ve Go tabanlı tip-güvenli mikroservisler',
      'Yüksek hacimli veri yükleri için PostgreSQL bağlantı havuzlama ve Redis tamponlama',
      'Firebase canlı dağıtım katmanı ile anlık 50k+ kullanıcı senkronizasyonu',
      'Docker ve konteyner orkestrasyonu ile mikroservis ölçekleme',
    ],
    systemMetric: '< 14ms',
    systemMetricLabel: 'P99 Gecikme Süresi',
  },
  {
    id: 'spatial-interactive',
    index: '02',
    title: 'Spatial & Interactive Experiences',
    tagline: 'WebGL, Three.js & 60 FPS Kararlı 3D Arayüzler',
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
    tagline: 'ESP32, ESP-IDF, Modbus-RTU & Donanım Entegrasyonu',
    technologies: ['ESP32', 'ESP-IDF C++', 'Modbus-RTU', 'RS485 Half-Duplex', 'FreeRTOS', '120Ω Bus'],
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
    tagline: 'Mekansal İş Akışları, Yerleşim Mimarisi & SOP Dokümantasyonu',
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

// Helper to safely test if WebGL is available in the current browser/sandbox
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function SpatialTunnel() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  const [activeStage, setActiveStage] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [cameraZ, setCameraZ] = useState<number>(600);
  const [engineMode, setEngineMode] = useState<string>('DETECTING');

  const getDisciplineIcon = (id: string) => {
    switch (id) {
      case 'digital-ecosystems':
        return <Globe className="w-5 h-5 text-sky-400" />;
      case 'spatial-interactive':
        return <Boxes className="w-5 h-5 text-[#38bdf8]" />;
      case 'physical-computing':
        return <Cpu className="w-5 h-5 text-[#FF4500]" />;
      case 'operational-design':
        return <Layers className="w-5 h-5 text-[#00FF66]" />;
      default:
        return <Compass className="w-5 h-5 text-white" />;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvasMount = canvasMountRef.current;
    if (!container || !canvasMount) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = canvasMount.clientWidth || window.innerWidth;
    const height = canvasMount.clientHeight || window.innerHeight;

    let webGlRenderer: THREE.WebGLRenderer | null = null;
    let animId: number | null = null;
    let cleanUpCallback: (() => void) | null = null;

    // Try WebGL initialization
    const webGLOk = isWebGLAvailable();

    if (webGLOk) {
      try {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0a);
        scene.fog = new THREE.FogExp2(0x0a0a0a, 0.0018);

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
        camera.position.set(0, 0, 600);

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        canvasMount.appendChild(renderer.domElement);
        webGlRenderer = renderer;
        setEngineMode('HARDWARE_ACCELERATED_WEBGL');

        // 1. Organic Swirling Particle Data Cloud
        const particleCount = 2800;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const colorPalette = [
          new THREE.Color(0x38bdf8), // Cyan
          new THREE.Color(0xff4500), // Industrial Orange
          new THREE.Color(0x00ff66), // Signal Green
          new THREE.Color(0xffffff), // Pure White
          new THREE.Color(0xa855f7), // Purple
        ];

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const radius = 25 + Math.random() * 95;
          const angle = Math.random() * Math.PI * 2;

          positions[i3] = Math.cos(angle) * radius;
          positions[i3 + 1] = Math.sin(angle) * radius;
          positions[i3 + 2] = 800 - Math.random() * 1500;

          const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
          colors[i3] = c.r;
          colors[i3 + 1] = c.g;
          colors[i3 + 2] = c.b;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
          size: 2.2,
          vertexColors: true,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
        });

        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particleSystem);

        // 2. Light Trajectories along Z-axis
        const trajectoryGroup = new THREE.Group();
        for (let t = 0; t < 10; t++) {
          const points: THREE.Vector3[] = [];
          const baseAngle = (t / 10) * Math.PI * 2;
          const radius = 45 + (t % 3) * 20;

          for (let z = 800; z >= -600; z -= 50) {
            const spiralAngle = baseAngle + (z * 0.003);
            points.push(new THREE.Vector3(
              Math.cos(spiralAngle) * radius,
              Math.sin(spiralAngle) * radius,
              z
            ));
          }

          const curve = new THREE.CatmullRomCurve3(points);
          const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.4, 6, false);
          const tubeMat = new THREE.MeshBasicMaterial({
            color: t % 2 === 0 ? 0x00ff66 : 0xff4500,
            wireframe: true,
            transparent: true,
            opacity: 0.35,
          });
          const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
          trajectoryGroup.add(tubeMesh);
        }
        scene.add(trajectoryGroup);

        // 3. Monoliths
        const monolithZPositions = [450, 180, -90, -360];
        const monoliths: THREE.Mesh[] = [];

        monolithZPositions.forEach((mz, mIdx) => {
          const monoGeo = new THREE.BoxGeometry(32, 48, 4);
          const monoMat = new THREE.MeshBasicMaterial({
            color: mIdx === 0 ? 0x38bdf8 : mIdx === 1 ? 0xa855f7 : mIdx === 2 ? 0xff4500 : 0x00ff66,
            wireframe: true,
            transparent: true,
            opacity: 0.6,
          });
          const monoMesh = new THREE.Mesh(monoGeo, monoMat);
          monoMesh.position.set(mIdx % 2 === 0 ? -45 : 45, 0, mz);
          scene.add(monoMesh);
          monoliths.push(monoMesh);
        });

        scene.add(new THREE.AmbientLight(0xffffff, 0.9));

        const animate = (time: number) => {
          const elapsed = time * 0.001;
          particleSystem.rotation.z = elapsed * 0.04;
          trajectoryGroup.rotation.z = -elapsed * 0.02;

          monoliths.forEach((m, idx) => {
            m.rotation.y = elapsed * 0.3 * (idx % 2 === 0 ? 1 : -1);
            m.rotation.x = Math.sin(elapsed + idx) * 0.1;
          });

          renderer.render(scene, camera);
          animId = requestAnimationFrame(animate);
        };
        animId = requestAnimationFrame(animate);

        const handleResize = () => {
          if (!canvasMount) return;
          const w = canvasMount.clientWidth;
          const h = canvasMount.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        let trigger: ScrollTrigger | null = null;
        if (!prefersReducedMotion) {
          trigger = ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: '+=3200',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              setScrollProgress(self.progress);
              const currentZ = THREE.MathUtils.lerp(600, -420, self.progress);
              camera.position.z = currentZ;
              setCameraZ(Math.round(currentZ));

              camera.position.x = Math.sin(self.progress * Math.PI * 3) * 15;
              camera.position.y = Math.cos(self.progress * Math.PI * 2) * 10;

              const stage = Math.min(3, Math.floor(self.progress * 4));
              setActiveStage(stage);
            },
          });
        }

        cleanUpCallback = () => {
          if (trigger) trigger.kill();
          if (animId) cancelAnimationFrame(animId);
          window.removeEventListener('resize', handleResize);
          if (canvasMount.contains(renderer.domElement)) {
            canvasMount.removeChild(renderer.domElement);
          }
          renderer.dispose();
        };
      } catch (err) {
        console.warn('WebGL Renderer could not be initialized, activating 2D spatial fallback:', err);
        webGlRenderer = null;
      }
    }

    // High-Performance 2D Canvas Fallback (Sandboxed / No WebGL GPU environments)
    if (!webGlRenderer) {
      setEngineMode('SPATIAL_2D_ACCEL (RESILIENT ZERO-JANK)');
      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = width;
      fallbackCanvas.height = height;
      fallbackCanvas.className = 'w-full h-full block';
      canvasMount.appendChild(fallbackCanvas);

      const ctx = fallbackCanvas.getContext('2d');
      if (!ctx) return;

      // Particle system with 3D coordinates projected in perspective
      const pCount = 900;
      interface P3D {
        x: number;
        y: number;
        z: number;
        baseRadius: number;
        color: string;
      }
      const particles: P3D[] = [];
      const colors = ['#38bdf8', '#ff4500', '#00ff66', '#ffffff', '#a855f7'];

      for (let i = 0; i < pCount; i++) {
        const radius = 40 + Math.random() * 200;
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: 800 - Math.random() * 1500,
          baseRadius: 1 + Math.random() * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      const monolithZ = [450, 180, -90, -360];
      const monolithColors = ['#38bdf8', '#a855f7', '#ff4500', '#00ff66'];

      let currentCamZ = 600;
      let camX = 0;
      let camY = 0;

      const render2D = (time: number) => {
        const w = fallbackCanvas.width;
        const h = fallbackCanvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const elapsed = time * 0.001;

        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, w, h);

        const fov = 420;

        // Draw Swirling Particles
        for (let i = 0; i < pCount; i++) {
          const p = particles[i];
          // Slow swirl rotation
          const cosR = Math.cos(0.002);
          const sinR = Math.sin(0.002);
          const nx = p.x * cosR - p.y * sinR;
          const ny = p.x * sinR + p.y * cosR;
          p.x = nx;
          p.y = ny;

          const relZ = currentCamZ - p.z;
          if (relZ <= 10 || relZ > 1400) continue;

          const scale = fov / relZ;
          const sx = cx + (p.x - camX) * scale;
          const sy = cy + (p.y - camY) * scale;
          const sr = Math.max(0.6, p.baseRadius * scale);

          if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) continue;

          const alpha = Math.min(1, Math.max(0.1, 1 - relZ / 1200));
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha * 0.85;
          ctx.fill();
        }

        // Draw Light Trajectory Spiral Lines
        ctx.lineWidth = 1;
        for (let t = 0; t < 6; t++) {
          const baseAngle = (t / 6) * Math.PI * 2 + elapsed * 0.2;
          const radius = 90 + (t % 2) * 40;
          ctx.strokeStyle = t % 2 === 0 ? 'rgba(0, 255, 102, 0.35)' : 'rgba(255, 69, 0, 0.35)';
          ctx.beginPath();
          let started = false;

          for (let z = 800; z >= -500; z -= 40) {
            const spiralAngle = baseAngle + z * 0.004;
            const px = Math.cos(spiralAngle) * radius;
            const py = Math.sin(spiralAngle) * radius;
            const relZ = currentCamZ - z;
            if (relZ <= 15 || relZ > 1300) continue;

            const scale = fov / relZ;
            const sx = cx + (px - camX) * scale;
            const sy = cy + (py - camY) * scale;

            if (!started) {
              ctx.moveTo(sx, sy);
              started = true;
            } else {
              ctx.lineTo(sx, sy);
            }
          }
          ctx.globalAlpha = 0.4;
          ctx.stroke();
        }

        // Draw 3D Monoliths Wireframe Projection
        monolithZ.forEach((mz, mIdx) => {
          const relZ = currentCamZ - mz;
          if (relZ <= 20 || relZ > 1400) return;

          const scale = fov / relZ;
          const monoX = (mIdx % 2 === 0 ? -110 : 110) - camX;
          const monoY = -camY;
          const sx = cx + monoX * scale;
          const sy = cy + monoY * scale;

          const mw = 65 * scale;
          const mh = 95 * scale;
          const depthOffset = 18 * scale;

          ctx.strokeStyle = monolithColors[mIdx];
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = Math.min(1, Math.max(0.2, 1 - relZ / 1200));

          // Front face
          ctx.strokeRect(sx - mw / 2, sy - mh / 2, mw, mh);
          // Back face projection
          ctx.strokeRect(sx - mw / 2 + depthOffset, sy - mh / 2 - depthOffset, mw, mh);
          // Connect corners
          ctx.beginPath();
          ctx.moveTo(sx - mw / 2, sy - mh / 2);
          ctx.lineTo(sx - mw / 2 + depthOffset, sy - mh / 2 - depthOffset);
          ctx.moveTo(sx + mw / 2, sy - mh / 2);
          ctx.lineTo(sx + mw / 2 + depthOffset, sy - mh / 2 - depthOffset);
          ctx.moveTo(sx - mw / 2, sy + mh / 2);
          ctx.lineTo(sx - mw / 2 + depthOffset, sy + mh / 2 - depthOffset);
          ctx.moveTo(sx + mw / 2, sy + mh / 2);
          ctx.lineTo(sx + mw / 2 + depthOffset, sy + mh / 2 - depthOffset);
          ctx.stroke();
        });

        ctx.globalAlpha = 1.0;
        animId = requestAnimationFrame(render2D);
      };

      animId = requestAnimationFrame(render2D);

      const handleResize = () => {
        if (!canvasMount) return;
        fallbackCanvas.width = canvasMount.clientWidth;
        fallbackCanvas.height = canvasMount.clientHeight;
      };
      window.addEventListener('resize', handleResize);

      let trigger: ScrollTrigger | null = null;
      if (!prefersReducedMotion) {
        trigger = ScrollTrigger.create({
          trigger: container,
          start: 'top top',
          end: '+=3200',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
            currentCamZ = THREE.MathUtils.lerp(600, -420, self.progress);
            camX = Math.sin(self.progress * Math.PI * 3) * 15;
            camY = Math.cos(self.progress * Math.PI * 2) * 10;
            setCameraZ(Math.round(currentCamZ));

            const stage = Math.min(3, Math.floor(self.progress * 4));
            setActiveStage(stage);
          },
        });
      }

      cleanUpCallback = () => {
        if (trigger) trigger.kill();
        if (animId) cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
        if (canvasMount.contains(fallbackCanvas)) {
          canvasMount.removeChild(fallbackCanvas);
        }
      };
    }

    return () => {
      if (cleanUpCallback) cleanUpCallback();
    };
  }, []);

  const jumpToStage = (stageIdx: number) => {
    setActiveStage(stageIdx);
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const scrollTarget = containerTop + (stageIdx / 4) * 3200;
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  };

  const activeCap = CAPABILITIES[activeStage] || CAPABILITIES[0];

  return (
    <section
      id="capabilities"
      ref={containerRef}
      className="relative w-full h-screen bg-[#0A0A0A] border-b border-white/10 overflow-hidden select-none"
    >
      {/* 3D Canvas Mount Point */}
      <div ref={canvasMountRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Top Telemetry & HUD Bar */}
      <div className="relative z-20 w-full bg-[#0D0D0D]/85 backdrop-blur-md border-b border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-[#00FF66] shadow-[0_0_8px_#00FF66] animate-pulse" />
          <span className="text-white font-bold tracking-widest uppercase">
            3D SPATIAL TUNNEL // Z-AXIS PORTAL
          </span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-400 tabular-nums">
            DEPTH: {cameraZ}m // PROGRESS: {Math.round(scrollProgress * 100)}%
          </span>
          <span className="text-zinc-600 hidden md:inline">·</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest hidden md:inline">
            [{engineMode}]
          </span>
        </div>

        {/* Warp Controls to Jump Across the 4 Disciplines */}
        <div className="flex items-center gap-2">
          {CAPABILITIES.map((cap, idx) => (
            <button
              key={cap.id}
              onClick={() => jumpToStage(idx)}
              className={`px-3 py-1 border text-xs font-mono transition-none cursor-pointer flex items-center gap-1.5 ${
                activeStage === idx
                  ? 'border-[#00FF66] bg-[#00FF66]/20 text-white font-bold'
                  : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
              }`}
            >
              <span>{cap.index}</span>
              <span className="hidden sm:inline">{cap.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Centered Spatial Card Approaching along Z-Axis */}
      <div className="relative z-10 w-full h-[calc(100vh-65px)] flex items-center justify-center p-6 pointer-events-none">
        <div className="w-full max-w-4xl bg-[#08090c]/90 border border-white/20 p-8 md:p-12 shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-xl pointer-events-auto transform transition-all duration-300">
          
          {/* Card Top Indicator */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/10 border border-white/20 text-xs font-mono text-white font-bold">
                DISCIPLINE {activeCap.index}
              </span>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                STATION {activeStage + 1} // 04
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-500 uppercase">SPATIAL_MONOLITH</span>
              {getDisciplineIcon(activeCap.id)}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight mb-2">
                  {activeCap.title}
                </h3>

                <div className="text-xs font-mono text-[#00FF66] mb-6">
                  {activeCap.tagline}
                </div>

                <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed mb-6">
                  {activeCap.description}
                </p>
              </div>

              {/* Technologies */}
              <div className="pt-4 border-t border-white/10">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                  TEKNOLOJİ VE PROTOKOL YIĞINI:
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-300">
                  {activeCap.technologies.map((tech, tIdx) => (
                    <span key={tech} className="inline-flex items-center">
                      <span className="text-white font-medium">{tech}</span>
                      {tIdx < activeCap.technologies.length - 1 && (
                        <span className="text-zinc-600 ml-3" aria-hidden="true">/</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Architectural Principles & Metric */}
            <div className="lg:col-span-5 bg-[#050608] p-6 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block mb-4">
                  Mimari İlkeler
                </span>

                <ul className="space-y-3 mb-6">
                  {activeCap.architecturePoints.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF66] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metric */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">{activeCap.systemMetricLabel}</div>
                  <div className="text-2xl font-bold text-white font-mono tabular-nums">{activeCap.systemMetric}</div>
                </div>
                <div className="text-right text-[10px] font-mono text-zinc-500">
                  DETERMİNİSTİK SLA
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 text-xs font-mono text-zinc-500 pointer-events-none">
        <ChevronDown className="w-4 h-4 text-[#00FF66] animate-bounce" />
        <span>SCROLL DOWN TO FLY THROUGH Z-AXIS SPATIAL MONOLITHS</span>
      </div>

    </section>
  );
}
