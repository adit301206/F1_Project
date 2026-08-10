'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// 3D Track Mesh using Extruded Tube Geometry
function TrackMesh({ trackColor = "#00f3ff", emissiveColor = "#00aaff", glowColor = "#ff0055" }) {
  const meshRef = useRef();

  // Create a 3D closed loop track path (Monaco-style spatial approximation)
  const curve = React.useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3, 0, -2),
      new THREE.Vector3(-1, 0, -3),
      new THREE.Vector3(2, 0, -2.5),
      new THREE.Vector3(3.5, 0, 0),
      new THREE.Vector3(2, 0, 2),
      new THREE.Vector3(0, 0, 3),
      new THREE.Vector3(-2.5, 0, 1.5),
    ], true); // true = closed loop
  }, []);

  // Smooth rotation animation along the Y-axis
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Primary Glowing Neon Circuit Tube */}
      <mesh>
        <tubeGeometry args={[curve, 128, 0.08, 12, true]} />
        <meshStandardMaterial
          color={trackColor}
          emissive={emissiveColor}
          emissiveIntensity={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Under-glow Shadow Extrusion */}
      <mesh position={[0, -0.05, 0]}>
        <tubeGeometry args={[curve, 128, 0.12, 12, true]} />
        <meshBasicMaterial
          color={glowColor}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// Main 3D Canvas Wrapper Component
export default function TrackCanvas3D({ 
  trackName = "MONACO",
  trackColor = "#00f3ff",
  emissiveColor = "#00aaff",
  glowColor = "#ff0055",
  gridColor = "#ff0055",
  autoRotate = false
}) {
  return (
    <div className="relative w-full h-[550px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Center Track Name Display Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <h2 className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-red-500 drop-shadow-[0_0_20px_rgba(0,243,255,0.4)]">
          {trackName}
        </h2>
        <span className="text-xs font-mono tracking-widest text-slate-400 mt-2 uppercase">
          3D Telemetry Spatial Render
        </span>
      </div>

      {/* Three.js Interactive 3D Scene */}
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 4, 6]} fov={50} />
        <OrbitControls enableZoom={true} autoRotate={autoRotate} maxPolarAngle={Math.PI / 2.2} />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[0, 2, 0]} intensity={3} color="#00ffff" />

        {/* 3D Grid Floor */}
        <gridHelper args={[20, 20, gridColor, '#1e293b']} position={[0, -0.5, 0]} />

        {/* The Circuit Mesh */}
        <TrackMesh trackColor={trackColor} emissiveColor={emissiveColor} glowColor={glowColor} />
      </Canvas>
    </div>
  );
}
