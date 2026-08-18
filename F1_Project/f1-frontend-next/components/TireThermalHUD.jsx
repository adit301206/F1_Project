'use client';

import React from 'react';
import { Shield, AlertTriangle, Thermometer } from 'lucide-react';

export default function TireThermalHUD() {
  const tires = [
    { pos: 'FL', temp: 104, coreTemp: 98, wear: 88, status: 'OPTIMAL', compound: 'SOFT (C5)' },
    { pos: 'FR', temp: 108, coreTemp: 101, wear: 84, status: 'WARM', compound: 'SOFT (C5)' },
    { pos: 'RL', temp: 99, coreTemp: 94, wear: 91, status: 'OPTIMAL', compound: 'SOFT (C5)' },
    { pos: 'RR', temp: 102, coreTemp: 96, wear: 89, status: 'OPTIMAL', compound: 'SOFT (C5)' },
  ];

  const getTempColor = (temp) => {
    if (temp > 106) return 'text-red-400 border-red-500/50 bg-red-500/10';
    if (temp >= 98) return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
    return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10';
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800/90 shadow-2xl space-y-4">
      
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
      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        {tires.map((tire) => (
          <div 
            key={tire.pos}
            className={`p-3 rounded-2xl border transition-all ${getTempColor(tire.temp)} space-y-1.5`}
          >
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="uppercase">{tire.pos} TIRE</span>
              <span className="opacity-80">{tire.status}</span>
            </div>
            
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-bold font-orbitron">{tire.temp}°C</span>
              <span className="text-[10px] text-slate-400">CORE: {tire.coreTemp}°C</span>
            </div>

            {/* Tire Wear Bar */}
            <div>
              <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                <span>LIFE</span>
                <span className="font-bold text-white">{tire.wear}%</span>
              </div>
              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${tire.wear < 50 ? 'bg-red-500' : 'bg-emerald-400'} transition-all`}
                  style={{ width: `${tire.wear}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Strategy Summary Pill */}
      <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-[11px] font-mono text-slate-300">
        <span className="text-slate-400">ESTIMATED PIT WINDOW:</span>
        <span className="font-bold text-cyan-400">LAP 18 - 22 (TARGET HARD)</span>
      </div>

    </div>
  );
}
