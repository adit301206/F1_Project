'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Compass, Eye, Zap, ChevronRight, ChevronLeft, Activity, ArrowDown, Flag } from 'lucide-react';
import { soundFx } from '@/lib/audioFx';

// Exact Zandvoort GP Track Path SVG Coordinates
const ZANDVOORT_SVG_PATH = "M 380 430 L 320 370 C 270 320 220 280 230 210 C 240 140 310 110 390 120 C 470 130 520 170 580 210 C 640 250 720 230 770 170 C 820 110 880 130 890 200 C 900 270 850 360 830 430 C 810 500 780 570 800 640 C 820 710 880 770 860 830 C 840 880 770 910 700 890 C 620 870 540 820 460 760 C 390 700 340 620 350 540 Z";

// Corners Data with exact screen coordinates & telemetry specs
const CORNERS = [
  {
    id: "start",
    name: "START / FINISH",
    label: "START / FINISH",
    x: 370,
    y: 430,
    cameraFocus: "CAMERA / START LINE FOCUS",
    speedKmh: 312,
    gear: "8",
    gForce: "1.2 G",
    throttle: 100,
    brake: 0,
    desc: "312 km/h full throttle main straight before breaking hard for Tarzan turn."
  },
  {
    id: "tarzan",
    name: "T1 / TARZAN",
    label: "T1 / TARZAN",
    x: 230,
    y: 210,
    cameraFocus: "CAMERA / TARZAN HAIRPIN",
    speedKmh: 115,
    gear: "2",
    gForce: "4.6 G",
    throttle: 35,
    brake: 95,
    desc: "Historic banked turn 1 hairpin. Prime overtaking spot with heavy 4.6G braking."
  },
  {
    id: "hugenholtz",
    name: "HUGENHOLTZ",
    label: "HUGENHOLTZ",
    x: 390,
    y: 120,
    cameraFocus: "CAMERA / HUGENHOLTZ BANKING",
    speedKmh: 142,
    gear: "3",
    gForce: "3.8 G",
    throttle: 78,
    brake: 20,
    desc: "18-degree parabolic banking allowing two distinct racing lines."
  },
  {
    id: "scheivlak",
    name: "T6-7 / SCHEIVLAK",
    label: "T6-7 / SCHEIVLAK",
    x: 770,
    y: 170,
    cameraFocus: "CAMERA / SCHEIVLAK HIGH SPEED",
    speedKmh: 265,
    gear: "6",
    gForce: "5.1 G",
    throttle: 92,
    brake: 10,
    desc: "Blind downhill turn taken at high speed. Maximum lateral compression."
  },
  {
    id: "sector2",
    name: "SECTOR 02",
    label: "SECTOR 02",
    x: 830,
    y: 430,
    cameraFocus: "CAMERA / MID-SECTOR SPLIT",
    speedKmh: 230,
    gear: "5",
    gForce: "3.4 G",
    throttle: 80,
    brake: 15,
    desc: "Challenging technical chicane requiring precise kerb riding."
  },
  {
    id: "luyendyk",
    name: "ARIE LUYENDYK",
    label: "ARIE LUYENDYK",
    x: 700,
    y: 890,
    cameraFocus: "CAMERA / LUYENDYK FINAL BANKING",
    speedKmh: 295,
    gear: "7",
    gForce: "4.2 G",
    throttle: 100,
    brake: 0,
    desc: "Steep 19-degree final turn opening DRS early onto the pit straight."
  }
];

