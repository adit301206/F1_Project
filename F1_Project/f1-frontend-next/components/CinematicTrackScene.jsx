'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Float, Html, Grid } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

// Accurate Monaco GP Nodes
const monacoNodes = [
  new THREE.Vector3(-1.0, 0.0, 4.5),   // Start/Finish
  new THREE.Vector3(-2.2, 0.1, 3.2),   // Sainte Dévote (Turn 1)
  new THREE.Vector3(-3.2, 0.5, 1.2),   // Beau Rivage
  new THREE.Vector3(-3.8, 1.0, -0.5),  // Massenet (Turn 2/3)
  new THREE.Vector3(-2.6, 1.2, -2.2),  // Casino Square (Turn 4)
  new THREE.Vector3(-0.8, 0.8, -2.0),  // Mirabeau Haute (Turn 5)
  new THREE.Vector3(-1.8, 0.4, -3.2),  // Fairmont Hairpin (Turn 6)
  new THREE.Vector3(-0.2, 0.2, -3.0),  // Mirabeau Bas (Turn 7)
  new THREE.Vector3(0.8, 0.1, -3.2),   // Portier (Turn 8)
  new THREE.Vector3(2.4, -0.1, -2.0),  // Tunnel (Turn 9)
  new THREE.Vector3(3.8, -0.1, 0.2),   // Tunnel Exit
  new THREE.Vector3(2.6, -0.05, 2.2),  // Nouvelle Chicane (Turn 10/11)
  new THREE.Vector3(1.2, 0.0, 2.4),    // Tabac (Turn 12)
  new THREE.Vector3(0.6, 0.0, 3.2),    // Piscine (Turn 13/14)
  new THREE.Vector3(-0.1, 0.0, 4.2),   // Swimming Pool Exit (Turn 15/16)
  new THREE.Vector3(-0.4, 0.0, 5.2),   // Rascasse (Turn 17/18)
  new THREE.Vector3(-1.2, 0.0, 4.8),   // Antony Noghès (Turn 19)
];

const monacoTrackCurve = new THREE.CatmullRomCurve3(monacoNodes, true, 'centripetal', 0.2);

// Detailed 3D Car Model with PBR Materials
function RealisticF1Car({ scrollProgress }) {
  const carRef = useRef();

  useFrame(() => {
    if (!carRef.current) return;
    const progress = (scrollProgress.current * 2.2) % 1;
    const point = monacoTrackCurve.getPointAt(progress);
    const tangent = monacoTrackCurve.getTangentAt(progress);

    carRef.current.position.copy(point);
    const lookTarget = point.clone().add(tangent);
    carRef.current.lookAt(lookTarget);
  });

  return (
    <group ref={carRef}>
      {/* Carbon Livery Body */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.24, 0.09, 0.7]} />
        <meshStandardMaterial color="#dc2626" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Front Wing */}
      <mesh position={[0, 0.05, 0.4]}>
        <boxGeometry args={[0.5, 0.02, 0.12]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00aaff" emissiveIntensity={1.5} />
      </mesh>
      {/* Rear Wing */}
      <mesh position={[0, 0.22, -0.36]}>
        <boxGeometry args={[0.42, 0.08, 0.08]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00aaff" emissiveIntensity={1.5} />
      </mesh>
      {/* Tires */}
      <mesh position={[-0.18, 0.07, 0.22]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 0.06, 16]} /><meshStandardMaterial color="#111" roughness={0.3} /></mesh>
      <mesh position={[0.18, 0.07, 0.22]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 0.06, 16]} /><meshStandardMaterial color="#111" roughness={0.3} /></mesh>
      <mesh position={[-0.18, 0.07, -0.22]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.08, 0.08, 0.07, 16]} /><meshStandardMaterial color="#111" roughness={0.3} /></mesh>
      <mesh position={[0.18, 0.07, -0.22]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.08, 0.08, 0.07, 16]} /><meshStandardMaterial color="#111" roughness={0.3} /></mesh>
    </group>
  );
}

// Camera Controller
function CameraController({ scrollProgress }) {
  useFrame((state) => {
    const sp = scrollProgress.current || 0;
    const targetX = THREE.MathUtils.lerp(0, -0.5, sp);
    const targetY = THREE.MathUtils.lerp(9, 2.5, sp);
    const targetZ = THREE.MathUtils.lerp(11, 4.5, sp);

    state.camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.05);
    state.camera.lookAt(0, 0.3, 0.5);
  });

  return <PerspectiveCamera makeDefault position={[0, 9, 11]} fov={45} />;
}

export default function CinematicTrackScene({ scrollProgress, trackName = "MONACO" }) {
  return (
    <div className="w-full h-full relative">
      <Canvas gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <CameraController scrollProgress={scrollProgress} />

        {/* Real-World Environment Lighting */}
        <Environment preset="night" />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 20, 10]} intensity={3} color="#ffffff" />
        <pointLight position={[0, 4, 0]} intensity={8} color="#00f3ff" />

        {/* Spatial Title */}
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
          <Html position={[0, 3.2, -0.5]} center transform sprite>
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

        {/* Realistic Track Layers */}
        <group>
          {/* Main Asphalt Road Surface (Extruded Tube with Glossy Wet Finish) */}
          <mesh>
            <tubeGeometry args={[monacoTrackCurve, 350, 0.22, 16, true]} />
            <meshStandardMaterial color="#080c16" roughness={0.15} metalness={0.85} />
          </mesh>

          {/* Red Kerb Border 1 */}
          <mesh position={[0, 0.01, 0]}>
            <tubeGeometry args={[monacoTrackCurve, 350, 0.24, 12, true]} />
            <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.5} />
          </mesh>

          {/* White Kerb Border 2 */}
          <mesh position={[0, -0.01, 0]}>
            <tubeGeometry args={[monacoTrackCurve, 350, 0.26, 12, true]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.5} />
          </mesh>

          {/* Glowing Racing Apex Telemetry Line */}
          <mesh position={[0, 0.03, 0]}>
            <tubeGeometry args={[monacoTrackCurve, 350, 0.04, 12, true]} />
            <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={3} />
          </mesh>
        </group>

        {/* F1 Car */}
        <RealisticF1Car scrollProgress={scrollProgress} />

        {/* Perspective Ground Grid */}
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

        {/* Cinematic Post-Processing Shaders */}
        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
          <ChromaticAberration offset={[0.0005, 0.0005]} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
