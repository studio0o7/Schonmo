import * as THREE from "three";

/**
 * Add handlebars to the points and colors arrays.
 * @param points Array of THREE.Vector3 to push new points into.
 * @param colors Array of THREE.Color to push new colors into.
 * @param headTubeTop Position at top of head tube.
 * @param wheelRadius Radius of the wheels.
 * @param frameWidth Thickness of the frame tubes.
 * @param ORANGE_COLOR Color of the frame.
 * @param pointBudget Optional maximum number of points to generate.
 */
export function addHandlebars(
  points: THREE.Vector3[],
  colors: THREE.Color[],
  headTubeTop: THREE.Vector3,
  wheelRadius: number,
  frameWidth: number,
  ORANGE_COLOR: THREE.Color,
  pointBudget?: number
) {
  // Track starting points to manage budget
  const startingPoints = points.length;

  // Use imported colors and create new ones
  const SILVER_COLOR = new THREE.Color("#C0C0C0");
  // Create a darker gray for handlebar components
  const DARK_GRAY_COLOR = new THREE.Color("#2A2A2A");

  // Adjust detail levels for mobile if budget is specified
  let detailMultiplier = 1.0;
  if (pointBudget) {
    // Apply a lower detail multiplier if we have a limited budget
    detailMultiplier = pointBudget < 8000 ? 0.5 : 
                       pointBudget < 15000 ? 0.7 : 1.0;
  }

  // Stem - longer and at better angle
  const stemHeight = wheelRadius * 0.15;
  const stemForward = wheelRadius * 0.4;
  const stemTop = new THREE.Vector3(
    headTubeTop.x + stemForward, 
    headTubeTop.y + stemHeight, 
    0
  );
  
  // Tilt handlebar assembly forward around stemTop by 10 degrees
  const handlebarTiltAxis = new THREE.Vector3(1, 0, 0);
  const handlebarTiltAngle = Math.PI / 100; // 10°
  function tiltHandlebarPoint(p: THREE.Vector3): THREE.Vector3 {
    return p.sub(stemTop).applyAxisAngle(handlebarTiltAxis, handlebarTiltAngle).add(stemTop);
  }
  
  // Angled stem - reduced density but still high quality
  createTube(
    headTubeTop, 
    stemTop, 
    Math.floor(60 * detailMultiplier), // Adjusted by detail multiplier
    frameWidth * 0.7, 
    ORANGE_COLOR
  );
  
  // Fill stem volume
  addVolumeParticles(headTubeTop, stemTop, frameWidth * 0.6, 100, ORANGE_COLOR);
  
  // Stem cap bolts
  const stemCapCenter = new THREE.Vector3(
    headTubeTop.x, 
    headTubeTop.y + frameWidth * 0.1, 
    0
  );
  createCircle(stemCapCenter, frameWidth * 0.5, 24, frameWidth * 0.1, DARK_GRAY_COLOR);

  // Handlebar type - modern flat bars
  addFlatBarsWithHoods(stemTop, wheelRadius, frameWidth, SILVER_COLOR, DARK_GRAY_COLOR);
  
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
        // generate and tilt point
        const raw = new THREE.Vector3(
          center.x + Math.cos(angle) * radius,
          center.y + Math.sin(angle) * radius,
          center.z
        );
        points.push(tiltHandlebarPoint(raw));
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
        // generate and tilt point
        const raw = new THREE.Vector3(
          center.x + x + Math.cos(ta) * thickness,
          center.y + y + Math.sin(ta) * thickness,
          center.z
        );
        points.push(tiltHandlebarPoint(raw));
        colors.push(color);
      }
    }
  }
  
  // Add modern flat bars with subtle extensions for brake hoods
  function addFlatBarsWithHoods(stemPos: THREE.Vector3, radius: number, width: number, barColor: THREE.Color, hoodColor: THREE.Color) {
    const barWidth = radius * 1.8;  // Wider bars
    const barThickness = width * 0.65;
    const riseAmount = radius * 0.05;
    const hoodLength = radius * 0.2;
    
    // Slightly angled center bar
    const barLeft = new THREE.Vector3(stemPos.x - barWidth/2, stemPos.y + riseAmount, 0);
    const barRight = new THREE.Vector3(stemPos.x + barWidth/2, stemPos.y + riseAmount, 0);
    
    // Center section with slight rise - reduced density
    createTube(stemPos, new THREE.Vector3(stemPos.x, stemPos.y + riseAmount, 0), 30, barThickness, barColor);
    
    // Fill center rise section - reduced particle count
    addVolumeParticles(stemPos, new THREE.Vector3(stemPos.x, stemPos.y + riseAmount, 0), barThickness, 80, barColor);
    
    // Main horizontal bar - more reasonable density
    createTube(barLeft, barRight, 80, barThickness, barColor);
    
    // Fill main bar volume - reduced particle count
    addVolumeParticles(barLeft, barRight, barThickness * 0.8, 200, barColor);
    
    // Bar end grips (slightly curved outward at ends)
    const gripLength = radius * 0.15;
    const leftGripEnd = new THREE.Vector3(
      barLeft.x - gripLength,
      barLeft.y - gripLength * 0.2,
      0
    );
    
    const rightGripEnd = new THREE.Vector3(
      barRight.x + gripLength,
      barRight.y - gripLength * 0.2,
      0
    );
    
    // Left grip and end cap - reduced density
    createTube(barLeft, leftGripEnd, 30, barThickness * 1.2, hoodColor);
    createCircle(leftGripEnd, barThickness * 1.3, 20, barThickness * 0.5, hoodColor);
    
    // Fill left grip volume - reduced particle count
    addVolumeParticles(barLeft, leftGripEnd, barThickness, 80, hoodColor);
    
    // Right grip and end cap - reduced density
    createTube(barRight, rightGripEnd, 30, barThickness * 1.2, hoodColor);
    createCircle(rightGripEnd, barThickness * 1.3, 20, barThickness * 0.5, hoodColor);
    
    // Fill right grip volume - reduced particle count
    addVolumeParticles(barRight, rightGripEnd, barThickness, 80, hoodColor);
    
    // Skip internal volume particles in brake hoods to reduce black particles
    
    // Brake hoods - left
    const leftHoodBase = new THREE.Vector3(barLeft.x + barWidth * 0.15, barLeft.y, 0);
    const leftHoodForward = new THREE.Vector3(
      leftHoodBase.x - hoodLength * 0.7,
      leftHoodBase.y + hoodLength * 0.4,
      0
    );
    
    // Left brake hood - reduced density
    createTube(leftHoodBase, leftHoodForward, 25, barThickness * 1.3, hoodColor);
    createCircle(leftHoodForward, barThickness * 1.1, 16, barThickness * 0.4, hoodColor);
    
    // Brake hood securing band (minimal density)
    createTube(
      new THREE.Vector3(leftHoodBase.x, leftHoodBase.y - barThickness * 0.8, 0),
      new THREE.Vector3(leftHoodBase.x, leftHoodBase.y + barThickness * 0.8, 0),
      12, barThickness * 0.2, hoodColor
    );
    
    // Right brake hood
    const rightHoodBase = new THREE.Vector3(barRight.x - barWidth * 0.15, barRight.y, 0);
    const rightHoodForward = new THREE.Vector3(
      rightHoodBase.x + hoodLength * 0.7,
      rightHoodBase.y + hoodLength * 0.4,
      0
    );
    
    createTube(rightHoodBase, rightHoodForward, 25, barThickness * 1.3, hoodColor);
    createCircle(rightHoodForward, barThickness * 1.1, 16, barThickness * 0.4, hoodColor);
    
    // Brake hood securing band (minimal density)
    createTube(
      new THREE.Vector3(rightHoodBase.x, rightHoodBase.y - barThickness * 0.8, 0),
      new THREE.Vector3(rightHoodBase.x, rightHoodBase.y + barThickness * 0.8, 0),
      12, barThickness * 0.2, hoodColor
    );
  }
  
  // Helper: add particles inside a volume between two points
  function addVolumeParticles(
    a: THREE.Vector3,
    b: THREE.Vector3,
    maxRadius: number,
    count: number,
    color: THREE.Color
  ) {
    // Create a unique position hash to avoid duplicates
    const usedPositions = new Set<string>();
    
    // Limit the number of attempts to avoid infinite loops
    let attempts = 0;
    const maxAttempts = count * 3;
    let addedParticles = 0;
    
    while (addedParticles < count && attempts < maxAttempts) {
      attempts++;
      
      // Random position along the tube axis
      const t = Math.random();
      const center = a.clone().lerp(b, t);
      
      // Random position within the tube radius
      const radius = Math.random() * maxRadius;
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI * 2;
      
      // Use spherical coordinates for better volume filling
      const x = Math.sin(angle1) * Math.cos(angle2) * radius;
      const y = Math.sin(angle1) * Math.sin(angle2) * radius;
      const z = Math.cos(angle1) * radius;
      
      // Create a point slightly offset from the central axis
      const raw = new THREE.Vector3(
        center.x + x,
        center.y + y,
        center.z + z
      );
      const point = tiltHandlebarPoint(raw);
      
      // Check for duplicate points (with rounding to avoid floating point issues)
      const posKey = `${Math.round(point.x*100)},${Math.round(point.y*100)},${Math.round(point.z*100)}`;
      if (!usedPositions.has(posKey)) {
        points.push(point);
        colors.push(color);
        usedPositions.add(posKey);
        addedParticles++;
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