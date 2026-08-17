export const RACE_SCHEDULE = [
  {
    id: "monaco",
    name: "CIRCUIT DE MONACO",
    location: "MONTE CARLO, MONACO",
    round: "ROUND 08",
    date: "MAY 22 - 24, 2026",
    length: "3.337 KM",
    laps: "78 LAPS",
    lapRecord: "1:12.909 (L. Hamilton)",
    backdropUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop",
    svgPath: "M 120 420 L 80 380 L 50 280 L 70 180 L 120 120 L 180 90 L 260 100 L 320 140 L 290 180 L 310 210 L 370 200 L 450 230 L 520 280 L 480 320 L 410 300 L 350 310 L 300 340 L 280 400 L 220 420 Z",
    corners: [
      { id: 1, name: "Sainte Dévote", speed: 108, gear: "2", throttle: 45, brake: 90, gForce: "2.8G" },
      { id: 3, name: "Massenet", speed: 215, gear: "4", throttle: 92, brake: 0, gForce: "3.6G" },
      { id: 4, name: "Casino Square", speed: 228, gear: "5", throttle: 95, brake: 0, gForce: "3.2G" },
      { id: 6, name: "Grand Hotel Hairpin", speed: 52, gear: "1", throttle: 20, brake: 100, gForce: "1.9G" },
      { id: 8, name: "Portier", speed: 84, gear: "2", throttle: 60, brake: 75, gForce: "2.4G" },
      { id: 9, name: "The Tunnel", speed: 290, gear: "7", throttle: 100, brake: 0, gForce: "4.1G" },
      { id: 10, name: "Nouvelle Chicane", speed: 92, gear: "2", throttle: 35, brake: 95, gForce: "3.9G" },
      { id: 12, name: "Tabac", speed: 168, gear: "3", throttle: 80, brake: 20, gForce: "3.4G" },
      { id: 14, name: "Swimming Pool", speed: 220, gear: "4", throttle: 88, brake: 15, gForce: "3.8G" },
      { id: 18, name: "La Rascasse", speed: 65, gear: "1", throttle: 25, brake: 90, gForce: "2.2G" }
    ]
  },
  {
    id: "spa",
    name: "SPA-FRANCORCHAMPS",
    location: "STAVELOT, BELGIUM",
    round: "ROUND 13",
    date: "JUL 24 - 26, 2026",
    length: "7.004 KM",
    laps: "44 LAPS",
    lapRecord: "1:46.286 (V. Bottas)",
    backdropUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2000&auto=format&fit=crop",
    svgPath: "M 100 200 L 140 120 L 220 100 L 320 80 L 420 110 L 520 180 L 480 280 L 420 380 L 320 420 L 200 400 L 120 320 Z",
    corners: [
      { id: 1, name: "La Source", speed: 82, gear: "1", throttle: 40, brake: 95, gForce: "2.6G" },
      { id: 3, name: "Eau Rouge / Raidillon", speed: 308, gear: "7", throttle: 100, brake: 0, gForce: "4.8G" },
      { id: 10, name: "Pouhon", speed: 292, gear: "6", throttle: 85, brake: 15, gForce: "5.2G" },
      { id: 18, name: "Blanchimont", speed: 318, gear: "8", throttle: 100, brake: 0, gForce: "4.5G" }
    ]
  },
  {
    id: "monza",
    name: "AUTODROMO DI MONZA",
    location: "MONZA, ITALY",
    round: "ROUND 16",
    date: "SEP 04 - 06, 2026",
    length: "5.793 KM",
    laps: "53 LAPS",
    lapRecord: "1:21.046 (R. Barrichello)",
    backdropUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2000&auto=format&fit=crop",
    svgPath: "M 80 400 L 120 180 L 220 140 L 380 120 L 520 160 L 540 260 L 420 340 L 260 380 Z",
    corners: [
      { id: 1, name: "Variante del Rettifilo", speed: 78, gear: "1", throttle: 30, brake: 100, gForce: "4.9G" },
      { id: 4, name: "Variante della Roggia", speed: 115, gear: "2", throttle: 40, brake: 90, gForce: "3.7G" },
      { id: 8, name: "Variante Ascari", speed: 238, gear: "5", throttle: 85, brake: 25, gForce: "4.2G" },
      { id: 11, name: "Curva Parabolica", speed: 220, gear: "4", throttle: 90, brake: 10, gForce: "3.9G" }
    ]
  }
];

export function getUpcomingRace() {
  return RACE_SCHEDULE[0];
}