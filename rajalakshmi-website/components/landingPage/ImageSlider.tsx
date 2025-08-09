"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";

export interface Slide {
  id: number;
  src: string;
  alt: string;
}

interface ImageSliderProps {
  slides: Slide[];
  mobileSlides?: Slide[];
  autoSlideInterval?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  slides,
  mobileSlides = [],
  autoSlideInterval = 5000,
}) => {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [fade, setFade] = useState(true);
  const mobileSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMedia = () => setIsMobile(window.innerWidth <= 1024); // Changed to lg breakpoint
    updateMedia();
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  // Memoize the images to use to prevent unnecessary recalculations
  const imagesToUse = useMemo(() => {
    const slidesToUse = isMobile && mobileSlides.length > 0 ? mobileSlides : slides;
    // Ensure each slide has a stable key by adding index-based keys
    return slidesToUse.map((slide, index) => ({
      ...slide,
      stableKey: `${slide.src}-${index}`
    }));
  }, [isMobile, mobileSlides, slides]);

  const total = imagesToUse.length;

  const prevSlide = () => {
    if (total > 1) {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
        setFade(true);
      }, 200); 
    }
  };

  const nextSlide = useCallback(() => {
    if (total > 1) {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
        setFade(true);
      }, 200); 
    }
  }, [total]);

  useEffect(() => {
    const interval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(interval);
  }, [autoSlideInterval, nextSlide]);

  useEffect(() => {
    if (isMobile && mobileSliderRef.current) {
      mobileSliderRef.current.scrollTo({
        left: current * mobileSliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  }, [current, isMobile]);

  // If no slides, show a placeholder
  if (total === 0) {
    return (
      <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] xl:aspect-[3/1] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base md:text-lg">No slider images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Mobile View */}
      {isMobile ? (
        <div
          ref={mobileSliderRef}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full"
        >
          {imagesToUse.map((slide, index) => (
            <div
              key={slide.stableKey}
              className="relative flex-shrink-0 w-full aspect-[3/4] sm:aspect-[4/3] snap-center"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      ) : (
        // Desktop View with fade transition
        <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] xl:aspect-[3/1]">
          <Image
            src={imagesToUse[current].src}
            alt={imagesToUse[current].alt}
            fill
            className={`object-cover transition-opacity duration-500 ease-in-out ${
              fade ? "opacity-100" : "opacity-0"
            }`}
            priority
          />
        </div>
      )}

      {/* Desktop Controls */}
      {!isMobile && (
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 right-4 sm:right-6 md:right-8 lg:right-10 gap-2 sm:gap-3 md:gap-4 hidden lg:flex items-center">
          <button
            onClick={prevSlide}
            className="text-white text-lg sm:text-xl md:text-2xl font-bold hover:scale-110 transition-transform duration-200"
          >
            ←
          </button>
          <div className="relative flex items-center justify-center w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[104px] md:h-[104px] rounded-full bg-white/30 p-1 sm:p-2">
            <div className="flex items-center justify-center w-full h-full rounded-full bg-[#6A1B9A]">
              <span className="text-white font-semibold text-xs sm:text-sm md:text-lg">
                {current + 1}/{total}
              </span>
            </div>
          </div>
          <button
            onClick={nextSlide}
            className="text-white text-lg sm:text-xl md:text-2xl font-bold hover:scale-110 transition-transform duration-200"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
