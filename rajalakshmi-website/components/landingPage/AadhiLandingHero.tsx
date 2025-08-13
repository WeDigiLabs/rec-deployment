"use client";

import React, { useState } from 'react';
import Image from 'next/image';
// Removed unused Button import

interface AadhiLandingHeroProps {
  chatServiceUrl?: string;
}

const AadhiLandingHero: React.FC<AadhiLandingHeroProps> = ({ 
  chatServiceUrl = "http://localhost:3001" 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleChatClick = () => {
    window.open(chatServiceUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  const handleTraditionalBrowse = () => {
    // Scroll to the next section or main content
    const nextSection = document.querySelector('main') || document.querySelector('#content');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
  <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto">
      
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

  <div className="relative z-10 w-full max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 text-center">
        
        {/* Main content */}
  <div className="w-full mx-auto">
          
          {/* Welcome badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-xs sm:text-sm font-medium text-center">Welcome to Rajalakshmi Engineering College</span>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
            Meet{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 animate-pulse">
              Aadhi
            </span>
          </h1>

          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-purple-200 mb-6 sm:mb-8 font-light px-2">
            Your AI-Powered Campus Assistant
          </h2>

          {/* Subtitle with typing effect */}
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
            Skip the endless clicking and searching. Get instant, accurate answers about our college in seconds.
          </p>

          {/* Mascot showcase */}
          <div className="mb-8 sm:mb-12 relative flex justify-center items-center">
            <div 
              className={`relative inline-block transition-transform duration-500 ${
                isHovered ? 'scale-105 rotate-2' : 'scale-100'
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ maxWidth: '100vw' }}
            >
              <div className="w-24 h-24 xs:w-28 xs:h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 mx-auto bg-white/10 backdrop-blur-sm rounded-full p-2 xs:p-3 sm:p-6 md:p-8 border border-white/20 shadow-2xl">
                <Image
                  src="/assets/mascot.png"
                  alt="Aadhi - AI Campus Assistant"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded-full"
                  priority
                />
              </div>
              {/* Floating elements around mascot, reposition for mobile */}
              <div className="absolute -top-2 -right-2 xs:-top-3 xs:-right-3 sm:-top-4 sm:-right-4 bg-green-400 text-white px-1.5 xs:px-2 py-0.5 xs:py-1 sm:px-3 rounded-full text-[10px] xs:text-xs sm:text-sm font-medium animate-bounce whitespace-nowrap">
                Online!
              </div>
              <div className="absolute -bottom-2 -left-2 xs:-bottom-3 xs:-left-3 sm:-bottom-4 sm:-left-4 bg-yellow-400 text-black px-1.5 xs:px-2 py-0.5 xs:py-1 sm:px-3 rounded-full text-[10px] xs:text-xs sm:text-sm font-medium animate-bounce whitespace-nowrap" style={{ animationDelay: '0.5s' }}>
                Ready!
              </div>
              <div className="absolute top-1/2 -left-4 xs:-left-5 sm:-left-8 bg-pink-400 text-white px-1.5 xs:px-2 py-0.5 xs:py-1 sm:px-3 rounded-full text-[10px] xs:text-xs sm:text-sm font-medium animate-bounce whitespace-nowrap" style={{ animationDelay: '1s' }}>
                24/7
              </div>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 mb-8 sm:mb-12 px-2 xs:px-4">
            {[
              {
                icon: "⚡",
                title: "Instant Answers",
                description: "Get information in seconds, not minutes"
              },
              {
                icon: "🎯",
                title: "Always Accurate",
                description: "Updated information directly from official sources"
              },
              {
                icon: "🧠",
                title: "Smart Understanding",
                description: "Ask in your own words, I'll understand"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="text-white font-semibold text-base sm:text-lg mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Call to action buttons */}
          <div className="flex flex-col gap-3 xs:gap-4 justify-center items-center mb-6 sm:mb-8 px-2 xs:px-4 w-full">
            
            {/* Primary CTA - Chat with Aadhi */}
            <button
              onClick={handleChatClick}
              className="group relative bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white px-4 xs:px-6 sm:px-8 py-2 xs:py-3 sm:py-4 rounded-2xl font-bold text-sm xs:text-base sm:text-lg hover:from-yellow-300 hover:via-pink-400 hover:to-purple-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 w-full xs:w-auto max-w-xs xs:max-w-sm"
            >
              <span className="relative z-10 flex items-center justify-center gap-1 xs:gap-2 sm:gap-3">
                <span className="text-base xs:text-lg sm:text-xl">🤖</span>
                <span className="hidden sm:inline">Start Chatting with Aadhi</span>
                <span className="sm:hidden">Chat with Aadhi</span>
                <svg className="w-4 h-4 xs:w-5 xs:h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </button>

            {/* Secondary option */}
            <button
              onClick={handleTraditionalBrowse}
              className="text-white/70 hover:text-white px-3 xs:px-4 sm:px-6 py-1.5 xs:py-2 sm:py-3 rounded-xl transition-all duration-200 flex items-center gap-1 xs:gap-2 hover:bg-white/10 text-xs xs:text-sm sm:text-base w-full xs:w-auto"
            >
              <span>Or browse traditionally</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>

          {/* Sample questions */}
          <div className="max-w-2xl mx-auto px-2 xs:px-4">
            <p className="text-white/60 text-[11px] xs:text-xs sm:text-sm mb-2 xs:mb-3 sm:mb-4">Try asking me:</p>
            <div className="flex flex-wrap justify-center gap-1 xs:gap-2 sm:gap-3">
              {[
                "What courses do you offer?",
                "How do I apply for admission?",
                "Tell me about campus facilities",
                "What's the placement record?",
                "Show me the CSE department"
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={handleChatClick}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full text-[11px] xs:text-xs sm:text-sm transition-all duration-200 hover:scale-105 whitespace-nowrap"
                >
                    &quot;{question}&quot;
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-2 xs:bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default AadhiLandingHero;
