"use client";

import { useState } from 'react';
import Button from '../Button';
import ContactDialog from '../ContactDialog';

export default function HeroButtons() {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  const handleExplore = () => {
    console.log('Explore button clicked!');
  };

  const handleContactUs = () => {
    setIsContactDialogOpen(true);
  };

  return (
    <>
      <div
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 md:mt-8 lg:mt-10 z-30 w-full sm:w-auto px-4 sm:px-0"
      >
        <Button
          variant="primary-gradient"
          size="lg"
          onClick={handleExplore}
          showArrow={false}
          className="shadow-[0_0_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(0,0,0,0.4)] hover:scale-105 w-full sm:w-auto"
        >
          Explore
        </Button>
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
            showArrow={false}
            className="shadow-[0_0_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(0,0,0,0.4)] hover:scale-105 w-full sm:w-auto"
          >
            Chat
            <sup className="font-bold text-xs align-super">AI</sup>
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