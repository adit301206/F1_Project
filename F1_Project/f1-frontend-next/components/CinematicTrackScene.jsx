'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Radio, Activity, Compass, ChevronRight, Gauge } from 'lucide-react';
import { getUpcomingRace, RACE_SCHEDULE } from '@/lib/raceCalendar';

export default function DynamicBroadcastHub() {
  const [activeRace, setActiveRace] = useState(() => getUpcomingRace());
  const [currentCornerIndex, setCurrentCornerIndex] = useState(0);

  // Simulate real-time ECU telemetry cycling through turns
  useEffect(() => {
    if (!activeRace) return;
    const interval = setInterval(() => {
      setCurrentCornerIndex((prev) => (prev + 1) % activeRace.corners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeRace]);

  if (!activeRace) return null;

  const currentCorner = activeRace.corners[currentCornerIndex];

  return (
    <div className="relative w-full h-screen bg-slate-950 text-white font-sans overflow-hidden select-none">
      
      {/* 1. REAL-WORLD VENUE PHOTOGRAPHIC BACKDROP */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.35] contrast-[1.15] transition-all duration-1000 scale-105"
        style={{ backgroundImage: `url('${activeRace.backdropUrl}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

      {/* 2. FLOATING RACE SELECTOR DECK (TOP RIGHT) */}
      <div className="absolute top-20 right-6 z-30 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800/80 shadow-2xl">
        {RACE_SCHEDULE.map((race) => (
          <button
            key={race.id}
            onClick={() => setActiveRace(race)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeRace.id === race.id
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {race.id.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 3. CENTERSTAGE VENUE TITLE & NEXT RACE COUNTDOWN */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center pointer-events-none px-4">
        
        {/* Session Status Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          key={activeRace.id}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4 pointer-events-auto backdrop-blur-md"
        >
          <Timer className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          UPCOMING GRAND PRIX // {activeRace.location}
        </motion.div>

        {/* Dynamic Venue Title */}
        <motion.h1 
          key={activeRace.name}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-8xl font-black italic tracking-tight text-white uppercase drop-shadow-[0_0_50px_rgba(0,0,0,0.9)] max-w-4xl"
        >
          {activeRace.name}
        </motion.h1>

        {/* Dynamic Corner Telemetry Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCorner.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="mt-8 bg-slate-950/85 backdrop-blur-xl border border-slate-800/90 px-8 py-5 rounded-3xl shadow-2xl pointer-events-auto max-w-md w-full"
          >
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.3em] block mb-1">
              LIVE SECTOR TELEMETRY // TURN {currentCorner.id}
            </span>
            <h3 className="text-2xl font-black italic text-white uppercase mb-4">
              {currentCorner.name}
            </h3>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs pt-3 border-t border-slate-800">
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                <span className="text-[10px] text-slate-500 block uppercase">APEX SPEED</span>
                <span className="font-bold text-cyan-400 text-lg">{currentCorner.speed} KM/H</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                <span className="text-[10px] text-slate-500 block uppercase">GEAR RATIO</span>
                <span className="font-bold text-red-500 text-lg">GEAR {currentCorner.gear}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 4. LEFT BROADCAST TIMING TOWER */}
      <div className="absolute top-20 left-6 z-20 w-72 bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /> F1 LIVE TOWER
          </span>
          <span className="text-[10px] font-mono text-cyan-400">SESSION: FP1</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          <div className="flex justify-between items-center p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <span className="font-bold text-cyan-300">1. M. VERSTAPPEN</span>
            <span className="text-cyan-400 font-bold">LEADER</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300">
            <span>2. C. LECLERC</span>
            <span className="text-slate-400">+ 0.182s</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300">
            <span>3. L. NORRIS</span>
            <span className="text-slate-400">+ 0.341s</span>
          </div>
        </div>
      </div>

    </div>
  );
}