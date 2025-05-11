'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, useAnimation } from 'framer-motion';

export default function About() {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-black to-gray-900 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/carbon-texture.png')] opacity-5 bg-repeat"></div>
      <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-[120px] bg-primary/10"></div>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <motion.div 
            className="lg:w-1/2"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { duration: 0.8 }
              }
            }}
          >
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-chakra uppercase tracking-wider mb-4 md:mb-6">
                <span className="bg-gradient-to-r from-primary to-[#ed9520] bg-clip-text text-transparent">About</span> <span className="text-white">Schön<span className="text-primary">Mo</span></span>
              </h2>
              
              <p className="text-sm md:text-base text-gray-300 font-chakra mb-4 md:mb-6 leading-relaxed">
                Founded in 2018, SchönMo was born from a passion for precision engineering and cycling excellence. Our journey began in a small workshop in Berlin, where our founder, an aerospace engineer with a cycling obsession, set out to create the perfect carbon fiber bicycle.
              </p>
              
              <p className="text-sm md:text-base text-gray-300 font-chakra mb-4 md:mb-6 leading-relaxed">
                Today, we craft bespoke carbon fiber bicycles for discerning cyclists who demand nothing but perfection. Each frame is meticulously designed, engineered, and handcrafted by our team of artisans and engineers.
              </p>
              
              <div className="border-l-2 border-primary pl-4 md:pl-6 mb-8">
                <p className="text-white italic font-chakra text-base md:text-lg">
                  &ldquo;The pursuit of perfection lies in the harmony of science and craftsmanship.&rdquo;
                </p>
                <p className="text-primary font-chakra mt-2">
                  — Erik Schmidt, Founder
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <div className="bg-black/30 backdrop-blur-sm p-4 md:p-5 border border-gray-800/50 flex-1">
                <div className="text-primary text-2xl md:text-3xl font-semibold mb-1 md:mb-2">5+</div>
                <div className="text-white font-chakra uppercase text-xs md:text-sm tracking-wider">Years of Excellence</div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm p-4 md:p-5 border border-gray-800/50 flex-1">
                <div className="text-primary text-2xl md:text-3xl font-semibold mb-1 md:mb-2">500+</div>
                <div className="text-white font-chakra uppercase text-xs md:text-sm tracking-wider">Custom Builds</div>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm p-4 md:p-5 border border-gray-800/50 flex-1">
                <div className="text-primary text-2xl md:text-3xl font-semibold mb-1 md:mb-2">100%</div>
                <div className="text-white font-chakra uppercase text-xs md:text-sm tracking-wider">Carbon Excellence</div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Image */}
          <motion.div 
            className="lg:w-1/2 mt-6 lg:mt-0"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.8, delay: 0.3 }
              }
            }}
          >
            <div className="relative">
              {/* Decorative elements - hidden on small screens */}
              <div className="absolute -top-6 -left-6 w-16 md:w-24 h-16 md:h-24 border-t-2 border-l-2 border-primary/50 hidden sm:block"></div>
              <div className="absolute -bottom-6 -right-6 w-16 md:w-24 h-16 md:h-24 border-b-2 border-r-2 border-primary/50 hidden sm:block"></div>
              
              {/* Main image with shadow effect */}
              <div className="relative z-10 overflow-hidden rounded-lg shadow-2xl">
                <Image
                  src="/images/About.png"
                  alt="SchönMo Workshop"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay"></div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-6 sm:-bottom-8 -left-2 sm:-left-8 bg-gradient-to-r from-primary to-[#ed9520] py-2 sm:py-3 px-4 sm:px-6 shadow-xl z-20">
                <span className="text-white font-chakra text-xs sm:text-sm uppercase tracking-wider">Precision Craftsmanship</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 