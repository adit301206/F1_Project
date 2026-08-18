'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Target, ShieldAlert } from 'lucide-react';
import { getGForceMetrics } from '@/lib/telemetryData';

export default function GForceMeter() {
  const [gMetrics, setGMetrics] = useState(getGForceMetrics());
  const [ballPos, setBallPos] = useState({ x: 0, y: 0 });

  // Simulate dynamic G-Force fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 45; // radius in px inside canvas
      setBallPos({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      });

      setGMetrics({
        lateralG: (Math.sin(angle) * 4.2).toFixed(2),
        longitudinalG: (Math.cos(angle) * 4.8).toFixed(2),
        verticalG: (1 + Math.random() * 0.3).toFixed(2),
        peakBrakingG: 5.10,
        peakCorneringG: 4.45,
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800/90 shadow-2xl flex flex-col justify-between space-y-4">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
          <Target className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>G-FORCE FRICTION VECTOR</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          MAX 5.5 G
        </span>
      </div>

      {/* 2D Circular Radar G-Meter */}
      <div className="relative flex items-center justify-center my-2 select-none">
        
        {/* Outer Circular Rings */}
        <div className="w-44 h-44 rounded-full border border-cyan-500/20 bg-slate-950/80 flex items-center justify-center relative shadow-[inset_0_0_20px_rgba(0,243,255,0.05)]">
          <div className="w-32 h-32 rounded-full border border-cyan-500/30 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-dashed border-slate-700 flex items-center justify-center" />
          </div>

          {/* Crosshair Axes */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-[1px] bg-slate-800" />
            <div className="h-full w-[1px] bg-slate-800 absolute" />
          </div>

          {/* Directional Cardinal Labels */}
          <span className="absolute top-1 text-[9px] font-mono font-bold text-red-500">BRAKE (-G)</span>
          <span className="absolute bottom-1 text-[9px] font-mono font-bold text-emerald-400">ACCEL (+G)</span>
          <span className="absolute left-2 text-[9px] font-mono font-bold text-cyan-400">LEFT</span>
          <span className="absolute right-2 text-[9px] font-mono font-bold text-cyan-400">RIGHT</span>

          {/* Dynamic Friction Ball */}
          <div
            className="absolute w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_15px_rgba(0,243,255,0.9)] transition-all duration-700 ease-out"
            style={{
              transform: `translate(${ballPos.x}px, ${ballPos.y}px)`,
            }}
          />
        </div>

      </div>

      {/* Live Readout Metrics */}
      <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-2 border-t border-slate-900">
        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/80 flex justify-between items-center">
          <span className="text-[10px] text-slate-400 uppercase">LATERAL G</span>
          <span className="font-bold text-cyan-400 text-sm">{Math.abs(gMetrics.lateralG)} G</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/80 flex justify-between items-center">
          <span className="text-[10px] text-slate-400 uppercase">LONG. G</span>
          <span className="font-bold text-amber-400 text-sm">{gMetrics.longitudinalG} G</span>
        </div>
      </div>

    </div>
  );
}
