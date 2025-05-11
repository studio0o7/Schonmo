'use client';

import React, { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

export default function OrderForm() {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bikeType: '',
    frameSize: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after submission (simulate successful submission)
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        bikeType: '',
        frameSize: '',
        message: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section 
      id="order" 
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-gray-900 to-black overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/carbon-texture.png')] opacity-5 bg-repeat"></div>
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full blur-[150px] bg-primary/20"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-[150px] bg-primary/10"></div>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-10 md:mb-16"
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
          <h2 className="inline-block text-3xl md:text-4xl lg:text-5xl font-bold font-chakra uppercase tracking-wider mb-3 md:mb-4">
            <span className="bg-gradient-to-r from-primary to-[#ed9520] bg-clip-text text-transparent">Start</span> <span className="text-white">Your Journey</span>
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-300 font-chakra max-w-2xl mx-auto">
            Ready to own a custom SchönMo carbon bicycle? Fill out the form below and our team will get in touch with you to discuss your dream build.
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-black/30 backdrop-blur-sm border border-gray-800/50 p-5 md:p-8 rounded-lg shadow-xl"
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
            {submitted ? (
              <div className="text-center py-8 md:py-10">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-primary to-[#ed9520] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-chakra text-white mb-3 md:mb-4">Thank You!</h3>
                <p className="text-sm md:text-base text-gray-300 font-chakra max-w-md mx-auto">
                  Your inquiry has been received. Our team will contact you shortly to discuss your custom build.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs md:text-sm font-medium text-gray-300 mb-1 md:mb-2 font-chakra">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/50 border border-gray-700 rounded-none px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-300 mb-1 md:mb-2 font-chakra">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/50 border border-gray-700 rounded-none px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
                      placeholder="Your email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-xs md:text-sm font-medium text-gray-300 mb-1 md:mb-2 font-chakra">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-gray-700 rounded-none px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
                      placeholder="Your phone number"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bikeType" className="block text-xs md:text-sm font-medium text-gray-300 mb-1 md:mb-2 font-chakra">Bike Type</label>
                    <select
                      id="bikeType"
                      name="bikeType"
                      value={formData.bikeType}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/50 border border-gray-700 rounded-none px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
                    >
                      <option value="" disabled>Select a bike type</option>
                      <option value="road">Road</option>
                      <option value="gravel">Gravel</option>
                      <option value="endurance">Endurance</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="frameSize" className="block text-xs md:text-sm font-medium text-gray-300 mb-1 md:mb-2 font-chakra">Frame Size</label>
                    <select
                      id="frameSize"
                      name="frameSize"
                      value={formData.frameSize}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/50 border border-gray-700 rounded-none px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
                    >
                      <option value="" disabled>Select your frame size</option>
                      <option value="xs">XS</option>
                      <option value="s">S</option>
                      <option value="m">M</option>
                      <option value="l">L</option>
                      <option value="xl">XL</option>
                      <option value="custom">Custom Geometry</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="message" className="block text-xs md:text-sm font-medium text-gray-300 mb-1 md:mb-2 font-chakra">Additional Information</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-black/50 border border-gray-700 rounded-none px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
                      placeholder="Tell us about your dream bike build..."
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="privacy"
                    type="checkbox"
                    required
                    className="h-4 w-4 border-gray-700 rounded accent-primary focus:ring-primary"
                  />
                  <label htmlFor="privacy" className="ml-2 block text-xs md:text-sm text-gray-300 font-chakra">
                    I agree to the privacy policy and terms of service
                  </label>
                </div>
                
                <div className="pt-3 md:pt-4">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-primary to-[#ed9520] text-white font-bold font-chakra uppercase tracking-wider text-xs md:text-sm shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300"
                  >
                    Submit Inquiry
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 