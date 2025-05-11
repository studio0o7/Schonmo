import * as THREE from "three";

/**
 * Add wheels to the bicycle model
 * 
 * @param points Array to add the wheel points to
 * @param colors Array to add the wheel colors to
 * @param rearWheelCenter Position of the rear wheel center
 * @param frontWheelCenter Position of the front wheel center
 * @param radius Wheel radius
 * @param color The main color for the wheels
 * @param pointBudget Optional maximum number of points to generate
 */
export function addWheels(
  points: THREE.Vector3[],
  colors: THREE.Color[],
  rearWheelCenter: THREE.Vector3,
  frontWheelCenter: THREE.Vector3,
  radius: number,
  color: THREE.Color,
  pointBudget?: number
) {
  // Count starting points to manage budget
  const startingPoints = points.length;
  
  // Default spoke count and detail levels
  const spokeCount = 32;
  const rimPointDensity = 200;
  const spokePointDensity = 20;
  const hubSize = radius * 0.15;
  
  // If budget specified, adjust detail levels
  let adjustedSpokeCount = spokeCount;
  let adjustedRimPointDensity = rimPointDensity;
  let adjustedSpokePointDensity = spokePointDensity;
  
  if (pointBudget) {
    // Calculate approximate points per wheel (half of budget for each wheel)
    const pointsPerWheel = pointBudget / 2;
    
    // Adjust detail based on available points
    if (pointsPerWheel < 5000) {
      adjustedSpokeCount = 24;
      adjustedRimPointDensity = 100;
      adjustedSpokePointDensity = 10;
    } else if (pointsPerWheel < 10000) {
      adjustedSpokeCount = 28;
      adjustedRimPointDensity = 150;
      adjustedSpokePointDensity = 15;
    }
  }
  
  // Rims
  addRim(points, colors, rearWheelCenter, radius, color, adjustedRimPointDensity);
  addRim(points, colors, frontWheelCenter, radius, color, adjustedRimPointDensity);
  
  // Hubs
  addHub(points, colors, rearWheelCenter, hubSize, color);
  addHub(points, colors, frontWheelCenter, hubSize, color);
  
  // Spokes
  addSpokes(points, colors, rearWheelCenter, radius, hubSize, color, adjustedSpokeCount, adjustedSpokePointDensity);
  addSpokes(points, colors, frontWheelCenter, radius, hubSize, color, adjustedSpokeCount, adjustedSpokePointDensity);
  
  // If we're over budget, truncate
  if (pointBudget && points.length - startingPoints > pointBudget) {
    const toRemove = (points.length - startingPoints) - pointBudget;
    points.splice(points.length - toRemove, toRemove);
    colors.splice(colors.length - toRemove, toRemove);
  }
}

/**
 * Add rim to the points and colors arrays.
 * @param points Array of Vector3 to push new rim points into.
 * @param colors Array of Color to push new rim colors into.
 * @param center Center position of the rim.
 * @param radius Radius of the rim.
 * @param color Color for the rim.
 * @param pointDensity Number of points to generate per unit length.
 */
function addRim(
  points: THREE.Vector3[],
  colors: THREE.Color[],
  center: THREE.Vector3,
  radius: number,
  color: THREE.Color,
  pointDensity: number
) {
  const rimRadius = radius * 0.95;
  const rimThickness = radius * 0.025;
  
  // Adjust number of segments based on point density
  const segments = Math.max(100, Math.min(600, Math.floor(rimRadius * pointDensity)));
  
  createCircle(points, colors, center, rimRadius, segments, rimThickness, color);
  createCircle(points, colors, center, rimRadius * 0.92, Math.floor(segments * 0.9), rimThickness, color);
}

/**
 * Add hub to the points and colors arrays.
 * @param points Array of Vector3 to push new hub points into.
 * @param colors Array of Color to push new hub colors into.
 * @param center Center position of the hub.
 * @param size Size of the hub.
 * @param color Color for the hub.
 */
function addHub(
  points: THREE.Vector3[],
  colors: THREE.Color[],
  center: THREE.Vector3,
  size: number,
  color: THREE.Color
) {
  const hubRadius = size;
  
  createCircle(points, colors, center, hubRadius, 180, 0, color);
  
  createTube(
    points,
    colors,
    new THREE.Vector3(center.x, center.y, -size * 0.05),
    new THREE.Vector3(center.x, center.y, size * 0.05),
    24, size * 0.08, color
  );
}

