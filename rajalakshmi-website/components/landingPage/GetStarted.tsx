"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface CardProps {
  number: string;
  title: string;
  imageUrl: string;
  offsetTop?: string;
  cardSize: "mobile" | "desktop";
}

const Card: React.FC<CardProps> = ({
  number,
  title,
  imageUrl,
  offsetTop,
  cardSize,
}) => {
  const isMobile = cardSize === "mobile";
  const width = isMobile ? 240 : 320;
  const height = isMobile ? 320 : 420;

  return (
    <div
      className={`flex flex-col items-start ${offsetTop ?? ""} shrink-0`}
      style={{ width: `${width}px` }}
    >
      <div
        className="rounded-[16px] sm:rounded-[20px] md:rounded-[24px] overflow-hidden shadow-md"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <Image
          src={imageUrl}
          alt={title}
          width={width}
          height={height}
          className="w-full h-full object-cover opacity-90"
        />
      </div>
      <div className="w-full flex justify-between mt-3 sm:mt-4 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-[#22282B] font-semibold px-1">
        <span>{number}</span>
        <span>{title}</span>
      </div>
    </div>
  );
};

const cardData = [
  {
    number: "01",
    title: "Placement",
    imageUrl: "/assets/landing-page/info-placement.jpg",
  },
  {
    number: "02",
    title: "Alumni",
    imageUrl: "/assets/landing-page/info-admission.jpg",
  },
  {
    number: "03",
    title: "University Ranks",
    imageUrl: "/assets/landing-page/info-result.jpg",
  },
  {
    number: "04",
    title: "Gallery",
    imageUrl: "/assets/landing-page/info-gallery.jpg",
  },
];

const GetStartedSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = sliderRef.current;
      if (!container) return;

      const card = container.querySelector("div.snap-center") as HTMLElement;
      if (!card) return;

      const cardWidth = card.offsetWidth + 24; // card width + gap
      const scrollMid = container.scrollLeft + container.offsetWidth / 2;
      const index = Math.round(scrollMid / cardWidth);

      setCurrentSlide(Math.min(index, cardData.length - 1));
    };

    const ref = sliderRef.current;
    ref?.addEventListener("scroll", handleScroll);
    return () => ref?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="bg-[#FAFAFA] overflow-hidden py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="w-full">
        {/* Desktop View */}
        <div className="hidden lg:flex w-full overflow-hidden relative">
          <div
            className="flex w-max animate-scroll-left space-x-6 sm:space-x-8 md:space-x-10 lg:space-x-12"
            style={{
              animation: "scroll-left 40s linear infinite",
            }}
          >
            {[...Array(3)].map((_, idx) => (
              <React.Fragment key={idx}>
                <Card {...cardData[0]} offsetTop="mt-0" cardSize="desktop" />
                <div className="flex flex-col items-center">
                  <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] leading-[44px] font-semibold text-[#22282B] mt-[20px] sm:mt-[30px] md:mt-[40px] mb-[-10px] sm:mb-[-15px] md:mb-[-20px] text-left">
                    Get <br /> Started Now
                  </h2>
                  <Card {...cardData[1]} offsetTop="mt-10 sm:mt-15 md:mt-20" cardSize="desktop" />
                </div>
                <Card {...cardData[2]} offsetTop="mt-0" cardSize="desktop" />
                <Card {...cardData[3]} offsetTop="mt-20 sm:mt-30 md:mt-40" cardSize="desktop" />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden flex flex-col items-center w-full px-4 sm:px-6">
          <div
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 no-scrollbar w-full"
          >
            {cardData.map((card, index) => (
              <div
                key={index}
                className="snap-center"
                style={{ scrollSnapAlign: "center" }}
              >
                <Card {...card} cardSize="mobile" />
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex mt-4 sm:mt-6 space-x-2">
            {cardData.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-[#6A1B9A]" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Infinite scroll keyframes */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </section>
  );
};

export default GetStartedSection;
