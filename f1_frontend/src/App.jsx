import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch directly from your newly built Django API endpoint
    fetch('http://127.0.0.1:8000/api/drivers/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Paddock link failed. Check if Django server is down!');
        }
        return response.json();
      })
      .then((data) => {
        setDrivers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Warming up tire blankets... 🏎️💨</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-screen">🛑 Engine Blowout: {error}</div>;
  }

  return (
    <div className="app-container">
      <header className="f1-header">
        <h1>🏁 F1 Paddock Hub</h1>
        <p>Live Driver Lineup synced via Django REST Framework</p>
      </header>

      <div className="driver-grid">
        {drivers.map((driver) => (
          <div 
            key={driver.number} 
            className="driver-card"
            style={{ borderLeft: `6px solid ${driver.team_color}` }}
          >
            {/* Massive background number for that premium sports look */}
            <div className="driver-number-bg">{driver.number}</div>
            
            <div className="driver-card-content">
              <span className="driver-number-badge" style={{ backgroundColor: driver.team_color }}>
                #{driver.number}
              </span>
              <div className="driver-details">
                <h2>
                  {driver.name} <span className="abbrev">({driver.abbreviation})</span>
                </h2>
                <p className="team-name">{driver.team}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;