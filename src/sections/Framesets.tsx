'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, useAnimation } from 'framer-motion';

type FrameCategory = 'gravel' | 'road' | 'endurance';

interface FrameCategoryData {
  name: string;
  description: string;
  features: string[];
}

export default function Framesets() {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });
  const [activeCategory, setActiveCategory] = useState<FrameCategory>('gravel');
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  // Frame categories with their specs
  const frameCategories: Record<FrameCategory, FrameCategoryData> = {
    gravel: {
      name: "Gravel",
      description: "All-terrain carbon machines that excel on challenging surfaces. Optimized geometry balances stability and responsiveness.",
      features: ["40mm Tire Clearance", "Adventure Geometry", "Multiple Mounting Points"]
    },
    road: {
      name: "Road Racing",
      description: "Ultra-lightweight race machines with aggressive geometry, designed for maximum power transfer and aerodynamic efficiency.",
      features: ["UCI Approved", "Aero Tubing", "Race-Ready Geometry"]
    },
    endurance: {
      name: "Endurance",
      description: "Long-distance comfort with performance DNA. Ideal for gran fondos and riders seeking all-day comfort without sacrificing speed.",
      features: ["Vibration Damping", "Stable Handling", "Relaxed Position"]
    }
  };

  return (
    <section 
      id="framesets" 
      ref={sectionRef}
      className="w-full min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 overflow-hidden py-24 relative"
    >
      {/* Subtle background elements */}
      <div className="absolute top-20 right-[25%] w-64 h-64 rounded-full blur-[150px] bg-primary/10"></div>
      <div className="absolute bottom-40 left-[20%] w-96 h-96 rounded-full blur-[180px] bg-primary/5"></div>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col lg:flex-row items-center">
        {/* Left Side Content */}
        <div className="lg:w-1/2 pr-0 lg:pr-12">
          {/* Section Header */}
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-chakra font-bold tracking-tight uppercase mb-3">
              <span className="bg-gradient-to-r from-primary to-[#ed9520] bg-clip-text text-transparent">FORGE</span> YOUR CUSTOM FRAMESET
            </h2>
            
            <p className="text-base text-gray-300 font-chakra mb-8">
              Choose your riding style and we&apos;ll craft the perfect carbon frame to match your exact needs.
            </p>
          </div>
          
          {/* Mobile image - Only visible on mobile */}
          <div className="lg:hidden mb-8 w-full">
            <motion.div
              className="w-full h-[280px] sm:h-[350px] relative"
              initial={{ opacity: 0 }}
              animate={controls}
              variants={{
                visible: { 
                  opacity: 1,
                  transition: { duration: 1.5 }
                }
              }}
            >
              <Image
                src="/images/Frameset.png"
                alt="Custom Carbon Frameset"
                fill
                priority
                className="object-contain"
              />
            </motion.div>
          </div>
          
          {/* Frame Selection Interface - Simplified */}
          <div>
            {/* Category Selection */}
            <div className="flex flex-wrap mb-8 border-b border-gray-800">
              {(Object.keys(frameCategories) as FrameCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`py-3 px-4 sm:px-5 font-chakra uppercase text-xs sm:text-sm relative ${
                    activeCategory === category 
                      ? 'text-white font-medium' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {/* Active indicator */}
                  {activeCategory === category && (
                    <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary"></div>
                  )}
                  {frameCategories[category].name}
                </button>
              ))}
            </div>
            
            {/* Frame Details */}
            <div className="bg-black/20 p-4 sm:p-6 mb-8">
              <h3 className="text-lg sm:text-xl font-chakra font-bold mb-3 sm:mb-4 text-white">
                {frameCategories[activeCategory].name} Frameset
              </h3>
              
              <p className="text-sm sm:text-base text-gray-300 font-chakra mb-4 sm:mb-6">
                {frameCategories[activeCategory].description}
              </p>
              
              {/* Features */}
              <div className="mb-6">
                <h4 className="text-xs sm:text-sm uppercase text-gray-400 mb-2 sm:mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {frameCategories[activeCategory].features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm sm:text-base text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-primary text-white font-bold font-chakra uppercase tracking-wider text-xs sm:text-sm hover:bg-primary/90 transition-colors duration-300">
                START YOUR BUILD
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 mt-6 lg:mt-0">
          <motion.div
            className="w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[550px] relative"
            initial={{ opacity: 0 }}
            animate={controls}
            variants={{
              visible: { 
                opacity: 1,
                transition: { duration: 1.5 }
              }
            }}
          >
            <Image
              src="/images/Frameset.png"
              alt="Custom Carbon Frameset"
              fill
              priority
              className="object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
} 