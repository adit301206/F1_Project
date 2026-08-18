'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Zap, BatteryCharging, Flame } from 'lucide-react';

export default function PowerUnitGauge() {
  const [rpm, setRpm] = useState(11800);
  const [batteryPercent, setBatteryPercent] = useState(84);
  const [mgukState, setMgukState] = useState('HARVESTING');

  useEffect(() => {
    const interval = setInterval(() => {
      const nextRpm = 10200 + Math.floor(Math.random() * 2400);
      setRpm(nextRpm);
      setMgukState(nextRpm > 12000 ? 'DEPLOYING' : 'HARVESTING');
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // Compute shift LED lights active state (10 LEDs)
  const shiftLeds = Math.min(10, Math.max(0, Math.floor(((rpm - 10000) / 2800) * 10)));

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800/90 shadow-2xl space-y-4">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>V6 TURBO HYBRID POWER UNIT</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
          ICE + MGU-K + MGU-H
        </span>
      </div>

      {/* LED Shift Light Bar */}
      <div>
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1 font-bold">
          <span>ENGINE SPEED (RPM)</span>
          <span className="text-white">{rpm} RPM</span>
        </div>
        <div className="grid grid-cols-10 gap-1.5 h-3 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {Array.from({ length: 10 }).map((_, idx) => {
            const isActive = idx < shiftLeds;
            const colorClass = idx < 4 ? 'bg-emerald-400' : idx < 7 ? 'bg-amber-400' : 'bg-red-500';
            return (
              <div 
                key={idx} 
                className={`h-full rounded-sm transition-all duration-150 ${
                  isActive ? `${colorClass} shadow-[0_0_8px_rgba(255,255,255,0.6)]` : 'bg-slate-900'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* ERS Energy Battery & Flow Grid */}
      <div className="grid grid-cols-2 gap-3 font-mono text-xs pt-1">
        
        {/* Battery Ring HUD */}
        <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="#1e293b" strokeWidth="4" fill="transparent" />
              <circle 
                cx="24" 
                cy="24" 
                r="20" 
                stroke="#00f3ff" 
                strokeWidth="4" 
                fill="transparent" 
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * batteryPercent) / 100}
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-white">{batteryPercent}%</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold">ERS BATTERY</span>
            <span className="text-cyan-400 font-bold text-xs">SOC OK</span>
          </div>
        </div>

        {/* MGU-K Energy Flow State */}
        <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-bold">MGU-K FLOW</span>
            <BatteryCharging className={`w-3.5 h-3.5 ${mgukState === 'DEPLOYING' ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
          </div>
          <span className={`text-sm font-bold ${mgukState === 'DEPLOYING' ? 'text-amber-400' : 'text-emerald-400'}`}>
            {mgukState}
          </span>
        </div>

      </div>

    </div>
  );
}
