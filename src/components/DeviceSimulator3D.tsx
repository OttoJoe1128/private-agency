import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import { isWebGLSupported } from '../utils/webgl.ts';
import SafeWebGLBoundary from './SafeWebGLBoundary.tsx';
import { Monitor, Smartphone, Sparkles } from 'lucide-react';

interface DeviceSimulator3DProps {
  deviceType: 'macbook' | 'iphone';
  accentColor: string;
  client: string;
  title: string;
  children: React.ReactNode;
}

/**
 * Procedural 3D MacBook Pro Chassis
 */
function MacBookMesh({
  accentColor,
  children,
}: {
  accentColor: string;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group | null>(null);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle floating and subtle mouse tilt
    const targetRotY = pointer.x * 0.18 + Math.sin(t * 0.5) * 0.04;
    const targetRotX = -pointer.y * 0.12 + Math.cos(t * 0.4) * 0.03 + 0.1;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      {/* 1. Base Keyboard Chassis (Bottom Slab) */}
      <mesh position={[0, -1.2, 0.9]} receiveShadow>
        <boxGeometry args={[7.2, 0.18, 4.6]} />
        <meshStandardMaterial
          color="#16181d"
          metalness={0.88}
          roughness={0.22}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Trackpad Indentation */}
      <mesh position={[0, -1.1, 2.2]}>
        <boxGeometry args={[2.4, 0.02, 1.5]} />
        <meshStandardMaterial color="#1e2129" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Keyboard Bed Area */}
      <mesh position={[0, -1.1, 0.5]}>
        <boxGeometry args={[6.2, 0.02, 2.2]} />
        <meshStandardMaterial color="#0e1014" roughness={0.6} />
      </mesh>

      {/* Hinge Cylinder */}
      <mesh position={[0, -1.08, -1.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 6.8, 16]} />
        <meshStandardMaterial color="#111317" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 2. Top Screen Lid (Angled 12 degrees back) */}
      <group position={[0, -1.05, -1.35]} rotation={[-0.2, 0, 0]}>
        {/* Screen Outer Aluminum Lid */}
        <mesh position={[0, 2.35, -0.05]} castShadow>
          <boxGeometry args={[7.2, 4.7, 0.12]} />
          <meshStandardMaterial
            color="#14161b"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Screen Glass Bezel */}
        <mesh position={[0, 2.35, 0.02]}>
          <boxGeometry args={[7.0, 4.5, 0.02]} />
          <meshStandardMaterial color="#08090b" roughness={0.1} />
        </mesh>

        {/* Top Notch Dot */}
        <mesh position={[0, 4.5, 0.04]}>
          <boxGeometry args={[0.5, 0.1, 0.01]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* 3. Screen Viewport with Interactive DOM Content */}
        <Html
          transform
          occlude={false}
          position={[0, 2.35, 0.04]}
          scale={0.0072}
          className="pointer-events-auto select-none"
        >
          <div
            style={{
              width: '920px',
              height: '580px',
              backgroundColor: '#07080a',
              overflowY: 'auto',
              overflowX: 'hidden',
              borderRadius: '6px',
              border: `1px solid ${accentColor}33`,
            }}
            className="shadow-2xl flex flex-col font-sans"
          >
            {children}
          </div>
        </Html>
      </group>
    </group>
  );
}

/**
 * Procedural 3D iPhone 16 Pro Chassis
 */
function IPhoneMesh({
  accentColor,
  children,
}: {
  accentColor: string;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group | null>(null);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const targetRotY = pointer.x * 0.22 + Math.sin(t * 0.6) * 0.06;
    const targetRotX = -pointer.y * 0.15 + Math.cos(t * 0.5) * 0.04;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    groupRef.current.position.y = Math.sin(t * 0.9) * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Titanium Body Outer Chassis */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.4, 6.8, 0.32]} />
        <meshStandardMaterial
          color="#181a20"
          metalness={0.92}
          roughness={0.18}
        />
      </mesh>

      {/* Titanium Side Edge Accents */}
      <mesh position={[1.71, 0, 0]}>
        <boxGeometry args={[0.02, 6.7, 0.28]} />
        <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-1.71, 0, 0]}>
        <boxGeometry args={[0.02, 6.7, 0.28]} />
        <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Front Glass Bezel */}
      <mesh position={[0, 0, 0.17]}>
        <boxGeometry args={[3.25, 6.65, 0.02]} />
        <meshStandardMaterial color="#050608" roughness={0.05} />
      </mesh>

      {/* Dynamic Island Pill */}
      <mesh position={[0, 3.05, 0.19]}>
        <boxGeometry args={[0.75, 0.22, 0.01]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Camera Module Back Bump */}
      <mesh position={[-0.8, 2.4, -0.22]}>
        <boxGeometry args={[1.3, 1.4, 0.15]} />
        <meshStandardMaterial color="#121317" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 3. Screen Viewport with Interactive DOM Content */}
      <Html
        transform
        occlude={false}
        position={[0, 0, 0.19]}
        scale={0.0072}
        className="pointer-events-auto select-none"
      >
        <div
          style={{
            width: '420px',
            height: '840px',
            backgroundColor: '#07080a',
            overflow: 'hidden',
            borderRadius: '42px',
            border: `1.5px solid ${accentColor}44`,
          }}
          className="shadow-2xl flex flex-col font-sans relative"
        >
          {/* iOS Dynamic Island Header Simulator */}
          <div className="w-full h-8 flex items-center justify-center relative bg-black/80 shrink-0">
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono text-zinc-400">SLISS</span>
            </div>
          </div>

          {/* Interactive Children inside the screen */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </div>
        </div>
      </Html>
    </group>
  );
}

