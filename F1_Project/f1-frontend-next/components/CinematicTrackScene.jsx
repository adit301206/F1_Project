'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Float, Html, Grid } from '@react-three/drei';
import * as THREE from 'three';

// -----------------------------------------------------------------------------
// High-Precision 36-Node Spatial Spline for Circuit de Monaco (19 Turns)
// -----------------------------------------------------------------------------
const monacoNodes = [
  // Pit Straight (Start / Finish Line)
  new THREE.Vector3(-0.5, 0.0, 3.5),
  new THREE.Vector3(-1.2, 0.0, 2.8),

  // Turn 1: Sainte Dévote (Right Hook & Hill Start)
  new THREE.Vector3(-2.2, 0.1, 2.4),
  new THREE.Vector3(-2.8, 0.2, 1.8),

  // Beau Rivage Climb (Elevation Rise)
  new THREE.Vector3(-3.4, 0.6, 0.8),
  new THREE.Vector3(-3.8, 1.0, -0.4),

  // Turn 2 & 3: Massenet (Sweeping Left Curve)
  new THREE.Vector3(-3.6, 1.3, -1.4),
  new THREE.Vector3(-3.0, 1.5, -2.2),

  // Turn 4: Casino Square (Crest Peak)
  new THREE.Vector3(-2.0, 1.6, -2.6),
  new THREE.Vector3(-1.0, 1.4, -2.4),

  // Turn 5: Mirabeau Haute (Downhill Drop)
  new THREE.Vector3(-0.4, 1.1, -2.2),
  new THREE.Vector3(-1.0, 0.8, -2.9),

  // Turn 6: Grand Hotel / Fairmont Hairpin (Tight 180° Loop)
  new THREE.Vector3(-1.8, 0.5, -3.5),
  new THREE.Vector3(-1.6, 0.4, -4.0),
  new THREE.Vector3(-0.8, 0.3, -3.8),

  // Turn 7: Mirabeau Bas
  new THREE.Vector3(-0.2, 0.2, -3.4),

  // Turn 8: Portier (Entry to Tunnel)
  new THREE.Vector3(0.6, 0.1, -3.6),
  new THREE.Vector3(1.4, 0.0, -3.2),

  // Turn 9: The Tunnel (Fast Curved Right Arc along Harbour)
  new THREE.Vector3(2.4, -0.1, -2.4),
  new THREE.Vector3(3.4, -0.1, -1.2),
  new THREE.Vector3(4.0, -0.1, 0.2),
  new THREE.Vector3(3.9, -0.1, 1.4),

  // Exit Tunnel
  new THREE.Vector3(3.3, -0.05, 2.2),

  // Turn 10 & 11: Nouvelle Chicane (Harbour Flick)
  new THREE.Vector3(2.6, -0.05, 2.5),
  new THREE.Vector3(2.2, -0.05, 2.1),

  // Run to Tabac
  new THREE.Vector3(1.8, -0.05, 1.9),

  // Turn 12: Tabac (Marina Left Curve)
  new THREE.Vector3(1.2, 0.0, 2.2),
  new THREE.Vector3(0.9, 0.0, 2.8),

  // Turn 13 & 14: Swimming Pool / Piscine (First S-Bend)
  new THREE.Vector3(0.6, 0.0, 3.4),
  new THREE.Vector3(0.2, 0.0, 3.2),

  // Turn 15 & 16: Swimming Pool Exit Chicane
  new THREE.Vector3(-0.1, 0.0, 3.6),
  new THREE.Vector3(-0.3, 0.0, 4.2),

  // Turn 17 & 18: La Rascasse (Tight 180° Restaurant Hairpin)
  new THREE.Vector3(-0.1, 0.0, 4.8),
  new THREE.Vector3(-0.6, 0.0, 5.0),

  // Turn 19: Antony Noghès (Final Right Flick back onto Main Straight)
  new THREE.Vector3(-1.0, 0.0, 4.5),
];

const monacoTrackCurve = new THREE.CatmullRomCurve3(monacoNodes, true, 'centripetal', 0.2);

// -----------------------------------------------------------------------------
// Animated F1 Car Component
// -----------------------------------------------------------------------------
function AnimatedF1Car({ scrollProgress }) {
  const carRef = useRef();

  useFrame(() => {
    if (!carRef.current) return;

    const progress = (scrollProgress.current * 2.5) % 1;
    const point = monacoTrackCurve.getPointAt(progress);
    const tangent = monacoTrackCurve.getTangentAt(progress);

    carRef.current.position.copy(point);

    const lookTarget = point.clone().add(tangent);
    carRef.current.lookAt(lookTarget);
  });

  return (
    <group ref={carRef}>
      {/* Monocoque Body */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.2, 0.08, 0.65]} />
        <meshStandardMaterial color="#e11d48" emissive="#9f1239" emissiveIntensity={0.8} roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Cockpit */}
      <mesh position={[0, 0.16, -0.04]}>
        <boxGeometry args={[0.12, 0.06, 0.18]} />
        <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Front Wing */}
      <mesh position={[0, 0.05, 0.38]}>
        <boxGeometry args={[0.48, 0.02, 0.12]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00aaff" emissiveIntensity={1.4} />
      </mesh>
      {/* Rear Wing */}
      <mesh position={[0, 0.18, -0.34]}>
        <boxGeometry args={[0.4, 0.08, 0.07]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00aaff" emissiveIntensity={1.4} />
      </mesh>
      {/* Tires */}
      <mesh position={[-0.16, 0.06, 0.2]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.06, 0.06, 0.05, 16]} /><meshStandardMaterial color="#0f172a" /></mesh>
      <mesh position={[0.16, 0.06, 0.2]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.06, 0.06, 0.05, 16]} /><meshStandardMaterial color="#0f172a" /></mesh>
      <mesh position={[-0.16, 0.06, -0.2]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 0.06, 16]} /><meshStandardMaterial color="#0f172a" /></mesh>
      <mesh position={[0.16, 0.06, -0.2]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 0.06, 16]} /><meshStandardMaterial color="#0f172a" /></mesh>
    </group>
  );
}

