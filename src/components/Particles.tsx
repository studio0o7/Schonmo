import React, { useState, useEffect } from "react";
import { useParticleMorph } from "../hooks/useParticleMorph";

const DESKTOP_PARTICLE_COUNT = 900000;
const MOBILE_PARTICLE_COUNT = 500000; // Reduced particles for mobile
const PARTICLE_SIZE = 0.02;

interface ParticlesProps {
  setError: (err: string | null) => void;
  duration?: number;
  onComplete?: () => void;
}

export function Particles({ setError, duration = 2, onComplete }: ParticlesProps) {
  const [particleCount, setParticleCount] = useState(DESKTOP_PARTICLE_COUNT);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setParticleCount(isMobileView ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT);
    };
    
    // Check on mount
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const { positionsRef, colorsRef, pointsRef } = useParticleMorph(
    particleCount, 
    duration, 
    setError,
    onComplete,
    isMobile
  );

  return (
    <points ref={pointsRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positionsRef.current}
          itemSize={3}
          args={[positionsRef.current, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
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