export default function ScrollCircuitApproach({ unit = 'kmh' }) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const [activeCornerIndex, setActiveCornerIndex] = useState(0);

  // Framer Motion Scroll Tracking across the section height
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  // Map scroll progress (0 -> 1) to racing line drawing completion
  const pathLength = useTransform(smoothProgress, [0, 1], [0, 1]);
  
  // Dynamic camera scale & translation based on scroll position
  const scale = useTransform(smoothProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [1, 1.3, 1.35, 1.4, 1.35, 1.1]);
  const translateX = useTransform(smoothProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 150, 60, -180, -220, 0]);
  const translateY = useTransform(smoothProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 100, 180, 120, -150, 0]);

  // Sync active corner with scroll progress
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      const idx = Math.min(
        Math.floor(latest * CORNERS.length),
        CORNERS.length - 1
      );
      if (idx !== activeCornerIndex) {
        setActiveCornerIndex(idx);
      }
    });
    return () => unsubscribe();
  }, [smoothProgress, activeCornerIndex]);

  const activeCorner = CORNERS[activeCornerIndex];

  const formattedSpeed = unit === 'mph'
    ? `${Math.round(activeCorner.speedKmh * 0.621371)} MPH`
    : `${activeCorner.speedKmh} KM/H`;

  const handlePrevCorner = () => {
    soundFx.playClick();
    setActiveCornerIndex(prev => (prev > 0 ? prev - 1 : CORNERS.length - 1));
  };

  const handleNextCorner = () => {
    soundFx.playClick();
    setActiveCornerIndex(prev => (prev < CORNERS.length - 1 ? prev + 1 : 0));
  };

  return (
    <section 
      ref={containerRef}
      id="circuit-approach" 
      className="relative w-full h-[320vh] bg-[#07090e] text-white font-mono select-none"
    >
      {/* STICKY SCREEN CONTAINER FOR SMOOTH SCROLL ZOOMING */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between p-4 md:p-8 bg-[#080b12] border-y border-white/10">
        
        {/* 1. TOP METADATA BAR */}
        <div className="relative z-30 flex flex-wrap items-center justify-between gap-4 pt-16 md:pt-4 px-2">
          {/* Top Left Label */}
          <div className="flex items-center gap-2 text-xs text-slate-300 font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>MODEL / ZANDVOORT GP LAYOUT</span>
          </div>

          {/* Center Quick Sector Jump Hotspots */}
          <div className="hidden lg:flex items-center gap-1.5 bg-black/60 p-1 rounded-full border border-white/10 text-[10px]">
            {CORNERS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveCornerIndex(i);
                }}
                className={`px-3 py-1 rounded-full transition-all font-bold ${
                  activeCornerIndex === i 
                    ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(255,24,1,0.6)] font-orbitron' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c.name.split('/')[0]}
              </button>
            ))}
          </div>

          {/* Top Right Scroll Prompt Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(255,24,1,0.2)]">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>SCROLL TO APPROACH</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </div>

        {/* 2. CENTER TRACK CANVAS */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden my-2">
          
          {/* Animated Zoomable SVG Viewport */}
          <motion.div 
            style={{ scale, x: translateX, y: translateY }}
            className="w-full h-full flex items-center justify-center transition-transform duration-300"
          >
            <svg 
              viewBox="0 0 1100 1000" 
              className="w-full h-full max-w-[950px] max-h-[750px] drop-shadow-[0_0_40px_rgba(0,0,0,0.9)]"
            >
              <defs>
                {/* Red & White Kerb Pattern Filter */}
                <pattern id="redWhiteKerb" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="10" height="20" fill="#FF1801" />
                  <rect x="10" width="10" height="20" fill="#FFFFFF" />
                </pattern>
                
                {/* Red Track Line Glow */}
                <filter id="redLineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* OUTMOST LAYER: Red & White Kerbs Pattern Boundary */}
              <path 
                d={ZANDVOORT_SVG_PATH} 
                fill="none" 
                stroke="url(#redWhiteKerb)" 
                strokeWidth="56" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="opacity-90"
              />

              {/* MAIN ASPHALT SURFACE LAYER */}
              <path 
                d={ZANDVOORT_SVG_PATH} 
                fill="none" 
                stroke="#1c2330" 
                strokeWidth="44" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* INNER BOUNDARY LINE */}
              <path 
                d={ZANDVOORT_SVG_PATH} 
                fill="none" 
                stroke="#334155" 
                strokeWidth="3" 
                strokeDasharray="8 8"
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* GLOWING SCROLL-ANIMATED RED RACING LINE */}
              <motion.path 
                ref={pathRef}
                d={ZANDVOORT_SVG_PATH} 
                fill="none" 
                stroke="#FF1801" 
                strokeWidth="6" 
                filter="url(#redLineGlow)"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{ pathLength }}
              />

              {/* CORNER HOTSPOT LABELS */}
              {CORNERS.map((corner, i) => {
                const isActive = activeCornerIndex === i;
                return (
                  <g key={corner.id} className="cursor-pointer" onClick={() => {
                    soundFx.playClick();
                    setActiveCornerIndex(i);
                  }}>
                    {/* Hotspot Pulsing Circle */}
                    <circle 
                      cx={corner.x} 
                      cy={corner.y} 
                      r={isActive ? "10" : "6"} 
                      fill={isActive ? "#FF1801" : "#ffffff"} 
                      className="transition-all duration-300 shadow-lg"
                    />
                    {isActive && (
                      <circle 
                        cx={corner.x} 
                        cy={corner.y} 
                        r="18" 
                        fill="none" 
                        stroke="#FF1801" 
                        strokeWidth="2" 
                        className="animate-ping"
                      />
                    )}

                    {/* Corner Label Box */}
                    <rect
                      x={corner.x + 12}
                      y={corner.y - 14}
                      width={corner.label.length * 9.5 + 16}
                      height="24"
                      rx="6"
                      fill={isActive ? "#FF1801" : "#0c1018"}
                      stroke={isActive ? "#ffffff" : "rgba(255,255,255,0.2)"}
                      strokeWidth="1.5"
                    />
                    <text
                      x={corner.x + 20}
                      y={corner.y + 2}
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      letterSpacing="1"
                    >
                      {corner.label}
                    </text>
                  </g>
                );
              })}

            </svg>
          </motion.div>

          {/* FLOATING CORNER TELEMETRY CARD OVERLAY */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCorner.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 max-w-sm w-[90%] sm:w-full bg-[#0b0e17]/92 backdrop-blur-xl border border-white/15 p-4 sm:p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] space-y-3"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] text-red-500 font-bold tracking-widest uppercase truncate max-w-[200px]">
                  SECTOR TELEMETRY // {activeCorner.name}
                </span>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={handlePrevCorner}
                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-all"
                    title="Previous Sector"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded font-orbitron font-bold">
                    {activeCornerIndex + 1}/6
                  </span>
                  <button 
                    onClick={handleNextCorner}
                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-all"
                    title="Next Sector"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeCorner.desc}
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono text-xs">
                <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-500 block uppercase">APEX SPEED</span>
                  <span className="font-bold text-white text-sm font-orbitron">{formattedSpeed}</span>
                </div>
                <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-500 block uppercase">GEAR</span>
                  <span className="font-bold text-red-500 text-sm font-orbitron">GEAR {activeCorner.gear}</span>
                </div>
                <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-500 block uppercase">G-FORCE</span>
                  <span className="font-bold text-emerald-400 text-sm font-orbitron">{activeCorner.gForce}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* 3. BOTTOM METADATA BAR */}
        <div className="relative z-30 flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10 text-xs text-slate-400">
          
          {/* Bottom Left: Dynamic Camera Focus Indicator */}
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-red-500" />
            <span className="font-bold text-white tracking-widest uppercase font-orbitron text-[11px]">
              {activeCorner.cameraFocus}
            </span>
          </div>

          {/* Center Title */}
          <div className="hidden sm:flex items-center gap-2 font-bold tracking-widest text-slate-400 uppercase">
            <span>THE TRACK</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-orbitron">ZANDVOORT</span>
          </div>

          {/* Bottom Right: Circuit Specs */}
          <div className="flex items-center gap-2 font-bold tracking-wider text-slate-300">
            <span className="text-red-500 font-orbitron">04.259 KM</span>
            <span className="text-slate-600">/</span>
            <span>14 TURNS</span>
          </div>

        </div>

      </div>
    </section>
  );
}
