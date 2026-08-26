'use client';

import React, { useRef, Suspense, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Html, Grid } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Play, Pause, Camera, Eye, Zap, RefreshCw, Cpu, Layers } from 'lucide-react';
import * as THREE from 'three';
import { soundFx } from '@/lib/audioFx';

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
  const scale = 9 / Math.max(width, height);

  const formattedPoints = points.map(p => {
    return new THREE.Vector3(
      (p.x - centerX) * scale,
      0,
      (p.z - centerZ) * scale
    );
  });

  return new THREE.CatmullRomCurve3(formattedPoints, true, 'centripetal', 0.2);
}

// 3D Multi-Colored Segmented Circuit Mesh
function TrackMesh({ curve, trackColor = "#00f3ff", emissiveColor = "#00aaff", glowColor = "#ff0055" }) {
  if (!curve) return null;

  return (
    <group>
      {/* Primary Glowing Neon Circuit Tube */}
      <mesh>
        <tubeGeometry args={[curve, 300, 0.09, 14, true]} />
        <meshStandardMaterial
          color={trackColor}
          emissive={emissiveColor}
          emissiveIntensity={2.5}
          roughness={0.12}
          metalness={0.88}
        />
      </mesh>

      {/* Outer Halo Glow Tube */}
      <mesh position={[0, -0.04, 0]}>
        <tubeGeometry args={[curve, 300, 0.16, 12, true]} />
        <meshBasicMaterial
          color={glowColor}
          wireframe
          transparent
          opacity={0.22}
        />
      </mesh>
    </group>
  );
}

// High-fidelity procedural 3D F1 car model (livery, sidepods, halo, carbon wings, 4 tires)
function ProceduralF1Car({ liveryColor = "#3671C2" }) {
  return (
    <group scale={1.1}>
      {/* Monocoque Body Chassis */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.2, 0.08, 0.6]} />
        <meshStandardMaterial color={liveryColor} metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Nosecone Streamline */}
      <mesh position={[0, 0.06, 0.35]} rotation={[0.1, 0, 0]} castShadow>
        <coneGeometry args={[0.08, 0.25, 16]} />
        <meshStandardMaterial color={liveryColor} metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Cockpit & Canopy */}
      <mesh position={[0, 0.13, -0.02]} castShadow>
        <boxGeometry args={[0.11, 0.06, 0.18]} />
        <meshStandardMaterial color="#080c16" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Halo Structure */}
      <mesh position={[0, 0.16, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.07, 0.012, 12, 24, Math.PI]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Aerodynamic Sidepods */}
      <mesh position={[-0.14, 0.07, -0.05]} castShadow>
        <boxGeometry args={[0.08, 0.07, 0.3]} />
        <meshStandardMaterial color={liveryColor} metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0.14, 0.07, -0.05]} castShadow>
        <boxGeometry args={[0.08, 0.07, 0.3]} />
        <meshStandardMaterial color={liveryColor} metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Front Wing Assembly */}
      <mesh position={[0, 0.03, 0.45]} castShadow>
        <boxGeometry args={[0.42, 0.015, 0.1]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00aaff" emissiveIntensity={2.0} />
      </mesh>
      <mesh position={[-0.2, 0.06, 0.45]} castShadow>
        <boxGeometry args={[0.015, 0.06, 0.1]} />
        <meshStandardMaterial color={liveryColor} metalness={0.8} />
      </mesh>
      <mesh position={[0.2, 0.06, 0.45]} castShadow>
        <boxGeometry args={[0.015, 0.06, 0.1]} />
        <meshStandardMaterial color={liveryColor} metalness={0.8} />
      </mesh>

      {/* Rear Wing DRS Element */}
      <mesh position={[0, 0.18, -0.32]} castShadow>
        <boxGeometry args={[0.36, 0.08, 0.08]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00aaff" emissiveIntensity={2.0} />
      </mesh>
      <mesh position={[-0.17, 0.13, -0.32]} castShadow>
        <boxGeometry args={[0.015, 0.12, 0.12]} />
        <meshStandardMaterial color={liveryColor} />
      </mesh>
      <mesh position={[0.17, 0.13, -0.32]} castShadow>
        <boxGeometry args={[0.015, 0.12, 0.12]} />
        <meshStandardMaterial color={liveryColor} />
      </mesh>

      {/* Rear Rain LED Light */}
      <mesh position={[0, 0.09, -0.35]}>
        <boxGeometry args={[0.04, 0.03, 0.02]} />
        <meshBasicMaterial color="#ff0055" />
      </mesh>

      {/* 4 Wheels (Pirelli Racing Tires) */}
      <mesh position={[-0.15, 0.05, 0.22]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.065, 0.065, 0.05, 24]} />
        <meshStandardMaterial color="#111827" roughness={0.4} />
      </mesh>
      <mesh position={[0.15, 0.05, 0.22]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.065, 0.065, 0.05, 24]} />
        <meshStandardMaterial color="#111827" roughness={0.4} />
      </mesh>
      <mesh position={[-0.15, 0.06, -0.22]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.06, 24]} />
        <meshStandardMaterial color="#111827" roughness={0.4} />
      </mesh>
      <mesh position={[0.15, 0.06, -0.22]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.06, 24]} />
        <meshStandardMaterial color="#111827" roughness={0.4} />
      </mesh>
    </group>
  );
}

