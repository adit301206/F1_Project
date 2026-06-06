import { useState, useEffect } from 'react';
import './TrackMap.css';

export default function TrackMap({ circuitId }) {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/circuit/?circuit_id=${circuitId}`)
      .then((res) => res.json())
      .then((data) => {
        setTrack(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load circuit configurations:", err);
        setLoading(false);
      });
  }, [circuitId]);

  if (loading) return <div className="track-skeleton">Booting Hologram Projection System... 🛰️</div>;
  if (!track) return <div className="track-error">Circuit data unavailable</div>;

  return (
    <div className="telemetry-showcase-container-3d">
      
      {/* Central Overlay Typography Mesh - Floats cleanly high above the 3D rotation plane */}
      <div className="absolute-center-label-3d">
        <span className="ambient-tag-3d">{track.locality}</span>
        <h2 className="core-destination-text-3d">{track.country}</h2>
      </div>

      {/* 3D Render Perspective Stage */}
      <div className="stage-3d-viewport">
        <div className="orbiting-3d-hologram">
          <svg viewBox="0 0 500 400" className="circuit-vector-fluid-huge-3d">
            <defs>
              {/* Vibrant Multi-Color Telemetry Gradient Stops */}
              <linearGradient id="velocity-gradient-3d" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f2fe" />   {/* High Speed Cyan */}
                <stop offset="35%" stopColor="#38ef7d" />  {/* Apex Green */}
                <stop offset="70%" stopColor="#ff007f" />  {/* Performance Pink */}
                <stop offset="100%" stopColor="#ff1801" /> {/* Braking Red */}
              </linearGradient>

              {/* Holographic Radiance Filter */}
              <filter id="neon-glow-filter-3d" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Layer 1: Holographic Deep Ground Shadow Drop */}
            <path d={track.svg_path} className="vector-base-track-3d shadow-layer" />
            
            {/* Layer 2: Extruded Mid-Level Thickness Layer */}
            <path d={track.svg_path} className="vector-base-track-3d extrusion-layer" />
            
            {/* Layer 3: Main Glowing Core Top-Flite Circuit Tracer */}
            <path d={track.svg_path} className="vector-neon-core-3d" />
          </svg>
        </div>
        
        {/* Futuristic Grid Line Target Floor beneath the map */}
        <div className="paddock-floor-grid"></div>
      </div>
    </div>
  );
}
