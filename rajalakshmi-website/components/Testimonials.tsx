"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export interface Testimonial {
  id: number;
  name: string;
  designation: string;
  quote: string;
  avatar: string;
}

export interface TestimonialsProps {
  testimonials: Testimonial[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials,
  className = '',
  autoPlay = false,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const fadeDuration = 300; // ms

  const handleNext = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
      setIsFadingOut(false);
    }, fadeDuration);
  }, [currentIndex, testimonials.length, fadeDuration]);

  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, testimonials.length, currentIndex, handleNext]);

  const handlePrevious = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
      setIsFadingOut(false);
    }, fadeDuration);
  };

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <p className="text-gray-500">No testimonials available</p>
      </div>
    );
  }

  const currentTestimonial = testimonials[currentIndex];
  const arrowButtonClasses = 'font-medium rounded-2xl sm:rounded-3xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent text-[#6A1B9A] hover:bg-[#6A1B9A]/10 focus:ring-[#6A1B9A]/50 px-1.5 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base border border-[#6A1B9A]/30 hover:border-[#6A1B9A]/50';

  return (
    <div className={`max-w-4xl mx-auto p-2 sm:p-4 md:p-6 ${className}`}>
      <div className="relative">
        <div
          className={`bg-transparent p-2 sm:p-6 md:p-8 transition-opacity duration-${fadeDuration}
            ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
        >
          {/* Quote section */}
          <div className="relative mb-3 sm:mb-6 md:mb-8">
            <div className="text-xl sm:text-4xl text-[#D9CCFF] absolute -top-1 sm:-top-2 -left-1 sm:-left-2">&quot;</div>
            <blockquote className="text-sm sm:text-xl font-bold leading-snug sm:leading-relaxed pl-3 sm:pl-6 py-1 sm:py-0">
              {currentTestimonial.quote}
            </blockquote>
            <div className="text-xl sm:text-4xl text-[#D9CCFF] absolute -bottom-2 sm:-bottom-6 right-0">&quot;</div>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end space-y-2 sm:space-y-0">
            <div className="flex items-center">
              <div className="relative flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
                <Image
                  src={currentTestimonial.avatar}
                  alt={`${currentTestimonial.name}&apos;s profile`}
                  fill
                  className="rounded-full object-cover border-2 border-[#D9CCFF] shadow-sm transition-all duration-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const size = window.innerWidth < 640 ? 48 : window.innerWidth < 768 ? 64 : 72;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentTestimonial.name)}&background=D9CCFF&color=6A1B9A&size=${size}`;
                  }}
                />
              </div>
              <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-[#6A1B9A] truncate leading-tight">
                  {currentTestimonial.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 truncate leading-tight">
                  {currentTestimonial.designation}
                </p>
              </div>
            </div>

            {/* Navigation */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-center sm:justify-end space-x-1.5 sm:space-x-4">
                <button onClick={handlePrevious} className={arrowButtonClasses} aria-label="Previous testimonial">
                  <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="text-xs sm:text-sm text-gray-600 font-medium min-w-[2rem] sm:min-w-[3rem] text-center">
                  {currentIndex + 1} / {testimonials.length}
                </div>

                <button onClick={handleNext} className={arrowButtonClasses} aria-label="Next testimonial">
                  <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
