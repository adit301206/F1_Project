'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Gauge, Flame, Shield, Radio, ChevronRight, Trophy, Zap } from 'lucide-react';
import TrackCanvas3D from '@/components/TrackCanvas3D';

const CIRCUITS = [
  { id: 'monaco', name: 'Circuit de Monaco', location: 'Monte Carlo, Monaco', length: '3.337 km', laps: '78 Laps / 19 Turns', record: '1:12.909', difficulty: 'EXPERT' },
  { id: 'monza', name: 'Autodromo Nazionale Monza', location: 'Monza, Italy', length: '5.793 km', laps: '53 Laps / 11 Turns', record: '1:21.046', difficulty: 'HIGH SPEED' },
  { id: 'spa', name: 'Circuit de Spa-Francorchamps', location: 'Stavelot, Belgium', length: '7.004 km', laps: '44 Laps / 20 Turns', record: '1:46.286', difficulty: 'TECHNICAL' },
  { id: 'silverstone', name: 'Silverstone Circuit', location: 'Silverstone, UK', length: '5.891 km', laps: '52 Laps / 18 Turns', record: '1:27.097', difficulty: 'HIGH G-FORCE' },
];

const DRIVERS = [
  { rank: '01', name: 'Max Verstappen', team: 'Red Bull Racing', points: '195 PTS', color: 'from-blue-600 to-amber-500' },
  { rank: '02', name: 'Charles Leclerc', team: 'Scuderia Ferrari', points: '138 PTS', color: 'from-red-600 to-red-400' },
  { rank: '03', name: 'Lando Norris', team: 'McLaren F1 Team', points: '131 PTS', color: 'from-orange-500 to-amber-400' },
  { rank: '04', name: 'Carlos Sainz', team: 'Scuderia Ferrari', points: '108 PTS', color: 'from-red-600 to-yellow-500' },
];

export default function Home() {
  const [selectedCircuit, setSelectedCircuit] = useState(CIRCUITS[0]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      
      {/* Background Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

      {/* Navigation Header */}
      <header className="relative z-20 border-b border-slate-800/60 bg-[#030712]/80 backdrop-blur-md sticky top-0 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-black font-black px-2.5 py-1 rounded text-sm tracking-widest uppercase shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            F1
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider uppercase text-slate-200">
              Spatial Telemetry Hub
            </h1>
            <p className="text-[10px] font-mono text-slate-500">VER_3.01_OCTANE // DEV_STREAM</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            STREAM: ACTIVE
          </div>
          <button className="px-4 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-mono transition-all flex items-center gap-2">
            <Radio className="w-3.5 h-3.5" /> Live Pit Wall
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-16">
        
        {/* Title Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
            <Zap className="w-3.5 h-3.5" /> 3D SPATIAL TELEMETRY RENDERER
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white uppercase italic">
            NEXT-GEN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-red-500 to-amber-400">PADDOCK</span> HUB
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mt-3 font-mono">
            Real-time circuit geometry, dynamic telemetry channels, and spatial driver tracking powered by Django REST & Next.js WebGL.
          </p>
        </motion.div>

        {/* Grid Container: 3D Canvas + Track Info Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* 3D Track Viewer (8 Cols) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-8 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-2 relative shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            <TrackCanvas3D trackName={selectedCircuit.name.toUpperCase()} />
          </motion.div>

          {/* Circuit Control Deck (4 Cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-4 flex flex-col gap-4"
          >
            {/* Circuit Selector Deck */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" /> Circuit Select Deck
              </h3>

              <div className="grid grid-cols-2 gap-2 mb-6">
                {CIRCUITS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCircuit(c)}
                    className={`p-3 rounded-xl border text-left transition-all text-xs font-mono ${
                      selectedCircuit.id === c.id
                        ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-white uppercase">{c.id}</div>
                    <div className="text-[10px] text-slate-500 truncate">{c.location}</div>
                  </button>
                ))}
              </div>

              {/* Selected Circuit Details */}
              <div className="border-t border-slate-800/80 pt-4 space-y-3 font-mono">
                <div>
                  <h4 className="text-lg font-bold text-white">{selectedCircuit.name}</h4>
                  <p className="text-xs text-slate-400">{selectedCircuit.location}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block uppercase">Circuit Length</span>
                    <span className="font-bold text-cyan-400">{selectedCircuit.length}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block uppercase">Laps / Turns</span>
                    <span className="font-bold text-white">{selectedCircuit.laps}</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Lap Record</span>
                    <span className="font-bold text-amber-400">{selectedCircuit.record}</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] bg-red-500/10 border border-red-500/30 text-red-400 rounded">
                    {selectedCircuit.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Live Telemetry Indicator */}
            <div className="bg-gradient-to-r from-slate-900/80 to-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-red-500 animate-pulse" />
                <div>
                  <div className="text-xs font-mono font-bold text-white">LIVE FEED (ECU TELEMETRY)</div>
                  <div className="text-[10px] font-mono text-slate-400">SYNCED WITH DJANGO BACKEND</div>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full">
                G-FORCE: 3.58G
              </span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* FEATURE SCROLL SHOWCASE */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/60">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
            // TELEMETRY CAPABILITIES
          </span>
          <h3 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight">
            BUILT FOR <span className="text-red-500">SPEED</span> & PRECISION
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <motion.div 
            whileHover={{ y: -8 }}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group"
          >
            <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold uppercase mb-2 text-white">01 / Live ECU Streams</h4>
            <p className="text-sm text-slate-400 font-mono leading-relaxed">
              Extract real-time speed, throttle profiles, brake pressures, and RPM traces from OpenF1 & FastF1 APIs.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -8 }}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group"
          >
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-center text-red-400 mb-6 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold uppercase mb-2 text-white">02 / Tyre & Strategy</h4>
            <p className="text-sm text-slate-400 font-mono leading-relaxed">
              Track tyre degradation across Soft, Medium, and Hard compounds with automated pit stop window predictions.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -8 }}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group"
          >
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold uppercase mb-2 text-white">03 / 3D Spatial Traces</h4>
            <p className="text-sm text-slate-400 font-mono leading-relaxed">
              Render spatial 3D circuit meshes using Three.js and React Three Fiber with dynamic lighting and camera orbits.
            </p>
          </motion.div>

        </div>
      </section>

      {/* DRIVER STANDINGS PREVIEW */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-slate-800/60 mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
              // WORLD CHAMPIONSHIP
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold uppercase">DRIVER STANDINGS DECK</h3>
          </div>
          <button className="self-start md:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2 transition-all">
            Full Standings <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DRIVERS.map((d) => (
            <div key={d.rank} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${d.color}`} />
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black font-mono text-slate-600 group-hover:text-cyan-400 transition-colors">
                  {d.rank}
                </span>
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1">{d.name}</h4>
              <p className="text-xs text-slate-400 font-mono mb-4">{d.team}</p>
              <div className="text-xs font-mono font-bold text-cyan-400 bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-center">
                {d.points}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800/60 py-8 text-center text-xs font-mono text-slate-500">
        <p>FORMULA 1 TELEMETRY SYSTEM // POWERED BY NEXT.JS 14, THREE.JS & DJANGO REST FRAMEWORK</p>
      </footer>

    </div>
  );
}
