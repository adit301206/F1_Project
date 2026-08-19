'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Gauge, TrendingUp, Sliders, Zap } from 'lucide-react';
import { generateLapTelemetry } from '@/lib/telemetryData';
import { soundFx } from '@/lib/audioFx';

export default function TelemetryGraph({ unit = 'kmh' }) {
  const [driverA, setDriverA] = useState('VER');
  const [driverB, setDriverB] = useState('NOR');
  const [hoverIndex, setHoverIndex] = useState(null);

  const telemetryData = useMemo(() => generateLapTelemetry(driverA, driverB), [driverA, driverB]);

  const speedMultiplier = unit === 'mph' ? 0.621371 : 1;
  const unitLabel = unit === 'mph' ? 'MPH' : 'KM/H';

  const hoverData = hoverIndex !== null ? telemetryData[hoverIndex] : telemetryData[Math.floor(telemetryData.length / 2)];

  // SVG dimensions for smooth telemetry plot
  const width = 640;
  const height = 200;
  const padding = 20;

  const pointsA = useMemo(() => {
    return telemetryData.map((d, i) => {
      const x = padding + (i / (telemetryData.length - 1)) * (width - padding * 2);
      const y = height - padding - (d.speedA / 360) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');
  }, [telemetryData]);

  const pointsB = useMemo(() => {
    return telemetryData.map((d, i) => {
      const x = padding + (i / (telemetryData.length - 1)) * (width - padding * 2);
      const y = height - padding - (d.speedB / 360) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');
  }, [telemetryData]);

  // Gradient area points
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass-panel p-6 rounded-3xl border border-slate-800/90 shadow-2xl space-y-5 backdrop-blur-xl"
    >
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4 animate-pulse text-cyan-400" />
            <span>LIVE TELEMETRY TRACE ANALYSIS</span>
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            SPEED & THROTTLE TELEMETRY OVERLAP // CIRCUIT DISTANCE
          </p>
        </div>

        {/* Driver Selection Switches */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-blue-500/30 shadow-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#3671C2] shadow-[0_0_8px_#3671C2]" />
            <span className="text-slate-300 font-bold">P1:</span>
            <select
              value={driverA}
              onChange={(e) => {
                soundFx.playClick();
                setDriverA(e.target.value);
              }}
              className="bg-transparent text-cyan-400 font-bold focus:outline-none cursor-pointer"
            >
              <option value="VER" className="bg-slate-950 text-white">VER (Red Bull)</option>
              <option value="LEC" className="bg-slate-950 text-white">LEC (Ferrari)</option>
              <option value="HAM" className="bg-slate-950 text-white">HAM (Ferrari)</option>
            </select>
          </motion.div>

          <span className="text-slate-600 font-bold text-xs">VS</span>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-orange-500/30 shadow-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF8000] shadow-[0_0_8px_#FF8000]" />
            <span className="text-slate-300 font-bold">P2:</span>
            <select
              value={driverB}
              onChange={(e) => {
                soundFx.playClick();
                setDriverB(e.target.value);
              }}
              className="bg-transparent text-orange-400 font-bold focus:outline-none cursor-pointer"
            >
              <option value="NOR" className="bg-slate-950 text-white">NOR (McLaren)</option>
              <option value="PIA" className="bg-slate-950 text-white">PIA (McLaren)</option>
              <option value="RUS" className="bg-slate-950 text-white">RUS (Mercedes)</option>
            </select>
          </motion.div>
        </div>
      </div>

      {/* Interactive SVG Telemetry Trace Canvas */}
      <div className="relative w-full overflow-hidden bg-slate-950/90 rounded-2xl p-4 border border-slate-850">
        
        {/* Hover Crosshair Telemetry Stats Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-mono text-xs bg-slate-900/70 p-3 rounded-xl border border-slate-800/90">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">DIST. POINT</span>
            <span className="font-bold text-white text-sm font-orbitron">{hoverData.distance}m ({hoverData.percent}%)</span>
          </div>
          <div>
            <span className="text-[10px] text-[#3671C2] uppercase block font-semibold">{driverA} SPEED</span>
            <span className="font-bold text-cyan-400 text-sm font-orbitron">{Math.round(hoverData.speedA * speedMultiplier)} {unitLabel}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#FF8000] uppercase block font-semibold">{driverB} SPEED</span>
            <span className="font-bold text-amber-400 text-sm font-orbitron">{Math.round(hoverData.speedB * speedMultiplier)} {unitLabel}</span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 uppercase block font-semibold">SPEED DELTA</span>
            <span className={`font-bold text-sm font-orbitron ${hoverData.speedA >= hoverData.speedB ? 'text-cyan-400' : 'text-orange-400'}`}>
              {hoverData.speedA >= hoverData.speedB ? '+' : ''}{Math.round((hoverData.speedA - hoverData.speedB) * speedMultiplier)} {unitLabel}
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
              <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00f3ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradB" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff8000" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ff8000" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#1e293b" strokeDasharray="4" />
          <line x1="0" y1={padding} x2={width} y2={padding} stroke="#1e293b" strokeDasharray="4" />

          {/* Gradient fill under curves */}
          <polygon points={areaA} fill="url(#gradA)" />
          <polygon points={areaB} fill="url(#gradB)" />

          {/* Driver A Speed Curve (Cyan) */}
          <polyline
            fill="none"
            stroke="#00f3ff"
            strokeWidth="3"
            points={pointsA}
            className="drop-shadow-[0_0_12px_rgba(0,243,255,0.8)]"
          />

          {/* Driver B Speed Curve (Orange) */}
          <polyline
            fill="none"
            stroke="#ff8000"
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
          {hoverIndex !== null && (
            <line
              x1={padding + (hoverIndex / (telemetryData.length - 1)) * (width - padding * 2)}
              y1="0"
              x2={padding + (hoverIndex / (telemetryData.length - 1)) * (width - padding * 2)}
              y2={height}
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeDasharray="2"
            />
          )}
        </svg>

        {/* Dynamic Throttle & Brake Bar Telemetry Indicators */}
        <div className="grid grid-cols-2 gap-4 mt-2 font-mono text-xs pt-3 border-t border-slate-900">
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold">
              <span>{driverA} THROTTLE / BRAKE</span>
              <span className="text-cyan-400">{hoverData.throttleA}% / {hoverData.brakeA}%</span>
            </div>
            <div className="flex gap-1 h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <motion.div 
                className="bg-cyan-400 h-full rounded-full shadow-[0_0_8px_#00f3ff]" 
                animate={{ width: `${hoverData.throttleA}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
              <motion.div 
                className="bg-red-500 h-full rounded-full shadow-[0_0_8px_#ef4444]" 
                animate={{ width: `${hoverData.brakeA}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold">
              <span>{driverB} THROTTLE / BRAKE</span>
              <span className="text-orange-400">{hoverData.throttleB}% / {hoverData.brakeB}%</span>
            </div>
            <div className="flex gap-1 h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <motion.div 
                className="bg-orange-400 h-full rounded-full shadow-[0_0_8px_#f97316]" 
                animate={{ width: `${hoverData.throttleB}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
              <motion.div 
                className="bg-red-500 h-full rounded-full shadow-[0_0_8px_#ef4444]" 
                animate={{ width: `${hoverData.brakeB}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
}

