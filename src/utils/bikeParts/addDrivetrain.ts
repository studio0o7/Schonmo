import * as THREE from "three";

/**
 * Add drivetrain components (chainring, cranks, chain) to the points and colors arrays.
 * @param points Array of THREE.Vector3 to push new points into.
 * @param colors Array of THREE.Color to push new colors into.
 * @param bottomBracket Position of the bottom bracket.
 * @param rearWheelCenter Center position of rear wheel.
 * @param wheelRadius Radius of the wheels.
 * @param frameWidth Thickness of the frame tubes.
 * @param ORANGE_COLOR Color of the frame.
 * @param WHITE_COLOR Color for drivetrain elements.
 * @param pointBudget Optional maximum number of points to generate.
 */
export function addDrivetrain(
  points: THREE.Vector3[],
  colors: THREE.Color[],
  bottomBracket: THREE.Vector3,
  rearWheelCenter: THREE.Vector3,
  wheelRadius: number,
  frameWidth: number,
  ORANGE_COLOR: THREE.Color,
  WHITE_COLOR: THREE.Color,
  pointBudget?: number
) {
  // Track starting points to enforce budget
  const startingPoints = points.length;
  const SILVER_COLOR = new THREE.Color("#C0C0C0");
  const BLACK_COLOR = new THREE.Color("#202020");
  
  const chainZ = frameWidth * 2;
  
  // Front chainrings (double crankset)
  const largeChainringRadius = wheelRadius * 0.3;
  const smallChainringRadius = wheelRadius * 0.25;
  const chainringThickness = wheelRadius * 0.02;
  
  // Larger chainring with teeth
  addChainring(
    bottomBracket,
    largeChainringRadius,
    chainringThickness,
    42,
    SILVER_COLOR,
    chainZ
  );
  
  // Smaller chainring
  addChainring(
    new THREE.Vector3(bottomBracket.x, bottomBracket.y, chainZ + chainringThickness * 2),
    smallChainringRadius,
    chainringThickness,
    32,
    SILVER_COLOR,
    chainZ + chainringThickness * 2
  );

  // Cranks
  const crankLen = wheelRadius * 0.45;
  const crankAngle = Math.PI / 4;
  const crankEnd1 = new THREE.Vector3(
    bottomBracket.x + Math.cos(crankAngle) * crankLen,
    bottomBracket.y + Math.sin(crankAngle) * crankLen,
    chainZ
  );
  const crankEnd2 = new THREE.Vector3(
    bottomBracket.x + Math.cos(crankAngle + Math.PI) * crankLen,
    bottomBracket.y + Math.sin(crankAngle + Math.PI) * crankLen,
    chainZ
  );
  
  // Thicker cranks with tapering
  createTaperedTube(
    new THREE.Vector3(bottomBracket.x, bottomBracket.y, chainZ),
    crankEnd1, 
    40, 
    frameWidth * 0.7, 
    frameWidth * 0.5, 
    SILVER_COLOR
  );
  
  createTaperedTube(
    new THREE.Vector3(bottomBracket.x, bottomBracket.y, chainZ),
    crankEnd2, 
    40, 
    frameWidth * 0.7, 
    frameWidth * 0.5, 
    SILVER_COLOR
  );
  
  // Pedals
  const pedalWidth = frameWidth * 2;
  const pedalHeight = frameWidth * 0.5;
  const pedalDepth = frameWidth * 3;
  
  addPedal(crankEnd1, pedalWidth, pedalHeight, pedalDepth, BLACK_COLOR);
  addPedal(crankEnd2, pedalWidth, pedalHeight, pedalDepth, BLACK_COLOR);
  
  // Rear cassette (multiple cogs)
  const cassetteCogs = 8;
  const maxCogSize = wheelRadius * 0.22;
  const minCogSize = wheelRadius * 0.11;
  const cogSpacing = chainringThickness * 1.2;
  
  for (let i = 0; i < cassetteCogs; i++) {
    // Size varies from large to small
    const t = i / (cassetteCogs - 1);
    const cogRadius = minCogSize + (maxCogSize - minCogSize) * (1 - t);
    const teethCount = Math.max(16, Math.floor(26 * (1 - t * 0.6)));
    const cogZ = chainZ + i * cogSpacing;
    
    addChainring(
      new THREE.Vector3(rearWheelCenter.x, rearWheelCenter.y, cogZ),
      cogRadius,
      chainringThickness * 0.8,
      teethCount,
      SILVER_COLOR,
      cogZ
    );
  }

  // Chain routing with proper tension
  addChain();
  
  // Rear derailleur
  addRearDerailleur();

  // Helper function to create a chain path with proper tension 
  function addChain() {
    const chainThickness = wheelRadius * 0.015;
    
    // Key points for chain path
    const frontChainringPoint = new THREE.Vector3(
      bottomBracket.x + largeChainringRadius * Math.cos(-Math.PI/3),
      bottomBracket.y + largeChainringRadius * Math.sin(-Math.PI/3),
      chainZ
    );
    
    // Calculate point on smallest cog
    const cogZ = chainZ + (cassetteCogs - 1) * cogSpacing;
    const cogAngle = Math.PI * 0.6;
    const rearCogPoint = new THREE.Vector3(
      rearWheelCenter.x + minCogSize * Math.cos(cogAngle),
      rearWheelCenter.y + minCogSize * Math.sin(cogAngle),
      cogZ
    );
    
    // Calculate lower chain path with tension
    const derailleurPos = new THREE.Vector3(
      rearWheelCenter.x - wheelRadius * 0.3,
      rearWheelCenter.y - wheelRadius * 0.3,
      cogZ
    );
    
    // Create chain segments array
    const chainPoints: THREE.Vector3[] = [];
    
    // Top segment (straight from front chainring to rear cog)
    for (let i = 0; i <= 70; i++) {
      const t = i / 70;
      const x = frontChainringPoint.x + (rearCogPoint.x - frontChainringPoint.x) * t;
      const y = frontChainringPoint.y + (rearCogPoint.y - frontChainringPoint.y) * t;
      const z = frontChainringPoint.z + (rearCogPoint.z - frontChainringPoint.z) * t;
      chainPoints.push(new THREE.Vector3(x, y, z));
    }
    
    // Bottom segment (with curve through derailleur)
    const ctrlPoint1 = new THREE.Vector3(
      bottomBracket.x - wheelRadius * 0.2,
      bottomBracket.y - wheelRadius * 0.15,
      chainZ
    );
    
    for (let i = 0; i <= 130; i++) {
      const t = i / 130;
      
      // Quadratic bezier curve
      if (t < 0.5) {
        const t2 = t * 2; // Remap to [0,1]
        const pt = quadraticBezier(
          new THREE.Vector3(
            bottomBracket.x - largeChainringRadius * 0.8,
            bottomBracket.y,
            chainZ
          ),
          ctrlPoint1,
          derailleurPos,
          t2
        );
        chainPoints.push(pt);
      } else {
        const t2 = (t - 0.5) * 2; // Remap to [0,1]
        const pt = quadraticBezier(
          derailleurPos,
          new THREE.Vector3(
            rearWheelCenter.x,
            rearWheelCenter.y - minCogSize,
            cogZ
          ),
          rearCogPoint,
          t2
        );
        chainPoints.push(pt);
      }
    }
    
    // Create tubes between chain points
    for (let i = 0; i < chainPoints.length - 1; i++) {
      createTube(chainPoints[i], chainPoints[i + 1], 2, chainThickness, WHITE_COLOR);
    }
  }
  
  // Helper: calculate point on quadratic bezier curve
  function quadraticBezier(p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, t: number): THREE.Vector3 {
    const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
    const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
    const z = (1 - t) * (1 - t) * p0.z + 2 * (1 - t) * t * p1.z + t * t * p2.z;
    return new THREE.Vector3(x, y, z);
  }
  
  // Helper: create a pedal at the end of a crank
  function addPedal(crankEnd: THREE.Vector3, width: number, height: number, depth: number, color: THREE.Color) {
    // Pedal body
    for (let i = 0; i < 200; i++) {
      const x = crankEnd.x - width/2 + Math.random() * width;
      const y = crankEnd.y - height/2 + Math.random() * height;
      const z = crankEnd.z - depth/2 + Math.random() * depth;
      
      points.push(new THREE.Vector3(x, y, z));
      colors.push(color);
    }
    
    // Pedal axle
    createTube(
      new THREE.Vector3(crankEnd.x, crankEnd.y, crankEnd.z - depth/2),
      new THREE.Vector3(crankEnd.x, crankEnd.y, crankEnd.z + depth/2),
      10,
      frameWidth * 0.3,
      SILVER_COLOR
    );
  }
  
  // Helper: add chainring with teeth
  function addChainring(
    center: THREE.Vector3, 
    radius: number, 
    thickness: number, 
    teethCount: number,
    color: THREE.Color,
    zPos: number
  ) {
    // Main ring
    createCircle(center, radius * 0.85, 180, thickness, color);
    
    // Spider arms
    const spiderArms = 5;
    for (let i = 0; i < spiderArms; i++) {
      const angle = (i / spiderArms) * Math.PI * 2;
      const innerRadius = radius * 0.25;
      const outerRadius = radius * 0.8;
      
      const inner = new THREE.Vector3(
        center.x + Math.cos(angle) * innerRadius,
        center.y + Math.sin(angle) * innerRadius,
        zPos
      );
      
      const outer = new THREE.Vector3(
        center.x + Math.cos(angle) * outerRadius,
        center.y + Math.sin(angle) * outerRadius,
        zPos
      );
      
      createTube(inner, outer, 10, thickness, color);
    }
    
    // Teeth
    for (let i = 0; i < teethCount; i++) {
      const angle = (i / teethCount) * Math.PI * 2;
      const toothHeight = thickness * 2;
      
      const basePoint = new THREE.Vector3(
        center.x + Math.cos(angle) * radius,
        center.y + Math.sin(angle) * radius,
        zPos
      );
      
      const tipPoint = new THREE.Vector3(
        center.x + Math.cos(angle) * (radius + toothHeight),
        center.y + Math.sin(angle) * (radius + toothHeight),
        zPos
      );
      
      createTube(basePoint, tipPoint, 4, thickness * 0.8, color);
    }
    
    // Center hole
    createCircle(center, thickness * 1.5, 24, thickness * 0.5, color);
  }
  
  // Helper: add rear derailleur
  function addRearDerailleur() {
    const cogZ = chainZ + (cassetteCogs - 1) * cogSpacing;
    const derailleurPos = new THREE.Vector3(
      rearWheelCenter.x - wheelRadius * 0.3,
      rearWheelCenter.y - wheelRadius * 0.3,
      cogZ
    );
    
    // Derailleur cage
    const cageLength = wheelRadius * 0.25;
    const cageHeight = wheelRadius * 0.15;
    
    // Upper pulley
    createCircle(
      derailleurPos,
      frameWidth * 1.2,
      30,
      frameWidth * 0.3,
      BLACK_COLOR
    );
    
    // Lower pulley
    const lowerPulleyPos = new THREE.Vector3(
      derailleurPos.x + cageLength * 0.5,
      derailleurPos.y - cageHeight,
      derailleurPos.z
    );
    
    createCircle(
      lowerPulleyPos,
      frameWidth * 1.2,
      30,
      frameWidth * 0.3,
      BLACK_COLOR
    );
    
    // Cage sides
    createTube(
      derailleurPos,
      new THREE.Vector3(lowerPulleyPos.x - frameWidth, lowerPulleyPos.y, lowerPulleyPos.z),
      15,
      frameWidth * 0.25,
      SILVER_COLOR
    );
    
    createTube(
      derailleurPos,
      new THREE.Vector3(lowerPulleyPos.x + frameWidth, lowerPulleyPos.y, lowerPulleyPos.z),
      15,
      frameWidth * 0.25,
      SILVER_COLOR
    );
    
    // Mounting arm
    const mountPoint = new THREE.Vector3(
      rearWheelCenter.x,
      rearWheelCenter.y - wheelRadius * 0.1,
      cogZ
    );
    
    createTube(
      mountPoint,
      derailleurPos,
      15,
      frameWidth * 0.3,
      SILVER_COLOR
    );
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
      const tt = i / (segments - 1);
      const center = a.clone().lerp(b, tt);
      for (let j = 0; j < 24; j++) {
        const angle = (j / 24) * Math.PI * 2;
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
  
  // Helper: tapered tube with different radii
  function createTaperedTube(
    a: THREE.Vector3,
    b: THREE.Vector3,
    segments: number,
    radiusStart: number,
    radiusEnd: number,
    color: THREE.Color
  ) {
    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1);
      const center = a.clone().lerp(b, t);
      const radius = radiusStart * (1-t) + radiusEnd * t;
      
      for (let j = 0; j < 24; j++) {
        const angle = (j / 24) * Math.PI * 2;
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
      for (let j = 0; j < 12; j++) {
        const ta = (j / 12) * Math.PI * 2;
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

  // Enforce point budget by truncating excess points
  if (pointBudget && points.length - startingPoints > pointBudget) {
    const toRemove = (points.length - startingPoints) - pointBudget;
    points.splice(points.length - toRemove, toRemove);
    colors.splice(colors.length - toRemove, toRemove);
  }
} 