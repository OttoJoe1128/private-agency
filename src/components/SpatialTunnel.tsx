import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Capability } from '../types/index.ts';
import { ChevronDown, Crosshair, ArrowRight, Compass } from 'lucide-react';
import { isWebGLSupported } from '../utils/webgl.ts';
import SafeWebGLBoundary from './SafeWebGLBoundary.tsx';
import { sound } from '../utils/soundEngine.ts';

gsap.registerPlugin(ScrollTrigger);

export const CAPABILITIES: Capability[] = [
  {
    id: 'digital-ecosystems',
    index: '01',
    title: 'COMPLEX DIGITAL ECOSYSTEMS',
    tagline: 'Dağıtık Sunucu Mimarileri & Yüksek Veri Trafiği',
    technologies: ['FastAPI', 'Go', 'Firebase', 'PostgreSQL', 'Docker', 'Redis', 'WebSockets'],
    description:
      'Gereksiz katmanlardan arındırılmış, deterministik ve yüksek eşzamanlı veri hatları. Mikroservisler, coroutine kuyrukları ve kesintisiz senkronizasyon ile sıfır veri kaybı.',
    architecturePoints: [
      'Pydantic v2 doğrulamalı FastAPI & Go mikroservisleri',
      'PostgreSQL bağlantı havuzlama & Redis önbelleği',
      'Canlı kullanıcı ve durum senkronizasyonu',
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
      'Ana iş parçacığını bloke etmeyen mimarilerle akıcı mekânsal deneyimler. Matematiksel kamera projeksiyonları ve GPU hızlandırmalı shader görselleştirmeleri.',
    architecturePoints: [
      'Web Worker & OffscreenCanvas izolasyonu',
      'Optimize BufferGeometry ve instanced çizim hatları',
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
      'Yazılımı fiziksel dünyaya taşıyan endüstriyel sensör hatları, diferansiyel sinyal kablolamaları ve mikrodenetleyici düzeyinde deterministik gömülü sistemler.',
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

// Stations positioned along the deep Z-axis corridor
export const STATIONS = [
  { sweetZ: 600, color: '#38bdf8', label: 'Ecosystems' }, // Cyan
  { sweetZ: 200, color: '#a855f7', label: 'Spatial' },    // Purple
  { sweetZ: -200, color: '#ff4500', label: 'Hardware' },  // Industrial Orange
  { sweetZ: -600, color: '#00ff66', label: 'Operations' },// Signal Green
];

interface StationProps {
  data: Capability;
  sweetZ: number;
  color: string;
  cameraZRef: React.MutableRefObject<number>;
  stationIndex: number;
}

/**
 * 3.1 & 3.2 Anamorphic Station with Drei <Text>
 * Words are dispersed across deep 3D space (z = -12, -24, -38, -52...)
 * When camera hits sweet spot, perspective convergence locks them into a planar 2D composition!
 */
function AnamorphicStation({ data, sweetZ, color, cameraZRef, stationIndex }: StationProps) {
  const groupRef = useRef<THREE.Group | null>(null);

  // Individual refs for dispersed words
  const words = useMemo(() => data.title.split(' '), [data.title]);
  const wordRefs = useRef<(THREE.Group | null)[]>([]);

  const indexRef = useRef<THREE.Group | null>(null);
  const taglineRef = useRef<THREE.Group | null>(null);
  const descRef = useRef<THREE.Group | null>(null);
  const techRef = useRef<THREE.Group | null>(null);
  const metricRef = useRef<THREE.Group | null>(null);
  const reticleRef = useRef<THREE.Group | null>(null);

  // Anamorphic Word Configuration:
  // Each word has an intended locked planar 2D position (x, y) relative to sweet spot,
  // and a true resting 3D depth zOffset.
  // Perspective projection formula: X_screen = X_target * (zOffset / referenceDepth).
  // When camera is not at sweetZ, non-linear scatter and rotation explode the layout in 3D.
  const wordConfigs = useMemo(() => {
    // Generate individual word coordinates
    let startX = -8.5;
    const depths = [14, 26, 38, 50];
    return words.map((w, i) => {
      const zOffset = depths[i % depths.length];
      const cfg = {
        word: w,
        x: startX,
        y: 2.8,
        zOffset,
        size: 1.1,
        dx: (stationIndex % 2 === 0 ? 1 : -1) * (18 + i * 8),
        dy: (i % 2 === 0 ? 1 : -1) * (10 + i * 5),
        rotX: (i % 2 === 0 ? 0.8 : -0.7),
        rotY: (stationIndex % 2 === 0 ? 0.9 : -0.8),
        rotZ: (i % 2 === 0 ? -0.5 : 0.6),
      };
      startX += w.length * 0.95 + 1.2;
      return cfg;
    });
  }, [words, stationIndex]);

  const chaos = useMemo(() => {
    const sign = stationIndex % 2 === 0 ? 1 : -1;
    return {
      index: { dx: 16 * sign, dy: 8, rotY: 0.7 * sign, rotZ: 0.4 },
      tagline: { dx: 14 * sign, dy: -10, rotY: 0.8 * sign, rotZ: 0.5 },
      desc: { dx: -18 * sign, dy: 12, rotY: -0.6 * sign, rotZ: -0.3 },
      tech: { dx: 18 * sign, dy: -14, rotY: 0.9 * sign, rotZ: 0.6 },
      metric: { dx: -16 * sign, dy: 14, rotY: -0.8 * sign, rotZ: 0.4 },
    };
  }, [stationIndex]);

  useFrame(() => {
    const camZ = cameraZRef.current;
    const dist = camZ - sweetZ;
    const absDist = Math.abs(dist);

    // Visibility range
    let masterAlpha = 0;
    if (dist > 0) {
      masterAlpha = THREE.MathUtils.clamp(1 - (dist - 50) / 280, 0, 1);
    } else {
      // Fly-through: letters part and fly past
      masterAlpha = THREE.MathUtils.clamp(1 - (-dist) / 180, 0, 1);
    }

    if (groupRef.current) {
      groupRef.current.visible = masterAlpha > 0.01;
    }

    // Anamorphic Sweet Spot Window
    const sweetWindow = 32;
    const scatter = THREE.MathUtils.clamp((absDist - sweetWindow) / 120, 0, 1);

    // Fly-through expansion when camera passes behind the sweet spot
    const flyThrough = dist < -10 ? Math.min(3.5, (-dist) / 40) : 0;

    // Update each word individually in 3D space
    wordConfigs.forEach((cfg, idx) => {
      const ref = wordRefs.current[idx];
      if (!ref) return;

      const depthRatio = cfg.zOffset / 26;
      const targetX = cfg.x * depthRatio;
      const targetY = cfg.y * depthRatio;
      const targetZ = -cfg.zOffset;

      // Apply fly-through outward burst when camera penetrates
      const flyX = (cfg.x < 0 ? -1 : 1) * flyThrough * 6;
      const flyY = (cfg.y < 0 ? -1 : 1) * flyThrough * 4;

      ref.position.x = targetX + cfg.dx * scatter + flyX;
      ref.position.y = targetY + cfg.dy * scatter + flyY;
      ref.position.z = targetZ + (cfg.dx * 0.4) * scatter;

      ref.rotation.x = cfg.rotX * scatter;
      ref.rotation.y = cfg.rotY * scatter;
      ref.rotation.z = cfg.rotZ * scatter;
    });

    // Helper for other blocks
    const updateBlock = (
      ref: React.MutableRefObject<THREE.Group | null>,
      coords: { x: number; y: number; zOffset: number },
      ch: { dx: number; dy: number; rotY: number; rotZ: number }
    ) => {
      if (!ref.current) return;
      const depthRatio = coords.zOffset / 26;
      const targetX = coords.x * depthRatio;
      const targetY = coords.y * depthRatio;
      const targetZ = -coords.zOffset;

      const flyX = (coords.x < 0 ? -1 : 1) * flyThrough * 8;
      const flyY = (coords.y < 0 ? -1 : 1) * flyThrough * 6;

      ref.current.position.x = targetX + ch.dx * scatter + flyX;
      ref.current.position.y = targetY + ch.dy * scatter + flyY;
      ref.current.position.z = targetZ + (ch.dx * 0.35) * scatter;

      ref.current.rotation.y = ch.rotY * scatter;
      ref.current.rotation.z = ch.rotZ * scatter;
      ref.current.rotation.x = (ch.rotY * 0.4) * scatter;
    };

    updateBlock(indexRef, { x: -8.5, y: 5.2, zOffset: 14 }, chaos.index);
    updateBlock(taglineRef, { x: -8.5, y: 0.9, zOffset: 34 }, chaos.tagline);
    updateBlock(descRef, { x: -8.5, y: -1.4, zOffset: 42 }, chaos.desc);
    updateBlock(techRef, { x: -8.5, y: -4.0, zOffset: 52 }, chaos.tech);
    updateBlock(metricRef, { x: 6.2, y: 0.0, zOffset: 30 }, chaos.metric);

    // Reticle brackets converge to 0 at sweet spot
    if (reticleRef.current) {
      const reticleScale = 1 + scatter * 2.5 + flyThrough * 2;
      reticleRef.current.scale.set(reticleScale, reticleScale, 1);
      reticleRef.current.rotation.z = scatter * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, sweetZ]}>
      {/* 1. Station Index Tag */}
      <group ref={indexRef}>
        <Text
          fontSize={0.65}
          color={color}
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.16}
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_al061wqUwwwO7VkQ.woff2"
        >
          {`DİSİPLİN ${data.index} // SPATIAL ARCHITECTURE`}
        </Text>
      </group>

      {/* 2. Dispersed Anamorphic Words */}
      {wordConfigs.map((cfg, idx) => (
        <group
          key={idx}
          ref={(el) => {
            wordRefs.current[idx] = el;
          }}
        >
          <Text
            fontSize={cfg.size}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.06}
            font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_al061wqUwwwO7VkQ.woff2"
          >
            {cfg.word}
          </Text>
        </group>
      ))}

      {/* 3. Subtitle / Tagline */}
      <group ref={taglineRef}>
        <Text
          fontSize={0.48}
          color={color}
          anchorX="left"
          anchorY="middle"
          maxWidth={18}
          letterSpacing={0.08}
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_al061wqUwwwO7VkQ.woff2"
        >
          {data.tagline}
        </Text>
      </group>

      {/* 4. Description Paragraph */}
      <group ref={descRef}>
        <Text
          fontSize={0.38}
          color="#cbd5e1"
          anchorX="left"
          anchorY="top"
          maxWidth={16}
          lineHeight={1.45}
          letterSpacing={0.02}
        >
          {data.description}
        </Text>
      </group>

      {/* 5. Technologies */}
      <group ref={techRef}>
        <Text
          fontSize={0.32}
          color="#94a3b8"
          anchorX="left"
          anchorY="middle"
          maxWidth={17}
          letterSpacing={0.1}
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_al061wqUwwwO7VkQ.woff2"
        >
          {data.technologies.join('  //  ')}
        </Text>
      </group>

      {/* 6. Metric Monolith & Structural Wireframe */}
      <group ref={metricRef}>
        <Text
          fontSize={1.1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_al061wqUwwwO7VkQ.woff2"
        >
          {data.systemMetric}
        </Text>
        <Text
          position={[0, -1.3, 0]}
          fontSize={0.28}
          color={color}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.16}
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_al061wqUwwwO7VkQ.woff2"
        >
          {data.systemMetricLabel}
        </Text>
        <lineSegments position={[0, -0.4, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(6.4, 4.8, 2.0)]} />
          <lineBasicMaterial color={color} transparent opacity={0.35} />
        </lineSegments>
      </group>

      {/* 7. Anamorphic Reticle Brackets (Locks into frame at Sweet Spot) */}
      <group ref={reticleRef} position={[-0.5, 0.4, -28]}>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(19.5, 12.5, 0.1)]} />
          <lineBasicMaterial color={color} transparent opacity={0.2} />
        </lineSegments>
      </group>
    </group>
  );
}

