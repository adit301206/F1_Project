import { useState, useEffect } from 'react';
import './SessionCountdown.css';

export default function SessionCountdown({ circuitId }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [sessionName, setSessionName] = useState("");

  useEffect(() => {
    // Determine the target time offset based on circuit
    let durationMs = 0;
    if (circuitId === "monaco") {
      setSessionName("MONACO GP - THE GRAND PRIX");
      // 17 hours, 25 minutes, 10 seconds from now
      durationMs = (17 * 60 * 60 + 25 * 60 + 10) * 1000;
    } else {
      setSessionName("BRITISH GP - QUALIFYING SESSION");
      // 2 days, 4 hours, 12 minutes, 30 seconds from now
      durationMs = (2 * 24 * 60 * 60 + 4 * 60 * 60 + 12 * 60 + 30) * 1000;
    }

    const targetTime = Date.now() + durationMs;

    const updateTimer = () => {
      const diff = targetTime - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [circuitId]);

  const pad = (num) => String(num).padStart(2, '0');

  return (
    <div className="countdown-card">
      <div className="countdown-header">
        <div className="live-status-dot"></div>
        <span className="session-status-tag">UPCOMING SESSION</span>
      </div>
      <h3 className="session-title">{sessionName}</h3>

      <div className="timer-grid">
        <div className="time-block">
          <span className="time-digits">{pad(timeLeft.days)}</span>
          <span className="time-label">DAYS</span>
        </div>
        <div className="time-divider">:</div>
        <div className="time-block">
          <span className="time-digits">{pad(timeLeft.hours)}</span>
          <span className="time-label">HRS</span>
        </div>
        <div className="time-divider">:</div>
        <div className="time-block">
          <span className="time-digits">{pad(timeLeft.minutes)}</span>
          <span className="time-label">MINS</span>
        </div>
        <div className="time-divider">:</div>
        <div className="time-block animate-pulse-seconds">
          <span className="time-digits text-red">{pad(timeLeft.seconds)}</span>
          <span className="time-label">SECS</span>
        </div>
      </div>
      <div className="pit-lane-status">
        <span className="status-label">TRACK STATUS</span>
        <span className="status-val">GREEN FLAG / DRY</span>
      </div>
    </div>
  );
}
