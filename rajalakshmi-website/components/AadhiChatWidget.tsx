"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface AadhiChatWidgetProps {
  chatServiceUrl?: string;
}

const AadhiChatWidget: React.FC<AadhiChatWidgetProps> = ({ 
  chatServiceUrl = "http://localhost:3001"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show widget after a longer delay to be less intrusive
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleChatClick = () => {
    window.open(chatServiceUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div 
        className="relative group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Minimal chat button */}
        <button
          onClick={handleChatClick}
          className="w-14 h-14 bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center relative"
        >
          {/* Simple mascot */}
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <Image
              src="/assets/mascot.png"
              alt="Chat with Aadhi"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Minimal online indicator */}
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
        </button>

        {/* Clean tooltip */}
        <div className={`
          absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap
          transition-all duration-200 pointer-events-none
          ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
        `}>
          Chat with Aadhi
          <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default AadhiChatWidget;
