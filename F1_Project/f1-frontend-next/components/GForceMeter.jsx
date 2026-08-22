'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Target, ShieldAlert } from 'lucide-react';
import { getGForceMetrics } from '@/lib/telemetryData';

export default function GForceMeter() {
  const [gMetrics, setGMetrics] = useState(getGForceMetrics());
  const [ballPos, setBallPos] = useState({ x: 0, y: 0 });
  const [historyTrail, setHistoryTrail] = useState([]);

  // Simulate dynamic G-Force fluctuations with history trail
  useEffect(() => {
    const interval = setInterval(() => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 18 + Math.random() * 48; // radius in px inside canvas
      const newX = Math.cos(angle) * radius;
      const newY = Math.sin(angle) * radius;

      setBallPos({ x: newX, y: newY });
      setHistoryTrail(prev => [
        { x: newX, y: newY, id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` },
        ...prev.slice(0, 4)
      ]);

      setGMetrics({
        lateralG: (Math.sin(angle) * 4.2).toFixed(2),
        longitudinalG: (Math.cos(angle) * 4.8).toFixed(2),
        verticalG: (1 + Math.random() * 0.3).toFixed(2),
        peakBrakingG: 5.10,
        peakCorneringG: 4.45,
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const totalG = Math.sqrt(
    Math.pow(parseFloat(gMetrics.lateralG), 2) + Math.pow(parseFloat(gMetrics.longitudinalG), 2)
  ).toFixed(2);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass-panel p-5 rounded-3xl border border-slate-800/90 shadow-2xl flex flex-col justify-between space-y-4 backdrop-blur-xl"
    >
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
          <Target className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>G-FORCE FRICTION VECTOR</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          COMBINED: <span className="text-cyan-400 font-orbitron">{totalG} G</span>
        </span>
      </div>

      {/* 2D Circular Radar G-Meter */}
      <div className="relative flex items-center justify-center my-2 select-none">
        
        {/* Radar Scanner Line */}
        <div className="absolute w-44 h-44 rounded-full border border-cyan-500/10 pointer-events-none overflow-hidden flex items-center justify-center">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-laser-sweep" />
        </div>

        {/* Outer Circular Rings */}
        <div className="w-44 h-44 rounded-full border border-cyan-500/20 bg-slate-950/90 flex items-center justify-center relative shadow-[inset_0_0_25px_rgba(0,243,255,0.08)]">
          <div className="w-32 h-32 rounded-full border border-cyan-500/30 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-dashed border-slate-700 flex items-center justify-center" />
          </div>

          {/* Crosshair Axes */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-[1px] bg-slate-800/80" />
            <div className="h-full w-[1px] bg-slate-800/80 absolute" />
          </div>

          {/* Directional Cardinal Labels */}
          <span className="absolute top-1 text-[9px] font-mono font-bold text-red-500 tracking-wider">BRAKE (-G)</span>
          <span className="absolute bottom-1 text-[9px] font-mono font-bold text-emerald-400 tracking-wider">ACCEL (+G)</span>
          <span className="absolute left-2 text-[9px] font-mono font-bold text-cyan-400 tracking-wider">LEFT</span>
          <span className="absolute right-2 text-[9px] font-mono font-bold text-cyan-400 tracking-wider">RIGHT</span>

          {/* Friction Vector Trail Dots */}
          {historyTrail.map((trail, idx) => (
            <div
              key={trail.id}
              className="absolute w-2 h-2 rounded-full bg-cyan-500 pointer-events-none transition-opacity"
              style={{
                transform: `translate(${trail.x}px, ${trail.y}px)`,
                opacity: 0.5 - idx * 0.1,
              }}
            />
          ))}

          {/* Dynamic Friction Ball */}
          <motion.div
            className="absolute w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_18px_rgba(0,243,255,1)] z-10"
            animate={{
              x: ballPos.x,
              y: ballPos.y,
            }}
            transition={{
              type: 'spring',
              stiffness: 180,
              damping: 18,
            }}
          />
        </div>

      </div>

      {/* Live Readout Metrics */}
      <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-2 border-t border-slate-900">
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex justify-between items-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">LATERAL G</span>
          <span className="font-bold text-cyan-400 text-sm font-orbitron">{Math.abs(gMetrics.lateralG)} G</span>
        </div>
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex justify-between items-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">LONG. G</span>
          <span className="font-bold text-amber-400 text-sm font-orbitron">{gMetrics.longitudinalG} G</span>
        </div>
      </div>

    </motion.div>
  );
}

