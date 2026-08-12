
'use client';

import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Html, Grid } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// SVG Path parsing utility to construct a 3D track spline
function getCurveFromSVGPath(svgPath) {
  if (!svgPath) return null;
  const matches = svgPath.match(/-?\d+(\.\d+)?/g);
  if (!matches || matches.length < 4) return null;

  const points = [];
  for (let i = 0; i < matches.length; i += 2) {
    const x = parseFloat(matches[i]);
    const y = parseFloat(matches[i+1]);
    if (!isNaN(x) && !isNaN(y)) {
      points.push(new THREE.Vector3(x, 0, y));
    }
  }

  if (points.length === 0) return null;

  // Center and scale the spline points so they fit nicely in our 3D view grid
  let minX = Infinity, maxX = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  points.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.z < minZ) minZ = p.z;
    if (p.z > maxZ) maxZ = p.z;
  });

  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;
  const width = maxX - minX || 1;
  const height = maxZ - minZ || 1;
  const scale = 8 / Math.max(width, height);

  const formattedPoints = points.map(p => {
    return new THREE.Vector3(
      (p.x - centerX) * scale,
      0,
      (p.z - centerZ) * scale
    );
  });

  return new THREE.CatmullRomCurve3(formattedPoints, true, 'centripetal', 0.2);
}

// 3D Track Mesh using Extruded Tube Geometry
function TrackMesh({ curve, trackColor = "#00f3ff", emissiveColor = "#00aaff", glowColor = "#ff0055" }) {
  if (!curve) return null;
  return (
    <group>
      {/* Primary Glowing Neon Circuit Tube */}
      <mesh>
        <tubeGeometry args={[curve, 256, 0.08, 12, true]} />
        <meshStandardMaterial
          color={trackColor}
          emissive={emissiveColor}
          emissiveIntensity={2.5}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Under-glow Shadow Extrusion */}
      <mesh position={[0, -0.05, 0]}>
        <tubeGeometry args={[curve, 256, 0.14, 12, true]} />
        <meshBasicMaterial
          color={glowColor}
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
}

// Error boundary to catch useGLTF failures when the model asset is missing
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.warn("[3D Engine] Failed to load 3D GLTF model. Using high-fidelity geometry fallback.", error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// High-fidelity fallback F1 car built using primitive meshes
function FallbackCarModel() {
  return (
    <group>
      {/* Carbon Livery Body */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <boxGeometry args={[0.16, 0.06, 0.5]} />
        <meshStandardMaterial color="#dc2626" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Cockpit Canopy */}
      <mesh position={[0, 0.10, -0.03]} castShadow>
        <boxGeometry args={[0.09, 0.05, 0.15]} />
        <meshStandardMaterial color="#090d16" metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Front Wing */}
      <mesh position={[0, 0.02, 0.3]} castShadow>
        <boxGeometry args={[0.36, 0.015, 0.08]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00aaff" emissiveIntensity={1.5} />
      </mesh>
      {/* Rear Wing */}
      <mesh position={[0, 0.14, -0.26]} castShadow>
        <boxGeometry args={[0.3, 0.06, 0.06]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00aaff" emissiveIntensity={1.5} />
      </mesh>
      {/* Tires */}
      <mesh position={[-0.11, 0.04, 0.16]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.04, 16]} /><meshStandardMaterial color="#111" roughness={0.4} /></mesh>
      <mesh position={[0.11, 0.04, 0.16]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.04, 16]} /><meshStandardMaterial color="#111" roughness={0.4} /></mesh>
      <mesh position={[-0.11, 0.045, -0.16]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.055, 0.055, 0.045, 16]} /><meshStandardMaterial color="#111" roughness={0.4} /></mesh>
      <mesh position={[0.11, 0.045, -0.16]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.055, 0.055, 0.045, 16]} /><meshStandardMaterial color="#111" roughness={0.4} /></mesh>
    </group>
  );
}

// GLTF Loader Component
function CarModel() {
  const { scene } = useGLTF('/models/f1_car.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.metalness = 0.9;
          child.material.roughness = 0.1;
        }
      }
    });
  }, [clonedScene]);

  return <primitive object={clonedScene} scale={0.25} />;
}

