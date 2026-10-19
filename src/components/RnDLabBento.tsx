import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cpu, Activity, Share2, Sparkles } from 'lucide-react';
import { isWebGLSupported } from '../utils/webgl.ts';
import SafeWebGLBoundary from './SafeWebGLBoundary.tsx';

/**
 * 1. Procedural 3D ESP32 Microcontroller Model (R3F)
 */
function ESP32BoardMesh() {
  const boardRef = useRef<THREE.Group | null>(null);

  useFrame(({ pointer }, delta) => {
    if (!boardRef.current) return;
    const targetRotX = 0.6 + pointer.y * 0.35;
    const targetRotY = -0.5 + pointer.x * 0.45;
    boardRef.current.rotation.x = THREE.MathUtils.damp(boardRef.current.rotation.x, targetRotX, 4, delta);
    boardRef.current.rotation.y = THREE.MathUtils.damp(boardRef.current.rotation.y, targetRotY, 4, delta);
  });

  const pins = useMemo(() => {
    const list: [number, number, number][] = [];
    for (let i = -7; i <= 7; i++) {
      list.push([-1.75, 0.12, i * 0.28]);
      list.push([1.75, 0.12, i * 0.28]);
    }
    return list;
  }, []);

  return (
    <group ref={boardRef} scale={1.2}>
      {/* 1. Main PCB Board */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.8, 0.12, 5.2]} />
        <meshStandardMaterial color="#061f12" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* 2. ESP-WROOM Metal Shielding Can */}
      <mesh castShadow position={[0, 0.18, -0.6]}>
        <boxGeometry args={[2.2, 0.22, 2.4]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.88} roughness={0.2} />
      </mesh>

      {/* 3. PCB Gold Antenna Trace Area */}
      <mesh position={[0, 0.08, -2.1]}>
        <boxGeometry args={[1.8, 0.04, 0.7]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* 4. USB Type-C Connector Port */}
      <mesh castShadow position={[0, 0.18, 2.5]}>
        <boxGeometry args={[1.1, 0.32, 0.6]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* 5. Dual In-Line Pin Headers */}
      {pins.map(([px, py, pz], pIdx) => (
        <group key={pIdx} position={[px, py, pz]}>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.22, 0.16, 0.24]} />
            <meshStandardMaterial color="#111827" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.32, 6]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* 6. Onboard Status LEDs */}
      <mesh position={[-0.8, 0.12, 1.2]}>
        <boxGeometry args={[0.15, 0.08, 0.15]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.5, 0.12, 1.2]}>
        <boxGeometry args={[0.15, 0.08, 0.15]} />
        <meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={0.9} />
      </mesh>

      {/* 7. Reset & Boot Switches */}
      <mesh position={[-1.2, 0.14, 2.1]}>
        <boxGeometry args={[0.3, 0.18, 0.3]} />
        <meshStandardMaterial color="#475569" metalness={0.6} />
      </mesh>
      <mesh position={[1.2, 0.14, 2.1]}>
        <boxGeometry args={[0.3, 0.18, 0.3]} />
        <meshStandardMaterial color="#475569" metalness={0.6} />
      </mesh>
    </group>
  );
}

/**
 * 2D Canvas Schematic Fallback for ESP32
 */
function ESP32SchematicFallback() {
  return (
    <div className="w-full h-full bg-[#05070a] p-4 flex flex-col items-center justify-center font-mono select-none">
      <div className="w-[180px] h-[210px] bg-[#072415] border-2 border-emerald-500/40 relative shadow-lg flex flex-col items-center justify-between p-2">
        {/* Antenna */}
        <div className="w-[120px] h-[24px] border border-amber-500/60 bg-amber-950/30 flex items-center justify-center text-[9px] text-amber-400">
          WIFI / BLE ANTENNA
        </div>
        {/* Metal Can */}
        <div className="w-[110px] h-[90px] bg-zinc-800 border border-zinc-500 flex flex-col items-center justify-center text-center p-1 my-1">
          <span className="text-white text-[11px] font-bold">ESP-WROOM-32E</span>
          <span className="text-zinc-400 text-[8px] mt-0.5">240MHz Dual-Core</span>
          <span className="text-emerald-400 text-[8px] mt-0.5">RS485 RTU DRIVER</span>
        </div>
        {/* USB Port & LEDs */}
        <div className="w-full flex items-center justify-between px-2">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" title="PWR" />
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="TX/RX" />
          </div>
          <div className="w-10 h-3 bg-zinc-600 border border-zinc-400 text-[7px] text-center text-zinc-300">
            USB-C
          </div>
        </div>

        {/* Pin Labels along Left and Right */}
        <div className="absolute -left-3 top-6 bottom-6 flex flex-col justify-between">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="w-2 h-1 bg-amber-400 rounded-none" />
          ))}
        </div>
        <div className="absolute -right-3 top-6 bottom-6 flex flex-col justify-between">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="w-2 h-1 bg-amber-400 rounded-none" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 2. Mouse-Interactive 2D Particle Simulation Canvas
 */
function ParticlePhysicsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles = Array.from({ length: 140 }, () => ({
      x: Math.random() * 400,
      y: Math.random() * 300,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 2 + 1.2,
      color: ['#00ff66', '#38bdf8', '#fbbf24', '#ffffff'][Math.floor(Math.random() * 4)],
    }));

    let mouseX = -1000;
    let mouseY = -1000;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', onMove);

    const render = () => {
      const w = (canvas.width = canvas.clientWidth || 360);
      const h = (canvas.height = canvas.clientHeight || 260);

      ctx.fillStyle = '#06070a';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < 90 && dist > 1) {
          p.x += (dx / dist) * 2.5;
          p.y += (dy / dist) * 2.5;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d2 = Math.hypot(p2.x - p.x, p2.y - p.y);
          if (d2 < 55) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.25 - d2 / 220})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />;
}

/**
 * 3. Asymmetric Bento Grid Component
 */
export default function RnDLabBento() {
  const [pulseCount, setPulseCount] = useState<number>(18240);
  const [canUseWebGL, setCanUseWebGL] = useState<boolean>(false);

  useEffect(() => {
    setCanUseWebGL(isWebGLSupported());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseCount((prev) => prev + Math.floor(Math.random() * 12) + 1);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full mt-10">
      <div className="flex items-center justify-between mb-6 pb-3">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight font-display">
            R&amp;D Mühendislik Laboratuvarı &amp; Donanım Bento
          </h3>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Gömülü sistemler, mikrodenetleyici donanım simülasyonları ve parçacık fiziği prototipleri.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Tile 1: 3D ESP32 Interactive Microcontroller Model (Span 5) */}
        <div className="lg:col-span-5 bg-[#080b10] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">ESP32-WROOM-32E Modeli</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">240MHz Xtensa LX6</span>
            </div>
            
            <p className="text-xs text-zinc-400 font-mono mb-4 leading-relaxed">
              Diferansiyel RS485 veri yolu ve FreeRTOS için tasarlanmış gömülü donanım mimarisi.
            </p>
          </div>

          <div className="w-full h-[240px] bg-[#05070a] relative overflow-hidden">
            {canUseWebGL ? (
              <SafeWebGLBoundary fallback={<ESP32SchematicFallback />}>
                <Canvas camera={{ position: [0, 4, 7], fov: 45 }}>
                  <ambientLight intensity={1.0} />
                  <directionalLight position={[5, 10, 5]} intensity={1.8} castShadow />
                  <pointLight position={[-6, 4, -4]} intensity={1.2} color="#00ff66" />
                  <pointLight position={[6, 4, 4]} intensity={0.9} color="#38bdf8" />
                  <ESP32BoardMesh />
                </Canvas>
                <div className="absolute bottom-2 right-2 text-[10px] font-mono text-zinc-500 pointer-events-none">
                  3D R3F / Damping Çevirme
                </div>
              </SafeWebGLBoundary>
            ) : (
              <ESP32SchematicFallback />
            )}
          </div>
        </div>

        {/* Tile 2: Mouse-Interactive Particle Simulation (Span 4) */}
        <div className="lg:col-span-4 bg-[#080b10] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-white">Etkileşimli Parçacık Simülasyonu</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">GPU Fizik Kuvvetleri</span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mb-4 leading-relaxed">
              İmleç pozisyonuna anlık tepki veren, hız ve sürtünme hesaplayan parçacık matrisi.
            </p>
          </div>

          <div className="w-full h-[240px] bg-[#05070a] relative overflow-hidden">
            <ParticlePhysicsCanvas />
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-zinc-500 pointer-events-none">
              İmleci hareket ettirerek itme kuvveti uygulayın
            </div>
          </div>
        </div>

        {/* Tile 3: Live Topology & Register Monitoring Strip (Span 3) */}
        <div className="lg:col-span-3 bg-[#080b10] p-5 flex flex-col justify-between font-mono text-xs">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4">
              <div className="flex items-center gap-2 text-zinc-300">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white">Düğüm Topolojisi</span>
              </div>
              <span className="text-emerald-400 font-bold text-[10px]">ÇALIŞIYOR</span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-[#05070a]">
                <span className="text-zinc-500 text-[10px] block mb-0.5">TOPLAM PAKET SAYACI</span>
                <span className="text-white text-base font-bold tabular-nums">
                  {pulseCount.toLocaleString()} pkt
                </span>
              </div>
              <div className="p-3 bg-[#05070a]">
                <span className="text-zinc-500 text-[10px] block mb-0.5">RS485 İLETİM HATTI</span>
                <span className="text-emerald-400 font-bold">120Ω Sonlandırma / 9600 Baud</span>
              </div>
              <div className="p-3 bg-[#05070a]">
                <span className="text-zinc-500 text-[10px] block mb-0.5">CPU ÇEKİRDEK GÖREVİ</span>
                <span className="text-sky-400 font-bold">Core 0: Network / Core 1: ISR</span>
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Protokol: Modbus-RTU</span>
            <span className="text-white font-bold">CRC16 OK</span>
          </div>
        </div>

      </div>
    </div>
  );
}
