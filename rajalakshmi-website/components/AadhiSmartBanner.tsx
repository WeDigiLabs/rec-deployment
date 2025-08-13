"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface AadhiSmartBannerProps {
  chatServiceUrl?: string;
  triggerAfterClicks?: number;
  triggerAfterTime?: number;
}

const AadhiSmartBanner: React.FC<AadhiSmartBannerProps> = ({ 
  chatServiceUrl = "http://localhost:3001",
  triggerAfterClicks = 5, // Show after 5 navigation clicks
  triggerAfterTime = 30000 // Show after 30 seconds of browsing
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was already dismissed this session
    const sessionDismissed = sessionStorage.getItem('aadhi-smart-banner-dismissed');
    if (sessionDismissed) {
      setIsDismissed(true);
      return;
    }

    // Track time spent on site
    const startTime = Date.now();
    const timeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setTimeSpent(elapsed);
    }, 1000);

    // Track navigation clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Count clicks on navigation elements
      if (target.tagName === 'A' || 
          target.closest('nav') || 
          target.closest('[role="navigation"]') ||
          target.closest('button')) {
        setClickCount(prev => prev + 1);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      clearInterval(timeInterval);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    // Show banner if conditions are met and not dismissed
    if (!isDismissed && !isVisible) {
      if (clickCount >= triggerAfterClicks || timeSpent >= triggerAfterTime) {
        setIsVisible(true);
      }
    }
  }, [clickCount, timeSpent, triggerAfterClicks, triggerAfterTime, isDismissed, isVisible]);

  const handleChatClick = () => {
    window.open(chatServiceUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    handleDismiss();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('aadhi-smart-banner-dismissed', 'true');
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed top-20 right-4 z-40 max-w-sm">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full p-1">
              <Image
                src="/assets/mascot.png"
                alt="Aadhi"
                width={24}
                height={24}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="text-sm text-gray-600">Aadhi Assistant</div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message */}
        <div className="mb-4">
          <p className="text-gray-800 text-sm font-medium mb-1">
            Need help finding something?
          </p>
          <p className="text-gray-600 text-xs">
            Ask me about admissions, departments, or campus information.
          </p>
        </div>

        {/* Action */}
        <button
          onClick={handleChatClick}
          className="w-full bg-gray-900 text-white text-sm py-2 px-3 rounded-md hover:bg-gray-800 transition-colors duration-200"
        >
          Start Chat
        </button>
      </div>
    </div>
  );
};

export default AadhiSmartBanner;
