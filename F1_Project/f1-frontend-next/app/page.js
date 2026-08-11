'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Radio, Activity, Timer, ChevronDown, Flag, Database, RefreshCw, Cpu, Award } from 'lucide-react';
import CinematicTrackScene from '@/components/CinematicTrackScene';
import TrackCanvas3D from '@/components/TrackCanvas3D';
import { fetchCircuitData, fetchDriversData } from '@/lib/api';

export default function Home() {
  const containerRef = useRef(null);
  const scrollProgressRef = useRef(0);

  // State for Django API Integration
  const [selectedCircuit, setSelectedCircuit] = useState('monaco');
  const [circuitData, setCircuitData] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loadingCircuit, setLoadingCircuit] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [isApiFallback, setIsApiFallback] = useState(false);

  // Fetch circuit data from Django
  useEffect(() => {
    let active = true;
    setLoadingCircuit(true);
    fetchCircuitData(selectedCircuit)
      .then((data) => {
        if (active) {
          setCircuitData(data);
          setIsApiFallback(data.isFallback || false);
          setLoadingCircuit(false);
        }
      })
      .catch(() => {
        if (active) {
          setLoadingCircuit(false);
        }
      });
    return () => {
      active = false;
    };
  }, [selectedCircuit]);

  // Fetch driver data from Django
  useEffect(() => {
    let active = true;
    setLoadingDrivers(true);
    fetchDriversData()
      .then((data) => {
        if (active) {
          setDrivers(data);
          setLoadingDrivers(false);
        }
      })
      .catch(() => {
        if (active) {
          setLoadingDrivers(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  // Framer Motion Scroll Listener
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Sync scroll progress value to the 3D Canvas ref without causing React re-renders
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
        <CinematicTrackScene scrollProgress={scrollProgressRef} trackName={selectedCircuit.toUpperCase()} />
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

        {/* SECTION 2: INTERACTIVE 3D TELEMETRY SUITE */}
        <section id="telemetry" className="min-h-screen py-24 flex items-center justify-center px-6 md:px-16 pointer-events-none">
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: High-tech HUD telemetry cards & controls */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ margin: "-20%" }}
              className="pointer-events-auto lg:col-span-5 bg-slate-950/80 backdrop-blur-xl border border-slate-800/90 p-6 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.9)] space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-pulse" /> Live Telemetry Suite
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 mt-0.5 font-semibold">CIRCUIT CONTROLLER // V2.0</span>
                </div>
                {/* Django Connection Status Badge */}
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                  isApiFallback 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  <Database className="w-3 h-3" />
                  <span>{isApiFallback ? 'OFFLINE FALLBACK' : 'DJANGO API LIVE'}</span>
                </div>
              </div>

              {/* Circuit Switcher Controls */}
              <div className="space-y-3">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Select Telemetry Circuit</span>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setSelectedCircuit('monaco')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all border ${
                      selectedCircuit === 'monaco'
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    MONACO GP
                  </button>
                  <button 
                    onClick={() => setSelectedCircuit('silverstone')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all border ${
                      selectedCircuit === 'silverstone'
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    SILVERSTONE GP
                  </button>
                </div>
              </div>

              {/* Active Circuit Info Card */}
              <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 font-bold">
                  <span>ACTIVE CIRCUIT METADATA</span>
                  <Cpu className="w-3.5 h-3.5 text-cyan-500" />
                </div>
                {loadingCircuit ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 py-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>Synchronizing database...</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white tracking-wide">
                      {circuitData?.track_name || 'Loading...'}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      Location: {circuitData?.locality}, {circuitData?.country}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate max-w-full">
                      Path Matrix: {circuitData?.svg_path ? `${circuitData.svg_path.substring(0, 30)}...` : 'N/A'}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Telemetry Progress Feeds */}
              <div className="space-y-3 font-mono text-xs border-t border-slate-900 pt-4">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>LIVE VEHICLE THROTTLE</span>
                    <span className="text-cyan-400">92.4%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 w-[92.4%] transition-all duration-300" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>LIVE BRAKE LOAD</span>
                    <span className="text-red-400">4.2%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[4.2%] transition-all duration-300" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Telemetry Signal Quality</span>
                    <span className="text-emerald-400">99.8% (EXCELLENT)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[99.8%] transition-all duration-300" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Dynamic interactive 3D Canvas */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ margin: "-20%" }}
              className="pointer-events-auto lg:col-span-7 w-full"
            >
              <TrackCanvas3D 
                circuitData={circuitData}
                trackColor="#00f3ff"
                emissiveColor="#00c8ff"
                glowColor="#ff0055"
                gridColor="#ff0055"
                autoRotate={true}
              />
            </motion.div>
            
          </div>
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
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2">
                <Flag className="w-4 h-4 text-amber-400" /> LEADERBOARD STANDINGS
              </h3>
              <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500 font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                <Award className="w-3 h-3 text-cyan-400" /> LIVE FROM OPENF1
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs max-h-[300px] overflow-y-auto pr-1">
              {loadingDrivers ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
                  <span className="text-[10px] tracking-wider uppercase font-semibold">Fetching Standings...</span>
                </div>
              ) : (
                drivers.map((driver, index) => (
                  <div 
                    key={driver.number || index} 
                    className="flex items-center justify-between p-2.5 bg-slate-900/50 hover:bg-slate-900/80 rounded-xl border border-slate-800/80 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500">#{driver.number}</span>
                      <span 
                        className="w-1.5 h-6 rounded-full" 
                        style={{ backgroundColor: driver.team_color || '#FFFFFF' }}
                      />
                      <span className="text-cyan-400 font-bold uppercase tracking-wide">
                        {driver.abbreviation} <span className="text-white font-medium text-[11px] normal-case tracking-normal ml-0.5">{driver.name.split(' ').pop()}</span>
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">{driver.team.toUpperCase()}</div>
                    <span className="text-amber-400 font-bold text-xs">
                      {300 - index * 25} PTS
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}