// Animated wrapper that moves the car model along the spline
function MovingCar({ curve }) {
  const carRef = useRef();

  useFrame((state) => {
    if (!carRef.current || !curve) return;
    const time = state.clock.getElapsedTime();
    const progress = (time * 0.05) % 1; // Drives around the track every 20 seconds
    const point = curve.getPointAt(progress);
    const tangent = curve.getTangentAt(progress);

    carRef.current.position.copy(point);
    const lookTarget = point.clone().add(tangent);
    carRef.current.lookAt(lookTarget);
  });

  return (
    <group ref={carRef}>
      <ModelErrorBoundary fallback={<FallbackCarModel />}>
        <CarModel />
      </ModelErrorBoundary>
    </group>
  );
}

// Custom 3D WebGL Spinner for Suspense
function CanvasLoader() {
  const spinnerRef = useRef();
  useFrame((state, delta) => {
    if (spinnerRef.current) {
      spinnerRef.current.rotation.y += delta * 2;
      spinnerRef.current.rotation.x += delta * 1;
    }
  });

  return (
    <group>
      <mesh ref={spinnerRef}>
        <torusGeometry args={[0.4, 0.06, 16, 64]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00ffff" emissiveIntensity={2.5} roughness={0.1} />
      </mesh>
      <Html center>
        <div className="text-[10px] font-mono tracking-[0.3em] text-cyan-400 bg-slate-950/80 px-4 py-2 rounded-xl border border-cyan-500/30 whitespace-nowrap animate-pulse shadow-lg backdrop-blur-sm">
          LOADING 3D ASSETS...
        </div>
      </Html>
    </group>
  );
}

// Main 3D Canvas Wrapper Component
export default function TrackCanvas3D({ 
  circuitData = null,
  trackColor = "#00f3ff",
  emissiveColor = "#00aaff",
  glowColor = "#ff0055",
  gridColor = "#ff0055",
  autoRotate = false
}) {
  // Parse SVG path to construct the 3D curve
  const curve = useMemo(() => {
    const defaultMonacoPath = "M 80,220 C 70,180 90,140 140,110 C 200,80 280,60 340,90 C 400,120 420,170 390,210 C 350,260 260,220 220,260 C 180,300 130,350 90,310 C 60,280 90,260 80,220 Z";
    const path = circuitData?.svg_path || defaultMonacoPath;
    return getCurveFromSVGPath(path);
  }, [circuitData]);

  const displayTrackName = circuitData?.track_name || "MONACO GP";
  const displayLocality = circuitData ? `${circuitData.locality}, ${circuitData.country}` : "MONTE CARLO, MONACO";

  return (
    <div className="relative w-full h-[550px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Left Overlay Circuit Information */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none select-none">
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-1 rounded-md backdrop-blur-sm">
          SPATIAL TELEMETRY FEED
        </span>
        <h2 className="text-3xl font-black italic tracking-tighter text-white mt-2 drop-shadow-md">
          {displayTrackName.toUpperCase()}
        </h2>
        <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mt-0.5">
          {displayLocality}
        </p>
      </div>

      {/* Three.js Interactive 3D Scene */}
      <Canvas shadows gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <PerspectiveCamera makeDefault position={[0, 6, 8]} fov={45} />
        <OrbitControls enableZoom={true} autoRotate={autoRotate} autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2.1} minDistance={3} maxDistance={15} />
        
        {/* Night Preset Environment Reflection */}
        <Environment preset="night" />

        {/* Studio Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[8, 12, 5]} intensity={2} color="#ffffff" castShadow />
        <pointLight position={[0, 4, 0]} intensity={6} color="#00ffff" />

        {/* 3D Grid Floor */}
        <Grid
          position={[0, -0.01, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#1e293b"
          sectionSize={2.5}
          sectionThickness={1}
          sectionColor={gridColor}
          fadeDistance={15}
        />

        {/* Suspended 3D elements (F1 Car & Track) */}
        <Suspense fallback={<CanvasLoader />}>
          {curve && (
            <>
              <TrackMesh curve={curve} trackColor={trackColor} emissiveColor={emissiveColor} glowColor={glowColor} />
              <MovingCar curve={curve} />
            </>
          )}
        </Suspense>

        {/* Post-Processing Effects */}
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.15} luminanceSmoothing={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
