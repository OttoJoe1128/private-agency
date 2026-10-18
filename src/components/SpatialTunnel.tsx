import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Capability } from '../types/index.ts';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const CAPABILITIES: Capability[] = [
  {
    id: 'digital-ecosystems',
    index: '01',
    title: 'COMPLEX DIGITAL ECOSYSTEMS',
    tagline: 'Dağıtık Sunucu Mimarileri & Yüksek Veri Trafiği',
    technologies: ['FastAPI', 'Go', 'Firebase', 'PostgreSQL', 'Docker', 'Redis', 'WebSockets'],
    description:
      'Gereksiz katmanlardan arındırılmış, deterministik ve yüksek eşzamanlı veri hatları. Mikroservisler, coroutine kuyrukları ve kesintisiz senkronizasyon.',
    architecturePoints: [
      'Pydantic v2 doğrulamalı FastAPI mikroservisleri',
      'PostgreSQL bağlantı havuzlama & Redis önbelleği',
      'Canlı kullanıcı senkronizasyonu',
    ],
    systemMetric: '< 14ms',
    systemMetricLabel: 'P99 Gecikme',
  },
  {
    id: 'spatial-interactive',
    index: '02',
    title: 'SPATIAL & INTERACTIVE SYSTEMS',
    tagline: 'WebGL, Three.js & 60 FPS Kararlı Arayüzler',
    technologies: ['WebGL', 'Three.js', 'React Three Fiber', 'GSAP', 'OffscreenCanvas', 'GLSL'],
    description:
      'Ana iş parçacığını bloke etmeyen mimarilerle akıcı mekânsal deneyimler. Matematiksel kamera projeksiyonları ve GPU hızlandırmalı görselleştirmeler.',
    architecturePoints: [
      'Web Worker & OffscreenCanvas izolasyonu',
      'Optimize BufferGeometry ve instanced çizim',
      'Özel GLSL shaderları ile dinamik ışık fiziği',
    ],
    systemMetric: '60 FPS',
    systemMetricLabel: 'Ekran Akıcılığı',
  },
  {
    id: 'physical-computing',
    index: '03',
    title: 'PHYSICAL COMPUTING & IOT',
    tagline: 'ESP32, ESP-IDF C++, Modbus-RTU & Donanım Entegrasyonu',
    technologies: ['ESP32', 'ESP-IDF C++', 'Modbus-RTU', 'RS485 Half-Duplex', 'FreeRTOS'],
    description:
      'Yazılımı fiziksel dünyaya taşıyan endüstriyel sensör hatları, diferansiyel sinyal kablolamaları ve mikrodenetleyici düzeyinde gömülü yazılımlar.',
    architecturePoints: [
      'ESP32 FreeRTOS deterministik görev önceliği',
      'RS485 Modbus-RTU endüstriyel gürültü koruması',
      'CRC16 hata doğrulama döngüsü ile güvenli iletim',
    ],
    systemMetric: '1.2 km',
    systemMetricLabel: 'Sinyal Mesafesi',
  },
  {
    id: 'operational-design',
    index: '04',
    title: 'HOLISTIC OPERATIONAL DESIGN',
    tagline: 'Mekânsal Planlama, İş Akışları & SOP Mimarisi',
    technologies: ['Spatial Planning', 'SOP Engine', 'Workflow Topology', 'System Architecture'],
    description:
      'Fiziksel tesisler ve operasyon merkezleri için mimari yerleşimden dijital operasyon protokollerine uzanan bütüncül sistemler ve servis rotalaması.',
    architecturePoints: [
      'Personel akış darboğazlarının matematiksel optimizasyonu',
      'SOP kurallarının dijital kontrol matrisine dönüştürülmesi',
      'Sıfır sürtünmeli fiziksel-dijital servis entegrasyonu',
    ],
    systemMetric: '+42%',
    systemMetricLabel: 'Verimlilik Artışı',
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

// Station Z-coordinates along the tunnel
const STATIONS = [
  { sweetZ: 500, color: '#38bdf8' }, // Cyan
  { sweetZ: 150, color: '#a855f7' }, // Purple
  { sweetZ: -200, color: '#ff4500' }, // Industrial Orange
  { sweetZ: -550, color: '#00ff66' }, // Signal Green
];

interface StationProps {
  data: Capability;
  sweetZ: number;
  color: string;
  cameraZRef: React.MutableRefObject<number>;
  stationIndex: number;
}

/**
 * Anamorphic 3D Station Component using @react-three/drei <Text>
 */
function AnamorphicStation({ data, sweetZ, color, cameraZRef, stationIndex }: StationProps) {
  const groupRef = useRef<THREE.Group | null>(null);

  const indexRef = useRef<THREE.Group | null>(null);
  const titleRef = useRef<THREE.Group | null>(null);
  const taglineRef = useRef<THREE.Group | null>(null);
  const descRef = useRef<THREE.Group | null>(null);
  const techRef = useRef<THREE.Group | null>(null);
  const metricRef = useRef<THREE.Group | null>(null);
  const wireframeRef = useRef<THREE.LineSegments | null>(null);

  const layout = {
    index: { x: -7.5, y: 4.8, zOffset: 12, size: 0.55 },
    title: { x: -7.5, y: 2.8, zOffset: 22, size: 0.95 },
    tagline: { x: -7.5, y: 0.8, zOffset: 30, size: 0.45 },
    desc: { x: -7.5, y: -1.2, zOffset: 38, size: 0.35 },
    tech: { x: -7.5, y: -3.4, zOffset: 46, size: 0.3 },
    metric: { x: 5.5, y: 0.0, zOffset: 26, size: 0.5 },
  };

  const chaos = useMemo(() => {
    const sign = stationIndex % 2 === 0 ? 1 : -1;
    return {
      index: { dx: 14 * sign, dy: 6, rotY: 0.6 * sign, rotZ: 0.3 },
      title: { dx: -18 * sign, dy: -8, rotY: -0.7 * sign, rotZ: -0.4 },
      tagline: { dx: 12 * sign, dy: -12, rotY: 0.8 * sign, rotZ: 0.5 },
      desc: { dx: -15 * sign, dy: 10, rotY: -0.6 * sign, rotZ: -0.3 },
      tech: { dx: 16 * sign, dy: -14, rotY: 0.9 * sign, rotZ: 0.6 },
      metric: { dx: -14 * sign, dy: 12, rotY: -0.8 * sign, rotZ: 0.4 },
    };
  }, [stationIndex]);

  useFrame(() => {
    const camZ = cameraZRef.current;
    const dist = camZ - sweetZ;

    const absDist = Math.abs(dist);
    let masterAlpha = 0;
    if (dist > 0) {
      masterAlpha = THREE.MathUtils.clamp(1 - (dist - 40) / 240, 0, 1);
    } else {
      masterAlpha = THREE.MathUtils.clamp(1 - (-dist) / 160, 0, 1);
    }

    if (groupRef.current) {
      groupRef.current.visible = masterAlpha > 0.01;
    }

    const sweetWindow = 28;
    const scatter = THREE.MathUtils.clamp((absDist - sweetWindow) / 100, 0, 1);

    const updateBlock = (
      ref: React.MutableRefObject<THREE.Group | null>,
      coords: { x: number; y: number; zOffset: number; size: number },
      ch: { dx: number; dy: number; rotY: number; rotZ: number }
    ) => {
      if (!ref.current) return;
      const depthRatio = coords.zOffset / 22;
      const targetX = coords.x * depthRatio;
      const targetY = coords.y * depthRatio;
      const targetZ = -coords.zOffset;

      ref.current.position.x = targetX + ch.dx * scatter;
      ref.current.position.y = targetY + ch.dy * scatter;
      ref.current.position.z = targetZ + (ch.dx * 0.3) * scatter;

      ref.current.rotation.y = ch.rotY * scatter;
      ref.current.rotation.z = ch.rotZ * scatter;
      ref.current.rotation.x = (ch.rotY * 0.5) * scatter;
    };

    updateBlock(indexRef, layout.index, chaos.index);
    updateBlock(titleRef, layout.title, chaos.title);
    updateBlock(taglineRef, layout.tagline, chaos.tagline);
    updateBlock(descRef, layout.desc, chaos.desc);
    updateBlock(techRef, layout.tech, chaos.tech);
    updateBlock(metricRef, layout.metric, chaos.metric);

    if (wireframeRef.current) {
      wireframeRef.current.rotation.z += 0.003;
      wireframeRef.current.position.x = 5.5 + chaos.metric.dx * 0.3 * scatter;
      wireframeRef.current.position.y = 0.0 + chaos.metric.dy * 0.3 * scatter;
      wireframeRef.current.position.z = -26;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, sweetZ]}>
      {/* 1. Station Index */}
      <group ref={indexRef}>
        <Text
          fontSize={layout.index.size}
          color={color}
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.12}
        >
          {`DİSİPLİN ${data.index}`}
        </Text>
      </group>

      {/* 2. Main Title */}
      <group ref={titleRef}>
        <Text
          fontSize={layout.title.size}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          maxWidth={18}
          lineHeight={1.05}
          letterSpacing={0.04}
        >
          {data.title}
        </Text>
      </group>

      {/* 3. Tagline */}
      <group ref={taglineRef}>
        <Text
          fontSize={layout.tagline.size}
          color={color}
          anchorX="left"
          anchorY="middle"
          maxWidth={16}
          letterSpacing={0.06}
        >
          {data.tagline}
        </Text>
      </group>

      {/* 4. Description Paragraph */}
      <group ref={descRef}>
        <Text
          fontSize={layout.desc.size}
          color="#cbd5e1"
          anchorX="left"
          anchorY="top"
          maxWidth={14}
          lineHeight={1.4}
          letterSpacing={0.02}
        >
          {data.description}
        </Text>
      </group>

      {/* 5. Technologies */}
      <group ref={techRef}>
        <Text
          fontSize={layout.tech.size}
          color="#94a3b8"
          anchorX="left"
          anchorY="middle"
          maxWidth={15}
          letterSpacing={0.08}
        >
          {data.technologies.join('  /  ')}
        </Text>
      </group>

      {/* 6. Metric Monolith */}
      <group ref={metricRef}>
        <Text
          fontSize={layout.metric.size * 1.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
        >
          {data.systemMetric}
        </Text>
        <Text
          position={[0, -1.2, 0]}
          fontSize={layout.metric.size * 0.45}
          color={color}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
        >
          {data.systemMetricLabel}
        </Text>
      </group>

      {/* 7. Monolith Wireframe Box */}
      <lineSegments ref={wireframeRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(6.5, 7.5, 2.5)]} />
        <lineBasicMaterial color={color} transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

/**
 * Dynamic Particle Starfield
 */
function ParticleStarfield({ cameraZRef }: { cameraZRef: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points | null>(null);
  const trajectoriesRef = useRef<THREE.Group | null>(null);

  const particleData = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#38bdf8'),
      new THREE.Color('#ff4500'),
      new THREE.Color('#00ff66'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#ffffff'),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 12 + Math.random() * 45;

      pos[i3] = Math.cos(angle) * radius;
      pos[i3 + 1] = Math.sin(angle) * radius;
      pos[i3 + 2] = 850 - Math.random() * 1700;

      const c = palette[Math.floor(Math.random() * palette.length)];
      cols[i3] = c.r;
      cols[i3 + 1] = c.g;
      cols[i3 + 2] = c.b;
    }

    return { pos, cols };
  }, []);

  const trajectories = useMemo(() => {
    const list: THREE.Vector3[][] = [];
    for (let t = 0; t < 8; t++) {
      const pts: THREE.Vector3[] = [];
      const baseAngle = (t / 8) * Math.PI * 2;
      const radius = 22 + (t % 3) * 6;
      for (let z = 850; z >= -850; z -= 30) {
        const spiralAngle = baseAngle + z * 0.004;
        pts.push(
          new THREE.Vector3(
            Math.cos(spiralAngle) * radius,
            Math.sin(spiralAngle) * radius,
            z
          )
        );
      }
      list.push(pts);
    }
    return list;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.z = t * 0.03;
    }
    if (trajectoriesRef.current) {
      trajectoriesRef.current.rotation.z = -t * 0.015;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleData.pos, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleData.cols, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <group ref={trajectoriesRef}>
        {trajectories.map((pts, idx) => {
          const curve = new THREE.CatmullRomCurve3(pts);
          const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.08, 4, false);
          return (
            <mesh key={idx} geometry={tubeGeo}>
              <meshBasicMaterial
                color={idx % 2 === 0 ? '#00ff66' : '#38bdf8'}
                wireframe
                transparent
                opacity={0.25}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

/**
 * Camera Controller
 */
function CameraController({ cameraZRef }: { cameraZRef: React.MutableRefObject<number> }) {
  useFrame(({ camera }) => {
    camera.position.z = cameraZRef.current;
    const time = Date.now() * 0.001;
    camera.position.x = Math.sin(time * 0.8) * 0.3;
    camera.position.y = Math.cos(time * 0.6) * 0.2;
    camera.lookAt(0, 0, cameraZRef.current - 100);
  });
  return null;
}

/**
 * 2D Canvas Fallback
 */
function Fallback2DCanvas({
  cameraZ,
  activeStationIdx,
}: {
  cameraZ: number;
  activeStationIdx: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const particles = Array.from({ length: 900 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 40 + Math.random() * 220;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: 850 - Math.random() * 1600,
        color: ['#38bdf8', '#00ff66', '#ff4500', '#a855f7', '#ffffff'][
          Math.floor(Math.random() * 5)
        ],
      };
    });

    const render = () => {
      const w = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
      const h = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);
      const cx = w / 2;
      const cy = h / 2;
      const fov = 350;

      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const relZ = cameraZ - p.z;
        if (relZ <= 10 || relZ > 1400) continue;

        const scale = fov / relZ;
        const sx = cx + p.x * scale;
        const sy = cy + p.y * scale;

        if (sx < 0 || sx > w || sy < 0 || sy > h) continue;

        const alpha = Math.min(1, Math.max(0.1, 1 - relZ / 1200));
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0.8, 2.5 * scale), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.7;
        ctx.fill();
      }

      STATIONS.forEach((st, sIdx) => {
        const cap = CAPABILITIES[sIdx];
        const dist = cameraZ - st.sweetZ;
        const absDist = Math.abs(dist);

        let alpha = 0;
        if (dist > 0) {
          alpha = THREE.MathUtils.clamp(1 - (dist - 40) / 240, 0, 1);
        } else {
          alpha = THREE.MathUtils.clamp(1 - -dist / 160, 0, 1);
        }
        if (alpha <= 0.02) return;

        const scatter = THREE.MathUtils.clamp((absDist - 28) / 100, 0, 1);
        const sign = sIdx % 2 === 0 ? 1 : -1;

        const blocks = [
          {
            text: `DİSİPLİN ${cap.index}`,
            x: -280 + 120 * scatter * sign,
            y: -120 + 60 * scatter,
            font: 'bold 13px monospace',
            color: st.color,
          },
          {
            text: cap.title,
            x: -280 - 160 * scatter * sign,
            y: -80 - 80 * scatter,
            font: '900 32px monospace',
            color: '#ffffff',
          },
          {
            text: cap.tagline,
            x: -280 + 140 * scatter * sign,
            y: -40 - 100 * scatter,
            font: 'bold 14px monospace',
            color: st.color,
          },
          {
            text: cap.description,
            x: -280 - 130 * scatter * sign,
            y: 0 + 90 * scatter,
            font: '13px monospace',
            color: '#cbd5e1',
          },
          {
            text: cap.technologies.join('  /  '),
            x: -280 + 150 * scatter * sign,
            y: 90 - 120 * scatter,
            font: '11px monospace',
            color: '#94a3b8',
          },
          {
            text: `${cap.systemMetric} ${cap.systemMetricLabel}`,
            x: 180 - 120 * scatter * sign,
            y: -40 + 80 * scatter,
            font: 'bold 24px monospace',
            color: '#ffffff',
          },
        ];

        blocks.forEach((b) => {
          ctx.font = b.font;
          ctx.fillStyle = b.color;
          ctx.globalAlpha = alpha;
          ctx.fillText(b.text, cx + b.x, cy + b.y);
        });
      });

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [cameraZ]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}

/**
 * Main SpatialTunnel Component
 */
export default function SpatialTunnel() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cameraZRef = useRef<number>(720);

  const [activeStage, setActiveStage] = useState<number>(0);
  const [cameraZDisplay, setCameraZDisplay] = useState<number>(720);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=3800',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        const prog = self.progress;
        const z = THREE.MathUtils.lerp(720, -720, prog);
        cameraZRef.current = z;
        setCameraZDisplay(Math.round(z));

        let closestIdx = 0;
        let minDist = 999999;
        STATIONS.forEach((st, idx) => {
          const d = Math.abs(z - st.sweetZ);
          if (d < minDist) {
            minDist = d;
            closestIdx = idx;
          }
        });

        setActiveStage(closestIdx);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const jumpToStage = (idx: number) => {
    setActiveStage(idx);
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const stZ = STATIONS[idx].sweetZ;
    const progressTarget = (720 - stZ) / (720 - (-720));
    const targetScroll = containerTop + progressTarget * 3800;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  const activeColor = STATIONS[activeStage]?.color || '#00FF66';

  return (
    <section
      id="capabilities"
      ref={containerRef}
      className="relative w-full h-screen bg-[#070709] border-b border-white/10 overflow-hidden select-none"
    >
      {/* 3D R3F Canvas / 2D Space */}
      <div className="absolute inset-0 z-0">
        {hasWebGL ? (
          <Canvas
            camera={{ position: [0, 0, 720], fov: 50, near: 0.1, far: 2000 }}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            onCreated={({ scene }) => {
              scene.background = new THREE.Color('#070709');
              scene.fog = new THREE.FogExp2('#070709', 0.0016);
            }}
          >
            <ambientLight intensity={1.2} />
            <pointLight position={[20, 20, 400]} intensity={1.5} color={activeColor} />
            
            <CameraController cameraZRef={cameraZRef} />
            <ParticleStarfield cameraZRef={cameraZRef} />

            {CAPABILITIES.map((cap, idx) => (
              <AnamorphicStation
                key={cap.id}
                data={cap}
                sweetZ={STATIONS[idx].sweetZ}
                color={STATIONS[idx].color}
                cameraZRef={cameraZRef}
                stationIndex={idx}
              />
            ))}
          </Canvas>
        ) : (
          <Fallback2DCanvas cameraZ={cameraZDisplay} activeStationIdx={activeStage} />
        )}
      </div>

      {/* Clean Top Navigation Bar */}
      <div className="relative z-20 w-full bg-[#070709]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span
            className="w-2.5 h-2.5 transition-colors duration-300"
            style={{ backgroundColor: activeColor }}
          />
          <span className="text-white font-bold tracking-widest uppercase">
            Mühendislik Disiplinleri
          </span>
        </div>

        {/* Clean Station Switcher Buttons */}
        <div className="flex items-center gap-2">
          {CAPABILITIES.map((cap, idx) => (
            <button
              key={cap.id}
              onClick={() => jumpToStage(idx)}
              className={`px-3 py-1.5 border text-xs font-mono cursor-pointer flex items-center gap-1.5 transition-all duration-200 ${
                activeStage === idx
                  ? 'text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                  : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/30 bg-black/40'
              }`}
              style={{
                borderColor: activeStage === idx ? STATIONS[idx].color : undefined,
                backgroundColor: activeStage === idx ? STATIONS[idx].color : undefined,
              }}
            >
              <span>{cap.index}.</span>
              <span>{cap.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subtle Bottom Scroll Cue */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none text-xs font-mono">
        <div className="flex items-center gap-2.5 text-zinc-400 bg-black/60 px-4 py-2 border border-white/10 backdrop-blur-sm">
          <ChevronDown className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span>Aşağı kaydırarak disiplinler arasında gezinin</span>
        </div>
      </div>
    </section>
  );
}
