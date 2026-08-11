/**
 * Fetches circuit details from the Django REST API with fallback data in case of failure.
 * @param {string} circuitId - The identifier of the circuit (e.g., 'monaco', 'silverstone')
 * @returns {Promise<{id: string, track_name: string, locality: string, country: string, svg_path: string}>}
 */
export async function fetchCircuitData(circuitId = 'monaco') {
  const formattedId = circuitId.toLowerCase();
  const url = `http://127.0.0.1:8000/api/circuit/?circuit_id=${formattedId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`[API] Failed to fetch circuit data for "${formattedId}" from Django backend. Using client-side safety fallback.`, error);
    
    // Safety Fallback package matching the Django REST endpoint's format
    const fallbacks = {
      monaco: {
        id: "monaco",
        track_name: "Circuit de Monaco",
        locality: "Monte Carlo",
        country: "Monaco",
        svg_path: "M 80,220 C 70,180 90,140 140,110 C 200,80 280,60 340,90 C 400,120 420,170 390,210 C 350,260 260,220 220,260 C 180,300 130,350 90,310 C 60,280 90,260 80,220 Z"
      },
      silverstone: {
        id: "silverstone",
        track_name: "Silverstone Circuit",
        locality: "Silverstone",
        country: "UK",
        svg_path: "M 50,100 L 200,50 L 350,120 L 300,250 L 150,280 Z"
      }
    };

    return { ...fallbacks[formattedId] || fallbacks.monaco, isFallback: true };
  }
}

/**
 * Fetches driver leaderboard data from the Django REST API with fallback data in case of failure.
 * @returns {Promise<Array<{name: string, abbreviation: string, number: number, team: string, team_color: string}>>}
 */
export async function fetchDriversData() {
  const url = `http://127.0.0.1:8000/api/drivers/`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`[API] Failed to fetch drivers list from Django backend. Using client-side safety fallback.`, error);
    
    return [
      {"name": "Max Verstappen", "abbreviation": "VER", "number": 1, "team": "Red Bull Racing", "team_color": "#3671C2"},
      {"name": "Lewis Hamilton", "abbreviation": "HAM", "number": 44, "team": "Ferrari", "team_color": "#E80020"},
      {"name": "Lando Norris", "abbreviation": "NOR", "number": 4, "team": "McLaren", "team_color": "#FF8000"},
      {"name": "Charles Leclerc", "abbreviation": "LEC", "number": 16, "team": "Ferrari", "team_color": "#E80020"},
      {"name": "George Russell", "abbreviation": "RUS", "number": 63, "team": "Mercedes", "team_color": "#27F4D2"},
      {"name": "Fernando Alonso", "abbreviation": "ALO", "number": 14, "team": "Aston Martin", "team_color": "#229971"}
    ];
  }
}
