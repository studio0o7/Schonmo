"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { Particles } from "./Particles";
import { CameraRig } from "./CameraRig";
import { LoadingScreen } from "./LoadingScreen";

interface ParticleMorphSceneProps {
  onAnimationComplete?: () => void;
}

export default function ParticleMorphScene({ onAnimationComplete }: ParticleMorphSceneProps) {
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const rotation: [number, number, number] = [0, 0, 0];
  const animationDuration = 2; // seconds

  // Detect mobile devices
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on mount
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Mobile-specific positioning to better center and scale the animation
  const mobilePosition: [number, number, number] = [-6, 1.5, 7]; // Closer and more centered
  const desktopPosition: [number, number, number] = [-8, 3, 10]; // Original position

  return (
    <div className="w-full h-full relative">
      <AnimatePresence>
        {error && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50 bg-black/80 text-white text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      <Canvas
        gl={{ antialias: !isMobile, alpha: true }}
        camera={{ 
          position: isMobile ? mobilePosition : desktopPosition, 
          fov: isMobile ? 65 : 60 
        }}
        dpr={isMobile ? [0.5, 1] : [1, 2]}
        className="w-full h-full"
        style={{ background: 'transparent' }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={<LoadingScreen />}>
          <ambientLight intensity={0.8} />
          
          <CameraRig basePosition={isMobile ? mobilePosition : desktopPosition}>
            <group rotation={rotation} position={isMobile ? [1, -1, 0] : [0, -1, 0]} scale={isMobile ? 0.85 : 1}>
              <Particles 
                setError={setError} 
                duration={animationDuration} 
                onComplete={onAnimationComplete} 
              />
            </group>
          </CameraRig>
        </Suspense>
      </Canvas>
      <Loader 
        containerStyles={{ 
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)'
        }}
        dataStyles={{
          fontSize: isMobile ? '12px' : '14px',
          color: 'white',
          opacity: 0.8
        }}
      />
    </div>
  );
} 