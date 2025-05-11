import * as THREE from "three";

/**
 * Add wheels (rims, spokes, hubs) to the points and colors arrays.
 * @param points Array of Vector3 to push new wheel points into.
 * @param colors Array of Color to push new wheel colors into.
 * @param rearWheelCenter Center position of the rear wheel.
 * @param frontWheelCenter Center position of the front wheel.
 * @param wheelRadius Radius of the wheels.
 * @param WHITE_COLOR Color for wheel rims and spokes.
 */
export function addWheels(
  points: THREE.Vector3[],
  colors: THREE.Color[],
  rearWheelCenter: THREE.Vector3,
  frontWheelCenter: THREE.Vector3,
  wheelRadius: number,
  WHITE_COLOR: THREE.Color
) {
  const SILVER_COLOR = new THREE.Color("#C0C0C0");
  const BLACK_COLOR = new THREE.Color("#202020");
  
  // Tires
  createCircle(rearWheelCenter, wheelRadius, 600, wheelRadius * 0.05, BLACK_COLOR);
  createCircle(frontWheelCenter, wheelRadius, 600, wheelRadius * 0.05, BLACK_COLOR);
  
  // Outer and inner rims
  createCircle(rearWheelCenter, wheelRadius * 0.95, 600, wheelRadius * 0.025, SILVER_COLOR);
  createCircle(frontWheelCenter, wheelRadius * 0.95, 600, wheelRadius * 0.025, SILVER_COLOR);
  createCircle(rearWheelCenter, wheelRadius * 0.92, 550, wheelRadius * 0.02, SILVER_COLOR);
  createCircle(frontWheelCenter, wheelRadius * 0.92, 550, wheelRadius * 0.02, SILVER_COLOR);

  // Hub flanges
  createCircle(rearWheelCenter, wheelRadius * 0.15, 180, wheelRadius * 0.035, WHITE_COLOR);
  createCircle(frontWheelCenter, wheelRadius * 0.15, 180, wheelRadius * 0.035, WHITE_COLOR);
  
  // Hub body - central cylinder
  createTube(
    new THREE.Vector3(rearWheelCenter.x, rearWheelCenter.y, -wheelRadius * 0.05),
    new THREE.Vector3(rearWheelCenter.x, rearWheelCenter.y, wheelRadius * 0.05),
    24, wheelRadius * 0.08, SILVER_COLOR
  );
  
  createTube(
    new THREE.Vector3(frontWheelCenter.x, frontWheelCenter.y, -wheelRadius * 0.05),
    new THREE.Vector3(frontWheelCenter.x, frontWheelCenter.y, wheelRadius * 0.05),
    24, wheelRadius * 0.08, SILVER_COLOR
  );

  // Crossed spokes pattern
  addCrossedSpokes(rearWheelCenter, wheelRadius, SILVER_COLOR);
  addCrossedSpokes(frontWheelCenter, wheelRadius, SILVER_COLOR);
  
  // Valve stems
  addValveStem(rearWheelCenter, wheelRadius, SILVER_COLOR);
  addValveStem(frontWheelCenter, wheelRadius, SILVER_COLOR);
  
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

  // Helper for circle
  function createCircle(
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
  
  // Helper for crossed spoke pattern
  function addCrossedSpokes(center: THREE.Vector3, radius: number, color: THREE.Color) {
    const spokeCount = 36; // Must be divisible by 4 for proper crossing
    const rimRadius = radius * 0.92;
    const hubRadius = radius * 0.15;
    const spokeThickness = wheelRadius * 0.005;
    
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
      const segments = Math.max(5, Math.floor(dist * 15));
      createTube(hubPoint, rimPoint, segments, spokeThickness, color);
    }
  }
  
  // Helper for valve stem
  function addValveStem(center: THREE.Vector3, radius: number, color: THREE.Color) {
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
    
    createTube(valveBase, valveTop, 10, wheelRadius * 0.02, color);
    
    // Valve cap
    createCircle(valveTop, wheelRadius * 0.025, 24, wheelRadius * 0.01, color);
  }
} 