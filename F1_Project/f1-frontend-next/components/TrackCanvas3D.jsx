'use client';

import React, { useRef, Suspense, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Html, Grid } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Play, Pause, Zap, CloudRain, Sun, Moon } from 'lucide-react';
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
function TrackMesh({ curve, trackColor = "#00f3ff", emissiveColor = "#00aaff", glowColor = "#ff0055", weatherMode = "night" }) {
  if (!curve) return null;

  // Dynamic track material properties depending on weather mode
  const emissiveIntensity = weatherMode === "night" ? 4.0 : weatherMode === "rain" ? 2.8 : 1.2;
  const metalness = weatherMode === "rain" ? 0.95 : weatherMode === "sunset" ? 0.75 : 0.88;
  const roughness = weatherMode === "rain" ? 0.05 : weatherMode === "sunset" ? 0.25 : 0.12;

  return (
    <group>
      {/* Primary Glowing Neon Circuit Tube */}
      <mesh>
        <tubeGeometry args={[curve, 300, 0.09, 14, true]} />
        <meshStandardMaterial
          color={weatherMode === "sunset" ? "#e0f2fe" : trackColor}
          emissive={weatherMode === "sunset" ? "#0284c7" : emissiveColor}
          emissiveIntensity={emissiveIntensity}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {/* Outer Halo Glow Tube */}
      <mesh position={[0, -0.04, 0]}>
        <tubeGeometry args={[curve, 300, 0.17, 12, true]} />
        <meshBasicMaterial
          color={weatherMode === "sunset" ? "#38bdf8" : weatherMode === "rain" ? "#00f3ff" : glowColor}
          wireframe
          transparent
          opacity={weatherMode === "night" ? 0.35 : weatherMode === "rain" ? 0.45 : 0.15}
        />
      </mesh>
    </group>
  );
}

// High-fidelity procedural 3D F1 car model
function ProceduralF1Car({ liveryColor = "#3671C2", weatherMode = "night" }) {
  return (
    <group scale={1.1}>
      {/* Monocoque Body Chassis */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.2, 0.08, 0.6]} />
        <meshStandardMaterial color={liveryColor} metalness={0.92} roughness={weatherMode === "rain" ? 0.05 : 0.15} />
      </mesh>

      {/* Nosecone Streamline */}
      <mesh position={[0, 0.06, 0.35]} rotation={[0.1, 0, 0]} castShadow>
        <coneGeometry args={[0.08, 0.25, 16]} />
        <meshStandardMaterial color={liveryColor} metalness={0.92} roughness={weatherMode === "rain" ? 0.05 : 0.15} />
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
        <meshStandardMaterial color={liveryColor} metalness={0.85} roughness={weatherMode === "rain" ? 0.05 : 0.2} />
      </mesh>
      <mesh position={[0.14, 0.07, -0.05]} castShadow>
        <boxGeometry args={[0.08, 0.07, 0.3]} />
        <meshStandardMaterial color={liveryColor} metalness={0.85} roughness={weatherMode === "rain" ? 0.05 : 0.2} />
      </mesh>

      {/* Front Wing Assembly */}
      <mesh position={[0, 0.03, 0.45]} castShadow>
        <boxGeometry args={[0.42, 0.015, 0.1]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00aaff" emissiveIntensity={weatherMode === "night" ? 2.5 : 1.0} />
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
        <meshStandardMaterial color="#00f3ff" emissive="#00aaff" emissiveIntensity={weatherMode === "night" ? 2.5 : 1.0} />
      </mesh>
      <mesh position={[-0.17, 0.13, -0.32]} castShadow>
        <boxGeometry args={[0.015, 0.12, 0.12]} />
        <meshStandardMaterial color={liveryColor} />
      </mesh>
      <mesh position={[0.17, 0.13, -0.32]} castShadow>
        <boxGeometry args={[0.015, 0.12, 0.12]} />
        <meshStandardMaterial color={liveryColor} />
      </mesh>

      {/* Rear Rain LED Light - Flash brightly in Rain mode */}
      <mesh position={[0, 0.09, -0.35]}>
        <boxGeometry args={[0.05, 0.04, 0.02]} />
        <meshBasicMaterial color="#ff0044" />
      </mesh>

      {/* 4 Pirelli Tires (WET Tread in Rain Mode) */}
      <mesh position={[-0.15, 0.05, 0.22]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.065, 0.065, 0.05, 24]} />
        <meshStandardMaterial color={weatherMode === "rain" ? "#0f172a" : "#111827"} roughness={weatherMode === "rain" ? 0.1 : 0.4} />
      </mesh>
      <mesh position={[0.15, 0.05, 0.22]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.065, 0.065, 0.05, 24]} />
        <meshStandardMaterial color={weatherMode === "rain" ? "#0f172a" : "#111827"} roughness={weatherMode === "rain" ? 0.1 : 0.4} />
      </mesh>
      <mesh position={[-0.15, 0.06, -0.22]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.06, 24]} />
        <meshStandardMaterial color={weatherMode === "rain" ? "#0f172a" : "#111827"} roughness={weatherMode === "rain" ? 0.1 : 0.4} />
      </mesh>
      <mesh position={[0.15, 0.06, -0.22]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.06, 24]} />
        <meshStandardMaterial color={weatherMode === "rain" ? "#0f172a" : "#111827"} roughness={weatherMode === "rain" ? 0.1 : 0.4} />
      </mesh>
    </group>
  );
}

