/**
 * Comprehensive F1 Circuit Dataset & Fallbacks
 */
export const CIRCUITS_DATA = {
  zandvoort: {
    id: "zandvoort",
    track_name: "Circuit Park Zandvoort",
    locality: "Zandvoort",
    country: "Netherlands",
    length_km: 4.259,
    turns: 14,
    drs_zones: 2,
    elevation_delta_m: 15,
    lap_record: "1:11.097 (Lewis Hamilton, 2021)",
    top_speed_kmh: 315,
    svg_path: "M 380,430 C 320,370 270,320 230,210 C 240,140 310,110 390,120 C 470,130 520,170 580,210 C 640,250 720,230 770,170 C 820,110 880,130 890,200 C 900,270 850,360 830,430 C 810,500 780,570 800,640 C 820,710 880,770 860,830 C 840,880 770,910 700,890 C 620,870 540,820 460,760 Z",
    corners: [
      { id: 1, name: "Tarzan Corner", speed: 115, gear: 2 },
      { id: 3, name: "Hugenholtzbocht", speed: 142, gear: 3 },
      { id: 7, name: "Scheivlak", speed: 265, gear: 6 },
      { id: 10, name: "Hans Ernstbocht", speed: 125, gear: 3 },
      { id: 14, name: "Arie Luyendykbocht", speed: 295, gear: 7 },
    ]
  },
  monaco: {
    id: "monaco",
    track_name: "Circuit de Monaco",
    locality: "Monte Carlo",
    country: "Monaco",
    length_km: 3.337,
    turns: 19,
    drs_zones: 1,
    elevation_delta_m: 42,
    lap_record: "1:12.909 (Lewis Hamilton, 2021)",
    top_speed_kmh: 290,
    svg_path: "M 80,220 C 70,180 90,140 140,110 C 200,80 280,60 340,90 C 400,120 420,170 390,210 C 350,260 260,220 220,260 C 180,300 130,350 90,310 C 60,280 90,260 80,220 Z",
    corners: [
      { id: 1, name: "Sainte Dévote", speed: 95, gear: 2 },
      { id: 4, name: "Casino Square", speed: 145, gear: 4 },
      { id: 6, name: "Grand Hôtel Hairpin", speed: 48, gear: 1 },
      { id: 10, name: "Nouvelle Chicane", speed: 85, gear: 2 },
      { id: 15, name: "Piscine (Swimming Pool)", speed: 215, gear: 6 },
      { id: 19, name: "Rascasse", speed: 75, gear: 2 },
    ]
  },
  silverstone: {
    id: "silverstone",
    track_name: "Silverstone Circuit",
    locality: "Silverstone",
    country: "United Kingdom",
    length_km: 5.891,
    turns: 18,
    drs_zones: 2,
    elevation_delta_m: 11,
    lap_record: "1:27.097 (Max Verstappen, 2020)",
    top_speed_kmh: 335,
    svg_path: "M 50,100 L 200,50 C 280,30 350,80 380,120 L 300,250 C 240,310 150,300 100,240 Z",
    corners: [
      { id: 1, name: "Abbey", speed: 290, gear: 8 },
      { id: 3, name: "Village", speed: 110, gear: 3 },
      { id: 9, name: "Copse", speed: 285, gear: 8 },
      { id: 11, name: " Maggotts & Becketts", speed: 275, gear: 7 },
      { id: 15, name: "Stowe", speed: 245, gear: 6 },
    ]
  },
  spa: {
    id: "spa",
    track_name: "Circuit de Spa-Francorchamps",
    locality: "Stavelot",
    country: "Belgium",
    length_km: 7.004,
    turns: 19,
    drs_zones: 2,
    elevation_delta_m: 102,
    lap_record: "1:46.286 (Valtteri Bottas, 2018)",
    top_speed_kmh: 345,
    svg_path: "M 60,60 L 320,80 C 400,120 380,240 320,290 L 140,310 C 80,270 50,150 60,60 Z",
    corners: [
      { id: 1, name: "La Source", speed: 75, gear: 1 },
      { id: 3, name: "Eau Rouge / Raidillon", speed: 305, gear: 8 },
      { id: 7, name: "Les Combes", speed: 165, gear: 4 },
      { id: 10, name: "Pouhon", speed: 280, gear: 7 },
      { id: 17, name: "Blanchimont", speed: 315, gear: 8 },
      { id: 19, name: "Bus Stop Chicane", speed: 85, gear: 2 },
    ]
  },
  monza: {
    id: "monza",
    track_name: "Autodromo Nazionale Monza",
    locality: "Monza",
    country: "Italy",
    length_km: 5.793,
    turns: 11,
    drs_zones: 2,
    elevation_delta_m: 13,
    lap_record: "1:21.046 (Rubens Barrichello, 2004)",
    top_speed_kmh: 358,
    svg_path: "M 60,280 L 70,80 C 150,50 350,50 400,100 L 390,260 C 300,310 120,320 60,280 Z",
    corners: [
      { id: 1, name: "Variante del Rettifilo", speed: 75, gear: 1 },
      { id: 4, name: "Variante della Roggia", speed: 120, gear: 3 },
      { id: 6, name: "Curva di Lesmo 1", speed: 185, gear: 5 },
      { id: 8, name: "Variante Ascari", speed: 220, gear: 6 },
      { id: 11, name: "Curva Parabolica (Alboreto)", speed: 215, gear: 5 },
    ]
  },
  suzuka: {
    id: "suzuka",
    track_name: "Suzuka International Racing Course",
    locality: "Suzuka",
    country: "Japan",
    length_km: 5.807,
    turns: 18,
    drs_zones: 1,
    elevation_delta_m: 40,
    lap_record: "1:30.983 (Lewis Hamilton, 2019)",
    top_speed_kmh: 332,
    svg_path: "M 80,240 C 140,160 220,100 300,120 C 360,140 380,220 300,280 C 220,320 140,280 80,240 Z",
    corners: [
      { id: 1, name: "First Corner", speed: 235, gear: 6 },
      { id: 3, name: "S Curves", speed: 210, gear: 5 },
      { id: 9, name: "Degner 1", speed: 185, gear: 4 },
      { id: 11, name: "Hairpin", speed: 68, gear: 1 },
      { id: 15, name: "130R", speed: 305, gear: 8 },
    ]
  },
  lasvegas: {
    id: "lasvegas",
    track_name: "Las Vegas Strip Circuit",
    locality: "Las Vegas",
    country: "United States",
    length_km: 6.201,
    turns: 17,
    drs_zones: 2,
    elevation_delta_m: 4,
    lap_record: "1:35.490 (Oscar Piastri, 2023)",
    top_speed_kmh: 350,
    svg_path: "M 70,80 L 380,80 L 390,260 L 220,280 L 70,180 Z",
    corners: [
      { id: 1, name: "Turn 1 Hairpin", speed: 85, gear: 2 },
      { id: 5, name: "Sphere Chicane", speed: 130, gear: 3 },
      { id: 12, name: "Las Vegas Blvd Straight", speed: 350, gear: 8 },
      { id: 17, name: "Harmon Corner", speed: 110, gear: 3 },
    ]
  }
};

