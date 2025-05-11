import React from "react";
import { useParticleMorph } from "../hooks/useParticleMorph";

const PARTICLE_COUNT = 900000;
const PARTICLE_SIZE = 0.02;

interface ParticlesProps {
  setError: (err: string | null) => void;
  duration?: number;
  onComplete?: () => void;
}

export function Particles({ setError, duration = 2, onComplete }: ParticlesProps) {
  const { positionsRef, colorsRef, pointsRef } = useParticleMorph(
    PARTICLE_COUNT, 
    duration, 
    setError,
    onComplete
  );

  return (
    <points ref={pointsRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positionsRef.current}
          itemSize={3}
          args={[positionsRef.current, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colorsRef.current}
          itemSize={3}
          args={[colorsRef.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        size={PARTICLE_SIZE}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
} 