/**
 * 3D Warp Rings & Particle Speedfield along Z-axis
 */
function WarpTunnelLattice({ cameraZRef }: { cameraZRef: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points | null>(null);
  const ringsRef = useRef<THREE.Group | null>(null);

  // Volumetric Starfield
  const particleData = useMemo(() => {
    const count = 3500;
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
      const radius = 10 + Math.random() * 55;

      pos[i3] = Math.cos(angle) * radius;
      pos[i3 + 1] = Math.sin(angle) * radius;
      pos[i3 + 2] = 850 - Math.random() * 1750;

      const c = palette[Math.floor(Math.random() * palette.length)];
      cols[i3] = c.r;
      cols[i3 + 1] = c.g;
      cols[i3 + 2] = c.b;
    }

    return { pos, cols };
  }, []);

  // Hexagonal Warp Rings at intervals along Z
  const ringDepths = useMemo(() => {
    const zList: number[] = [];
    for (let z = 800; z >= -800; z -= 80) {
      zList.push(z);
    }
    return zList;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.z = t * 0.02;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z = -t * 0.01;
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
          size={0.16}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <group ref={ringsRef}>
        {ringDepths.map((z, idx) => (
          <group key={idx} position={[0, 0, z]}>
            <lineLoop>
              <ringGeometry args={[18, 18.05, 6]} />
              <lineBasicMaterial
                color={idx % 2 === 0 ? '#38bdf8' : '#00ff66'}
                transparent
                opacity={0.12}
              />
            </lineLoop>
          </group>
        ))}
      </group>
    </>
  );
}

/**
 * Camera Controller driven by ScrollTrigger progress
 */
function CameraController({ cameraZRef }: { cameraZRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();

  useFrame(() => {
    const z = cameraZRef.current;
    camera.position.z = z;
    const time = Date.now() * 0.001;
    camera.position.x = Math.sin(time * 0.7) * 0.35;
    camera.position.y = Math.cos(time * 0.5) * 0.25;
    camera.lookAt(0, 0, z - 100);
  });

  return null;
}

/**
 * High-Fidelity 2D Canvas Fallback (Used when WebGL context cannot be created)
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
      const radius = 40 + Math.random() * 240;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: 850 - Math.random() * 1700,
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
      const fov = 380;

      ctx.fillStyle = '#070709';
      ctx.fillRect(0, 0, w, h);

      // Starfield particles
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
        ctx.arc(sx, sy, Math.max(0.8, 2.8 * scale), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.7;
        ctx.fill();
      }

      // Anamorphic stations in 2D perspective
      STATIONS.forEach((st, sIdx) => {
        const cap = CAPABILITIES[sIdx];
        const dist = cameraZ - st.sweetZ;
        const absDist = Math.abs(dist);

        let alpha = 0;
        if (dist > 0) {
          alpha = THREE.MathUtils.clamp(1 - (dist - 50) / 280, 0, 1);
        } else {
          alpha = THREE.MathUtils.clamp(1 - (-dist) / 180, 0, 1);
        }
        if (alpha <= 0.02) return;

        const scatter = THREE.MathUtils.clamp((absDist - 32) / 120, 0, 1);
        const sign = sIdx % 2 === 0 ? 1 : -1;

        // Dispersed title words
        const words = cap.title.split(' ');
        let curX = -320;

        ctx.globalAlpha = alpha;

        // Station index
        ctx.font = 'bold 13px monospace';
        ctx.fillStyle = st.color;
        ctx.fillText(
          `DİSİPLİN ${cap.index} // SPATIAL ARCHITECTURE`,
          cx - 320 + 130 * scatter * sign,
          cy - 120 + 60 * scatter
        );

        // Anamorphic words
        words.forEach((w, wIdx) => {
          const wScatterX = (wIdx % 2 === 0 ? 1 : -1) * (140 + wIdx * 40) * scatter;
          const wScatterY = (wIdx % 2 === 0 ? -1 : 1) * (80 + wIdx * 25) * scatter;

          ctx.font = '900 34px monospace';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(w, cx + curX + wScatterX, cy - 60 + wScatterY);

          curX += ctx.measureText(w).width + 16;
        });

        // Tagline
        ctx.font = 'bold 15px monospace';
        ctx.fillStyle = st.color;
        ctx.fillText(
          cap.tagline,
          cx - 320 + 150 * scatter * sign,
          cy - 15 - 90 * scatter
        );

        // Description
        ctx.font = '14px monospace';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(
          cap.description.substring(0, 75) + '...',
          cx - 320 - 140 * scatter * sign,
          cy + 25 + 80 * scatter
        );

        // Technologies
        ctx.font = '12px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(
          cap.technologies.join('  //  '),
          cx - 320 + 160 * scatter * sign,
          cy + 75 - 110 * scatter
        );

        // Metric
        ctx.font = 'bold 28px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(
          cap.systemMetric,
          cx + 220 - 130 * scatter * sign,
          cy - 40 + 70 * scatter
        );
        ctx.font = '11px monospace';
        ctx.fillStyle = st.color;
        ctx.fillText(
          cap.systemMetricLabel,
          cx + 220 - 130 * scatter * sign,
          cy - 15 + 70 * scatter
        );
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
 * Main SpatialTunnel Component (Step 3: Anamorphic Z-Axis Spatial Corridor)
 */
export default function SpatialTunnel() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cameraZRef = useRef<number>(750);

  const [activeStage, setActiveStage] = useState<number>(0);
  const [cameraZDisplay, setCameraZDisplay] = useState<number>(750);
  const [alignmentPercent, setAlignmentPercent] = useState<number>(0);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  const lastLockedRef = useRef<number>(-1);

  useEffect(() => {
    setHasWebGL(isWebGLSupported());
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=4200',
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
      onUpdate: (self) => {
        const prog = self.progress;
        // Travel from z = 750 (before first station) to z = -750 (past last station)
        const z = THREE.MathUtils.lerp(750, -750, prog);
        cameraZRef.current = z;
        setCameraZDisplay(Math.round(z));

        // Determine closest station and calculate alignment %
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

        // Alignment lock calculation (100% when within sweet spot window)
        const lockWindow = 32;
        const scatterRange = 120;
        let lockPct = 0;
        if (minDist <= lockWindow) {
          lockPct = 100;
          if (lastLockedRef.current !== closestIdx) {
            lastLockedRef.current = closestIdx;
            sound.playWarp();
          }
        } else {
          lockPct = Math.round(
            Math.max(0, 100 - ((minDist - lockWindow) / scatterRange) * 100)
          );
          if (minDist > lockWindow + 50) {
            lastLockedRef.current = -1;
          }
        }
        setAlignmentPercent(lockPct);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const jumpToStage = (idx: number) => {
    setActiveStage(idx);
    sound.playClick();
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const stZ = STATIONS[idx].sweetZ;
    const progressTarget = (750 - stZ) / (750 - -750);
    const targetScroll = containerTop + progressTarget * 4200;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  const activeColor = STATIONS[activeStage]?.color || '#00FF66';
  const isLocked = alignmentPercent >= 95;

  return (
    <section
      id="capabilities"
      ref={containerRef}
      className="relative w-full h-screen bg-[#070709] overflow-hidden select-none"
    >
      {/* 3D R3F Canvas / Resilient 2D Fallback */}
      <div className="absolute inset-0 z-0">
        {hasWebGL ? (
          <SafeWebGLBoundary
            fallback={
              <Fallback2DCanvas
                cameraZ={cameraZDisplay}
                activeStationIdx={activeStage}
              />
            }
          >
            <Canvas
              camera={{ position: [0, 0, 750], fov: 50, near: 0.1, far: 2400 }}
              gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
              onCreated={({ scene }) => {
                scene.background = new THREE.Color('#070709');
                scene.fog = new THREE.FogExp2('#070709', 0.0014);
              }}
            >
              <ambientLight intensity={1.4} />
              <pointLight
                position={[20, 20, cameraZRef.current - 40]}
                intensity={1.8}
                color={activeColor}
              />

              <CameraController cameraZRef={cameraZRef} />
              <WarpTunnelLattice cameraZRef={cameraZRef} />

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
          </SafeWebGLBoundary>
        ) : (
          <Fallback2DCanvas
            cameraZ={cameraZDisplay}
            activeStationIdx={activeStage}
          />
        )}
      </div>

      {/* Top Telemetry & Station Switcher (Clean, Zero-Pill Architecture) */}
      <div className="relative z-20 w-full bg-[#070709]/85 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span
            className="w-2.5 h-2.5 transition-colors duration-300"
            style={{ backgroundColor: activeColor }}
          />
          <span className="text-white font-bold tracking-widest uppercase">
            Mühendislik Disiplinleri — 3D Anamorfik Portal
          </span>
        </div>

        {/* Dynamic Anamorphic Alignment State Indicator */}
        <div className="hidden md:flex items-center gap-4 text-zinc-400">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-zinc-500" />
            <span>Z-DERİNLİK: <strong className="text-white">{cameraZDisplay}m</strong></span>
          </div>
          <div className="h-3 w-px bg-white/15" />
          <div className="flex items-center gap-2">
            <Crosshair
              className={`w-3.5 h-3.5 transition-colors ${
                isLocked ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'
              }`}
            />
            <span>
              HİZALAMA KİLİDİ:{' '}
              <strong
                className={
                  isLocked
                    ? 'text-emerald-400 font-bold'
                    : 'text-amber-400 font-normal'
                }
              >
                %{alignmentPercent} {isLocked ? '[SWEET SPOT]' : ''}
              </strong>
            </span>
          </div>
        </div>

        {/* Station Navigation Switcher */}
        <div className="flex items-center gap-2">
          {CAPABILITIES.map((cap, idx) => (
            <button
              key={cap.id}
              onClick={() => jumpToStage(idx)}
              onMouseEnter={() => sound.playHover()}
              className={`px-3 py-1.5 text-xs font-mono cursor-pointer flex items-center gap-1.5 transition-all duration-200 ${
                activeStage === idx
                  ? 'text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                  : 'text-zinc-400 hover:text-white bg-black/40'
              }`}
              style={{
                borderColor: activeStage === idx ? STATIONS[idx].color : undefined,
                backgroundColor: activeStage === idx ? STATIONS[idx].color : undefined,
              }}
            >
              <span>{cap.index}.</span>
              <span>{STATIONS[idx].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sweet Spot Status Banner in Mobile/Subtle Footer */}
      <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none flex items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2.5 text-zinc-400 bg-black/70 px-4 py-2 backdrop-blur-sm">
          <ChevronDown className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span>Kaydırmaya devam ederek harflerin arasından geçin</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-zinc-400 bg-black/70 px-4 py-2 backdrop-blur-sm">
          <span className="text-zinc-500">Mevcut İstasyon:</span>
          <span className="text-white font-bold">{CAPABILITIES[activeStage].title}</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400 ml-1" />
        </div>
      </div>
    </section>
  );
}
