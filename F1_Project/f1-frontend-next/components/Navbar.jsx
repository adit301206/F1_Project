'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Volume2, VolumeX, Flag, Sparkles } from 'lucide-react';
import { soundFx } from '@/lib/audioFx';

export default function Navbar({ 
  unit = 'kmh', 
  setUnit, 
  theme = 'neon', 
  setTheme,
  onOpenCircuitSpecs
}) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('01. OVERVIEW');

  const handleSoundToggle = () => {
    const newState = soundFx.toggleSound();
    setSoundEnabled(newState);
    if (newState) soundFx.playClick();
  };

  const handleUnitToggle = (newUnit) => {
    setUnit(newUnit);
    soundFx.playClick();
  };

  const navLinks = [
    { label: '01. OVERVIEW', href: '#hero' },
    { label: '02. 3D CIRCUIT', href: '#telemetry-studio' },
    { label: '03. ANALYTICS', href: '#telemetry-analytics' },
    { label: '04. LEADERBOARD', href: '#standings' },
  ];

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl px-5 py-3 glass-panel-cyan rounded-2xl flex items-center justify-between shadow-[0_0_35px_rgba(0,0,0,0.8)] border border-cyan-500/30 backdrop-blur-xl"
    >
      
      {/* Left: F1 Brand Logo & Session Tag */}
      <motion.div 
        whileHover={{ scale: 1.03 }}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-black font-black px-2.5 py-1 rounded text-xs tracking-widest italic font-orbitron shadow-[0_0_15px_rgba(225,6,0,0.5)]">
          F1
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-orbitron font-extrabold tracking-wider uppercase text-white flex items-center gap-1.5">
            PADDOCK 3D <span className="text-[10px] text-cyan-400 font-mono font-normal animate-pulse">v3.0</span>
          </span>
          <span className="text-[9px] font-mono text-slate-400 tracking-wider">
            SPATIAL TELEMETRY HUB
          </span>
        </div>
      </motion.div>

      {/* Center: Animated Navigation Links */}
      <div className="hidden lg:flex items-center gap-6 text-xs font-mono text-slate-300">
        {navLinks.map((link) => {
          const isActive = activeTab === link.label;
          return (
            <a 
              key={link.label}
              href={link.href} 
              onClick={() => {
                soundFx.playClick();
                setActiveTab(link.label);
              }}
              className="relative px-2 py-1 hover:text-cyan-400 transition-colors uppercase font-bold tracking-wider"
            >
              <span className={isActive ? 'text-cyan-400 font-extrabold' : ''}>{link.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_10px_#00f3ff]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          );
        })}
      </div>

      {/* Right: Controls (Unit Switcher, Audio, Live Indicator) */}
      <div className="flex items-center gap-3">
        
        {/* Track Specs Quick Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundFx.playClick();
            if (onOpenCircuitSpecs) onOpenCircuitSpecs();
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-slate-200 text-xs font-mono hover:border-cyan-500/50 transition-all hover:text-cyan-400 shadow-md"
        >
          <Flag className="w-3.5 h-3.5 text-amber-400" />
          <span>TRACK SPECS</span>
        </motion.button>

        {/* Speed Unit Toggle Button (KM/H vs MPH) */}
        <div className="bg-slate-950/80 border border-slate-800 p-0.5 rounded-xl flex items-center text-[10px] font-mono font-bold">
          <button
            onClick={() => handleUnitToggle('kmh')}
            className={`px-2 py-1 rounded-lg transition-all ${
              unit === 'kmh' 
                ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,243,255,0.5)] font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            KM/H
          </button>
          <button
            onClick={() => handleUnitToggle('mph')}
            className={`px-2 py-1 rounded-lg transition-all ${
              unit === 'mph' 
                ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,243,255,0.5)] font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            MPH
          </button>
        </div>

        {/* Audio Mute/Unmute Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSoundToggle}
          className={`p-2 rounded-xl border text-xs font-mono transition-all ${
            soundEnabled 
              ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20' 
              : 'bg-slate-900/80 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle HUD Telemetry Beeps"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </motion.button>

        {/* Live Broadcast Pulse Badge */}
        <motion.div 
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="px-3 py-1 bg-red-600/15 border border-red-500/40 rounded-full text-red-400 text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(225,6,0,0.2)]"
        >
          <Radio className="w-3 h-3 text-red-500 animate-pulse" />
          <span className="font-bold tracking-wider text-[11px]">LIVE FP2</span>
        </motion.div>

      </div>

    </motion.nav>
  );
}