/**
 * 2.5D Resilient Fallback for environments where WebGL is disabled or context is lost
 */
function FallbackDeviceFrame({
  deviceType,
  accentColor,
  children,
}: {
  deviceType: 'macbook' | 'iphone';
  accentColor: string;
  children: React.ReactNode;
}) {
  if (deviceType === 'iphone') {
    return (
      <div className="w-full max-w-[380px] mx-auto p-4 bg-[#14161b] rounded-[48px] border-2 border-white/20 shadow-2xl relative">
        <div className="w-full h-[680px] bg-[#07080a] rounded-[38px] overflow-hidden flex flex-col border border-white/10">
          <div className="w-full h-8 flex items-center justify-center bg-black/80 shrink-0">
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono text-zinc-400">SLISS</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-[#16181d] rounded-xl border border-white/20 shadow-2xl">
      <div className="w-full h-[520px] bg-[#07080a] rounded-lg overflow-hidden border border-white/10 flex flex-col">
        {children}
      </div>
      <div className="w-full h-3 bg-[#111317] rounded-b-xl mt-2 flex items-center justify-center">
        <div className="w-24 h-1 bg-white/20 rounded-full" />
      </div>
    </div>
  );
}

export default function DeviceSimulator3D({
  deviceType,
  accentColor,
  client,
  title,
  children,
}: DeviceSimulator3DProps) {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    setHasWebGL(isWebGLSupported());
  }, []);

  return (
    <div className="relative w-full h-[680px] sm:h-[720px] lg:h-[760px] overflow-hidden rounded-xl border border-white/10 bg-[#060709] flex items-center justify-center">
      {/* Device Type Indicator & Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 text-xs font-mono bg-black/75 px-3 py-1.5 border border-white/10 backdrop-blur-md">
        {deviceType === 'iphone' ? (
          <Smartphone className="w-3.5 h-3.5 text-sky-400" />
        ) : (
          <Monitor className="w-3.5 h-3.5 text-emerald-400" />
        )}
        <span className="text-white font-bold uppercase">
          {deviceType === 'iphone' ? 'iPhone 16 Pro 3D Simülatör' : 'MacBook Pro 3D Simülatör'}
        </span>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-400">İnteraktif Ekran</span>
      </div>

      <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400 bg-black/75 px-3 py-1.5 border border-white/10 backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Ekranla doğrudan etkileşime girebilirsiniz</span>
      </div>

      {/* 3D Scene Viewport */}
      {hasWebGL ? (
        <SafeWebGLBoundary
          fallback={
            <FallbackDeviceFrame
              deviceType={deviceType}
              accentColor={accentColor}
            >
              {children}
            </FallbackDeviceFrame>
          }
        >
          <div className="w-full h-full">
            <Canvas
              camera={{
                position: [0, 0, deviceType === 'iphone' ? 9.5 : 8.8],
                fov: 46,
              }}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              onCreated={({ scene }) => {
                scene.background = null;
              }}
            >
              <ambientLight intensity={1.2} />
              <directionalLight position={[10, 15, 10]} intensity={1.8} castShadow />
              <pointLight position={[-10, -5, -5]} intensity={1.5} color={accentColor} />
              <pointLight position={[5, -5, 8]} intensity={1.2} color="#ffffff" />

              {/* Background Monumental Typography in Deep 3D Space */}
              <group position={[0, 0.4, -4.5]}>
                <Text
                  fontSize={deviceType === 'iphone' ? 2.8 : 2.4}
                  color="#ffffff"
                  fillOpacity={0.06}
                  anchorX="center"
                  anchorY="middle"
                  letterSpacing={0.08}
                  font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_al061wqUwwwO7VkQ.woff2"
                >
                  {client.toUpperCase()}
                </Text>
              </group>

              {/* Procedural 3D Device */}
              {deviceType === 'iphone' ? (
                <IPhoneMesh accentColor={accentColor}>
                  {children}
                </IPhoneMesh>
              ) : (
                <MacBookMesh accentColor={accentColor}>
                  {children}
                </MacBookMesh>
              )}
            </Canvas>
          </div>
        </SafeWebGLBoundary>
      ) : (
        <FallbackDeviceFrame
          deviceType={deviceType}
          accentColor={accentColor}
        >
          {children}
        </FallbackDeviceFrame>
      )}
    </div>
  );
}