/**
 * Add spokes to the points and colors arrays.
 * @param points Array of Vector3 to push new spoke points into.
 * @param colors Array of Color to push new spoke colors into.
 * @param center Center position of the spoke.
 * @param radius Radius of the spoke.
 * @param hubRadius Radius of the hub.
 * @param color Color for the spoke.
 * @param spokeCount Number of spokes to generate.
 * @param spokePointDensity Number of points to generate per unit length.
 */
function addSpokes(
  points: THREE.Vector3[],
  colors: THREE.Color[],
  center: THREE.Vector3,
  radius: number,
  hubRadius: number,
  color: THREE.Color,
  spokeCount: number,
  spokePointDensity: number
) {
  const rimRadius = radius * 0.92;
  
  for (let i = 0; i < spokeCount; i++) {
    const rimAngle1 = (i / spokeCount) * Math.PI * 2;
    const hubAngle1 = ((i + spokeCount / 3) % spokeCount / spokeCount) * Math.PI * 2; // 3-cross pattern
    
    const rimPoint = new THREE.Vector3(
      center.x + Math.cos(rimAngle1) * rimRadius,
      center.y + Math.sin(rimAngle1) * rimRadius,
      0
    );
    
    const hubPoint = new THREE.Vector3(
      center.x + Math.cos(hubAngle1) * hubRadius,
      center.y + Math.sin(hubAngle1) * hubRadius,
      0
    );
    
    // Create thin tubes for spokes with segment density based on length
    const dist = rimPoint.distanceTo(hubPoint);
    const segments = Math.max(5, Math.floor(dist * spokePointDensity));
    createTube(points, colors, hubPoint, rimPoint, segments, radius * 0.005, color);
  }
  
  // Add valve stem
  addValveStem(points, colors, center, radius, color);
}

/**
 * Add valve stem to the points and colors arrays.
 * @param points Array of Vector3 to push new valve stem points into.
 * @param colors Array of Color to push new valve stem colors into.
 * @param center Center position of the valve stem.
 * @param radius Radius of the valve stem.
 * @param color Color for the valve stem.
 */
function addValveStem(
  points: THREE.Vector3[],
  colors: THREE.Color[],
  center: THREE.Vector3,
  radius: number,
  color: THREE.Color
) {
  const valveAngle = -Math.PI / 2; // Bottom of wheel
  const valveBase = new THREE.Vector3(
    center.x + Math.cos(valveAngle) * radius * 0.95,
    center.y + Math.sin(valveAngle) * radius * 0.95,
    0
  );
  
  const valveTop = new THREE.Vector3(
    center.x + Math.cos(valveAngle) * (radius * 1.05),
    center.y + Math.sin(valveAngle) * (radius * 1.05),
    0
  );
  
  createTube(points, colors, valveBase, valveTop, 10, radius * 0.02, color);
  
  // Valve cap
  createCircle(points, colors, valveTop, radius * 0.025, 24, radius * 0.01, color);
}

/**
 * Helper: tube (cylinder) between two points
 * @param points Array of Vector3 to push new tube points into.
 * @param colors Array of Color to push new tube colors into.
 * @param a First point
 * @param b Second point
 * @param segments Number of segments to generate
 * @param radius Radius of the tube
 * @param color Color for the tube
 */
function createTube(
  points: THREE.Vector3[],
  colors: THREE.Color[],
  a: THREE.Vector3,
  b: THREE.Vector3,
  segments: number,
  radius: number,
  color: THREE.Color
) {
  for (let i = 0; i < segments; i++) {
    const t = i / (segments - 1);
    const center = a.clone().lerp(b, t);
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

/**
 * Helper for circle
 * @param points Array of Vector3 to push new circle points into.
 * @param colors Array of Color to push new circle colors into.
 * @param center Center position of the circle
 * @param radius Radius of the circle
 * @param segments Number of segments to generate
 * @param thickness Thickness of the circle
 * @param color Color for the circle
 */
function createCircle(
  points: THREE.Vector3[],
  colors: THREE.Color[],
  center: THREE.Vector3,
  radius: number,
  segments: number,
  thickness: number,
  color: THREE.Color
) {
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;
    if (thickness > 0) {
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
    } else {
      points.push(new THREE.Vector3(center.x + x, center.y + y, center.z));
      colors.push(color);
    }
  }
} 