'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { 
  Radio, Activity, Timer, ChevronDown, Flag, Database, RefreshCw, Cpu, Award, 
  Wind, Thermometer, CloudRain, Users, Eye, Sliders, Play, CheckCircle2 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import TrackCanvas3D from '@/components/TrackCanvas3D';
import TelemetryGraph from '@/components/TelemetryGraph';
import GForceMeter from '@/components/GForceMeter';
import TireThermalHUD from '@/components/TireThermalHUD';
import PowerUnitGauge from '@/components/PowerUnitGauge';
import CircuitSpecsModal from '@/components/CircuitSpecsModal';
import DriverCompareModal from '@/components/DriverCompareModal';
import { fetchCircuitData, fetchDriversData, CIRCUITS_DATA } from '@/lib/api';
import { soundFx } from '@/lib/audioFx';

export default function Home() {
  const containerRef = useRef(null);

  // Global State
  const [selectedCircuit, setSelectedCircuit] = useState('monaco');
  const [circuitData, setCircuitData] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loadingCircuit, setLoadingCircuit] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [isApiFallback, setIsApiFallback] = useState(false);
  const [unit, setUnit] = useState('kmh');
  const [theme, setTheme] = useState('neon');

  // Modals State
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Fetch circuit metadata
  useEffect(() => {
    let active = true;
    setLoadingCircuit(true);
    fetchCircuitData(selectedCircuit)
      .then((data) => {
        if (active) {
          setCircuitData(data);
          setIsApiFallback(data.isFallback || false);
          setLoadingCircuit(false);
        }
      })
      .catch(() => {
        if (active) setLoadingCircuit(false);
      });
    return () => {
      active = false;
    };
  }, [selectedCircuit]);

  // Fetch driver standings
  useEffect(() => {
    let active = true;
    setLoadingDrivers(true);
    fetchDriversData()
      .then((data) => {
        if (active) {
          setDrivers(data);
          setLoadingDrivers(false);
        }
      })
      .catch(() => {
        if (active) setLoadingDrivers(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCircuitSelect = (id) => {
    soundFx.playClick();
    setSelectedCircuit(id);
  };

  const speedMultiplier = unit === 'mph' ? 0.621371 : 1;
  const unitLabel = unit === 'mph' ? 'MPH' : 'KM/H';

  return (
    <div ref={containerRef} className="bg-carbon-pattern text-slate-100 font-sans min-h-screen relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* 1. FLOATING GLASS NAVBAR */}
      <Navbar 
        unit={unit}
        setUnit={setUnit}
        theme={theme}
        setTheme={setTheme}
        onOpenCircuitSpecs={() => setIsSpecsOpen(true)}
      />

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <main className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-16">
        
        {/* SECTION 1: HERO & WEATHER TICKER */}
        <section id="hero" className="space-y-6 text-center">
          
          {/* Top Session Status Bar */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 glass-panel px-5 py-2 rounded-full border border-cyan-500/30 shadow-[0_0_25px_rgba(0,243,255,0.15)]"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Timer className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="font-bold">NEXT SESSION: FORMULA 1 GRAND PRIX</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <div className="flex items-center gap-2 font-orbitron font-bold text-xs text-white">
              <span>02D</span>:<span>14H</span>:<span>38M</span>:<span>12S</span>
            </div>
          </motion.div>

          {/* Hero Main Heading */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="space-y-2"
          >
            <h1 className="text-4xl md:text-7xl font-orbitron font-black italic tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-400 drop-shadow-[0_0_35px_rgba(0,243,255,0.2)]">
              REAL-TIME SPATIAL TELEMETRY
            </h1>
            <p className="text-sm md:text-base font-mono text-slate-400 max-w-2xl mx-auto uppercase tracking-wider font-medium">
              High-Fidelity 3D Track Render // Live Telemetry Diagnostics // Driver Head-to-Head Analytics
            </p>
          </motion.div>

          {/* Weather & Track Condition Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-2 font-mono text-xs">
            <div className="glass-panel p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-red-400" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-semibold">TRACK TEMP</span>
                <span className="font-bold text-white text-sm">42.4°C</span>
              </div>
            </div>

            <div className="glass-panel p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <Wind className="w-5 h-5 text-cyan-400" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-semibold">AIR TEMP / WIND</span>
                <span className="font-bold text-white text-sm">26.1°C // 12 KM/H</span>
              </div>
            </div>

            <div className="glass-panel p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <CloudRain className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-semibold">RAIN PROBABILITY</span>
                <span className="font-bold text-emerald-400 text-sm">0% (DRY SURFACE)</span>
              </div>
            </div>

            <div className="glass-panel p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <Flag className="w-5 h-5 text-purple-400" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-semibold">DRS STATUS</span>
                <span className="font-bold text-purple-400 text-sm">ENABLED (ZONE 1)</span>
              </div>
            </div>
          </div>

        </section>

        {/* SECTION 2: INTERACTIVE 3D TELEMETRY STUDIO */}
        <section id="telemetry-studio" className="space-y-6">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>02. INTERACTIVE 3D CIRCUIT CANVAS</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-orbitron font-extrabold italic text-white uppercase mt-1">
                CIRCUIT SELECTION & SPATIAL MODEL
              </h2>
            </div>

            {/* Django Connection Badge */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border ${
              isApiFallback 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}>
              <Database className="w-3.5 h-3.5" />
              <span>{isApiFallback ? 'OFFLINE FALLBACK DATA' : 'DJANGO REST API LIVE'}</span>
            </div>
          </div>

          {/* Circuit Switcher Selector Grid (6 Circuits) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.keys(CIRCUITS_DATA).map((id) => {
              const c = CIRCUITS_DATA[id];
              const isSelected = selectedCircuit === id;
              return (
                <button
                  key={id}
                  onClick={() => handleCircuitSelect(id)}
                  className={`p-3 rounded-2xl text-left font-mono transition-all border ${
                    isSelected
                      ? 'glass-panel-cyan border-cyan-400 text-white shadow-[0_0_20px_rgba(0,243,255,0.2)]'
                      : 'glass-panel text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] uppercase block font-bold text-slate-500">{c.country}</span>
                  <span className="text-xs font-orbitron font-bold uppercase truncate block mt-0.5">{c.id}</span>
                  <span className="text-[10px] text-cyan-400 block mt-1">{c.turns} TURNS</span>
                </button>
              );
            })}
          </div>

          {/* Main 3D Canvas Studio Container */}
          <TrackCanvas3D 
            circuitData={circuitData}
            trackColor="#00f3ff"
            emissiveColor="#00aaff"
            glowColor="#ff0055"
            gridColor="#ff0055"
            unit={unit}
          />

        </section>

        {/* SECTION 3: LIVE TELEMETRY ANALYTICS SUITE */}
        <section id="telemetry-analytics" className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>03. TELEMETRY DIAGNOSTICS & ANALYTICS</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-orbitron font-extrabold italic text-white uppercase mt-1">
              LIVE VEHICLE PERFORMANCE METRICS
            </h2>
          </div>

          {/* Grid Layout of Telemetry Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Speed & Throttle SVG Curve Graph (7 Cols) */}
            <div className="lg:col-span-7">
              <TelemetryGraph unit={unit} />
            </div>

            {/* Right Diagnostics Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <GForceMeter />
              <PowerUnitGauge />
            </div>

          </div>

          {/* Bottom Tire Wear HUD */}
          <TireThermalHUD />
        </section>

        {/* SECTION 4: LEADERBOARD & DRIVER STANDINGS */}
        <section id="standings" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                <Flag className="w-4 h-4 text-amber-400" />
                <span>04. PADDOCK STANDINGS</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-orbitron font-extrabold italic text-white uppercase mt-1">
                DRIVER LEADERBOARD & SECTOR TIMES
              </h2>
            </div>

            {/* Compare Drivers Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setIsCompareOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold hover:bg-cyan-500/20 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,243,255,0.15)]"
            >
              <Users className="w-4 h-4" />
              <span>HEAD-TO-HEAD COMPARISON</span>
            </button>
          </div>

          {/* Drivers Table Card */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800/90 shadow-2xl overflow-hidden">
            {loadingDrivers ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">SYNCHRONIZING PADDOCK STANDINGS...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800 pb-3">
                      <th className="pb-3 font-bold">POS</th>
                      <th className="pb-3 font-bold">DRIVER</th>
                      <th className="pb-3 font-bold">TEAM</th>
                      <th className="pb-3 font-bold">COMPOUND</th>
                      <th className="pb-3 font-bold">S1 SPLIT</th>
                      <th className="pb-3 font-bold">S2 SPLIT</th>
                      <th className="pb-3 font-bold">S3 SPLIT</th>
                      <th className="pb-3 font-bold text-right">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {drivers.map((driver, index) => (
                      <tr key={driver.number || index} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3.5 font-bold font-orbitron text-slate-400">P{index + 1}</td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: driver.team_color }} />
                            <span className="font-bold text-white font-orbitron">#{driver.number} {driver.abbreviation}</span>
                            <span className="text-slate-400 font-sans">{driver.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 font-semibold text-slate-300">{driver.team}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            driver.tire === 'SOFT' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                            driver.tire === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                            'bg-slate-500/10 text-slate-300 border-slate-500/30'
                          }`}>
                            {driver.tire || 'SOFT'}
                          </span>
                        </td>
                        <td className="py-3.5 text-emerald-400 font-semibold">{driver.s1 || '21.402'}s</td>
                        <td className="py-3.5 text-emerald-400 font-semibold">{driver.s2 || '34.190'}s</td>
                        <td className="py-3.5 text-emerald-400 font-semibold">{driver.s3 || '19.210'}s</td>
                        <td className="py-3.5 text-right font-bold text-amber-400 font-orbitron text-sm">
                          {driver.points || (300 - index * 25)} PTS
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center font-mono text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="bg-red-600 text-black font-black px-2 py-0.5 rounded text-[10px] tracking-widest italic font-orbitron">
            F1
          </div>
          <span className="font-bold text-slate-300 uppercase">FORMULA 1 SPATIAL TELEMETRY HUB</span>
        </div>
        <p className="text-[10px]">
          REAL-TIME 3D CIRCUIT MATRIX // POWERED BY NEXT.JS 16 & THREE.JS
        </p>
      </footer>

      {/* MODALS */}
      <CircuitSpecsModal 
        circuitId={selectedCircuit}
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
        unit={unit}
      />

      <DriverCompareModal 
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        drivers={drivers}
        unit={unit}
      />

    </div>
  );
}
