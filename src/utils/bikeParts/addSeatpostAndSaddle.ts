import * as THREE from "three";

/**
 * Add seatpost and saddle to the points and colors arrays.
 * @param points Array of THREE.Vector3 to push new points into.
 * @param colors Array of THREE.Color to push new colors into.
 * @param seatTop Position at top of seat tube.
 * @param seatTubeHeight Height of the seat tube.
 * @param wheelRadius Radius of the wheels.
 * @param frameWidth Thickness of the frame tubes.
 * @param ORANGE_COLOR Color of the frame.
 * @param pointBudget Optional maximum number of points to generate.
 */
export function addSeatpostAndSaddle(
  points: THREE.Vector3[],
  colors: THREE.Color[],
  seatTop: THREE.Vector3,
  seatTubeHeight: number,
  wheelRadius: number,
  frameWidth: number,
  ORANGE_COLOR: THREE.Color,
  pointBudget?: number
) {
  // Track starting points to manage budget
  const startingPoints = points.length;

  const BLACK_COLOR = new THREE.Color("#202020");
  const SILVER_COLOR = new THREE.Color("#C0C0C0");
  
  // Adjust detail levels for mobile if budget is specified
  let detailMultiplier = 1.0;
  if (pointBudget) {
    // Apply a lower detail multiplier if we have a limited budget
    detailMultiplier = pointBudget < 5000 ? 0.4 : 
                       pointBudget < 10000 ? 0.7 : 1.0;
  }
  
  // Seatpost - slightly angled
  const seatPostH = seatTubeHeight * 0.18;
  const seatAngle = Math.PI * 0.03;  // Slight angle
  const seatCtrX = seatTop.x - Math.sin(seatAngle) * seatPostH;
  const seatCtrY = seatTop.y + Math.cos(seatAngle) * seatPostH;
  const seatCtr = new THREE.Vector3(seatCtrX, seatCtrY, 0);
  
  // Seatpost tube
  createTube(seatTop, seatCtr, 30, frameWidth * 0.7, SILVER_COLOR);
  
  // Seatpost clamp
  const clampCenter = new THREE.Vector3(
    seatTop.x,
    seatTop.y + frameWidth * 0.4,
    0
  );
  createCircle(clampCenter, frameWidth * 1.1, 24, frameWidth * 0.2, ORANGE_COLOR);
  
  // Saddle dimensions
  const saddleLength = wheelRadius * 0.6;
  const saddleWidth = frameWidth * 4.5;
  const saddleDip = frameWidth * 0.3;
  const saddleRise = frameWidth * 0.6;
  
  // Saddle rails (two parallel tubes underneath)
  const railStart = new THREE.Vector3(
    seatCtr.x - saddleLength * 0.3,
    seatCtr.y - frameWidth * 1.2,
    0
  );
  
  const railEnd = new THREE.Vector3(
    seatCtr.x + saddleLength * 0.3,
    seatCtr.y - frameWidth * 0.8,
    0
  );
  
  const railSeparation = frameWidth * 2;
  
  // Left rail
  createTube(
    new THREE.Vector3(railStart.x, railStart.y, -railSeparation / 2),
    new THREE.Vector3(railEnd.x, railEnd.y, -railSeparation / 2),
    20,
    frameWidth * 0.25,
    SILVER_COLOR
  );
  
  // Right rail
  createTube(
    new THREE.Vector3(railStart.x, railStart.y, railSeparation / 2),
    new THREE.Vector3(railEnd.x, railEnd.y, railSeparation / 2),
    20,
    frameWidth * 0.25,
    SILVER_COLOR
  );
  
  // Saddle connection point
  createCircle(seatCtr, frameWidth * 0.9, 20, frameWidth * 0.25, BLACK_COLOR);
  
  // Anatomical saddle surface - based on curved grid with optimized density
  const sadLen = saddleLength;
  const sadWid = saddleWidth;
  // Reduce grid density to eliminate unnecessary particles
  const xDivs = Math.floor(25 * detailMultiplier); // Adjusted by detail multiplier
  const zDivs = Math.floor(15 * detailMultiplier); // Adjusted by detail multiplier
  
  // Track points to avoid duplicates
  const usedPositions = new Set<string>();
  
  for (let ix = 0; ix < xDivs; ix++) {
    for (let iz = 0; iz < zDivs; iz++) {
      // Parametric coordinates
      const u = ix / (xDivs - 1);
      const v = iz / (zDivs - 1);
      
      // Skip some points in the middle to reduce density
      if (u > 0.3 && u < 0.7 && ix % 2 === 0 && iz % 2 === 0) {
        continue;
      }
      
      // Base position
      const x = seatCtr.x + (u - 0.5) * sadLen;
      const z = (v - 0.5) * sadWid;
      
      // Anatomical saddle shape with:
      // - Higher nose
      // - Center channel
      // - Raised rear section
      // - Flared sides
      
      // Longitudinal curve (front to back)
      const xFactor = -4 * (u - 0.5) * (u - 0.5) + 1; // Parabola peaking at center
      const longitudinalProfile = xFactor * saddleDip + (u < 0.3 ? saddleRise * (1 - u / 0.3) : 0);
      
      // Center channel and side flare
      const vNorm = Math.abs(v - 0.5) * 2; // 0 at center, 1 at edges
      const channelDepth = frameWidth * 0.35;
      const sideFlare = frameWidth * 0.3;
      
      // Center channel (minimized at nose and tail)
      const channelFactor = Math.max(0, 1 - Math.pow(Math.abs(u - 0.5) * 2.5, 2));
      const centerChannel = v > 0.4 && v < 0.6 ? -channelDepth * channelFactor : 0;
      
      // Side shape (flared for thigh clearance)
      const sideShape = Math.pow(vNorm, 2) * sideFlare;
      
      // Combined height profile
      const y = seatCtr.y + longitudinalProfile + centerChannel + sideShape;
      
      // Create a point with slight jitter to create natural variation
      const jitter = frameWidth * 0.03;
      const px = x + (Math.random() - 0.5) * jitter;
      const py = y + (Math.random() - 0.5) * jitter;
      const pz = z + (Math.random() - 0.5) * jitter;
      
      // Check for duplicate points (with rounding to avoid floating point issues)
      const posKey = `${Math.round(px*100)},${Math.round(py*100)},${Math.round(pz*100)}`;
      if (!usedPositions.has(posKey)) {
        points.push(new THREE.Vector3(px, py, pz));
        colors.push(BLACK_COLOR);
        usedPositions.add(posKey);
      }
    }
  }

  // Helper: tube (cylinder) between two points
  function createTube(
    a: THREE.Vector3,
    b: THREE.Vector3,
    segments: number,
    radius: number,
    color: THREE.Color
  ) {
    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1);
      const center = a.clone().lerp(b, t);
      for (let j = 0; j < 16; j++) { // Reduced from 24
        const angle = (j / 16) * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            center.x + Math.cos(angle) * radius,
            center.y + Math.sin(angle) * radius,
            center.z
          )
        );
        colors.push(color);
      }
    }
  }

  // Helper: circle (torus slice)
  function createCircle(
    center: THREE.Vector3, 
    radius: number, 
    segments: number, 
    thickness: number, 
    color: THREE.Color
  ) {
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      for (let j = 0; j < 8; j++) { // Reduced from 12
        const ta = (j / 8) * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            center.x + x + Math.cos(ta) * thickness,
            center.y + y + Math.sin(ta) * thickness,
            center.z
          )
        );
        colors.push(color);
      }
    }
  }
  
  // If we're over budget, truncate
  if (pointBudget && points.length - startingPoints > pointBudget) {
    const toRemove = (points.length - startingPoints) - pointBudget;
    points.splice(points.length - toRemove, toRemove);
    colors.splice(colors.length - toRemove, toRemove);
  }
} 