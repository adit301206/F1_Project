/**
 * Telemetry curve generator for Speed vs Distance, Throttle %, Brake %, and RPM
 */
export function generateLapTelemetry(driverA = "VER", driverB = "NOR") {
  const pointsCount = 40;
  const data = [];

  for (let i = 0; i <= pointsCount; i++) {
    const distancePercent = (i / pointsCount) * 100;
    
    // Simulate lap speed profile with straightaways and corners
    const isCorner1 = distancePercent > 12 && distancePercent < 22;
    const isCorner2 = distancePercent > 45 && distancePercent < 58;
    const isCorner3 = distancePercent > 78 && distancePercent < 88;

    let baseSpeedA = 325;
    let baseSpeedB = 322;
    let throttleA = 100;
    let throttleB = 100;
    let brakeA = 0;
    let brakeB = 0;
    let gearA = 8;
    let gearB = 8;

    if (isCorner1) {
      baseSpeedA = 110 + Math.sin((distancePercent - 12) * 0.3) * 30;
      baseSpeedB = 105 + Math.sin((distancePercent - 12) * 0.3) * 32;
      throttleA = 15;
      throttleB = 10;
      brakeA = 85;
      brakeB = 92;
      gearA = 3;
      gearB = 3;
    } else if (isCorner2) {
      baseSpeedA = 160 + Math.cos((distancePercent - 45) * 0.25) * 40;
      baseSpeedB = 164 + Math.cos((distancePercent - 45) * 0.25) * 38;
      throttleA = 45;
      throttleB = 52;
      brakeA = 20;
      brakeB = 10;
      gearA = 4;
      gearB = 5;
    } else if (isCorner3) {
      baseSpeedA = 90 + Math.sin((distancePercent - 78) * 0.4) * 20;
      baseSpeedB = 94 + Math.sin((distancePercent - 78) * 0.4) * 18;
      throttleA = 0;
      throttleB = 5;
      brakeA = 98;
      brakeB = 94;
      gearA = 2;
      gearB = 2;
    }

    data.push({
      distance: Math.round((distancePercent / 100) * 3337), // Monaco meter distance
      percent: Math.round(distancePercent),
      speedA: Math.round(baseSpeedA + (i % 3) * 2),
      speedB: Math.round(baseSpeedB + (i % 2) * 3),
      throttleA: Math.min(100, Math.max(0, throttleA)),
      throttleB: Math.min(100, Math.max(0, throttleB)),
      brakeA: Math.min(100, Math.max(0, brakeA)),
      brakeB: Math.min(100, Math.max(0, brakeB)),
      gearA,
      gearB,
      rpmA: Math.round(10500 + (baseSpeedA / 350) * 3000),
      rpmB: Math.round(10400 + (baseSpeedB / 350) * 3100),
    });
  }

  return data;
}

/**
 * G-Force simulation data generator
 */
export function getGForceMetrics() {
  return {
    lateralG: 3.85,
    longitudinalG: -4.62,
    verticalG: 1.15,
    peakBrakingG: 5.10,
    peakCorneringG: 4.45,
  };
}