// -----------------------------------------------------------------------------
// Start/Finish Line Arch Component
// -----------------------------------------------------------------------------
function StartFinishBanner() {
  const pitPoint = monacoNodes[0];
  return (
    <group position={[pitPoint.x, pitPoint.y + 0.3, pitPoint.z]}>
      {/* Checkered Start Banner Tube */}
      <mesh>
        <boxGeometry args={[0.8, 0.05, 0.05]} />
        <meshStandardMaterial color="#ffffff" emissive="#00f3ff" emissiveIntensity={2} />
      </mesh>
      <Html position={[0, 0.25, 0]} center sprite>
        <span className="text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-400/40">
          START / FINISH
        </span>
      </Html>
    </group>
  );
}

// -----------------------------------------------------------------------------
// Camera Controller (Optimized Distance so entire track is visible)
// -----------------------------------------------------------------------------
function CameraController({ scrollProgress }) {
  useFrame((state) => {
    const sp = scrollProgress.current || 0;

    // Camera starts back at Z=12 (full visibility) -> moves down to Z=5 on scroll
    const targetX = THREE.MathUtils.lerp(0, -0.4, sp);
    const targetY = THREE.MathUtils.lerp(10, 3.2, sp);
    const targetZ = THREE.MathUtils.lerp(12, 5.0, sp);

    state.camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.06);
    state.camera.lookAt(0, 0.2, 0.6);
  });

  return <PerspectiveCamera makeDefault position={[0, 10, 12]} fov={50} />;
}

// -----------------------------------------------------------------------------
// Main WebGL 3D Scene Component
// -----------------------------------------------------------------------------
export default function CinematicTrackScene({ scrollProgress, trackName = "MONACO" }) {
  return (
    <div className="w-full h-full relative">
      <Canvas gl={{ antialias: true }}>
        <CameraController scrollProgress={scrollProgress} />

        {/* Dynamic Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[15, 22, 12]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-4, 5, 0]} intensity={6} color="#00f3ff" />
        <pointLight position={[4, 2, -3]} intensity={5} color="#ff0055" />

        {/* Location Title in 3D Space */}
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
          <Html position={[0, 3.5, -0.5]} center transform sprite>
            <div className="pointer-events-none text-center select-none backdrop-blur-md px-8 py-3 rounded-2xl border border-cyan-500/30 bg-slate-950/70 shadow-[0_0_50px_rgba(0,243,255,0.25)]">
              <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-300 to-cyan-600 drop-shadow-[0_0_40px_rgba(0,243,255,0.7)]">
                {trackName}
              </h1>
              <p className="text-[11px] font-mono tracking-[0.4em] text-cyan-400 uppercase mt-1">
                CIRCUIT DE MONTE CARLO // 3.337 KM // 19 TURNS
              </p>
            </div>
          </Html>
        </Float>

        {/* Monaco Track Mesh Layers */}
        <group>
          {/* Base Asphalt Surface */}
          <mesh>
            <tubeGeometry args={[monacoTrackCurve, 300, 0.18, 16, true]} />
            <meshStandardMaterial color="#080d1a" roughness={0.3} metalness={0.8} />
          </mesh>

          {/* Neon Telemetry Apex Line */}
          <mesh position={[0, 0.02, 0]}>
            <tubeGeometry args={[monacoTrackCurve, 300, 0.06, 12, true]} />
            <meshStandardMaterial color="#00f3ff" emissive="#00ccff" emissiveIntensity={3} roughness={0.1} />
          </mesh>

          {/* Sub-Glow Grid Shadow */}
          <mesh position={[0, -0.06, 0]}>
            <tubeGeometry args={[monacoTrackCurve, 300, 0.26, 12, true]} />
            <meshBasicMaterial color="#ff0055" wireframe transparent opacity={0.2} />
          </mesh>
        </group>

        {/* Start / Finish Banner */}
        <StartFinishBanner />

        {/* Animated F1 Car */}
        <AnimatedF1Car scrollProgress={scrollProgress} />

        {/* Spatial Floor Grid */}
        <Grid
          position={[0, -0.5, 0]}
          args={[35, 35]}
          cellSize={0.6}
          cellThickness={0.6}
          cellColor="#1e293b"
          sectionSize={3}
          sectionThickness={1.2}
          sectionColor="#ff0055"
          fadeDistance={22}
        />
      </Canvas>
    </div>
  );
}