// Animated wrapper that moves the car model along the spline
function MovingCar({ curve, isPlaying = true, speedMultiplier = 1.0, liveryColor = "#3671C2", cameraMode = "orbit", controlsRef }) {
  const carRef = useRef();
  const progressRef = useRef(0);

  useFrame((state, delta) => {
    if (!carRef.current || !curve) return;

    if (isPlaying) {
      progressRef.current = (progressRef.current + delta * 0.05 * speedMultiplier) % 1;
    }

    const point = curve.getPointAt(progressRef.current);
    const tangent = curve.getTangentAt(progressRef.current);

    carRef.current.position.copy(point);
    const lookTarget = point.clone().add(tangent);
    carRef.current.lookAt(lookTarget);

    // Dynamic Camera Tracking Modes
    if (cameraMode === "chase" && controlsRef.current) {
      const camOffset = point.clone().sub(tangent.clone().multiplyScalar(2.5)).add(new THREE.Vector3(0, 1.2, 0));
      state.camera.position.lerp(camOffset, 0.08);
      controlsRef.current.target.lerp(point, 0.1);
      controlsRef.current.update();
    } else if (cameraMode === "cockpit" && controlsRef.current) {
      // Driver Helmet / Cockpit Halo POV looking straight forward down the apex
      const helmetPos = point.clone().add(new THREE.Vector3(0, 0.22, 0));
      const lookAhead = point.clone().add(tangent.clone().multiplyScalar(4.0)).add(new THREE.Vector3(0, 0.1, 0));
      state.camera.position.lerp(helmetPos, 0.2);
      controlsRef.current.target.lerp(lookAhead, 0.2);
      controlsRef.current.update();
    } else if (cameraMode === "topdown" && controlsRef.current) {
      state.camera.position.set(0, 12, 0.01);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  });

  return (
    <group ref={carRef}>
      <ProceduralF1Car liveryColor={liveryColor} />
    </group>
  );
}

// Interactive 3D Corner Waypoints HTML Overlay
function CornerWaypoints({ curve, corners = [] }) {
  if (!curve || !corners.length) return null;

  return corners.map((corner, idx) => {
    const fraction = ((idx + 1) / (corners.length + 1)) % 1;
    const point = curve.getPointAt(fraction);

    return (
      <group key={corner.id} position={[point.x, point.y + 0.35, point.z]}>
        <Html center distanceFactor={12}>
          <div className="bg-slate-950/90 border border-cyan-500/40 text-cyan-400 text-[9px] font-mono px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(0,243,255,0.4)] whitespace-nowrap flex items-center gap-1 backdrop-blur-md hover:scale-110 transition-transform cursor-pointer">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold">T{corner.id}</span>
            <span className="text-white text-[8px] opacity-80">{corner.name}</span>
          </div>
        </Html>
      </group>
    );
  });
}

function CanvasLoader() {
  const spinnerRef = useRef();
  useFrame((state, delta) => {
    if (spinnerRef.current) {
      spinnerRef.current.rotation.y += delta * 2.5;
    }
  });

  return (
    <group>
      <mesh ref={spinnerRef}>
        <torusGeometry args={[0.45, 0.05, 16, 64]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00ffff" emissiveIntensity={2.5} roughness={0.1} />
      </mesh>
      <Html center>
        <div className="text-[10px] font-orbitron font-bold tracking-[0.2em] text-cyan-400 bg-slate-950/90 px-4 py-2 rounded-xl border border-cyan-500/40 whitespace-nowrap animate-pulse shadow-xl backdrop-blur-md">
          INITIALIZING SPATIAL CANVAS...
        </div>
      </Html>
    </group>
  );
}

export default function TrackCanvas3D({ 
  circuitData = null,
  trackColor = "#00f3ff",
  emissiveColor = "#00aaff",
  glowColor = "#ff0055",
  gridColor = "#ff0055",
  unit = 'kmh'
}) {
  const controlsRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [cameraMode, setCameraMode] = useState("orbit"); // 'orbit', 'chase', 'cockpit', 'topdown'
  const [weatherMode, setWeatherMode] = useState("night"); // 'night', 'sunset', 'rain'
  const [selectedTeam, setSelectedTeam] = useState("redbull");

  const teamsMap = {
    redbull: { name: "Red Bull Racing", color: "#3671C2" },
    ferrari: { name: "Scuderia Ferrari", color: "#E80020" },
    mclaren: { name: "McLaren F1 Team", color: "#FF8000" },
    mercedes: { name: "Mercedes-AMG", color: "#27F4D2" },
  };

  const curve = useMemo(() => {
    const defaultMonacoPath = "M 80,220 C 70,180 90,140 140,110 C 200,80 280,60 340,90 C 400,120 420,170 390,210 C 350,260 260,220 220,260 C 180,300 130,350 90,310 C 60,280 90,260 80,220 Z";
    const path = circuitData?.svg_path || defaultMonacoPath;
    return getCurveFromSVGPath(path);
  }, [circuitData]);

  const displayTrackName = circuitData?.track_name || "Circuit de Monaco";
  const displayLocality = circuitData ? `${circuitData.locality}, ${circuitData.country}` : "Monte Carlo, Monaco";
  const cornersList = circuitData?.corners || [];

  return (
    <div className="relative w-full h-[580px] bg-[#070b16] rounded-3xl overflow-hidden border border-slate-800/90 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
      
      {/* Top Overlay: Circuit Specs Badge */}
      <div className="absolute top-5 left-6 z-20 pointer-events-none select-none">
        <div className="inline-flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-slate-950/85 border border-cyan-500/30 px-3 py-1 rounded-lg backdrop-blur-md shadow-lg">
          <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>SPATIAL 3D CIRCUIT MATRIX</span>
        </div>
        <h2 className="text-3xl font-orbitron font-black italic tracking-tight text-white mt-2 drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]">
          {displayTrackName.toUpperCase()}
        </h2>
        <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mt-0.5 font-semibold">
          {displayLocality}
        </p>
      </div>

      {/* Floating Interactive HUD Controls Toolbar */}
      <div className="absolute top-5 right-6 z-20 flex flex-wrap items-center gap-2 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800/90 shadow-2xl">
        
        {/* Play / Pause Toggle */}
        <button
          onClick={() => {
            soundFx.playClick();
            setIsPlaying(!isPlaying);
          }}
          className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all"
          title={isPlaying ? "Pause Lap Simulation" : "Play Lap Simulation"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Speed Multiplier Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            setSpeedMultiplier(prev => (prev === 1.0 ? 2.0 : prev === 2.0 ? 0.5 : 1.0));
          }}
          className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 font-bold hover:text-cyan-400 transition-colors"
        >
          {speedMultiplier}x SPEED
        </button>

        {/* Weather Lighting Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              soundFx.playClick();
              setWeatherMode("night");
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
              weatherMode === "night" ? "bg-red-600 text-white shadow-[0_0_10px_rgba(255,24,1,0.4)]" : "text-slate-400 hover:text-white"
            }`}
          >
            🌙 NIGHT
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setWeatherMode("sunset");
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
              weatherMode === "sunset" ? "bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]" : "text-slate-400 hover:text-white"
            }`}
          >
            ☀️ DAY
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setWeatherMode("rain");
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
              weatherMode === "rain" ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,243,255,0.4)]" : "text-slate-400 hover:text-white"
            }`}
          >
            🌧️ RAIN
          </button>
        </div>

        {/* Camera View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              soundFx.playClick();
              setCameraMode("orbit");
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
              cameraMode === "orbit"
                ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,243,255,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ORBIT
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setCameraMode("chase");
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
              cameraMode === "chase"
                ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,243,255,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            CHASE
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setCameraMode("cockpit");
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
              cameraMode === "cockpit"
                ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,243,255,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            HALO POV
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setCameraMode("topdown");
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
              cameraMode === "topdown"
                ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,243,255,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            GRID
          </button>
        </div>

      </div>

      {/* Bottom Floating Team Selector */}
      <div className="absolute bottom-5 left-6 z-20 flex items-center gap-3 bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800/90 shadow-2xl">
        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">LIVERY:</span>
        <div className="flex items-center gap-2">
          {Object.entries(teamsMap).map(([key, team]) => (
            <button
              key={key}
              onClick={() => {
                soundFx.playClick();
                setSelectedTeam(key);
              }}
              className={`w-5 h-5 rounded-full border-2 transition-transform ${
                selectedTeam === key ? "scale-125 border-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "border-transparent opacity-60 hover:opacity-100"
              }`}
              style={{ backgroundColor: team.color }}
              title={team.name}
            />
          ))}
        </div>
      </div>

      {/* Three.js Interactive 3D Canvas */}
      <Canvas shadows gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <PerspectiveCamera makeDefault position={[0, 6.5, 8.5]} fov={45} />
        
        <OrbitControls 
          ref={controlsRef}
          enableZoom={true} 
          autoRotate={cameraMode === "orbit"} 
          autoRotateSpeed={0.4} 
          maxPolarAngle={Math.PI / 2.05} 
          minDistance={3} 
          maxDistance={18} 
        />
        
        <Environment preset={weatherMode === "sunset" ? "sunset" : "night"} />

        <ambientLight intensity={weatherMode === "sunset" ? 1.2 : 0.6} />
        <directionalLight position={[8, 14, 6]} intensity={weatherMode === "sunset" ? 3.5 : 2.2} color={weatherMode === "sunset" ? "#ffaa55" : "#ffffff"} castShadow />
        <pointLight position={[0, 5, 0]} intensity={7} color={weatherMode === "rain" ? "#0088ff" : "#00ffff"} />

        <Grid
          position={[0, -0.01, 0]}
          args={[22, 22]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#1e293b"
          sectionSize={2.5}
          sectionThickness={1}
          sectionColor={gridColor}
          fadeDistance={16}
        />

        <Suspense fallback={<CanvasLoader />}>
          {curve && (
            <>
              <TrackMesh curve={curve} trackColor={trackColor} emissiveColor={emissiveColor} glowColor={glowColor} />
              <MovingCar 
                curve={curve} 
                isPlaying={isPlaying} 
                speedMultiplier={speedMultiplier} 
                liveryColor={teamsMap[selectedTeam].color} 
                cameraMode={cameraMode}
                controlsRef={controlsRef}
              />
              <CornerWaypoints curve={curve} corners={cornersList} />
            </>
          )}
        </Suspense>

        <EffectComposer>
          <Bloom intensity={1.6} luminanceThreshold={0.15} luminanceSmoothing={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
