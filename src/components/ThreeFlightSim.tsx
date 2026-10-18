import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Eye, Compass, Cpu, Layers } from 'lucide-react';

export default function ThreeFlightSim() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const [wireframe, setWireframe] = useState<boolean>(true);
  const [pitch, setPitch] = useState<number>(0);
  const [roll, setRoll] = useState<number>(0);
  const [altitude, setAltitude] = useState<number>(140);
  const [fps, setFps] = useState<number>(60);
  const [workerActive, setWorkerActive] = useState<boolean>(false);
  const [threadMode, setThreadMode] = useState<string>('DETECTING...');

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 500;
    const height = 320;

    canvas.width = width;
    canvas.height = height;

    const supportsOffscreen = 'transferControlToOffscreen' in canvas;

    if (supportsOffscreen) {
      try {
        const offscreen = canvas.transferControlToOffscreen();

        // Worker Script utilizing pure 3D wireframe matrix projection or Canvas2D/WebGL on the Worker thread
        const workerCode = `
          let ctx = null;
          let offscreenCanvas = null;
          let pitch = 0;
          let roll = 0;
          let altitude = 140;
          let wireframe = true;
          let frameCount = 0;
          let lastTime = performance.now();
          let animId = null;

          function renderScene(time) {
            frameCount++;
            if (time - lastTime >= 1000) {
              self.postMessage({ type: 'FPS', value: frameCount });
              frameCount = 0;
              lastTime = time;
            }

            if (!ctx) return;
            const w = offscreenCanvas.width;
            const h = offscreenCanvas.height;

            // Clear
            ctx.fillStyle = '#060709';
            ctx.fillRect(0, 0, w, h);

            // Perspective Grid Floor (Worker Thread)
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
            ctx.lineWidth = 1;
            const cy = h * 0.7;
            const cx = w * 0.5;

            // Rolling ground lines based on time and roll
            const groundOffset = (time * 0.05) % 30;
            for (let i = 0; i < 15; i++) {
              const y = cy + (i * i * 0.8) + groundOffset;
              if (y > h) continue;
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(w, y);
              ctx.stroke();
            }

            for (let i = -8; i <= 8; i++) {
              ctx.beginPath();
              ctx.moveTo(cx, cy);
              ctx.lineTo(cx + i * 80 + roll * 2, h);
              ctx.stroke();
            }

            // Drone 3D Projected Coordinate System
            ctx.save();
            ctx.translate(cx, cy - 60 - (altitude - 140) * 0.2);
            ctx.rotate((roll * Math.PI) / 180);

            // Drone Main Body
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            if (!wireframe) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
              ctx.fillRect(-45, -12, 90, 24);
            }
            ctx.strokeRect(-45, -12, 90, 24);

            // Quad Arms
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.8)';
            ctx.beginPath();
            ctx.moveTo(-55, -35);
            ctx.lineTo(55, 35);
            ctx.moveTo(55, -35);
            ctx.lineTo(-55, 35);
            ctx.stroke();

            // 4 Rotors spinning
            const spin = time * 0.02;
            const rotors = [
              [-55, -35], [55, -35], [-55, 35], [55, 35]
            ];
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.2;
            rotors.forEach(([rx, ry], idx) => {
              ctx.beginPath();
              ctx.ellipse(rx, ry, 18, 5, spin * (idx % 2 === 0 ? 1 : -1), 0, Math.PI * 2);
              ctx.stroke();
            });

            // Target Crosshair
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.moveTo(-15, 0); ctx.lineTo(15, 0);
            ctx.moveTo(0, -15); ctx.lineTo(0, 15);
            ctx.stroke();

            ctx.restore();

            animId = requestAnimationFrame(renderScene);
          }

          self.onmessage = function(e) {
            const data = e.data;
            if (data.type === 'INIT') {
              offscreenCanvas = data.canvas;
              ctx = offscreenCanvas.getContext('2d');
              animId = requestAnimationFrame(renderScene);
            } else if (data.type === 'UPDATE') {
              pitch = data.pitch;
              roll = data.roll;
              altitude = data.altitude;
              wireframe = data.wireframe;
            } else if (data.type === 'RESIZE') {
              if (offscreenCanvas) {
                offscreenCanvas.width = data.width;
                offscreenCanvas.height = data.height;
              }
            }
          };
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        const worker = new Worker(workerUrl);
        workerRef.current = worker;

        worker.postMessage({ type: 'INIT', canvas: offscreen }, [offscreen]);

        worker.onmessage = (e) => {
          if (e.data.type === 'FPS') {
            setFps(e.data.value);
          }
        };

        setWorkerActive(true);
        setThreadMode('OFFSCREEN_WORKER [0ms JANK / ISOLATED THREAD]');

        const handleResize = () => {
          if (!container) return;
          const w = container.clientWidth;
          worker.postMessage({ type: 'RESIZE', width: w, height: 320 });
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          worker.terminate();
          URL.revokeObjectURL(workerUrl);
        };
      } catch (err) {
        console.warn('OffscreenCanvas fallback activated:', err);
      }
    }

    // Fallback: Direct WebGL Three.js on main thread if browser restricts offscreen transfer
    setThreadMode('WEBGL_MAIN_THREAD [SYNCHRONOUS]');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060709);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(width, height);

    const gridHelper = new THREE.GridHelper(20, 20, 0x38bdf8, 0x1f2937);
    gridHelper.position.y = -1.5;
    scene.add(gridHelper);

    const droneGroup = new THREE.Group();
    const bodyMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.3, 0.8),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    );
    droneGroup.add(bodyMesh);
    scene.add(droneGroup);

    let animId: number;
    let frames = 0;
    let timer = performance.now();

    const animate = (time: number) => {
      frames++;
      if (time - timer >= 1000) {
        setFps(frames);
        frames = 0;
        timer = time;
      }
      droneGroup.rotation.x = (pitch * Math.PI) / 180;
      droneGroup.rotation.z = (roll * Math.PI) / 180;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  // Post update to worker when sliders move
  useEffect(() => {
    if (workerRef.current && workerActive) {
      workerRef.current.postMessage({
        type: 'UPDATE',
        pitch,
        roll,
        altitude,
        wireframe,
      });
    }
  }, [pitch, roll, altitude, wireframe, workerActive]);

  // Scroll timeline scrubbing: tilts drone based on vertical scroll delta
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const delta = window.scrollY - lastY;
      lastY = window.scrollY;
      const scrubRoll = Math.max(-25, Math.min(25, delta * 0.4));
      if (Math.abs(scrubRoll) > 1) {
        setRoll((prev) => Math.max(-30, Math.min(30, prev + scrubRoll * 0.2)));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const resetAttitude = () => {
    setPitch(0);
    setRoll(0);
    setAltitude(140);
  };

  return (
    <div className="border border-white/10 bg-[#060709] overflow-hidden">
      {/* 3D Viewport Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#0e1117] border-b border-white/10 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-white font-bold">3D_FLIGHT_SIM</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span className="text-[11px] text-zinc-400">{threadMode}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <Cpu className="w-3 h-3 text-emerald-400" />
            <span>RENDER_TICKER:</span>
          </span>
          <span className="text-amber-400 tabular-nums font-bold font-mono">{fps} FPS</span>
        </div>
      </div>

      {/* Canvas Viewport Mount */}
      <div ref={containerRef} className="relative w-full h-[320px] bg-[#060709] flex items-center justify-center">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      {/* Flight Control Instrument Bar */}
      <div className="p-4 bg-[#0a0d12] border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <label className="text-zinc-500 block mb-1">PITCH ({pitch}°)</label>
          <input
            type="range"
            min="-30"
            max="30"
            value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))}
            className="w-full accent-white cursor-pointer"
          />
        </div>

        <div>
          <label className="text-zinc-500 block mb-1">ROLL ({roll}°)</label>
          <input
            type="range"
            min="-30"
            max="30"
            value={roll}
            onChange={(e) => setRoll(Number(e.target.value))}
            className="w-full accent-white cursor-pointer"
          />
        </div>

        <div>
          <label className="text-zinc-500 block mb-1">ALTITUDE ({altitude}m)</label>
          <input
            type="range"
            min="20"
            max="500"
            value={altitude}
            onChange={(e) => setAltitude(Number(e.target.value))}
            className="w-full accent-white cursor-pointer"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={resetAttitude}
            className="px-3 py-1.5 border border-white/20 text-zinc-300 hover:text-white hover:border-white/40 flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Sıfırla</span>
          </button>
          <button
            onClick={() => setWireframe(!wireframe)}
            className="px-3 py-1.5 border border-white/20 text-zinc-300 hover:text-white hover:border-white/40 flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
          >
            <Eye className="w-3 h-3" />
            <span>{wireframe ? 'Tel Çerçeve' : 'Katı Model'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
