'use client';

import React from 'react';
import { X, Flag, MapPin, Compass, Award, Zap, TrendingUp } from 'lucide-react';
import { CIRCUITS_DATA } from '@/lib/api';
import { soundFx } from '@/lib/audioFx';

export default function CircuitSpecsModal({ circuitId = 'monaco', isOpen, onClose, unit = 'kmh' }) {
  if (!isOpen) return null;

  const circuit = CIRCUITS_DATA[circuitId] || CIRCUITS_DATA.monaco;
  const speedMultiplier = unit === 'mph' ? 0.621371 : 1;
  const lengthMultiplier = unit === 'mph' ? 0.621371 : 1;
  const speedLabel = unit === 'mph' ? 'MPH' : 'KM/H';
  const lengthLabel = unit === 'mph' ? 'MI' : 'KM';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#090e1a] border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,243,255,0.2)] space-y-6">
        
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

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
            <Flag className="w-3.5 h-3.5" /> OFFICIAL FIA CIRCUIT PROFILE
          </div>
          <h2 className="text-3xl font-orbitron font-black italic tracking-tight text-white uppercase mt-2">
            {circuit.track_name}
          </h2>
          <p className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {circuit.locality}, {circuit.country}
          </p>
        </div>

        {/* Technical Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">TRACK LENGTH</span>
            <span className="text-lg font-bold text-cyan-400 font-orbitron">
              {(circuit.length_km * lengthMultiplier).toFixed(3)} {lengthLabel}
            </span>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">TOTAL TURNS</span>
            <span className="text-lg font-bold text-white font-orbitron">
              {circuit.turns} CORNERS
            </span>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">DRS ZONES</span>
            <span className="text-lg font-bold text-purple-400 font-orbitron">
              {circuit.drs_zones} ZONE{circuit.drs_zones > 1 ? 'S' : ''}
            </span>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">TOP SPEED</span>
            <span className="text-lg font-bold text-amber-400 font-orbitron">
              {Math.round(circuit.top_speed_kmh * speedMultiplier)} {speedLabel}
            </span>
          </div>
        </div>

        {/* Lap Record & Elevation Info */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5 font-bold">
              <Award className="w-4 h-4 text-amber-400" /> ALL-TIME LAP RECORD:
            </span>
            <span className="text-cyan-400 font-bold text-sm">{circuit.lap_record}</span>
          </div>

          <div className="flex justify-between items-center border-t border-slate-800/80 pt-2">
            <span className="text-slate-400 flex items-center gap-1.5 font-bold">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> ELEVATION DELTA:
            </span>
            <span className="text-white font-bold">{circuit.elevation_delta_m} METERS</span>
          </div>
        </div>

        {/* Corner Breakdown List */}
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase font-bold block mb-2">
            APEX SECTOR BREAKDOWN ({circuit.corners.length} KEY CORNERS)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 font-mono text-xs">
            {circuit.corners.map((corner) => (
              <div key={corner.id} className="p-2 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="font-bold text-cyan-400">T{corner.id}. {corner.name}</span>
                <span className="text-slate-400 text-[11px]">
                  {Math.round(corner.speed * speedMultiplier)} {speedLabel} // G{corner.gear}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
