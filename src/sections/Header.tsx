'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Extend Window interface to include our custom property
declare global {
  interface Window {
    animationComplete?: boolean;
  }
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if animation is complete and add scroll listener
  useEffect(() => {
    // Function to handle scroll events
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    // Function to handle animation completion
    const handleAnimationComplete = () => {
      setShowHeader(true);
    };
    
    // Check if animation already completed on mount
    if (window.animationComplete) {
      setShowHeader(true);
    }
    
    // Listen for animation complete event
    window.addEventListener('animationComplete', handleAnimationComplete);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('animationComplete', handleAnimationComplete);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  if (!showHeader) return null;

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md py-3' : 'bg-black/30 backdrop-blur-sm py-4'} font-chakra uppercase tracking-wider`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.05 }}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white font-chakra uppercase tracking-wider">
              SCHON<span className="inline-block bg-gradient-to-r from-primary to-[#ed9520] bg-clip-text text-transparent">MO</span>
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 font-chakra">
            <Link href="#framesets" className="text-sm text-white hover:text-primary transition-colors font-medium font-chakra uppercase tracking-wider">
              Framesets
            </Link>
            <Link href="#wheelsets" className="text-sm text-white hover:text-primary transition-colors font-medium font-chakra uppercase tracking-wider">
              Wheelsets
            </Link>
            <Link href="#about" className="text-sm text-white hover:text-primary transition-colors font-medium font-chakra uppercase tracking-wider">
              About Us
            </Link>
            <Link href="#order" className="px-4 py-1.5 text-xs bg-gradient-to-r from-primary to-[#ed9520] text-white font-medium font-chakra uppercase tracking-wider rounded-none hover:scale-105 transition-transform duration-300">
              Custom Builds
            </Link>
          </nav>
          
          {/* Mobile menu button - for responsive design */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-white hover:text-primary transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/95 z-40 md:hidden pt-20 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col items-center space-y-6 font-chakra py-12">
              <Link 
                href="#framesets" 
                onClick={closeMobileMenu}
                className="text-xl text-white hover:text-primary transition-colors font-medium font-chakra uppercase tracking-wider"
              >
                Framesets
              </Link>
              <Link 
                href="#wheelsets" 
                onClick={closeMobileMenu}
                className="text-xl text-white hover:text-primary transition-colors font-medium font-chakra uppercase tracking-wider"
              >
                Wheelsets
              </Link>
              <Link 
                href="#about" 
                onClick={closeMobileMenu}
                className="text-xl text-white hover:text-primary transition-colors font-medium font-chakra uppercase tracking-wider"
              >
                About Us
              </Link>
              <div className="pt-4">
                <Link 
                  href="#order" 
                  onClick={closeMobileMenu}
                  className="px-8 py-3 bg-gradient-to-r from-primary to-[#ed9520] text-white font-medium font-chakra uppercase tracking-wider rounded-none"
                >
                  Custom Builds
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 