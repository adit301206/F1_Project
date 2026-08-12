export const RACE_SCHEDULE = [
  {
    id: "monaco",
    name: "CIRCUIT DE MONACO",
    location: "MONTE CARLO, MONACO",
    coordinates: { latitude: 43.7347, longitude: 7.4206 },
    zoom: 14.8,
    pitch: 55,
    bearing: -20,
    nextSession: "2026-05-24T13:00:00Z",
    backdropUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop",
    corners: [
      { id: 1, name: "Sainte Dévote", speed: 105, gear: "2" },
      { id: 4, name: "Casino Square", speed: 228, gear: "5" },
      { id: 6, name: "Grand Hotel Hairpin", speed: 52, gear: "1" },
      { id: 9, name: "The Tunnel", speed: 288, gear: "7" },
      { id: 18, name: "La Rascasse", speed: 62, gear: "1" }
    ]
  },
  {
    id: "spa",
    name: "CIRCUIT DE SPA-FRANCORCHAMPS",
    location: "STAVELOT, BELGIUM",
    coordinates: { latitude: 50.4372, longitude: 5.9714 },
    zoom: 13.8,
    pitch: 60,
    bearing: 45,
    nextSession: "2026-07-26T13:00:00Z",
    backdropUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2000&auto=format&fit=crop",
    corners: [
      { id: 1, name: "La Source", speed: 80, gear: "1" },
      { id: 3, name: "Eau Rouge / Raidillon", speed: 305, gear: "7" },
      { id: 10, name: "Pouhon", speed: 290, gear: "6" },
      { id: 18, name: "Blanchimont", speed: 315, gear: "8" }
    ]
  },
  {
    id: "monza",
    name: "AUTODROMO NAZIONALE MONZA",
    location: "MONZA, ITALY",
    coordinates: { latitude: 45.6156, longitude: 9.2811 },
    zoom: 14.2,
    pitch: 50,
    bearing: -10,
    nextSession: "2026-09-06T13:00:00Z",
    backdropUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2000&auto=format&fit=crop",
    corners: [
      { id: 1, name: "Variante del Rettifilo", speed: 75, gear: "1" },
      { id: 4, name: "Variante della Roggia", speed: 110, gear: "2" },
      { id: 8, name: "Variante Ascari", speed: 235, gear: "5" },
      { id: 11, name: "Curva Parabolica", speed: 215, gear: "4" }
    ]
  }
];

// Helper to determine next GP venue automatically based on current date
export function getUpcomingRace() {
  const now = new Date();
  const upcoming = RACE_SCHEDULE.find(race => new Date(race.nextSession) > now);
  return upcoming || RACE_SCHEDULE[0]; // Default to Monaco
}