import React, { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { isWebGLSupported } from '../utils/webgl.ts';
import SafeWebGLBoundary from './SafeWebGLBoundary.tsx';

interface DayData {
  date: string;
  contributionCount: number;
  weekday: number;
  color: string;
}

interface WeekData {
  contributionDays: DayData[];
}

interface MatrixProps {
  weeks: WeekData[];
}

function Monolith({
  day,
  x,
  z,
  onHover,
  isHovered,
}: {
  day: DayData;
  x: number;
  z: number;
  onHover: (day: DayData | null, pos?: [number, number, number]) => void;
  isHovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const count = day.contributionCount;

  const height = useMemo(() => {
    if (count === 0) return 0.22;
    return Math.min(4.8, 0.4 + count * 0.48);
  }, [count]);

  const color = useMemo(() => {
    if (count === 0) return '#18202c';
    if (count < 3) return '#0e5a36';
    if (count < 6) return '#10b981';
    if (count < 9) return '#34d399';
    return '#00ff66';
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetScaleY = isHovered ? 1.25 : 1.0;
    meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, targetScaleY, 8, delta);
  });

  return (
    <mesh
      ref={meshRef}
      position={[x, height / 2, z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(day, [x, height + 0.4, z]);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.55, height, 0.55]} />
      <meshStandardMaterial
        color={isHovered ? '#ffffff' : color}
        emissive={isHovered ? color : count > 0 ? color : '#000000'}
        emissiveIntensity={isHovered ? 0.7 : count > 5 ? 0.3 : 0.05}
        roughness={0.25}
        metalness={0.7}
      />
    </mesh>
  );
}

function MonolithGrid({ weeks }: { weeks: WeekData[] }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const [hoveredDay, setHoveredDay] = useState<{ day: DayData; pos: [number, number, number] } | null>(null);

  const weekCount = weeks.length || 52;
  const offsetX = (weekCount * 0.72) / 2;
  const offsetZ = (7 * 0.72) / 2;

  useFrame(({ pointer }, delta) => {
    if (!groupRef.current) return;
    const targetRotX = 0.55 + pointer.y * 0.12;
    const targetRotY = -0.45 + pointer.x * 0.15;
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4, delta);
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {weeks.map((week, wIdx) => {
        const x = wIdx * 0.72 - offsetX;
        return (
          <group key={wIdx}>
            {week.contributionDays.map((day, dIdx) => {
              const z = dIdx * 0.72 - offsetZ;
              const isHovered = hoveredDay?.day.date === day.date;
              return (
                <Monolith
                  key={day.date}
                  day={day}
                  x={x}
                  z={z}
                  isHovered={isHovered}
                  onHover={(d, pos) => {
                    if (d && pos) setHoveredDay({ day: d, pos });
                    else setHoveredDay(null);
                  }}
                />
              );
            })}
          </group>
        );
      })}

      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[weekCount * 0.75 + 1.5, 0.1, 7 * 0.75 + 1.5]} />
        <meshStandardMaterial color="#080b10" roughness={0.8} metalness={0.3} />
      </mesh>

      {hoveredDay && (
        <Html
          position={hoveredDay.pos}
          center
          distanceFactor={18}
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-[#05070a]/95 border border-white/20 px-3 py-2 text-xs font-mono text-white shadow-2xl backdrop-blur-md rounded-none whitespace-nowrap min-w-[130px]">
            <div className="text-[10px] text-zinc-500 font-normal">
              {hoveredDay.day.date}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-none bg-[#00FF66]" />
              <span className="font-bold text-white text-sm">
                {hoveredDay.day.contributionCount}
              </span>
              <span className="text-zinc-400 text-xs">
                {hoveredDay.day.contributionCount === 1 ? 'katkı' : 'katkı / commit'}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * High-Performance 2D Isometric Canvas Fallback
 * Guaranteed to render with 0% error even when WebGL is completely disabled in sandboxed browser
 */
function FallbackIsometricMatrix({ weeks }: { weeks: WeekData[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hovered, setHovered] = useState<{ day: DayData; x: number; y: number } | null>(null);

  const flatDays = useMemo(() => {
    const list: Array<{ day: DayData; w: number; d: number }> = [];
    weeks.forEach((w, wIdx) => {
      w.contributionDays.forEach((d, dIdx) => {
        list.push({ day: d, w: wIdx, d: dIdx });
      });
    });
    return list;
  }, [weeks]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = (canvas.width = canvas.clientWidth || 900);
      const height = (canvas.height = canvas.clientHeight || 400);

      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, width, height);

      const cellW = 12;
      const cellD = 12;
      const originX = width * 0.48;
      const originY = height * 0.35;

      // Render isometric pillars
      flatDays.forEach(({ day, w, d }) => {
        const count = day.contributionCount;
        const pillarH = count === 0 ? 3 : Math.min(60, 6 + count * 6);

        // Isometric coordinates
        const isoX = originX + (w - 22) * 11 - (d - 3) * 11;
        const isoY = originY + (w - 22) * 5.5 + (d - 3) * 5.5;

        const isHovered = hovered?.day.date === day.date;

        // Base color
        let topColor = '#18202c';
        let leftColor = '#0f141d';
        let rightColor = '#0b0f16';

        if (count > 0) {
          if (count < 3) {
            topColor = '#0e5a36'; leftColor = '#093a23'; rightColor = '#062919';
          } else if (count < 6) {
            topColor = '#10b981'; leftColor = '#059669'; rightColor = '#047857';
          } else if (count < 9) {
            topColor = '#34d399'; leftColor = '#10b981'; rightColor = '#059669';
          } else {
            topColor = '#00ff66'; leftColor = '#00cc52'; rightColor = '#00993d';
          }
        }

        if (isHovered) {
          topColor = '#ffffff';
          leftColor = '#e2e8f0';
          rightColor = '#cbd5e1';
        }

        // Draw Left Face
        ctx.fillStyle = leftColor;
        ctx.beginPath();
        ctx.moveTo(isoX - cellW / 2, isoY);
        ctx.lineTo(isoX, isoY + cellD / 2);
        ctx.lineTo(isoX, isoY + cellD / 2 - pillarH);
        ctx.lineTo(isoX - cellW / 2, isoY - pillarH);
        ctx.closePath();
        ctx.fill();

        // Draw Right Face
        ctx.fillStyle = rightColor;
        ctx.beginPath();
        ctx.moveTo(isoX, isoY + cellD / 2);
        ctx.lineTo(isoX + cellW / 2, isoY);
        ctx.lineTo(isoX + cellW / 2, isoY - pillarH);
        ctx.lineTo(isoX, isoY + cellD / 2 - pillarH);
        ctx.closePath();
        ctx.fill();

        // Draw Top Face
        ctx.fillStyle = topColor;
        ctx.beginPath();
        ctx.moveTo(isoX, isoY - cellD / 2 - pillarH);
        ctx.lineTo(isoX + cellW / 2, isoY - pillarH);
        ctx.lineTo(isoX, isoY + cellD / 2 - pillarH);
        ctx.lineTo(isoX - cellW / 2, isoY - pillarH);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const originX = rect.width * 0.48;
      const originY = rect.height * 0.35;

      let found: DayData | null = null;
      let foundPos = { x: 0, y: 0 };

      // Check reverse (front to back) for raycast hit
      for (let i = flatDays.length - 1; i >= 0; i--) {
        const { day, w, d } = flatDays[i];
        const count = day.contributionCount;
        const pillarH = count === 0 ? 3 : Math.min(60, 6 + count * 6);
        const isoX = originX + (w - 22) * 11 - (d - 3) * 11;
        const isoY = originY + (w - 22) * 5.5 + (d - 3) * 5.5 - pillarH;

        if (Math.abs(mx - isoX) < 8 && Math.abs(my - isoY) < 8) {
          found = day;
          foundPos = { x: isoX, y: isoY };
          break;
        }
      }

      if (found) {
        setHovered({ day: found, ...foundPos });
        render();
      } else if (hovered) {
        setHovered(null);
        render();
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [flatDays, hovered]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {hovered && (
        <div
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 bg-[#05070a]/95 border border-white/20 px-3 py-2 text-xs font-mono text-white shadow-2xl backdrop-blur-md whitespace-nowrap min-w-[130px]"
          style={{ left: hovered.x, top: hovered.y }}
        >
          <div className="text-[10px] text-zinc-500 font-normal">{hovered.day.date}</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-none bg-[#00FF66]" />
            <span className="font-bold text-white text-sm">{hovered.day.contributionCount}</span>
            <span className="text-zinc-400 text-xs">katkı / commit</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GitHub3DMatrix({ weeks }: MatrixProps) {
  const [canUseWebGL, setCanUseWebGL] = useState<boolean>(false);

  useEffect(() => {
    setCanUseWebGL(isWebGLSupported());
  }, []);

  const displayedWeeks = useMemo(() => {
    if (!weeks || weeks.length === 0) return [];
    return weeks.slice(-44);
  }, [weeks]);

  return (
    <div className="relative w-full h-[360px] md:h-[420px] bg-[#05070a] border border-white/10 overflow-hidden select-none">
      {canUseWebGL ? (
        <SafeWebGLBoundary fallback={<FallbackIsometricMatrix weeks={displayedWeeks} />}>
          <Canvas
            camera={{ position: [0, 14, 22], fov: 42, near: 0.1, far: 100 }}
            shadows
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <color attach="background" args={['#05070a']} />
            <ambientLight intensity={0.9} />
            <directionalLight
              position={[10, 20, 15]}
              intensity={1.8}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <pointLight position={[-15, 8, -10]} intensity={1.2} color="#00ff66" />
            <pointLight position={[15, 6, 10]} intensity={0.8} color="#38bdf8" />

            <MonolithGrid weeks={displayedWeeks} />
          </Canvas>
        </SafeWebGLBoundary>
      ) : (
        <FallbackIsometricMatrix weeks={displayedWeeks} />
      )}

      {/* Floating Viewport Legend */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 bg-black/60 px-3.5 py-2 border border-white/10 backdrop-blur-sm">
        <span className="text-white font-bold">3D Katkı Matrisi (365 Gün)</span>
        <span className="text-zinc-600">·</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-zinc-500">Az</span>
          <span className="w-2.5 h-2.5 bg-[#18202c]" />
          <span className="w-2.5 h-2.5 bg-[#0e5a36]" />
          <span className="w-2.5 h-2.5 bg-[#10b981]" />
          <span className="w-2.5 h-2.5 bg-[#00ff66]" />
          <span className="text-[10px] text-zinc-500">Çok</span>
        </div>
      </div>

      <div className="absolute bottom-3 right-4 z-10 text-[10px] font-mono text-zinc-500 hidden sm:block">
        Fareyi sütunların üzerine getirerek katkı ayrıntılarını inceleyin
      </div>
    </div>
  );
}
