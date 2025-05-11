'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useAnimation } from 'framer-motion';

export default function Wheelsets() {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });
  const sliderRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  // The wheelsets data for reuse
  const wheelsets = [
    {
      id: 1,
      name: "Chromatic Elite",
      subtitle: "Ultimate climbing performance",
      image: "/images/Wheelset1.jpg",
      specs: [
        "Carbon Fiber Rim",
        "25mm Inner Width",
        "Ceramic Bearings"
      ]
    },
    {
      id: 2,
      name: "Velocity Aero",
      subtitle: "Aerodynamic excellence",
      image: "/images/second2jpg.jpg",
      specs: [
        "50mm Deep Section",
        "Aero-optimized Spokes",
        "Tubeless Ready"
      ]
    }
  ];

  return (
    <section 
      id="wheelsets" 
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
    >
      {/* Enhanced background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/carbon-texture.png')] opacity-10 bg-repeat"></div>
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-[100px] bg-primary/20"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-[150px] bg-primary/10"></div>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.8 }
            }
          }}
        >
          <h2 className="inline-block text-4xl md:text-5xl font-bold font-chakra uppercase tracking-wider mb-4">
            <span className="bg-gradient-to-r from-primary to-[#ed9520] bg-clip-text text-transparent">Premium</span> <span className="text-white">Wheelsets</span>
          </h2>
          <p className="mt-4 text-gray-300 font-chakra max-w-2xl mx-auto">
            Handcrafted carbon fiber masterpieces designed for those who demand excellence in every turn and climb.
          </p>
        </motion.div>
        
        {/* Mobile Horizontal Slider - Only visible on mobile */}
        <div className="md:hidden mb-12">
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-6"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none' 
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {wheelsets.map((wheelset) => (
              <div 
                key={wheelset.id} 
                className="flex-shrink-0 w-[85%] snap-center mr-4"
              >
                <motion.div 
                  className="relative group overflow-hidden"
                  initial="hidden"
                  animate={controls}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { 
                      opacity: 1,
                      transition: { duration: 1, delay: 0.3 }
                    }
                  }}
                >
                  <div className="aspect-square relative overflow-hidden rounded-xl shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent mix-blend-overlay"></div>
                    <Image
                      src={wheelset.image}
                      alt={wheelset.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 sm:p-5">
                      <h3 className="text-lg sm:text-xl font-chakra uppercase tracking-wider text-white">{wheelset.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-300 mt-1">{wheelset.subtitle}</p>
                    </div>
                  </div>
                  
                  {/* Specs */}
                  <div className="mt-4 bg-black/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800/50 shadow-xl">
                    <ul className="space-y-2">
                      {wheelset.specs.map((spec, idx) => (
                        <li key={idx} className="text-sm text-gray-200 font-chakra flex items-center">
                          <span className="text-primary mr-2 text-lg">•</span> {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile CTA Button - Only visible on mobile */}
        <div className="md:hidden text-center mb-8">
          <button className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-[#ed9520] text-white font-bold font-chakra uppercase tracking-wider text-xs sm:text-sm rounded-none shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300">
            Configure Now
          </button>
        </div>
        
        {/* Desktop Layout - Hidden on mobile */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-center">
          {/* Left Wheelset */}
          <motion.div 
            className="col-span-1 md:col-span-1 lg:col-span-4"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { duration: 1, delay: 0.3 }
              }
            }}
          >
            <div className="relative group overflow-hidden">
              <div className="aspect-square relative overflow-hidden rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent mix-blend-overlay group-hover:opacity-60 transition-opacity"></div>
                <Image
                  src="/images/Wheelset1.jpg"
                  alt="Chromatic Elite Wheelset"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-chakra uppercase tracking-wider text-white">Chromatic Elite</h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">Ultimate climbing performance</p>
                </div>
              </div>
            </div>
            
            {/* Specs */}
            <div className="mt-4 sm:mt-6 bg-black/50 backdrop-blur-sm p-4 sm:p-5 rounded-lg border border-gray-800/50 shadow-xl">
              <ul className="space-y-2 sm:space-y-3">
                <li className="text-sm sm:text-base text-gray-200 font-chakra flex items-center">
                  <span className="text-primary mr-2 text-lg">•</span> Carbon Fiber Rim
                </li>
                <li className="text-sm sm:text-base text-gray-200 font-chakra flex items-center">
                  <span className="text-primary mr-2 text-lg">•</span> 25mm Inner Width
                </li>
                <li className="text-sm sm:text-base text-gray-200 font-chakra flex items-center">
                  <span className="text-primary mr-2 text-lg">•</span> Ceramic Bearings
                </li>
              </ul>
            </div>
          </motion.div>
          
          {/* Center Content */}
          <motion.div 
            className="col-span-1 md:col-span-2 lg:col-span-4 order-first md:order-none mb-8 md:mb-0"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 1, delay: 0.5 }
              }
            }}
          >
            <div className="text-center py-6 sm:py-8 px-4">
              <div className="relative mb-6 sm:mb-8 inline-block">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-primary to-[#ed9520] flex items-center justify-center shadow-lg shadow-primary/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black border border-gray-800"></div>
              </div>
              
              <p className="text-base sm:text-lg text-gray-200 font-chakra italic mb-8 sm:mb-10 px-0 sm:px-4">
                &ldquo;Engineered for precision, crafted for passion. Our wheelsets define your ride.&rdquo;
              </p>
              
              <button className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-primary to-[#ed9520] text-white font-bold font-chakra uppercase tracking-wider text-xs sm:text-sm rounded-none shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300">
                Configure Now
              </button>
            </div>
          </motion.div>
          
          {/* Right Wheelset */}
          <motion.div 
            className="col-span-1 md:col-span-1 lg:col-span-4"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: 30 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { duration: 1, delay: 0.3 }
              }
            }}
          >
            <div className="relative group overflow-hidden">
              <div className="aspect-square relative overflow-hidden rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-bl from-primary/40 to-transparent mix-blend-overlay group-hover:opacity-60 transition-opacity"></div>
                <Image
                  src="/images/second2jpg.jpg"
                  alt="Velocity Aero Wheelset"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-chakra uppercase tracking-wider text-white">Velocity Aero</h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">Aerodynamic excellence</p>
                </div>
              </div>
            </div>
            
            {/* Specs */}
            <div className="mt-4 sm:mt-6 bg-black/50 backdrop-blur-sm p-4 sm:p-5 rounded-lg border border-gray-800/50 shadow-xl">
              <ul className="space-y-2 sm:space-y-3">
                <li className="text-sm sm:text-base text-gray-200 font-chakra flex items-center">
                  <span className="text-primary mr-2 text-lg">•</span> 50mm Deep Section
                </li>
                <li className="text-sm sm:text-base text-gray-200 font-chakra flex items-center">
                  <span className="text-primary mr-2 text-lg">•</span> Aero-optimized Spokes
                </li>
                <li className="text-sm sm:text-base text-gray-200 font-chakra flex items-center">
                  <span className="text-primary mr-2 text-lg">•</span> Tubeless Ready
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 