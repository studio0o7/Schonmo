'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically load the particle animation without SSR
const ParticleMorphScene = dynamic(
  () => import('../components/ParticleMorphScene'),
  { ssr: false }
);

// Create a context to manage animation state across components
import { createContext, useContext } from 'react';

export const AnimationContext = createContext({
  animationComplete: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  setAnimationComplete: (_value: boolean) => {}
});

export const useAnimationContext = () => useContext(AnimationContext);

// Extend Window interface to include our custom property
declare global {
  interface Window {
    animationComplete?: boolean;
  }
}

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const titleText = 'PERSONALIZE YOUR DREAM RIDE';
  const orangeThreshold = titleText.split(' ').slice(0, 2).join(' ').length;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Simply track that component is mounted
    setIsLoaded(true);

    // Check if mobile
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

  const handleAnimationComplete = () => {
    // Slight delay before showing content to ensure animation is visually settled
    setTimeout(() => {
      setAnimationComplete(true);
      
      // Expose animation state to window for other components
      window.animationComplete = true;
      
      // Dispatch a custom event that Header can listen for
      window.dispatchEvent(new CustomEvent('animationComplete'));
    }, 0);
  };

  return (
    <section id="hero" className="w-full h-screen bg-gradient-to-b from-black via-black to-gray-900 text-white overflow-hidden flex flex-col">
      {/* Animation layer - always visible */}
      <div className="absolute inset-0 w-full h-full">
        <ParticleMorphScene onAnimationComplete={handleAnimationComplete} />
      </div>

      {/* Content overlay - completely invisible until animation completes */}
      {isLoaded && (
        <motion.div 
          className="relative z-20 w-full h-full flex flex-col justify-between pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: animationComplete ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Top section: Title and Description - positioned higher on mobile */}
          <div className={`container mx-auto ${isMobile ? 'pt-28' : 'pt-20 md:pt-32'} text-center`}>
            {isMobile ? (
              // Mobile-specific title layout with line break after 2 words
              <div>
                <div className="inline-block mb-2">
                  {titleText.split(' ').slice(0, 2).join(' ').split('').map((letter, idx) => (
                    <motion.span
                      key={`first-${idx}`}
                      className={`inline-block text-3xl font-chakra font-bold tracking-tight uppercase ${idx < orangeThreshold ? 'bg-gradient-to-r from-primary to-[#ed9520] bg-clip-text text-transparent' : 'text-white'}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={animationComplete ? { opacity: 1, y: 0 } : {}}
                      transition={{ 
                        type: 'spring', 
                        damping: 12, 
                        stiffness: 100, 
                        delay: 0.3 + idx * 0.05 
                      }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </motion.span>
                  ))}
                </div>
                <div className="inline-block">
                  {titleText.split(' ').slice(2).join(' ').split('').map((letter, idx) => (
                    <motion.span
                      key={`second-${idx}`}
                      className="inline-block text-3xl font-chakra font-bold tracking-tight uppercase text-white"
                      initial={{ opacity: 0, y: 30 }}
                      animate={animationComplete ? { opacity: 1, y: 0 } : {}}
                      transition={{ 
                        type: 'spring', 
                        damping: 12, 
                        stiffness: 100, 
                        delay: 0.3 + idx * 0.05 + titleText.split(' ').slice(0, 2).join(' ').length * 0.05
                      }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </motion.span>
                  ))}
                </div>
              </div>
            ) : (
              // Desktop layout (unchanged)
              <div className="inline-block">
                {titleText.split('').map((letter, idx) => (
                  <motion.span
                    key={idx}
                    className={`inline-block ${isMobile ? 'text-2xl sm:text-3xl' : 'text-3xl md:text-4xl lg:text-5xl'} font-chakra font-bold tracking-tight uppercase ${idx < orangeThreshold ? 'bg-gradient-to-r from-primary to-[#ed9520] bg-clip-text text-transparent' : 'text-white'}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={animationComplete ? { opacity: 1, y: 0 } : {}}
                    transition={{ 
                      type: 'spring', 
                      damping: 12, 
                      stiffness: 100, 
                      delay: 0.3 + idx * 0.05 
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </div>
            )}
            
            {/* Description */}
            <motion.p
              className="mt-4 text-base md:text-lg text-gray-300 font-chakra mx-auto px-4 max-w-full md:whitespace-nowrap"
              initial={{ opacity: 0, y: 20 }}
              animate={animationComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Custom wheelsets & framesets built to your exact specifications.
            </motion.p>
          </div>

          {/* Middle section: Empty space for animation to be visible */}
          <div className="flex-grow"></div>

          {/* Bottom section: CTA Button - positioned lower */}
          <div className="container mx-auto pb-10 md:pb-12 text-center">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={animationComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-orange-600 text-white font-bold font-chakra uppercase tracking-wider text-xs sm:text-sm rounded-none shadow-lg hover:scale-105 transition-transform duration-300 pointer-events-auto">
                ORDER NOW
              </button>
            </motion.div>
            
            {/* Scroll indicator */}
            <motion.div 
              className="flex justify-center mt-4"
              initial={{ opacity: 0 }}
              animate={animationComplete ? { 
                opacity: 1,
                y: [0, 10, 0]
              } : {}}
              transition={{
                delay: 1.2,
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 sm:h-8 sm:w-8 text-white/70 pointer-events-auto cursor-pointer"
                viewBox="0 0 20 20" 
                fill="currentColor"
                onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}
              >
                <path 
                  fillRule="evenodd" 
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}
    </section>
  );
} 