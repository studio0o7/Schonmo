import * as THREE from "three";

/**
 * Add "SCHONMO" text underneath the bicycle
 * @param points Array of THREE.Vector3 to push new points into.
 * @param colors Array of THREE.Color to push new colors into.
 * @param wheelBase Distance between wheel centers.
 * @param scale Overall scaling factor.
 * @param roadY Y position of the text.
 * @param WHITE_COLOR Color for the text.
 * @param GRAY_COLOR Not used, kept for backward compatibility.
 * @param ORANGE_COLOR Color for highlighted letters.
 */
export function addRoadSurface(
  points: THREE.Vector3[],
  colors: THREE.Color[],
  wheelBase: number,
  scale: number,
  roadY: number,
  WHITE_COLOR: THREE.Color,
  GRAY_COLOR: THREE.Color,
  ORANGE_COLOR: THREE.Color,
  pointBudget?: number
) {
  // Track starting points to manage budget
  const startingPoints = points.length;

  // Text positioning
  const textY = roadY - wheelBase * 0.05;
  const textBaseWidth = wheelBase * 1.8;
  const textHeight = wheelBase * 0.4;
  
  // Adjust particle density based on budget
  let particleDensity = 12000; // Default high density
  if (pointBudget) {
    particleDensity = pointBudget < 5000 ? 4000 : 
                      pointBudget < 10000 ? 8000 : 12000;
  }

  // Draw the "SCHONMO" text laid flat on the road (horizontal XZ plane)
  drawText("SCHONMO", textBaseWidth, textHeight, 0, textY, 0, WHITE_COLOR, ORANGE_COLOR, particleDensity);
  
  // Add a few subtle background particles with GRAY_COLOR
  addBackgroundParticles(textBaseWidth, textHeight, textY, GRAY_COLOR, 500);

  /**
   * Draws text as particle points
   * @param text Text to draw
   * @param totalWidth Width to fit the entire text
   * @param height Height of the text
   * @param x X position (center)
   * @param y Y position (base)
   * @param z Z position
   * @param defaultColor Color for the text points
   * @param highlightColor Color for highlighted letters
   * @param totalParticles Total particles to distribute
   */
  function drawText(
    text: string, 
    totalWidth: number, 
    height: number,
    x: number,
    y: number,
    z: number,
    defaultColor: THREE.Color,
    highlightColor: THREE.Color,
    totalParticles: number
  ) {
    // Character data - defines each letter as a set of line segments
    const characters: { [key: string]: [number, number, number, number][] } = {
      'S': [
        [0.1, 0.0, 0.9, 0.0],
        [0.1, 0.0, 0.1, 0.5],
        [0.1, 0.5, 0.9, 0.5],
        [0.9, 0.5, 0.9, 1.0],
        [0.9, 1.0, 0.1, 1.0]
      ],
      'C': [
        [0.9, 0.0, 0.1, 0.0],
        [0.1, 0.0, 0.1, 1.0],
        [0.1, 1.0, 0.9, 1.0]
      ],
      'H': [
        [0.1, 0.0, 0.1, 1.0],
        [0.1, 0.5, 0.9, 0.5],
        [0.9, 0.0, 0.9, 1.0]
      ],
      'O': [
        [0.1, 0.0, 0.9, 0.0],
        [0.9, 0.0, 0.9, 1.0],
        [0.9, 1.0, 0.1, 1.0],
        [0.1, 1.0, 0.1, 0.0]
      ],
      'N': [
        [0.1, 0.0, 0.1, 1.0],
        [0.1, 0.0, 0.9, 1.0],
        [0.9, 1.0, 0.9, 0.0]
      ],
      'M': [
        [0.1, 0.0, 0.1, 1.0],
        [0.1, 0.0, 0.5, 0.6],
        [0.5, 0.6, 0.9, 0.0],
        [0.9, 0.0, 0.9, 1.0]
      ]
    };
    
    // Total width of all characters with spacing
    const charCount = text.length;
    const charWidth = totalWidth / (charCount * 1.5);
    const spacing = charWidth * 0.5;
    
    // Distribute particles per character based on complexity
    const characterComplexity: { [key: string]: number } = {
      'S': 1.2, 'C': 0.8, 'H': 0.9, 'O': 1.0, 'N': 0.8, 'M': 1.3
    };
    
    // Calculate total complexity to distribute particles
    let totalComplexity = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);
      totalComplexity += characterComplexity[char] || 1.0;
    }
    
    // Place the text centered
    const totalTextWidth = (charWidth + spacing) * charCount - spacing;
    const startX = x - totalTextWidth / 2;
    
    // Draw each character
    let curX = startX;
    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);
      const charLines = characters[char];
      if (!charLines) continue;
      
      // Calculate particles for this character
      const charParticles = Math.round(
        (characterComplexity[char] || 1.0) / totalComplexity * totalParticles
      );
      
      // Highlight only the last two letters 'M' and 'O'
      const charColor = (i >= text.length - 2) ? highlightColor : defaultColor;
      drawCharacter(charLines, curX, y, z, charWidth, height, charColor, charParticles);
      curX += charWidth + spacing;
    }
  }

  /**
   * Draws a single character using points along its line segments
   */
  function drawCharacter(
    lines: [number, number, number, number][],
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    color: THREE.Color,
    particleCount: number
  ) {
    // Distribute particles across lines based on line length
    const totalLineLength = lines.reduce((total, line) => {
      const [x1, y1, x2, y2] = line;
      return total + Math.sqrt(Math.pow((x2 - x1) * width, 2) + Math.pow((y2 - y1) * height, 2));
    }, 0);
    
    for (const line of lines) {
      const [x1, y1, x2, y2] = line;
      
      // Calculate start and end points in world coordinates
      const startX = x + x1 * width;
      const startY = y + (1 - y1) * height; // Flip Y to match Three.js coordinates
      const endX = x + x2 * width;
      const endY = y + (1 - y2) * height;
      
      // Calculate line length for proportional particle distribution
      const lineLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      const lineParticles = Math.round((lineLength / totalLineLength) * particleCount);
      
      // Add particles along the line
      for (let i = 0; i < lineParticles; i++) {
        const t = i / (lineParticles - 1);
        
        // Increase thickness: widen randomness for bolder strokes
        const offsetX = (Math.random() - 0.5) * width * 0.15;
        const offsetY = (Math.random() - 0.5) * height * 0.15;
        
        const px = startX + (endX - startX) * t + offsetX;
        const py = startY + (endY - startY) * t + offsetY;
        
        // Lay on XZ plane: Y coordinate = yParam, Z = -py to correct mirror
        points.push(new THREE.Vector3(px, y, -py));
        colors.push(color);
      }
    }
  }

  /**
   * Adds some subtle background particles
   */
  function addBackgroundParticles(width: number, height: number, y: number, color: THREE.Color, count: number) {
    for (let i = 0; i < count; i++) {
      // random on horizontal plane around text
      const x = (Math.random() - 0.5) * width * 1.5;
      const zOffset = (Math.random() - 0.5) * height * 0.5;
      // points laid flat: Y constant (y), Z variation
      points.push(new THREE.Vector3(x, y, zOffset));
      colors.push(color);
    }
  }
  
  // If we're over budget, truncate
  if (pointBudget && points.length - startingPoints > pointBudget) {
    const toRemove = (points.length - startingPoints) - pointBudget;
    points.splice(points.length - toRemove, toRemove);
    colors.splice(colors.length - toRemove, toRemove);
  }
} 