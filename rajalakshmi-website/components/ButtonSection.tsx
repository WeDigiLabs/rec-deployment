"use client";

import Button from './Button';

export default function ButtonSection() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <div className="flex justify-center items-center py-8">
      <Button 
        variant="primary-gradient" 
        size="lg" 
        onClick={handleClick}
      >
        Get Started
      </Button>
    </div>
  );
}