/**
 * Fetches circuit details from the Django REST API with fallback data in case of failure.
 */
export async function fetchCircuitData(circuitId = 'monaco') {
  const formattedId = circuitId.toLowerCase();
  const url = `http://127.0.0.1:8000/api/circuit/?circuit_id=${formattedId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { ...CIRCUITS_DATA[formattedId], ...data, isFallback: false };
  } catch (error) {
    console.warn(`[API] Failed to fetch circuit data for "${formattedId}" from Django backend. Using client-side fallback dataset.`, error);
    return { ...(CIRCUITS_DATA[formattedId] || CIRCUITS_DATA.monaco), isFallback: true };
  }
}

/**
 * Fetches driver leaderboard data from the Django REST API with fallback data in case of failure.
 */
export async function fetchDriversData() {
  const url = `http://127.0.0.1:8000/api/drivers/`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`[API] Failed to fetch drivers list from Django backend. Using client-side safety fallback.`, error);
    
    return [
      {"name": "Max Verstappen", "abbreviation": "VER", "number": 1, "team": "Red Bull Racing", "team_color": "#3671C2", "points": 312, "tire": "SOFT", "s1": "21.402", "s2": "34.190", "s3": "19.210", "pitstops": 1, "top_speed": 348},
      {"name": "Lando Norris", "abbreviation": "NOR", "number": 4, "team": "McLaren", "team_color": "#FF8000", "points": 274, "tire": "MEDIUM", "s1": "21.448", "s2": "34.215", "s3": "19.288", "pitstops": 1, "top_speed": 346},
      {"name": "Charles Leclerc", "abbreviation": "LEC", "number": 16, "team": "Ferrari", "team_color": "#E80020", "points": 245, "tire": "MEDIUM", "s1": "21.490", "s2": "34.310", "s3": "19.305", "pitstops": 1, "top_speed": 347},
      {"name": "Lewis Hamilton", "abbreviation": "HAM", "number": 44, "team": "Ferrari", "team_color": "#E80020", "points": 210, "tire": "HARD", "s1": "21.520", "s2": "34.390", "s3": "19.340", "pitstops": 2, "top_speed": 345},
      {"name": "Oscar Piastri", "abbreviation": "PIA", "number": 81, "team": "McLaren", "team_color": "#FF8000", "points": 198, "tire": "SOFT", "s1": "21.505", "s2": "34.402", "s3": "19.320", "pitstops": 1, "top_speed": 346},
      {"name": "George Russell", "abbreviation": "RUS", "number": 63, "team": "Mercedes", "team_color": "#27F4D2", "points": 182, "tire": "HARD", "s1": "21.560", "s2": "34.450", "s3": "19.390", "pitstops": 2, "top_speed": 344},
      {"name": "Carlos Sainz", "abbreviation": "SAI", "number": 55, "team": "Williams", "team_color": "#00A0DE", "points": 160, "tire": "MEDIUM", "s1": "21.610", "s2": "34.510", "s3": "19.410", "pitstops": 1, "top_speed": 343},
      {"name": "Fernando Alonso", "abbreviation": "ALO", "number": 14, "team": "Aston Martin", "team_color": "#229971", "points": 124, "tire": "HARD", "s1": "21.640", "s2": "34.580", "s3": "19.450", "pitstops": 2, "top_speed": 342}
    ];
  }
}

