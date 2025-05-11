import * as THREE from "three";

/**
 * Add frame tubes (down tube, top tube, seat tube, stays, fork) to the points and colors arrays.
 * @param points Array of Vector3 to push new frame points into.
 * @param colors Array of Color to push new frame colors into.
 * @param bottomBracket Position of the bottom bracket.
 * @param headTubeBottom Position at bottom of head tube.
 * @param headTubeTop Position at top of head tube.
 * @param seatTop Position at top of seat tube.
 * @param rearWheelCenter Center position of rear wheel.
 * @param frontWheelCenter Center position of front wheel.
 * @param frameWidth Thickness of the frame tubes.
 * @param ORANGE_COLOR Color of the frame.
 */
export function addFrame(
  points: THREE.Vector3[],
  colors: THREE.Color[],
  bottomBracket: THREE.Vector3,
  headTubeBottom: THREE.Vector3,
  headTubeTop: THREE.Vector3,
  seatTop: THREE.Vector3,
  rearWheelCenter: THREE.Vector3,
  frontWheelCenter: THREE.Vector3,
  frameWidth: number,
  ORANGE_COLOR: THREE.Color
) {
  const SILVER_COLOR = new THREE.Color("#C0C0C0");
  const DARK_ORANGE = new THREE.Color("#c85e01");
  
  // Frame tubes with significantly increased segment density
  const tubeSegments = 800;
  
  // Down tube - tapered wider at BB end
  createTaperedTube(
    bottomBracket,
    headTubeBottom,
    tubeSegments,
    frameWidth * 1.2,  // Bottom bracket end
    frameWidth,        // Head tube end
    ORANGE_COLOR
  );
  
  // Add some volume filling particles inside the down tube
  addVolumeParticles(
    bottomBracket,
    headTubeBottom,
    frameWidth * 1.0,
    200,
    ORANGE_COLOR
  );
  
  // Top tube - tapered wider at head tube
  createTaperedTube(
    seatTop, 
    headTubeTop, 
    tubeSegments, 
    frameWidth * 0.9,  // Seat tube end
    frameWidth * 1.1,  // Head tube end
    ORANGE_COLOR
  );
  
  // Add volume filling particles inside the top tube
  addVolumeParticles(
    seatTop,
    headTubeTop,
    frameWidth * 0.8,
    200,
    ORANGE_COLOR
  );
  
  // Seat tube
  createTube(bottomBracket, seatTop, 600, frameWidth, ORANGE_COLOR);
  // Fill seat tube volume
  addVolumeParticles(bottomBracket, seatTop, frameWidth * 1.0, 400, ORANGE_COLOR);
  
  // Seat stays - thinner
  const stayThickness = frameWidth * 0.75;
  const rearDropout = new THREE.Vector3(
    rearWheelCenter.x,
    rearWheelCenter.y + frameWidth * 0.5,
    0
  );
  createTaperedTube(
    seatTop,
    rearDropout,
    300,
    stayThickness * 0.8,
    stayThickness,
    ORANGE_COLOR
  );
  // Fill seat stays
  addVolumeParticles(seatTop, rearDropout, stayThickness, 200, ORANGE_COLOR);
  
  // Chain stays - flattened tubes
  createTube(
    bottomBracket,
    rearDropout,
    300,
    stayThickness,
    ORANGE_COLOR
  );
  // Fill chain stays
  addVolumeParticles(bottomBracket, rearDropout, stayThickness * 0.8, 200, ORANGE_COLOR);
  
  // Head tube 
  createTube(headTubeBottom, headTubeTop, 300, frameWidth * 1.1, ORANGE_COLOR);
  // Fill head tube
  addVolumeParticles(headTubeBottom, headTubeTop, frameWidth * 0.9, 250, ORANGE_COLOR);

  // Fork legs
  const forkWidth = frameWidth * 0.75;
  const forkOffset = frontWheelCenter.x - headTubeBottom.x;
  
  // Extend fork crown forward for longer reach to wheel
  const forkCrownX = headTubeBottom.x + forkOffset * 1.1;
  const forkCrownY = headTubeBottom.y - frameWidth * 1.5;
  const forkCrown = new THREE.Vector3(forkCrownX, forkCrownY, 0);
  
  // Front dropouts - positioned to fit front wheel
  const leftDropout = new THREE.Vector3(
    frontWheelCenter.x - frameWidth * 2,
    frontWheelCenter.y,
    0
  );
  const rightDropout = new THREE.Vector3(
    frontWheelCenter.x + frameWidth * 2,
    frontWheelCenter.y,
    0
  );
  
  // Steerer tube
  createTube(
    headTubeBottom,
    forkCrown,
    160,
    frameWidth * 0.85,
    ORANGE_COLOR
  );
  // Fill steerer tube
  addVolumeParticles(headTubeBottom, forkCrown, frameWidth * 0.8, 150, ORANGE_COLOR);
  
  // Fork legs - straight design
  const forkSegments = 300;
  
  // Direct straight connection from crown to dropouts
  createTaperedTube(
    forkCrown,
    leftDropout,
    forkSegments,
    forkWidth,
    forkWidth * 0.7,
    ORANGE_COLOR
  );
  // Fill left fork leg
  addVolumeParticles(forkCrown, leftDropout, forkWidth, 200, ORANGE_COLOR);
  
  createTaperedTube(
    forkCrown,
    rightDropout,
    forkSegments,
    forkWidth,
    forkWidth * 0.7,
    ORANGE_COLOR
  );
  // Fill right fork leg
  addVolumeParticles(forkCrown, rightDropout, forkWidth, 200, ORANGE_COLOR);
  
  // Add lugs at tube junctions
  addLug(bottomBracket, 3, frameWidth * 1.8, DARK_ORANGE);  // Bottom bracket
  addLug(headTubeBottom, 3, frameWidth * 1.6, DARK_ORANGE); // Lower head tube
  addLug(headTubeTop, 3, frameWidth * 1.6, DARK_ORANGE);    // Upper head tube
  addLug(seatTop, 3, frameWidth * 1.6, DARK_ORANGE);        // Seat cluster
  
  // Rear dropouts
  createCircle(rearDropout, frameWidth * 1.5, 32, frameWidth * 0.4, SILVER_COLOR);
  
  // Front dropouts
  createCircle(leftDropout, frameWidth * 1.2, 32, frameWidth * 0.4, SILVER_COLOR);
  createCircle(rightDropout, frameWidth * 1.2, 32, frameWidth * 0.4, SILVER_COLOR);
  
  // Helper: create a decorative lug at a tube junction
  function addLug(center: THREE.Vector3, sides: number, size: number, color: THREE.Color) {
    for (let i = 0; i < sides; i++) {
      const angle1 = (i / sides) * Math.PI * 2;
      const angle2 = ((i + 1) / sides) * Math.PI * 2;
      
      const point1 = new THREE.Vector3(
        center.x + Math.cos(angle1) * size,
        center.y + Math.sin(angle1) * size,
        0
      );
      
      const point2 = new THREE.Vector3(
        center.x + Math.cos(angle2) * size,
        center.y + Math.sin(angle2) * size,
        0
      );
      
      // Create triangle from center to points
      for (let j = 0; j < 80; j++) {
        const t1 = j / 80;
        const t2 = (j + 1) / 80;
        
        const pt1 = center.clone().lerp(point1, t1);
        const pt2 = center.clone().lerp(point1, t2);
        const pt3 = center.clone().lerp(point2, t1);
        
        points.push(pt1, pt2, pt3);
        colors.push(color, color, color);
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
  
  // Helper: tapered tube with different radii at each end
  function createTaperedTube(
    a: THREE.Vector3,
    b: THREE.Vector3,
    segments: number,
    radiusA: number,
    radiusB: number,
    color: THREE.Color
  ) {
    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1);
      const center = a.clone().lerp(b, t);
      const radius = radiusA * (1 - t) + radiusB * t; // Linear interpolation
      
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

  // Helper: add particles inside a volume between two points
  function addVolumeParticles(
    a: THREE.Vector3,
    b: THREE.Vector3,
    maxRadius: number,
    count: number,
    color: THREE.Color
  ) {
    const direction = b.clone().sub(a);
    direction.normalize();
    
    for (let i = 0; i < count; i++) {
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
      const point = new THREE.Vector3(
        center.x + x,
        center.y + y,
        center.z + z
      );
      
      points.push(point);
      colors.push(color);
    }
  }
} 