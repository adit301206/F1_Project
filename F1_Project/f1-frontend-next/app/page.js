'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Radio, Activity, Timer, ChevronDown, Flag } from 'lucide-react';
import CinematicTrackScene from '@/components/CinematicTrackScene';

export default function Home() {
  const containerRef = useRef(null);
  const scrollProgressRef = useRef(0);

  // Framer Motion Scroll Listener
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Continuously sync scroll progress value to the 3D Canvas ref without causing React re-renders
  useEffect(() => {
    if (scrollYProgress.on) {
      return scrollYProgress.on('change', (latest) => {
        scrollProgressRef.current = latest;
      });
    } else if (scrollYProgress.onChange) {
      return scrollYProgress.onChange((latest) => {
        scrollProgressRef.current = latest;
      });
    }
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="bg-[#020617] text-white font-sans relative selection:bg-cyan-500 selection:text-black min-h-[300vh]">
      
      {/* 1. FLOATING GLASS NAVBAR */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-2.5 bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-full flex items-center gap-8 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 text-black font-black px-2 py-0.5 rounded text-xs tracking-widest italic">
            F1
          </div>
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-200">
            PADDOCK 3D
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-400">
          <a href="#hero" className="hover:text-cyan-400 transition-colors">01. HERO</a>
          <a href="#telemetry" className="hover:text-cyan-400 transition-colors">02. TELEMETRY</a>
          <a href="#standings" className="hover:text-cyan-400 transition-colors">03. STANDINGS</a>
        </div>

        <button className="px-3.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-mono transition-all flex items-center gap-1.5">
          <Radio className="w-3 h-3 animate-pulse" /> LIVE STREAM
        </button>
      </nav>

      {/* 2. FIXED 3D CANVAS BACKGROUND CONTAINER */}
      <div className="fixed inset-0 z-0 w-full h-screen">
        <CinematicTrackScene scrollProgress={scrollProgressRef} trackName="MONACO" />
      </div>

      {/* 3. SCROLLABLE CONTENT OVERLAY STACK */}
      <div className="relative z-10">
        
        {/* SECTION 1: HERO & SESSION TIMER */}
        <section id="hero" className="h-screen flex flex-col justify-between items-center pt-24 pb-12 px-6 pointer-events-none">
          
          {/* Upcoming Race Timer Widget */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-auto bg-slate-950/70 backdrop-blur-md border border-slate-800/80 px-6 py-3 rounded-2xl flex items-center gap-6 shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-red-500" />
              <span className="text-xs font-mono text-slate-400 uppercase">NEXT GP IN:</span>
            </div>
            <div className="flex items-center gap-3 font-mono font-bold text-sm text-cyan-400">
              <span>02D</span>:<span>14H</span>:<span>38M</span>:<span>12S</span>
            </div>
          </motion.div>

          {/* Scroll Prompt */}
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2 font-mono text-[10px] text-slate-400 uppercase tracking-widest"
          >
            <span>SCROLL TO ENTER RACE TRACK</span>
            <ChevronDown className="w-4 h-4 text-cyan-400" />
          </motion.div>
        </section>

        {/* SECTION 2: TELEMETRY HUD OVERLAY (Revealed on Scroll) */}
        <section id="telemetry" className="h-screen flex items-center justify-start px-8 md:px-20 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ margin: "-20%" }}
            className="pointer-events-auto max-w-md bg-slate-950/80 backdrop-blur-xl border border-slate-800/90 p-6 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.9)] space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-2">
                <Activity className="w-4 h-4" /> CAR #1 TELEMETRY FEED
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded">
                GEAR 7 // 312 KM/H
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>THROTTLE PRESSURE</span>
                  <span className="text-cyan-400">98%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 w-[98%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>BRAKE FORCE</span>
                  <span className="text-red-400">0%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-[0%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>DRS STATUS</span>
                  <span className="text-emerald-400">AVAILABLE</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 3: DRIVER LEADERBOARD OVERLAY */}
        <section id="standings" className="h-screen flex items-center justify-end px-8 md:px-20 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ margin: "-20%" }}
            className="pointer-events-auto max-w-md w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800/90 p-6 rounded-2xl shadow-2xl space-y-4"
          >
            <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Flag className="w-4 h-4 text-amber-400" /> LEADERBOARD STANDINGS
            </h3>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-cyan-400 font-bold">P1. M. VERSTAPPEN</span>
                <span className="text-slate-400">RED BULL</span>
                <span className="text-amber-400 font-bold">195 PTS</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-cyan-400 font-bold">P2. C. LECLERC</span>
                <span className="text-slate-400">FERRARI</span>
                <span className="text-amber-400 font-bold">138 PTS</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-cyan-400 font-bold">P3. L. NORRIS</span>
                <span className="text-slate-400">MCLAREN</span>
                <span className="text-amber-400 font-bold">131 PTS</span>
              </div>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}
