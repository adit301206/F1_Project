'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, ArrowUpRight, Radio } from 'lucide-react';
import { soundFx } from '@/lib/audioFx';

export default function CircuitPulseNavbar({
  unit = 'kmh',
  setUnit,
  activeTab = 'CIRCUIT',
  setActiveTab,
  onOpenSpecs
}) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const navItems = [
    { label: 'CIRCUIT', href: '#circuit-approach' },
    { label: 'SIGNAL', href: '#hero-signal' },
    { label: 'WEEKEND', href: '#race-widget' },
    { label: 'TELEMETRY', href: '#telemetry-studio' },
    { label: 'STANDINGS', href: '#standings' },
  ];

  const handleSoundToggle = () => {
    const newState = soundFx.toggleSound();
    setSoundEnabled(newState);
    if (newState) soundFx.playClick();
  };

  const handleNavClick = (label, href) => {
    soundFx.playClick();
    if (setActiveTab) setActiveTab(label);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl px-4 md:px-6 py-2.5 rounded-full bg-[#0b0e14]/85 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center justify-between font-mono select-none"
    >
      {/* Left Brand Badge */}
      <div 
        onClick={() => handleNavClick('SIGNAL', '#hero-signal')}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <span className="w-4 h-0.5 bg-red-600 group-hover:w-6 transition-all" />
        <span className="text-xs font-extrabold tracking-widest text-white uppercase font-orbitron flex items-center gap-2">
          F1 <span className="text-slate-400 font-mono font-normal">/</span> CIRCUIT PULSE
        </span>
      </div>

      {/* Center Nav Links */}
      <nav className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/5">
        {navItems.map((item) => {
          const isActive = activeTab === item.label;
          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.label, item.href)}
              className={`relative px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-colors ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="pillNavBackground"
                  className="absolute inset-0 rounded-full bg-white/10 border border-white/15 shadow-inner"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls & Next Race CTA */}
      <div className="flex items-center gap-2.5">
        {/* Speed Unit Toggle */}
        <div className="hidden sm:flex bg-black/60 border border-white/10 p-0.5 rounded-full text-[10px] font-bold">
          <button
            onClick={() => {
              soundFx.playClick();
              if (setUnit) setUnit('kmh');
            }}
            className={`px-2.5 py-1 rounded-full transition-all ${
              unit === 'kmh' ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(255,24,1,0.5)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            KM/H
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              if (setUnit) setUnit('mph');
            }}
            className={`px-2.5 py-1 rounded-full transition-all ${
              unit === 'mph' ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(255,24,1,0.5)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            MPH
          </button>
        </div>

        {/* Audio Mute/Unmute */}
        <button
          onClick={handleSoundToggle}
          className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all text-xs"
          title="Toggle Audio Feedback"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Action Button: NEXT RACE ↗ */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => handleNavClick('CIRCUIT', '#circuit-approach')}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#121620] border border-white/20 text-white text-xs font-bold font-mono hover:border-red-500 hover:bg-red-950/40 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] group"
        >
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse group-hover:scale-125 transition-transform" />
          <span className="tracking-wider uppercase text-[11px]">NEXT RACE</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      </div>
    </motion.header>
  );
}
