import { useState, useEffect } from 'react';
import TrackMap from './components/TrackMap';
import SessionCountdown from './components/SessionCountdown';
import './App.css';

function App() {
  const [drivers, setDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(true);
  const [driversError, setDriversError] = useState(null);
  const [circuitId, setCircuitId] = useState('monaco');

  useEffect(() => {
    setDriversLoading(true);
    fetch('http://127.0.0.1:8000/api/drivers/')
      .then((response) => {
        if (!response.ok) throw new Error('Paddock connection dropped. Verify Django backend.');
        return response.json();
      })
      .then((data) => {
        setDrivers(data);
        setDriversLoading(false);
      })
      .catch((err) => {
        setDriversError(err.message);
        setDriversLoading(false);
      });
  }, []);

  return (
    <div className="paddock-canvas">
      
      {/* Centralized Telemetry Hero Block */}
      <header className="centralized-telemetry-hero">
        <div className="broadcast-headline-block">
          <span className="live-pill">● LIVE TELEMETRY FEED</span>
          
          <h1 className="main-paddock-title">
            <span className="flag-icon">🏁</span> PADDOCK TELEMETRY
          </h1>
          
          <p className="main-paddock-subtitle">
            Real-time Formula 1 racing insights and track telemetry synced with Django backend
          </p>
        </div>

        {/* Dynamic Circuit Selector Tabs */}
        <div className="telemetry-controls">
          <div className="circuit-tabs">
            <button 
              className={`tab-btn ${circuitId === 'monaco' ? 'active' : ''}`}
              onClick={() => setCircuitId('monaco')}
            >
              🇲🇨 MONACO GP
            </button>
            <button 
              className={`tab-btn ${circuitId === 'silverstone' ? 'active' : ''}`}
              onClick={() => setCircuitId('silverstone')}
            >
              🇬🇧 SILVERSTONE GP
            </button>
          </div>
        </div>

        {/* Large Multi-color Central Circuit Showcase Module */}
        <div className="showcase-stage">
          <TrackMap circuitId={circuitId} />
        </div>
      </header>

      {/* Main Structural Grid Section Deck */}
      <main className="main-paddock-content">
        
        {/* Dynamic Countdown Component Segment */}
        <section className="countdown-section-wrapper">
          <SessionCountdown circuitId={circuitId} />
        </section>

        {/* Driver Lineup Cluster Grid */}
        <section className="drivers-sectionbox">
          <h2 className="paddock-section-title">Official Driver Grid Lineup</h2>
          
          {driversLoading ? (
            <div className="drivers-loading">
              <div className="spinner-glow"></div>
              <p>Warming up tire blankets...</p>
            </div>
          ) : driversError ? (
            <div className="drivers-error">🛑 Engine Blowout: {driversError}</div>
          ) : (
            <div className="driver-grid">
              {drivers.map((driver) => (
                <div 
                  key={driver.number} 
                  className="driver-card"
                  style={{ '--team-color': driver.team_color }}
                >
                  <div className="driver-number-bg">{driver.number}</div>
                  <div className="driver-inner-content">
                    <span className="driver-number-badge" style={{ backgroundColor: driver.team_color }}>
                      #{driver.number}
                    </span>
                    <div className="driver-details">
                      <h2>{driver.name} <span className="abbrev">({driver.abbreviation})</span></h2>
                      <p className="team-name">{driver.team}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;