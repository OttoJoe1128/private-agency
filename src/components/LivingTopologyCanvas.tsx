import { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  pulsePhase: number;
  label: string;
  type: 'sensor' | 'gateway' | 'compute' | 'storage' | 'display';
}

interface Packet {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
}

export default function LivingTopologyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fps, setFps] = useState<number>(60);
  const [activeNodesCount, setActiveNodesCount] = useState<number>(24);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCounter = 0;
    let fpsTimer = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const labels = [
      'ESP32_BUS', 'MODBUS_01', 'FASTAPI_GW', 'WORKER_THREAD',
      'THREE_MESH', 'SOIL_NODE', 'EC_SENSOR', 'PH_PROBE',
      'REDIS_CACHE', 'POSTGRES_DB', 'MQTT_BROKER', 'WEBSOCKET_RX',
      'GPU_BUFFER', 'OFFSCREEN_CV', 'SOP_MATRIX', 'DMA_STREAM',
      'RS485_TRANS', 'PID_CONTROLLER', 'TIMER_TICK', 'CANVAS_2D'
    ];

    const types: ('sensor' | 'gateway' | 'compute' | 'storage' | 'display')[] = [
      'sensor', 'gateway', 'compute', 'storage', 'display'
    ];

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 600;
    const height = rect.height || 450;
    const count = 22;
    setActiveNodesCount(count);

    const nodes: Node[] = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      baseRadius: Math.random() * 2 + 2.5,
      radius: 3,
      pulsePhase: Math.random() * Math.PI * 2,
      label: labels[i % labels.length],
      type: types[i % types.length],
    }));

    const packets: Packet[] = Array.from({ length: 8 }, () => ({
      fromIndex: Math.floor(Math.random() * count),
      toIndex: Math.floor(Math.random() * count),
      progress: Math.random(),
      speed: 0.008 + Math.random() * 0.012,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      const bounds = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      frameCounter++;
      if (time - fpsTimer > 500) {
        setFps(Math.round((frameCounter * 1000) / (time - fpsTimer)));
        frameCounter = 0;
        fpsTimer = time;
      }

      const currentRect = canvas.getBoundingClientRect();
      const w = currentRect.width;
      const h = currentRect.height;

      // Dark canvas clear
      ctx.fillStyle = '#060709';
      ctx.fillRect(0, 0, w, h);

      // Subtle architectural coordinates grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Update and connect nodes
      const maxDistance = 140;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // Bounce on boundary
        if (n.x < 15) { n.x = 15; n.vx *= -1; }
        if (n.x > w - 15) { n.x = w - 15; n.vx *= -1; }
        if (n.y < 15) { n.y = 15; n.vy *= -1; }
        if (n.y > h - 15) { n.y = h - 15; n.vy *= -1; }

        // Mouse interaction
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - n.x;
          const dy = mouseRef.current.y - n.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120 && dist > 1) {
            const force = (120 - dist) / 120;
            n.x -= (dx / dist) * force * 1.5;
            n.y -= (dy / dist) * force * 1.5;
          }
        }

        n.pulsePhase += dt * 2;
        n.radius = n.baseRadius + Math.sin(n.pulsePhase) * 1.2;

        // Connect to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n.x;
          const dy = n2.y - n.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = 1 - dist / maxDistance;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.14})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Render data packets
      for (let p = 0; p < packets.length; p++) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) {
          pkt.progress = 0;
          pkt.fromIndex = Math.floor(Math.random() * nodes.length);
          pkt.toIndex = Math.floor(Math.random() * nodes.length);
        }

        const start = nodes[pkt.fromIndex];
        const end = nodes[pkt.toIndex];
        if (start && end) {
          const dist = Math.hypot(end.x - start.x, end.y - start.y);
          if (dist < maxDistance * 1.5) {
            const px = start.x + (end.x - start.x) * pkt.progress;
            const py = start.y + (end.y - start.y) * pkt.progress;

            ctx.fillStyle = '#f59e0b'; // amber engineering signal
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();

            // Glow trail
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px - (end.x - start.x) * 0.05, py - (end.y - start.y) * 0.05);
            ctx.stroke();
          }
        }
      }

      // Render nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Outer telemetry ring
        ctx.strokeStyle = n.type === 'sensor' 
          ? 'rgba(56, 189, 248, 0.35)' 
          : 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + 3, 0, Math.PI * 2);
        ctx.stroke();

        // Node center
        ctx.fillStyle = n.type === 'sensor' ? '#38bdf8' : '#f8fafc';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();

        // Technical Monospace Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(n.label, n.x + 8, n.y + 3);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] md:h-[480px] border border-white/10 bg-[#060709] overflow-hidden select-none">
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

      {/* Real-time Technical Overlay */}
      <div className="absolute top-3 left-3 flex items-center gap-3 text-xs font-mono text-zinc-400">
        <span>TOPOLOGY_BUS</span>
        <span aria-hidden="true">·</span>
        <span className="tabular-nums">{activeNodesCount} NODES ACTIVE</span>
        <span aria-hidden="true">·</span>
        <span className="text-amber-400 tabular-nums">{fps} FPS</span>
      </div>

      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-zinc-500">
        CANVAS2D / INTERACTIVE PHYSICS
      </div>
    </div>
  );
}
