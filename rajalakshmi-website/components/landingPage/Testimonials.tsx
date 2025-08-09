"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
  autoSlideInterval?: number; 
}

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
  testimonials,
  autoSlideInterval = 3000,
}) => {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, autoSlideInterval);

    return () => clearInterval(interval); 
  }, [autoSlideInterval, testimonials.length]);

  const testimonial = testimonials[current];

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
      <div className="max-w-[100rem] mx-auto flex flex-col items-center text-center gap-4 sm:gap-6 md:gap-8 lg:text-left lg:items-start">
        {/* Mobile View */}
        <div className="flex items-center gap-3 sm:gap-4 lg:hidden">
          <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px] relative rounded-full overflow-hidden border border-[#FFFFFF80]">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-left">
            <p className="font-bold text-[14px] sm:text-[16px] md:text-[18px] text-[#212121] leading-[1.8]">
              {testimonial.name}
            </p>
            <p className="font-medium text-[12px] sm:text-[13px] md:text-[14px] text-[#878C91] leading-[1.6]">
              {testimonial.role}
            </p>
          </div>
        </div>

        {/* Quote */}
        <blockquote className="font-[600] text-[14px] sm:text-[18px] md:text-[24px] lg:text-[32px] xl:text-[40px] leading-[1.6] tracking-[-0.03em] font-montserrat text-[#22282B] rounded-lg px-2 sm:px-4">
          &quot; {testimonial.quote} &quot;
        </blockquote>

        {/* Navigation + Desktop */}
        <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center justify-between w-full">
          <div className="hidden lg:flex items-center gap-3 sm:gap-4">
            <div className="w-[60px] h-[60px] sm:w-[65px] sm:h-[65px] md:w-[70px] md:h-[70px] relative rounded-full overflow-hidden border border-[#FFFFFF80]">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <p className="font-bold text-[16px] sm:text-[18px] md:text-[20px] text-[#212121] leading-[1.8]">
                {testimonial.name}
              </p>
              <p className="font-medium text-[14px] sm:text-[15px] md:text-[16px] text-[#878C91] leading-[1.8]">
                {testimonial.role}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:ml-auto">
            <button
              onClick={handlePrev}
              className="border border-[#010205] text-black 
                       hover:bg-[#6A1B9A] hover:text-white hover:border-[#6A1B9A]
                       w-[45px] h-[28px] sm:w-[50px] sm:h-[32px] md:w-[60px] md:h-[40px] lg:w-[70px] lg:h-[48px] xl:w-[88px] xl:h-[56px] rounded-[70px] 
                       px-0 py-0 md:px-[24px] md:py-[12px] lg:px-[28px] lg:py-[14px] xl:px-[32px] xl:py-[16px] 
                       flex items-center justify-center transition-colors duration-200 text-sm sm:text-base md:text-lg"
              aria-label="Previous"
            >
              ←
            </button>

            <div className="flex items-center text-[12px] sm:text-[14px] md:text-[16px] leading-[1.8] font-semibold font-[Plus Jakarta Sans]">
              <span className="underline">
                {String(current + 1).padStart(2, "0")}
              </span>
              <span className="text-[#01020566] ml-1">
                / {String(testimonials.length).padStart(2, "0")}
              </span>
            </div>

            <button
              onClick={handleNext}
              className="border border-[#010205] text-black 
                       hover:bg-[#6A1B9A] hover:text-white hover:border-[#6A1B9A]
                       w-[45px] h-[28px] sm:w-[50px] sm:h-[32px] md:w-[60px] md:h-[40px] lg:w-[70px] lg:h-[48px] xl:w-[88px] xl:h-[56px] rounded-[70px] 
                       px-0 py-0 md:px-[24px] md:py-[12px] lg:px-[28px] lg:py-[14px] xl:px-[32px] xl:py-[16px] 
                       flex items-center justify-center transition-colors duration-200 text-sm sm:text-base md:text-lg"
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
