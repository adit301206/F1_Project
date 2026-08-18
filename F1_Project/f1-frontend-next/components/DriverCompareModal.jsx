'use client';

import React from 'react';
import { X, Users, Award, Zap, Shield, ChevronRight } from 'lucide-react';
import { soundFx } from '@/lib/audioFx';

export default function DriverCompareModal({ isOpen, onClose, drivers = [], unit = 'kmh' }) {
  if (!isOpen || drivers.length < 2) return null;

  const driver1 = drivers[0];
  const driver2 = drivers[1];

  const speedMultiplier = unit === 'mph' ? 0.621371 : 1;
  const speedLabel = unit === 'mph' ? 'MPH' : 'KM/H';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-[#090e1a] border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,243,255,0.2)] space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-400 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>HEAD-TO-HEAD DRIVER ANALYTICS</span>
        </div>

        {/* Side-by-Side Comparison Header */}
        <div className="grid grid-cols-2 gap-4 text-center font-mono">
          
          {/* Driver 1 */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
            <span className="w-3 h-3 rounded-full inline-block mb-1" style={{ backgroundColor: driver1.team_color }} />
            <h3 className="text-xl font-orbitron font-black uppercase text-white">#{driver1.number} {driver1.abbreviation}</h3>
            <p className="text-xs text-slate-400 font-semibold">{driver1.name}</p>
            <span className="text-[10px] text-cyan-400 font-bold block">{driver1.team}</span>
          </div>

          {/* Driver 2 */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
            <span className="w-3 h-3 rounded-full inline-block mb-1" style={{ backgroundColor: driver2.team_color }} />
            <h3 className="text-xl font-orbitron font-black uppercase text-white">#{driver2.number} {driver2.abbreviation}</h3>
            <p className="text-xs text-slate-400 font-semibold">{driver2.name}</p>
            <span className="text-[10px] text-orange-400 font-bold block">{driver2.team}</span>
          </div>

        </div>

        {/* Comparative Metrics Table */}
        <div className="space-y-2 font-mono text-xs">
          
          {/* Metric Row 1: Season Points */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="font-bold text-cyan-400">{driver1.points} PTS</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">SEASON CHAMPIONSHIP POINTS</span>
            <span className="font-bold text-orange-400">{driver2.points} PTS</span>
          </div>

          {/* Metric Row 2: Top Speed Trap */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="font-bold text-white">{Math.round(driver1.top_speed * speedMultiplier)} {speedLabel}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">SPEED TRAP MAXIMUM</span>
            <span className="font-bold text-white">{Math.round(driver2.top_speed * speedMultiplier)} {speedLabel}</span>
          </div>

          {/* Metric Row 3: Sector 1 Best */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="font-bold text-emerald-400">{driver1.s1}s</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">SECTOR 1 SPLIT</span>
            <span className="font-bold text-emerald-400">{driver2.s1}s</span>
          </div>

          {/* Metric Row 4: Sector 2 Best */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="font-bold text-emerald-400">{driver1.s2}s</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">SECTOR 2 SPLIT</span>
            <span className="font-bold text-emerald-400">{driver2.s2}s</span>
          </div>

          {/* Metric Row 5: Sector 3 Best */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="font-bold text-emerald-400">{driver1.s3}s</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">SECTOR 3 SPLIT</span>
            <span className="font-bold text-emerald-400">{driver2.s3}s</span>
          </div>

        </div>

      </div>
    </div>
  );
}
