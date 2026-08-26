'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Thermometer } from 'lucide-react';
import { soundFx } from '@/lib/audioFx';

export default function TireThermalHUD() {
  const [selectedCompound, setSelectedCompound] = useState('SOFT');

  const compoundPresets = {
    SOFT: {
      name: 'SOFT (C5)',
      badgeColor: 'text-red-400 bg-red-500/10 border-red-500/30',
      pitWindow: 'LAP 18 - 22 (TARGET HARD COMPOUND)',
      tires: [
        { pos: 'FL', temp: 104, coreTemp: 98, wear: 88, status: 'OPTIMAL' },
        { pos: 'FR', temp: 108, coreTemp: 101, wear: 84, status: 'WARM' },
        { pos: 'RL', temp: 99, coreTemp: 94, wear: 91, status: 'OPTIMAL' },
        { pos: 'RR', temp: 102, coreTemp: 96, wear: 89, status: 'OPTIMAL' },
      ]
    },
    MEDIUM: {
      name: 'MEDIUM (C4)',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      pitWindow: 'LAP 28 - 34 (TARGET SOFT COMPOUND)',
      tires: [
        { pos: 'FL', temp: 96, coreTemp: 92, wear: 94, status: 'OPTIMAL' },
        { pos: 'FR', temp: 99, coreTemp: 95, wear: 92, status: 'OPTIMAL' },
        { pos: 'RL', temp: 93, coreTemp: 89, wear: 96, status: 'OPTIMAL' },
        { pos: 'RR', temp: 95, coreTemp: 91, wear: 95, status: 'OPTIMAL' },
      ]
    },
    HARD: {
      name: 'HARD (C3)',
      badgeColor: 'text-slate-200 bg-white/10 border-white/20',
      pitWindow: 'LAP 45 - 50 (TARGET SOFT COMPOUND)',
      tires: [
        { pos: 'FL', temp: 88, coreTemp: 85, wear: 98, status: 'COOL' },
        { pos: 'FR', temp: 90, coreTemp: 87, wear: 97, status: 'OPTIMAL' },
        { pos: 'RL', temp: 86, coreTemp: 83, wear: 99, status: 'COOL' },
        { pos: 'RR', temp: 88, coreTemp: 85, wear: 98, status: 'OPTIMAL' },
      ]
    },
    WET: {
      name: 'INTERMEDIATE',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      pitWindow: 'DEPENDS ON RAIN INTENSITY (FULL WET IF TRACK > 4MM WATER)',
      tires: [
        { pos: 'FL', temp: 78, coreTemp: 75, wear: 92, status: 'WET TREAD' },
        { pos: 'FR', temp: 80, coreTemp: 76, wear: 90, status: 'WET TREAD' },
        { pos: 'RL', temp: 76, coreTemp: 72, wear: 94, status: 'WET TREAD' },
        { pos: 'RR', temp: 78, coreTemp: 74, wear: 93, status: 'WET TREAD' },
      ]
    }
  };

  const activeData = compoundPresets[selectedCompound];

  const getTempColor = (temp) => {
    if (temp > 106) return 'text-red-400 border-red-500/50 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
    if (temp >= 95) return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider">
          <Thermometer className="w-4 h-4 text-cyan-400" />
          <span>TIRE DEGRADATION & THERMAL HUD</span>
        </div>

        {/* Compound Filter Buttons */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-slate-800 text-[10px]">
          {['SOFT', 'MEDIUM', 'HARD', 'WET'].map((cpd) => (
            <button
              key={cpd}
              onClick={() => {
                soundFx.playClick();
                setSelectedCompound(cpd);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedCompound === cpd 
                  ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(255,24,1,0.5)] font-orbitron' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cpd}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Wheel Chassis Layout Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        {activeData.tires.map((tire) => (
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
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`h-full rounded-full ${tire.wear < 50 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-emerald-400 shadow-[0_0_8px_#10b981]'}`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Strategy Summary Pill */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between text-[11px] font-mono text-slate-300">
        <span className="text-slate-400 font-bold">ESTIMATED PIT WINDOW ({activeData.name}):</span>
        <span className="font-bold text-cyan-400 font-orbitron text-xs truncate max-w-sm">{activeData.pitWindow}</span>
      </div>

    </motion.div>
  );
}


