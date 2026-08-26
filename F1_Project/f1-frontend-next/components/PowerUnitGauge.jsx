'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, BatteryCharging, Flame, Radio } from 'lucide-react';
import { soundFx } from '@/lib/audioFx';

export default function PowerUnitGauge() {
  const [rpm, setRpm] = useState(11800);
  const [batteryPercent, setBatteryPercent] = useState(84);
  const [mgukState, setMgukState] = useState('HARVESTING');
  const [isBoosting, setIsBoosting] = useState(false);

  useEffect(() => {
    if (isBoosting) return;

    const interval = setInterval(() => {
      const nextRpm = 10200 + Math.floor(Math.random() * 2400);
      setRpm(nextRpm);
      setMgukState(nextRpm > 12000 ? 'DEPLOYING' : 'HARVESTING');
    }, 1200);

    return () => clearInterval(interval);
  }, [isBoosting]);

  const handleErsBoost = () => {
    if (isBoosting) return;
    soundFx.playTurboSpool();
    setIsBoosting(true);
    setRpm(13200);
    setMgukState('OVERTAKE BOOST');
    setBatteryPercent(prev => Math.max(10, prev - 8));

    setTimeout(() => {
      setIsBoosting(false);
      setRpm(11400);
      setMgukState('HARVESTING');
    }, 2500);
  };

  // Compute shift LED lights active state (10 LEDs)
  const shiftLeds = Math.min(10, Math.max(0, Math.floor(((rpm - 10000) / 2800) * 10)));
  const isRevLimiter = rpm > 12400 || isBoosting;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`glass-panel p-5 rounded-3xl border transition-all space-y-4 backdrop-blur-xl ${
        isBoosting 
          ? 'border-amber-400 bg-amber-950/30 shadow-[0_0_35px_rgba(245,158,11,0.4)]' 
          : 'border-slate-800/90 shadow-2xl'
      }`}
    >
      
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
          <span className={`font-orbitron font-bold text-xs ${isRevLimiter ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {rpm} RPM {isBoosting && '⚡ OVERTAKE'}
          </span>
        </div>
        <div className={`grid grid-cols-10 gap-1.5 h-3.5 bg-slate-950 p-1 rounded-xl border border-slate-800 transition-colors ${
          isRevLimiter ? 'border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : ''
        }`}>
          {Array.from({ length: 10 }).map((_, idx) => {
            const isActive = idx < shiftLeds;
            const colorClass = idx < 4 ? 'bg-emerald-400' : idx < 7 ? 'bg-amber-400' : 'bg-red-500';
            return (
              <motion.div 
                key={idx} 
                animate={isActive ? { scale: [0.95, 1.05, 1] } : { scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`h-full rounded-sm transition-all duration-150 ${
                  isActive ? `${colorClass} shadow-[0_0_10px_rgba(255,255,255,0.8)]` : 'bg-slate-900'
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
              <motion.circle 
                cx="24" 
                cy="24" 
                r="20" 
                stroke={isBoosting ? "#f59e0b" : "#00f3ff"} 
                strokeWidth="4" 
                fill="transparent" 
                strokeDasharray="125.6"
                animate={{ strokeDashoffset: 125.6 - (125.6 * batteryPercent) / 100 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-white font-orbitron">{batteryPercent}%</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold">ERS BATTERY</span>
            <span className={`font-bold text-xs ${isBoosting ? 'text-amber-400' : 'text-cyan-400'}`}>
              {isBoosting ? 'DISCHARGING' : 'SOC OK'}
            </span>
          </div>
        </div>

        {/* MGU-K Energy Flow State */}
        <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-bold">MGU-K FLOW</span>
            <BatteryCharging className={`w-3.5 h-3.5 ${isBoosting ? 'text-amber-400 animate-spin' : mgukState === 'DEPLOYING' ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
          </div>
          <span className={`text-xs font-bold font-orbitron ${isBoosting ? 'text-amber-400' : mgukState === 'DEPLOYING' ? 'text-amber-400' : 'text-emerald-400'}`}>
            {mgukState}
          </span>
        </div>

      </div>

      {/* Interactive Push to Pass ERS Trigger Button */}
      <button
        onClick={handleErsBoost}
        disabled={isBoosting}
        className={`w-full py-2.5 rounded-2xl font-orbitron font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${
          isBoosting 
            ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.8)] animate-pulse'
            : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.2)]'
        }`}
      >
        <Zap className="w-4 h-4 fill-current" />
        <span>{isBoosting ? '⚡ OVERTAKE BOOST ACTIVE!' : 'TRIGGER ERS OVERTAKE BOOST'}</span>
      </button>

    </motion.div>
  );
}


