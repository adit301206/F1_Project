'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Gauge, Play, Pause, RotateCcw, Zap, Sliders } from 'lucide-react';
import { generateLapTelemetry } from '@/lib/telemetryData';
import { soundFx } from '@/lib/audioFx';

const DRIVER_OPTIONS = [
  { code: 'VER', name: 'Verstappen', team: 'Red Bull Racing', color: '#3671C2' },
  { code: 'NOR', name: 'Norris', team: 'McLaren', color: '#FF8000' },
  { code: 'LEC', name: 'Leclerc', team: 'Ferrari', color: '#E80020' },
  { code: 'HAM', name: 'Hamilton', team: 'Ferrari', color: '#E80020' },
  { code: 'PIA', name: 'Piastri', team: 'McLaren', color: '#FF8000' },
  { code: 'RUS', name: 'Russell', team: 'Mercedes', color: '#27F4D2' },
];

export default function TelemetryGraph({ unit = 'kmh' }) {
  const [driverA, setDriverA] = useState('VER');
  const [driverB, setDriverB] = useState('NOR');
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [activeMetricTab, setActiveMetricTab] = useState('SPEED'); // SPEED, THROTTLE, BRAKE, GEAR

  const telemetryData = useMemo(() => generateLapTelemetry(driverA, driverB), [driverA, driverB]);

  const speedMultiplier = unit === 'mph' ? 0.621371 : 1;
  const unitLabel = unit === 'mph' ? 'MPH' : 'KM/H';

  // Playback timer loop
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackIndex((prev) => (prev + 1) % telemetryData.length);
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isPlaying, telemetryData.length]);

  const currentIndex = hoverIndex !== null ? hoverIndex : (isPlaying ? playbackIndex : Math.floor(telemetryData.length / 2));
  const currentData = telemetryData[currentIndex] || telemetryData[0];

  // SVG dimensions for smooth telemetry plot
  const width = 640;
  const height = 200;
  const padding = 20;

  const getMetricValue = (point, driverKey) => {
    if (activeMetricTab === 'THROTTLE') return driverKey === 'A' ? point.throttleA : point.throttleB;
    if (activeMetricTab === 'BRAKE') return driverKey === 'A' ? point.brakeA : point.brakeB;
    if (activeMetricTab === 'GEAR') return driverKey === 'A' ? (point.gearA / 8) * 100 : (point.gearB / 8) * 100;
    return driverKey === 'A' ? point.speedA : point.speedB;
  };

  const maxVal = activeMetricTab === 'SPEED' ? 360 : 100;

  const pointsA = useMemo(() => {
    return telemetryData.map((d, i) => {
      const x = padding + (i / (telemetryData.length - 1)) * (width - padding * 2);
      const val = getMetricValue(d, 'A');
      const y = height - padding - (val / maxVal) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');
  }, [telemetryData, activeMetricTab]);

  const pointsB = useMemo(() => {
    return telemetryData.map((d, i) => {
      const x = padding + (i / (telemetryData.length - 1)) * (width - padding * 2);
      const val = getMetricValue(d, 'B');
      const y = height - padding - (val / maxVal) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');
  }, [telemetryData, activeMetricTab]);

  const areaA = useMemo(() => {
    const firstX = padding;
    const lastX = width - padding;
    return `${firstX},${height - padding} ${pointsA} ${lastX},${height - padding}`;
  }, [pointsA]);

  const areaB = useMemo(() => {
    const firstX = padding;
    const lastX = width - padding;
    return `${firstX},${height - padding} ${pointsB} ${lastX},${height - padding}`;
  }, [pointsB]);

  const driverAObj = DRIVER_OPTIONS.find(d => d.code === driverA) || DRIVER_OPTIONS[0];
  const driverBObj = DRIVER_OPTIONS.find(d => d.code === driverB) || DRIVER_OPTIONS[1];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass-panel p-6 rounded-3xl border border-slate-800/90 shadow-2xl space-y-5 backdrop-blur-xl"
    >
      
      {/* Header & Driver Selectors */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4 animate-pulse text-cyan-400" />
            <span>LIVE TELEMETRY TRACE ANALYSIS</span>
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            SPEED & THROTTLE TELEMETRY OVERLAP // CIRCUIT DISTANCE
          </p>
        </div>

        {/* High-Tech Driver Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-slate-800 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: driverAObj.color }} />
            <span className="text-slate-400 font-bold text-[10px]">P1:</span>
            <select
              value={driverA}
              onChange={(e) => {
                soundFx.playClick();
                setDriverA(e.target.value);
              }}
              className="bg-transparent text-white font-orbitron font-bold text-xs focus:outline-none cursor-pointer"
            >
              {DRIVER_OPTIONS.map(d => (
                <option key={d.code} value={d.code} className="bg-slate-950 text-white font-mono">
                  #{d.code} - {d.name} ({d.team})
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-600 font-bold text-xs">VS</span>

          <div className="flex items-center gap-1.5 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-slate-800 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: driverBObj.color }} />
            <span className="text-slate-400 font-bold text-[10px]">P2:</span>
            <select
              value={driverB}
              onChange={(e) => {
                soundFx.playClick();
                setDriverB(e.target.value);
              }}
              className="bg-transparent text-amber-400 font-orbitron font-bold text-xs focus:outline-none cursor-pointer"
            >
              {DRIVER_OPTIONS.map(d => (
                <option key={d.code} value={d.code} className="bg-slate-950 text-white font-mono">
                  #{d.code} - {d.name} ({d.team})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Metric Mode Filter Tabs & Playback Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-slate-800">
          {['SPEED', 'THROTTLE', 'BRAKE', 'GEAR'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                soundFx.playClick();
                setActiveMetricTab(tab);
              }}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                activeMetricTab === tab
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,243,255,0.5)] font-orbitron'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Lap Scrub Playback Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playClick();
              setIsPlaying(!isPlaying);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold hover:bg-cyan-500/20 transition-all"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'PAUSE SCRUB' : 'PLAY LAP TRACE'}</span>
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setPlaybackIndex(0);
              setHoverIndex(null);
            }}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
            title="Reset Lap Position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive SVG Telemetry Trace Canvas */}
      <div className="relative w-full overflow-hidden bg-slate-950/90 rounded-2xl p-4 border border-slate-850">
        
        {/* Hover Crosshair Telemetry Stats Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 font-mono text-xs bg-slate-900/70 p-3 rounded-xl border border-slate-800/90">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">DIST. POINT</span>
            <span className="font-bold text-white text-sm font-orbitron">{currentData.distance}m ({currentData.percent}%)</span>
          </div>
          <div>
            <span className="text-[10px] uppercase block font-semibold" style={{ color: driverAObj.color }}>
              {driverA} {activeMetricTab}
            </span>
            <span className="font-bold text-cyan-400 text-sm font-orbitron">
              {activeMetricTab === 'SPEED' ? `${Math.round(currentData.speedA * speedMultiplier)} ${unitLabel}` :
               activeMetricTab === 'THROTTLE' ? `${currentData.throttleA}%` :
               activeMetricTab === 'BRAKE' ? `${currentData.brakeA}%` :
               `GEAR ${currentData.gearA}`}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase block font-semibold" style={{ color: driverBObj.color }}>
              {driverB} {activeMetricTab}
            </span>
            <span className="font-bold text-amber-400 text-sm font-orbitron">
              {activeMetricTab === 'SPEED' ? `${Math.round(currentData.speedB * speedMultiplier)} ${unitLabel}` :
               activeMetricTab === 'THROTTLE' ? `${currentData.throttleB}%` :
               activeMetricTab === 'BRAKE' ? `${currentData.brakeB}%` :
               `GEAR ${currentData.gearB}`}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 uppercase block font-semibold">SPEED DELTA</span>
            <span className={`font-bold text-sm font-orbitron ${currentData.speedA >= currentData.speedB ? 'text-cyan-400' : 'text-orange-400'}`}>
              {currentData.speedA >= currentData.speedB ? '+' : ''}{Math.round((currentData.speedA - currentData.speedB) * speedMultiplier)} {unitLabel}
            </span>
          </div>
        </div>

        {/* SVG Plot */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-52 select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="gradA" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={driverAObj.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={driverAObj.color} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradB" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={driverBObj.color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={driverBObj.color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#1e293b" strokeDasharray="4" />
          <line x1="0" y1={padding} x2={width} y2={padding} stroke="#1e293b" strokeDasharray="4" />

          {/* Gradient fill under curves */}
          <polygon points={areaA} fill="url(#gradA)" />
          <polygon points={areaB} fill="url(#gradB)" />

          {/* Driver A Speed Curve */}
          <polyline
            fill="none"
            stroke={driverAObj.color}
            strokeWidth="3"
            points={pointsA}
            className="drop-shadow-[0_0_12px_rgba(0,243,255,0.8)]"
          />

          {/* Driver B Speed Curve */}
          <polyline
            fill="none"
            stroke={driverBObj.color}
            strokeWidth="3"
            points={pointsB}
            className="drop-shadow-[0_0_12px_rgba(255,128,0,0.8)]"
          />

          {/* Interactive Hover Vertical Crosshair */}
          {telemetryData.map((d, i) => {
            const x = padding + (i / (telemetryData.length - 1)) * (width - padding * 2);
            return (
              <rect
                key={i}
                x={x - width / (telemetryData.length * 2)}
                y="0"
                width={width / telemetryData.length}
                height={height}
                fill="transparent"
                onMouseEnter={() => {
                  soundFx.playTelemetryBeep();
                  setHoverIndex(i);
                }}
                className="cursor-crosshair hover:fill-cyan-500/10 transition-colors"
              />
            );
          })}

          {/* Current Crosshair Line */}
          <line
            x1={padding + (currentIndex / (telemetryData.length - 1)) * (width - padding * 2)}
            y1="0"
            x2={padding + (currentIndex / (telemetryData.length - 1)) * (width - padding * 2)}
            y2={height}
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        </svg>

        {/* Dynamic Throttle & Brake Bar Telemetry Indicators */}
        <div className="grid grid-cols-2 gap-4 mt-2 font-mono text-xs pt-3 border-t border-slate-900">
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold">
              <span>{driverA} THROTTLE / BRAKE</span>
              <span className="text-cyan-400">{currentData.throttleA}% / {currentData.brakeA}%</span>
            </div>
            <div className="flex gap-1 h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <motion.div 
                className="h-full rounded-full shadow-[0_0_8px_#00f3ff]" 
                style={{ backgroundColor: driverAObj.color }}
                animate={{ width: `${currentData.throttleA}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
              <motion.div 
                className="bg-red-500 h-full rounded-full shadow-[0_0_8px_#ef4444]" 
                animate={{ width: `${currentData.brakeA}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold">
              <span>{driverB} THROTTLE / BRAKE</span>
              <span className="text-orange-400">{currentData.throttleB}% / {currentData.brakeB}%</span>
            </div>
            <div className="flex gap-1 h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <motion.div 
                className="h-full rounded-full shadow-[0_0_8px_#f97316]" 
                style={{ backgroundColor: driverBObj.color }}
                animate={{ width: `${currentData.throttleB}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
              <motion.div 
                className="bg-red-500 h-full rounded-full shadow-[0_0_8px_#ef4444]" 
                animate={{ width: `${currentData.brakeB}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
}
