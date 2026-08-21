'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowDownRight, Radio, Sparkles, ChevronRight, Zap, Play, RotateCcw } from 'lucide-react';
import { soundFx } from '@/lib/audioFx';

export default function CircuitPulseHero({ onExploreScroll }) {
  // Live ticking countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 19,
    minutes: 32,
    seconds: 41
  });

  // Interactive 5 Red LED Race Start Simulator
  const [startLightsCount, setStartLightsCount] = useState(0);
  const [lightsOut, setLightsOut] = useState(false);
  const [isSequenceRunning, setIsSequenceRunning] = useState(false);
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStartLightsSequence = () => {
    if (isSequenceRunning) return;
    soundFx.playClick();
    setIsSequenceRunning(true);
    setLightsOut(false);
    setStartLightsCount(0);
    setReactionTime(null);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      soundFx.playTelemetryBeep();
      setStartLightsCount(count);

      if (count === 5) {
        clearInterval(interval);
        // Random delay between 1s and 2.8s for Lights Out!
        const randomDelay = 1000 + Math.random() * 1800;
        setTimeout(() => {
          setLightsOut(true);
          soundFx.playClick();
          setStartTime(performance.now());
          setIsSequenceRunning(false);
        }, randomDelay);
      }
    }, 1000);
  };

  const handleReactionClick = () => {
    if (lightsOut && startTime && reactionTime === null) {
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(3);
      setReactionTime(elapsed);
      soundFx.playClick();
    }
  };

  const formatDigit = (num) => (num < 10 ? `0${num}` : `${num}`);

  return (
    <section 
      id="hero-signal" 
      className="relative w-full min-h-screen bg-[#07090e] text-white font-sans overflow-hidden flex items-center justify-center pt-28 pb-16 px-4 md:px-12 select-none"
    >
      {/* 1. ATMOSPHERIC NIGHT TRACK BACKDROP IMAGE & GRADIENT VIGNETTES */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.38] contrast-[1.2] scale-105 transition-all duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2400&auto=format&fit=crop')`
          }}
        />
        {/* Dark Vignette Overlays matching image 1 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-[#07090e]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-[#07090e]/50 to-[#07090e]/90" />
        {/* Circuit Lights Glow */}
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[300px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* 2. LEFT TELEMETRY OVERLAY AXIS */}
      <div className="absolute left-6 top-1/3 hidden lg:flex flex-col items-center gap-6 z-20 text-slate-500 font-mono text-[11px] tracking-widest pointer-events-none">
        <span className="[writing-mode:vertical-lr] rotate-180 uppercase font-bold text-slate-400">
          52° 22' N ZANDVOORT
        </span>
        <div className="w-[1px] h-20 bg-slate-800/80" />
        <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-slate-400">
          F1 / 026
        </div>
      </div>

      {/* 3. MAIN HERO CONTENT CONTAINER */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
        
        {/* LEFT COLUMN: HEADLINE & COPY & RACE START SIMULATOR (7 COLS) */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Subhead Signal Badge & Start Simulator Pill */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 text-slate-300 backdrop-blur-md shadow-md">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span className="font-extrabold text-red-500 tracking-wider">NEXT SIGNAL</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400 font-bold">ROUND 12</span>
            </div>

            {/* Interactive F1 5-Red Light Start Sequence Widget */}
            <div 
              onClick={handleReactionClick}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-white/15 backdrop-blur-md cursor-pointer hover:border-red-500/50 transition-all"
              title="Click when lights go OUT to test your reaction time!"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const isLit = !lightsOut && startLightsCount > i;
                  return (
                    <span 
                      key={i}
                      className={`w-3 h-3 rounded-full border transition-all duration-200 ${
                        isLit
                          ? 'bg-red-600 border-red-400 shadow-[0_0_12px_rgba(255,24,1,1)]'
                          : 'bg-slate-900 border-slate-700'
                      }`}
                    />
                  );
                })}
              </div>

              {!isSequenceRunning && !lightsOut && (
                <button 
                  onClick={handleStartLightsSequence}
                  className="text-[10px] text-cyan-400 font-bold hover:underline ml-1 uppercase font-mono flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" /> START SIM
                </button>
              )}

              {lightsOut && (
                <span className="text-[10px] text-emerald-400 font-bold uppercase font-orbitron animate-pulse">
                  {reactionTime ? `REACTION: ${reactionTime}s` : 'LIGHTS OUT! CLICK!'}
                </span>
              )}
            </div>
          </div>

          {/* High-Impact Headline matching Image 1 */}
          <div className="space-y-1 font-orbitron">
            <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-[6.2rem] font-black tracking-tighter uppercase leading-[0.88] text-white">
              THE NEXT
            </h1>
            <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-[6.2rem] font-black tracking-tighter uppercase leading-[0.88] text-[#FF1801] drop-shadow-[0_0_35px_rgba(255,24,1,0.5)]">
              LIGHTS
            </h1>
            <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-[6.2rem] font-black tracking-tighter uppercase leading-[0.88] text-white">
              ARE COMING.
            </h1>
          </div>

          {/* Subtitle Description */}
          <p className="text-sm md:text-base font-mono text-slate-300 max-w-xl leading-relaxed tracking-wide font-normal pt-2">
            A circuit-first countdown to the Dutch Grand Prix. Start wide. Follow the line. Feel the race arrive.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4 font-mono">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                soundFx.playClick();
                if (onExploreScroll) onExploreScroll();
                const el = document.querySelector('#circuit-approach');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-7 py-3.5 rounded-full bg-[#FF1801] text-white font-extrabold text-xs tracking-widest uppercase shadow-[0_0_30px_rgba(255,24,1,0.4)] hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <span>SCROLL TO APPROACH</span>
              <ArrowDownRight className="w-4 h-4" />
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#telemetry-studio"
              onClick={() => soundFx.playClick()}
              className="px-6 py-3.5 rounded-full bg-white/5 border border-white/15 text-slate-200 font-bold text-xs tracking-wider uppercase hover:border-white/40 hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <span>3D TELEMETRY CANVAS</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </motion.a>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: FLOATING COUNTDOWN CARD (5 COLS) */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <div 
            id="race-widget"
            className="glass-panel rounded-3xl p-6 sm:p-7 bg-[#0b0f19]/80 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-6 relative overflow-hidden group hover:border-red-500/30 transition-all"
          >
            {/* Top Glow Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-white/40 to-transparent" />

            {/* Top Row: UPCOMING & 12 / 24 */}
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400 font-bold tracking-widest uppercase text-[11px]">
                UPCOMING
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="text-white font-extrabold tracking-wider font-orbitron">
                  12 / 24
                </span>
              </div>
            </div>

            {/* Title Section */}
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase block">
                FORMULA 1
              </span>
              <h2 className="text-2xl sm:text-3xl font-orbitron font-black uppercase text-white tracking-tight italic">
                HEINEKEN DUTCH GP
              </h2>
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-xs pt-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Circuit Park Zandvoort • NL</span>
              </div>
            </div>

            {/* Live Countdown Grid matching Image 1 */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10 font-mono text-center">
              <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                <span className="block text-2xl sm:text-3xl font-black text-white font-orbitron">
                  {formatDigit(timeLeft.days)}
                </span>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase block mt-0.5">
                  DAYS
                </span>
              </div>
              <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                <span className="block text-2xl sm:text-3xl font-black text-white font-orbitron">
                  {formatDigit(timeLeft.hours)}
                </span>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase block mt-0.5">
                  HRS
                </span>
              </div>
              <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                <span className="block text-2xl sm:text-3xl font-black text-white font-orbitron">
                  {formatDigit(timeLeft.minutes)}
                </span>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase block mt-0.5">
                  MIN
                </span>
              </div>
              <div className="bg-black/40 p-3 rounded-2xl border border-white/5 relative overflow-hidden">
                <motion.span 
                  key={timeLeft.seconds}
                  initial={{ y: -5, opacity: 0.7 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="block text-2xl sm:text-3xl font-black text-red-500 font-orbitron"
                >
                  {formatDigit(timeLeft.seconds)}
                </motion.span>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase block mt-0.5">
                  SEC
                </span>
              </div>
            </div>

            {/* Track Pulse Live Bar */}
            <div className="space-y-2 pt-1 font-mono text-[10px]">
              <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-wider">
                <span>TRACK PULSE</span>
                <span className="text-red-500 font-orbitron flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" /> LIVE
                </span>
              </div>
              <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: '70%' }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-red-600 via-red-500 to-white rounded-full shadow-[0_0_10px_rgba(255,24,1,0.8)]"
                />
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 font-mono text-[11px] text-slate-400 font-bold">
              <span>21 - 23 AUG 2026</span>
              <span className="text-white bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase font-orbitron tracking-wider">
                SPRINT WEEKEND
              </span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
