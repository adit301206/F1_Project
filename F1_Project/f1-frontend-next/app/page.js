'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radio, Activity, Timer, ChevronDown, Flag, Database, RefreshCw, Cpu, Award, 
  Wind, Thermometer, CloudRain, Users, Eye, Sliders, Play, CheckCircle2, Zap, Search, X 
} from 'lucide-react';

import CircuitPulseNavbar from '@/components/CircuitPulseNavbar';
import CircuitPulseHero from '@/components/CircuitPulseHero';
import ScrollCircuitApproach from '@/components/ScrollCircuitApproach';

import TrackCanvas3D from '@/components/TrackCanvas3D';
import TelemetryGraph from '@/components/TelemetryGraph';
import GForceMeter from '@/components/GForceMeter';
import TireThermalHUD from '@/components/TireThermalHUD';
import PowerUnitGauge from '@/components/PowerUnitGauge';
import CircuitSpecsModal from '@/components/CircuitSpecsModal';
import DriverCompareModal from '@/components/DriverCompareModal';

import { fetchCircuitData, fetchDriversData, CIRCUITS_DATA } from '@/lib/api';
import { soundFx } from '@/lib/audioFx';

export default function Home() {
  const containerRef = useRef(null);

  // Global State
  const [activeTab, setActiveTab] = useState('CIRCUIT');
  const [selectedCircuit, setSelectedCircuit] = useState('zandvoort');
  const [circuitData, setCircuitData] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loadingCircuit, setLoadingCircuit] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [isApiFallback, setIsApiFallback] = useState(false);
  const [unit, setUnit] = useState('kmh');

  // Standings Filter State
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriverDetail, setSelectedDriverDetail] = useState(null);

  // Modals State
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Fetch circuit metadata
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
        if (active) setLoadingCircuit(false);
      });
    return () => {
      active = false;
    };
  }, [selectedCircuit]);

  // Fetch driver standings
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
        if (active) setLoadingDrivers(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCircuitSelect = (id) => {
    soundFx.playClick();
    setSelectedCircuit(id);
  };

  // Filtered drivers list
  const filteredDrivers = drivers.filter(d => {
    const matchesTeam = selectedTeamFilter === 'ALL' || d.team.toLowerCase().includes(selectedTeamFilter.toLowerCase());
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.team.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  return (
    <div ref={containerRef} className="bg-[#07090e] text-slate-100 font-sans min-h-screen relative overflow-x-hidden selection:bg-red-600 selection:text-white">
      
      {/* Dynamic Background Glow Orbs */}
      <div className="fixed top-20 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-20 right-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />

      {/* 1. FLOATING PILL NAVBAR */}
      <CircuitPulseNavbar 
        unit={unit}
        setUnit={setUnit}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSpecs={() => setIsSpecsOpen(true)}
      />

      {/* 2. HERO SECTION & COUNTDOWN CARD */}
      <CircuitPulseHero 
        onExploreScroll={() => setActiveTab('CIRCUIT')}
      />

      {/* 3. SCROLL-DRIVEN CIRCUIT APPROACH SECTION */}
      <ScrollCircuitApproach unit={unit} />

      {/* 4. MAIN TELEMETRY DASHBOARD CONTENT */}
      <main className="pt-16 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* SECTION A: INTERACTIVE 3D TELEMETRY STUDIO */}
        <motion.section 
          id="telemetry-studio" 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-red-500 font-bold uppercase tracking-wider">
                <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                <span>02. SPATIAL CIRCUIT MODEL</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-orbitron font-extrabold italic text-white uppercase mt-1">
                3D CANVASES & VENUE SELECTOR
              </h2>
            </div>

            {/* Django API Status Badge */}
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold border shadow-md ${
                isApiFallback 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isApiFallback ? 'OFFLINE FALLBACK DATA' : 'DJANGO REST API LIVE'}</span>
            </motion.div>
          </div>

          {/* Circuit Switcher Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {Object.keys(CIRCUITS_DATA).map((id) => {
              const c = CIRCUITS_DATA[id];
              const isSelected = selectedCircuit === id;
              return (
                <motion.button
                  key={id}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCircuitSelect(id)}
                  className={`relative p-3.5 rounded-2xl text-left font-mono transition-all border ${
                    isSelected
                      ? 'bg-red-950/40 border-red-500 text-white shadow-[0_0_25px_rgba(255,24,1,0.25)]'
                      : 'glass-panel text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {isSelected && (
                    <motion.div 
                      layoutId="activeCircuitBorder"
                      className="absolute inset-0 rounded-2xl border-2 border-red-600 pointer-events-none shadow-[inset_0_0_15px_rgba(255,24,1,0.3)]"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                  <span className="text-[10px] uppercase block font-bold text-slate-500">{c.country}</span>
                  <span className="text-xs font-orbitron font-extrabold uppercase truncate block mt-0.5">{c.id}</span>
                  <span className="text-[10px] text-red-500 block mt-1 font-semibold">{c.turns} TURNS</span>
                </motion.button>
              );
            })}
          </div>

          {/* 3D Canvas Container */}
          <TrackCanvas3D 
            circuitData={circuitData}
            trackColor="#FF1801"
            emissiveColor="#ff3300"
            glowColor="#FF1801"
            gridColor="#1e293b"
            unit={unit}
          />
        </motion.section>

        {/* SECTION B: LIVE TELEMETRY ANALYTICS SUITE */}
        <motion.section 
          id="telemetry-analytics" 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-red-500 font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-red-500" />
              <span>03. VEHICLE DIAGNOSTICS</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-orbitron font-extrabold italic text-white uppercase mt-1">
              LIVE TELEMETRY METRICS
            </h2>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <TelemetryGraph unit={unit} />
            </div>

            <div className="lg:col-span-5 space-y-6">
              <GForceMeter />
              <PowerUnitGauge />
            </div>
          </div>

          <TireThermalHUD />
        </motion.section>

        {/* SECTION C: PADDOCK STANDINGS & LEADERBOARD */}
        <motion.section 
          id="standings" 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-red-500 font-bold uppercase tracking-wider">
                <Flag className="w-4 h-4 text-amber-400" />
                <span>04. PADDOCK STANDINGS</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-orbitron font-extrabold italic text-white uppercase mt-1">
                DRIVER LEADERBOARD & SECTOR TIMES
              </h2>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundFx.playClick();
                setIsCompareOpen(true);
              }}
              className="px-5 py-2.5 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold hover:bg-red-600/20 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,24,1,0.15)]"
            >
              <Users className="w-4 h-4" />
              <span>HEAD-TO-HEAD COMPARISON</span>
            </motion.button>
          </div>

          {/* Filter Bar & Search Input */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/10 w-full md:w-auto">
              {['ALL', 'Red Bull', 'Ferrari', 'McLaren', 'Mercedes'].map((team) => (
                <button
                  key={team}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedTeamFilter(team);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all ${
                    selectedTeamFilter === team
                      ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(255,24,1,0.5)] font-orbitron'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {team}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="SEARCH DRIVER OR TEAM..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-2xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl bg-[#0b0e17]/80">
            {loadingDrivers ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3 font-mono text-xs">
                <RefreshCw className="w-6 h-6 animate-spin text-red-500" />
                <span>SYNCHRONIZING PADDOCK STANDINGS...</span>
              </div>
            ) : filteredDrivers.length === 0 ? (
              <div className="text-center py-12 font-mono text-slate-500 text-xs">
                NO DRIVERS MATCHING YOUR FILTER.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="text-[10px] text-slate-400 uppercase border-b border-white/10 pb-3">
                      <th className="pb-3 font-bold">POS</th>
                      <th className="pb-3 font-bold">DRIVER</th>
                      <th className="pb-3 font-bold">TEAM</th>
                      <th className="pb-3 font-bold">COMPOUND</th>
                      <th className="pb-3 font-bold">S1 SPLIT</th>
                      <th className="pb-3 font-bold">S2 SPLIT</th>
                      <th className="pb-3 font-bold">S3 SPLIT</th>
                      <th className="pb-3 font-bold text-right">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredDrivers.map((driver, index) => (
                      <motion.tr 
                        key={driver.number || index} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.04 }}
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedDriverDetail(driver);
                        }}
                        className="transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 font-bold font-orbitron text-slate-400 group-hover:text-red-400">P{index + 1}</td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className="w-1.5 h-6 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: driver.team_color }} />
                            <span className="font-bold text-white font-orbitron">#{driver.number} {driver.abbreviation}</span>
                            <span className="text-slate-400 font-sans hidden sm:inline">{driver.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 font-semibold text-slate-300">{driver.team}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            driver.tire === 'SOFT' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                            driver.tire === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                            'bg-slate-500/10 text-slate-300 border-slate-500/30'
                          }`}>
                            {driver.tire || 'SOFT'}
                          </span>
                        </td>
                        <td className="py-3.5 text-emerald-400 font-semibold font-orbitron">{driver.s1 || '21.402'}s</td>
                        <td className="py-3.5 text-emerald-400 font-semibold font-orbitron">{driver.s2 || '34.190'}s</td>
                        <td className="py-3.5 text-emerald-400 font-semibold font-orbitron">{driver.s3 || '19.210'}s</td>
                        <td className="py-3.5 text-right font-bold text-amber-400 font-orbitron text-sm">
                          {driver.points || (300 - index * 25)} PTS
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#04060a] py-8 text-center font-mono text-xs text-slate-500 space-y-2 relative z-10">
        <div className="flex items-center justify-center gap-2">
          <div className="bg-red-600 text-white font-black px-2 py-0.5 rounded text-[10px] tracking-widest italic font-orbitron shadow-[0_0_10px_rgba(255,24,1,0.5)]">
            F1
          </div>
          <span className="font-bold text-slate-300 uppercase font-orbitron">FORMULA 1 CIRCUIT PULSE</span>
        </div>
        <p className="text-[10px]">
          POWERED BY NEXT.JS 16, FRAMER MOTION & THREE.JS SPATIAL CANVASES
        </p>
      </footer>

      {/* DRIVER DETAIL POPUP MODAL */}
      <AnimatePresence>
        {selectedDriverDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDriverDetail(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#090e1a] border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_60px_rgba(0,243,255,0.25)] space-y-5 z-10 font-mono"
            >
              <button
                onClick={() => setSelectedDriverDetail(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <span className="w-3 h-10 rounded-full shadow-[0_0_12px_currentColor]" style={{ backgroundColor: selectedDriverDetail.team_color }} />
                <div>
                  <h3 className="text-2xl font-orbitron font-black text-white uppercase">
                    #{selectedDriverDetail.number} {selectedDriverDetail.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">{selectedDriverDetail.team}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">SEASON POINTS</span>
                  <span className="text-lg font-bold text-amber-400 font-orbitron">{selectedDriverDetail.points} PTS</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">SPEED TRAP</span>
                  <span className="text-lg font-bold text-cyan-400 font-orbitron">
                    {unit === 'mph' ? Math.round((selectedDriverDetail.top_speed || 348) * 0.621371) + ' MPH' : `${selectedDriverDetail.top_speed || 348} KM/H`}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">SECTOR 1 SPLIT:</span>
                  <span className="text-emerald-400 font-bold font-orbitron">{selectedDriverDetail.s1 || '21.402'}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SECTOR 2 SPLIT:</span>
                  <span className="text-emerald-400 font-bold font-orbitron">{selectedDriverDetail.s2 || '34.190'}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SECTOR 3 SPLIT:</span>
                  <span className="text-emerald-400 font-bold font-orbitron">{selectedDriverDetail.s3 || '19.210'}s</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODALS */}
      <CircuitSpecsModal 
        circuitId={selectedCircuit}
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
        unit={unit}
      />

      <DriverCompareModal 
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        drivers={drivers}
        unit={unit}
      />

    </div>
  );
}
