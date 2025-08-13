"use client";

import { useState } from 'react';
import Button from '../Button';
import ContactDialog from '../ContactDialog';

export default function HeroButtons() {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);


  const handleContactUs = () => {
    setIsContactDialogOpen(true);
  };

  const handleChatWithAadhi = () => {
    // Open chat service in a new window/tab
    window.open('http://localhost:3001', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  return (
    <>
      <div
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 md:mt-8 lg:mt-10 z-30 w-full sm:w-auto px-4 sm:px-0"
      >
        <div className="flex flex-row w-full sm:w-auto gap-3">
          <Button
            variant="primary-gradient"
            size="lg"
            onClick={handleContactUs}
            showArrow={false}
            className="shadow-[0_0_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(0,0,0,0.4)] hover:scale-105 w-full sm:w-auto"
          >
            Contact Us
          </Button>
          <Button
            variant="primary-gradient"
            size="lg"
            onClick={handleChatWithAadhi}
            showArrow={false}
            className="relative shadow-[0_0_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(0,0,0,0.4)] hover:scale-105 w-full sm:w-auto overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              🤖 Ask Aadhi
            </span>
            {/* Pulse effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            {/* Sparkle effect */}
            <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
          </Button>
        </div>
      </div>
      
      <ContactDialog 
        isOpen={isContactDialogOpen} 
        onClose={() => setIsContactDialogOpen(false)} 
      />
    </>
  );
}