// 🌧️ 3D Rain Particle System (1,000 continuous rain streaks)
function RainParticles({ count = 1000 }) {
  const pointsRef = useRef();

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = Math.random() * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 28;
      vel[i] = 0.25 + Math.random() * 0.35;
    }
    return [pos, vel];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array;
    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] -= velocities[i] * delta * 65;
      if (array[i * 3 + 1] < -0.1) {
        array[i * 3 + 1] = 14 + Math.random() * 3;
        array[i * 3] = (Math.random() - 0.5) * 28;
        array[i * 3 + 2] = (Math.random() - 0.5) * 28;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color="#38bdf8"
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 🌩️ Lightning Flash Effect in Rain Mode
function LightningEffect() {
  const lightRef = useRef();
  useFrame(() => {
    if (!lightRef.current) return;
    if (Math.random() < 0.006) {
      lightRef.current.intensity = 18;
    } else {
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 0, 0.18);
    }
  });
  return <pointLight ref={lightRef} position={[0, 10, 0]} color="#bae6fd" />;
}

// Animated wrapper that moves car model along spline
function MovingCar({ curve, isPlaying = true, speedMultiplier = 1.0, liveryColor = "#3671C2", cameraMode = "orbit", controlsRef, weatherMode = "night" }) {
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
      <ProceduralF1Car liveryColor={liveryColor} weatherMode={weatherMode} />
    </group>
  );
}

