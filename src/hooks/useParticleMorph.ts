import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { generateBicyclePoints } from "../utils/generateBicyclePoints";

/**
 * Hook for managing particle positions and colors morphing into a target shape.
 * @param particleCount Number of particles.
 * @param totalDuration Time in seconds for full formation.
 * @param setError Callback to clear or set errors.
 * @param onComplete Optional callback for when animation completes.
 * @param isMobile Whether the device is a mobile device.
 */
export function useParticleMorph(
  particleCount: number,
  totalDuration: number,
  setError: (err: string | null) => void,
  onComplete?: () => void,
  isMobile?: boolean
) {
  // Track if animation is completed
  const isCompletedRef = useRef(false);

  // Generate target shape once
  const targetData = useMemo(() => generateBicyclePoints(particleCount, isMobile), [particleCount, isMobile]);

  // Initial positions: evenly distributed on a sphere around the scene
  const initialPositions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    // Reduced spawn radius to keep particles closer and more visible
    const spawnRadius = 20; 
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = spawnRadius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = spawnRadius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = spawnRadius * Math.cos(phi);
    }
    return arr;
  }, [particleCount]);

  // Initial colors: brighter orange gradient
  const initialColors = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    const color = new THREE.Color();
    for (let i = 0; i < particleCount; i++) {
      // Increased brightness of colors and saturation for better visibility
      color.set(`hsl(${30 + Math.random() * 10}, ${80 + Math.random() * 20}%, ${60 + Math.random() * 40}%)`);
      arr[i * 3] = color.r;
      arr[i * 3 + 1] = color.g;
      arr[i * 3 + 2] = color.b;
    }
    return arr;
  }, [particleCount]);

  // Refs for animated data
  const positionsRef = useRef(new Float32Array(initialPositions));
  const colorsRef = useRef(new Float32Array(initialColors));
  const pointsRef = useRef<THREE.Points>(null);

  // Initialize buffers and clear errors
  useEffect(() => {
    positionsRef.current.set(initialPositions);
    colorsRef.current.set(initialColors);
    setError(null);
  }, [initialPositions, initialColors, setError]);

  // Animate morph
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const progress = Math.min(t / totalDuration, 1);
    const offset = 0; // no delay: all particles start at once
    const segment = 1 - offset;

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const tx = targetData.positions[i].x;
      const ty = targetData.positions[i].y;
      const tz = targetData.positions[i].z;

      const ix = initialPositions[idx];
      const iy = initialPositions[idx + 1];
      const iz = initialPositions[idx + 2];

      const rawP = (progress) / segment;
      const p = Math.max(0, Math.min(rawP, 1));
      // apply ease-out cubic: faster start, slower finish
      const ep = 1 - Math.pow(1 - p, 3);

      // Position interpolation with eased progress
      positionsRef.current[idx]     = ix + (tx - ix) * ep;
      positionsRef.current[idx + 1] = iy + (ty - iy) * ep;
      positionsRef.current[idx + 2] = iz + (tz - iz) * ep;

      // Color interpolation
      const icr = initialColors[idx];
      const icg = initialColors[idx + 1];
      const icb = initialColors[idx + 2];
      const tcol = targetData.colors[i];
      colorsRef.current[idx]     = icr + (tcol.r - icr) * ep;
      colorsRef.current[idx + 1] = icg + (tcol.g - icg) * ep;
      colorsRef.current[idx + 2] = icb + (tcol.b - icb) * ep;
    }

    if (pointsRef.current) {
      const geom = pointsRef.current.geometry as THREE.BufferGeometry;
      geom.attributes.position.needsUpdate = true;
      geom.attributes.color.needsUpdate = true;
    }

    // Check if animation just completed and call onComplete
    if (progress === 1 && !isCompletedRef.current && onComplete) {
      isCompletedRef.current = true;
      onComplete();
    }
  });

  return { positionsRef, colorsRef, pointsRef };
} 