'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Thermometer } from 'lucide-react';

export default function TireThermalHUD() {
  const tires = [
    { pos: 'FL', temp: 104, coreTemp: 98, wear: 88, status: 'OPTIMAL', compound: 'SOFT (C5)' },
    { pos: 'FR', temp: 108, coreTemp: 101, wear: 84, status: 'WARM', compound: 'SOFT (C5)' },
    { pos: 'RL', temp: 99, coreTemp: 94, wear: 91, status: 'OPTIMAL', compound: 'SOFT (C5)' },
    { pos: 'RR', temp: 102, coreTemp: 96, wear: 89, status: 'OPTIMAL', compound: 'SOFT (C5)' },
  ];

  const getTempColor = (temp) => {
    if (temp > 106) return 'text-red-400 border-red-500/50 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
    if (temp >= 98) return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
    return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-panel p-5 rounded-3xl border border-slate-800/90 shadow-2xl space-y-4 backdrop-blur-xl"
    >
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
          <Thermometer className="w-4 h-4 text-cyan-400" />
          <span>TIRE DEGRADATION & THERMAL HUD</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
          C5 SOFT COMPOUND
        </span>
      </div>

      {/* 4-Wheel Chassis Layout Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        {tires.map((tire) => (
          <motion.div 
            key={tire.pos}
            whileHover={{ scale: 1.03, y: -2 }}
            className={`p-3.5 rounded-2xl border transition-all ${getTempColor(tire.temp)} space-y-2`}
          >
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="uppercase font-orbitron">{tire.pos} TIRE</span>
              <span className="opacity-80 text-[9px] font-mono">{tire.status}</span>
            </div>
            
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-bold font-orbitron">{tire.temp}°C</span>
              <span className="text-[10px] text-slate-400">CORE: {tire.coreTemp}°C</span>
            </div>

            {/* Tire Wear Bar */}
            <div>
              <div className="flex justify-between text-[9px] text-slate-400 mb-1 font-bold">
                <span>LIFE</span>
                <span className="text-white">{tire.wear}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${tire.wear}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${tire.wear < 50 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-emerald-400 shadow-[0_0_8px_#10b981]'}`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Strategy Summary Pill */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between text-[11px] font-mono text-slate-300">
        <span className="text-slate-400 font-bold">ESTIMATED PIT WINDOW:</span>
        <span className="font-bold text-cyan-400 font-orbitron">LAP 18 - 22 (TARGET HARD COMPOUND)</span>
      </div>

    </motion.div>
  );
}

