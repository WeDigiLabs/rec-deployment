"use client";

import Button from '../Button';

export default function HeroButtons() {
  const handleExplore = () => {
    console.log('Explore button clicked!');
  };

  const handleContactUs = () => {
    console.log('Contact Us button clicked!');
  };

  return (
    <div className="flex flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 md:mt-8 lg:mt-10 z-30">
      <Button 
        variant="primary-gradient" 
        size="lg" 
        onClick={handleExplore}
        showArrow={true}
        className="shadow-[0_0_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(0,0,0,0.4)] hover:scale-105 "
      >
        Explore
      </Button>
      <Button 
        variant="primary-gradient" 
        size="lg" 
        onClick={handleContactUs}
        showArrow={true}
        className="shadow-[0_0_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(0,0,0,0.4)] hover:scale-105"
      >
        Contact Us
      </Button>
    </div>
  );
}