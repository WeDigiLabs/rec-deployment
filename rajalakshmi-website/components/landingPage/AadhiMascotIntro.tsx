"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface AadhiMascotIntroProps {
  chatServiceUrl?: string;
  autoShowDelay?: number;
  showDuration?: number;
}

const AadhiMascotIntro: React.FC<AadhiMascotIntroProps> = ({ 
  chatServiceUrl = "http://localhost:3001",
  autoShowDelay = 3000, // Show after 3 seconds
  showDuration = 10000  // Hide after 10 seconds if no interaction
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const messages = [
    {
      text: "👋 Hi! I'm Aadhi, your AI campus assistant!",
      subtext: "Skip the browsing - just ask me anything!"
    },
    {
      text: "🎓 Looking for course details? Admission info?",
      subtext: "I have all the answers at my fingertips!"
    },
    {
      text: "⚡ Get instant answers instead of clicking around",
      subtext: "Try asking me about departments, facilities, or events!"
    }
  ];

  useEffect(() => {
    // Check if user has seen intro before (localStorage)
    const hasSeenIntro = localStorage.getItem('aadhi-intro-seen');
    
    if (!hasSeenIntro) {
      const showTimer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, autoShowDelay);

      return () => clearTimeout(showTimer);
    }
  }, [autoShowDelay]);

  useEffect(() => {
    if (isVisible) {
      // Cycle through messages
      const messageInterval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
      }, 3000);

      // Auto-hide after duration
      const hideTimer = setTimeout(() => {
        handleDismiss();
      }, showDuration);

      return () => {
        clearInterval(messageInterval);
        clearTimeout(hideTimer);
      };
    }
  }, [isVisible, showDuration, messages.length]);

  const handleChatClick = () => {
    localStorage.setItem('aadhi-intro-seen', 'true');
    window.open(chatServiceUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('aadhi-intro-seen', 'true');
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleRemindLater = () => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
    // Don't set localStorage, so it shows again on next visit
  };

  if (!isVisible) return null;

  const currentMessage = messages[currentMessageIndex];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleDismiss}
      />

      {/* Main Modal */}
      <div className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
        transition-all duration-500 ease-out w-[95vw] md:w-auto
        ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
          
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
            aria-label="Close"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-600 px-6 pt-6 pb-4 relative overflow-hidden">
            
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-yellow-300 rounded-full blur-2xl"></div>
            </div>

            {/* Mascot and intro */}
            <div className="relative z-10 flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-white rounded-full p-2 shadow-lg">
                  <Image
                    src="/assets/mascot.png"
                    alt="Aadhi Mascot"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
                {/* Online dot */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>

              <div className="text-white">
                <h3 className="text-xl font-bold">Meet Aadhi!</h3>
                <p className="text-purple-100 text-sm">Your Smart Campus Guide</p>
              </div>
            </div>
          </div>

          {/* Message content */}
          <div className="p-6 space-y-4">
            
            {/* Animated message */}
            <div 
              key={currentMessageIndex}
              className="animate-fade-in-up"
            >
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                <p className="text-gray-800 font-medium text-lg leading-relaxed">
                  {currentMessage.text}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  {currentMessage.subtext}
                </p>
              </div>
            </div>

            {/* Comparison section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              
              {/* Traditional browsing */}
              <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-500">😓</span>
                  <span className="text-red-700 font-medium">Traditional Way</span>
                </div>
                <ul className="text-red-600 space-y-1 text-xs">
                  <li>• Multiple page clicks</li>
                  <li>• Search through menus</li>
                  <li>• Time consuming</li>
                </ul>
              </div>

              {/* Aadhi way */}
              <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">🚀</span>
                  <span className="text-green-700 font-medium">With Aadhi</span>
                </div>
                <ul className="text-green-600 space-y-1 text-xs">
                  <li>• Just ask your question</li>
                  <li>• Instant answers</li>
                  <li>• Save time & effort</li>
                </ul>
              </div>
            </div>

            {/* Sample questions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 font-medium text-sm mb-2">Try asking me:</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {[
                  "Admission process?",
                  "CSE department info?",
                  "Campus facilities?",
                  "Placement records?"
                ].map((question, index) => (
                  <span
                    key={index}
                    className="bg-white text-gray-600 px-3 py-2 sm:py-1 rounded-full text-xs border hover:bg-purple-50 hover:border-purple-200 transition-colors duration-200 cursor-pointer text-center"
                    onClick={handleChatClick}
                  >
                    &quot;{question}&quot;
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleChatClick}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span>🤖</span>
                Chat with Aadhi
              </button>
              
              <button
                onClick={handleRemindLater}
                className="px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm font-medium w-full sm:w-auto"
              >
                Maybe later
              </button>
            </div>

            {/* Bottom tip */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                💡 Tip: You can always find me in the bottom-right corner!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
      `}</style>
    </>
  );
}

export default AadhiMascotIntro;