// Corner Waypoints HTML Overlay
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

  // Weather Preset Visual Metadata
  const weatherConfig = {
    night: {
      title: "🌙 SINGAPORE NIGHT GP",
      subtitle: "FLOODLIGHT ILLUMINATION // HIGH EMISSIVE NEON CONTRAST",
      bgClass: "bg-[#020409] border-red-500/30",
      canvasBg: "#020409",
      gridColor: "#ff0055",
      envPreset: "night"
    },
    sunset: {
      title: "☀️ MONACO DAYLIGHT GP",
      subtitle: "SUNNY SKYLINE // HIGH VISIBILITY // REALISTIC SOLAR REFLECTION",
      bgClass: "bg-[#0b172a] border-sky-500/40",
      canvasBg: "#0f1f38",
      gridColor: "#0284c7",
      envPreset: "dawn"
    },
    rain: {
      title: "🌧️ SPA TORRENTIAL RAIN",
      subtitle: "HEAVY DOWNPOUR // WET REFLECTIVE TARMAC // STORM LIGHTNING",
      bgClass: "bg-[#050c18] border-cyan-500/40",
      canvasBg: "#061122",
      gridColor: "#00f3ff",
      envPreset: "night"
    }
  };

  const currentW = weatherConfig[weatherMode];

  return (
    <div className={`relative w-full h-[580px] ${currentW.bgClass} rounded-3xl overflow-hidden border shadow-[0_0_60px_rgba(0,0,0,0.95)] transition-all duration-700`}>
      
      {/* Top Overlay: Circuit Specs Badge */}
      <div className="absolute top-5 left-6 z-20 pointer-events-none select-none">
        <div className="inline-flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-slate-950/85 border border-cyan-500/30 px-3 py-1 rounded-lg backdrop-blur-md shadow-lg">
          <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>SPATIAL 3D CIRCUIT MATRIX</span>
        </div>
        <h2 className="text-3xl font-orbitron font-black italic tracking-tight text-white mt-2 drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]">
          {displayTrackName.toUpperCase()}
        </h2>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
            {displayLocality}
          </p>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900/90 text-amber-400 border border-amber-500/30">
            {currentW.title}
          </span>
        </div>
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
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${
              weatherMode === "night" ? "bg-red-600 text-white shadow-[0_0_12px_rgba(255,24,1,0.6)]" : "text-slate-400 hover:text-white"
            }`}
          >
            <Moon className="w-3 h-3" /> NIGHT
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setWeatherMode("sunset");
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${
              weatherMode === "sunset" ? "bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.6)]" : "text-slate-400 hover:text-white"
            }`}
          >
            <Sun className="w-3 h-3" /> DAY
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setWeatherMode("rain");
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${
              weatherMode === "rain" ? "bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,243,255,0.6)]" : "text-slate-400 hover:text-white"
            }`}
          >
            <CloudRain className="w-3 h-3" /> RAIN
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
        
        {/* Dynamic Scene Environment & Atmosphere */}
        <color attach="background" args={[currentW.canvasBg]} />

        {weatherMode === "rain" && (
          <fog attach="fog" args={['#061122', 4, 18]} />
        )}
        {weatherMode === "night" && (
          <fog attach="fog" args={['#020409', 8, 28]} />
        )}

        <Environment preset={currentW.envPreset} />

        {/* Weather-Specific Dynamic Lighting */}
        {weatherMode === "sunset" ? (
          <>
            <ambientLight intensity={1.8} color="#e0f2fe" />
            <directionalLight position={[12, 20, 8]} intensity={4.5} color="#fffbeb" castShadow />
            <directionalLight position={[-8, 10, -6]} intensity={1.2} color="#7dd3fc" />
          </>
        ) : weatherMode === "rain" ? (
          <>
            <ambientLight intensity={0.5} color="#38bdf8" />
            <directionalLight position={[6, 12, 4]} intensity={1.8} color="#93c5fd" castShadow />
            <pointLight position={[0, 4, 0]} intensity={8} color="#00f3ff" />
            <LightningEffect />
          </>
        ) : (
          <>
            {/* NIGHT MODE: Stadium Corner Floodlights & High Contrast Neon */}
            <ambientLight intensity={0.25} color="#0f172a" />
            <directionalLight position={[8, 16, 6]} intensity={2.8} color="#38bdf8" castShadow />
            <spotLight position={[6, 8, 6]} angle={0.6} penumbra={0.5} intensity={12} color="#00f3ff" />
            <spotLight position={[-6, 8, -6]} angle={0.6} penumbra={0.5} intensity={12} color="#ff0055" />
          </>
        )}

        {/* Ground Grid */}
        <Grid
          position={[0, -0.01, 0]}
          args={[24, 24]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor={weatherMode === "sunset" ? "#334155" : "#1e293b"}
          sectionSize={2.5}
          sectionThickness={1}
          sectionColor={currentW.gridColor}
          fadeDistance={18}
        />

        {/* 🌧️ WET REFLECTIVE GROUND PLANE IN RAIN MODE */}
        {weatherMode === "rain" && (
          <mesh position={[0, -0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[32, 32]} />
            <meshStandardMaterial
              color="#091426"
              roughness={0.02}
              metalness={0.96}
            />
          </mesh>
        )}

        <Suspense fallback={<CanvasLoader />}>
          {curve && (
            <>
              <TrackMesh curve={curve} trackColor={trackColor} emissiveColor={emissiveColor} glowColor={glowColor} weatherMode={weatherMode} />
              
              <MovingCar 
                curve={curve} 
                isPlaying={isPlaying} 
                speedMultiplier={speedMultiplier} 
                liveryColor={teamsMap[selectedTeam].color} 
                cameraMode={cameraMode}
                controlsRef={controlsRef}
                weatherMode={weatherMode}
              />

              <CornerWaypoints curve={curve} corners={cornersList} />

              {/* 🌧️ Rain Drop Particles in Rain Mode */}
              {weatherMode === "rain" && <RainParticles count={1000} />}
            </>
          )}
        </Suspense>

        <EffectComposer>
          <Bloom 
            intensity={weatherMode === "night" ? 2.2 : weatherMode === "rain" ? 1.6 : 0.8} 
            luminanceThreshold={0.15} 
            luminanceSmoothing={0.9} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
