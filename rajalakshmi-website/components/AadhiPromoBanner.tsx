"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface AadhiPromoBannerProps {
  chatServiceUrl?: string;
}

const AadhiPromoBanner: React.FC<AadhiPromoBannerProps> = ({ 
  chatServiceUrl = "http://localhost:3001" 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Add periodic animation
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleChatClick = () => {
    window.open(chatServiceUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mascot */}
            <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
              <div className="w-12 h-12 bg-white rounded-full p-1 shadow-lg">
                <Image
                  src="/assets/mascot.png"
                  alt="Aadhi"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>

            {/* Text content */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <div>
                <span className="font-bold text-lg">Meet Aadhi! 🤖</span>
                <span className="hidden sm:inline ml-2 text-purple-100">
                  Your AI campus assistant is ready to help
                </span>
              </div>
              <div className="text-sm text-purple-200 sm:hidden">
                Your AI campus assistant is ready to help
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleChatClick}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span className="hidden sm:inline">Chat Now</span>
              <span className="sm:hidden">Chat</span>
            </button>
            
            <button
              onClick={handleDismiss}
              className="text-white/70 hover:text-white p-1 transition-colors duration-200"
              aria-label="Dismiss banner"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-yellow-400 animate-pulse"></div>
    </div>
  );
};

export default AadhiPromoBanner;
