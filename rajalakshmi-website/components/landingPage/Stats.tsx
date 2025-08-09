"use client";
import React, { useEffect, useRef, useState } from "react";

export interface StatItem {
  value: string;
  label: string;
}

interface StatsSectionProps {
  stats: StatItem[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024); // Changed to lg breakpoint
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !scrollRef.current) return;

    const container = scrollRef.current;
    const scrollWidth = container.scrollWidth / 2;
    const speed = 1;

    const interval = setInterval(() => {
      if (container.scrollLeft >= scrollWidth) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += speed;
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isMobile]);

  const duplicatedStats = [...stats, ...stats];

  if (!mounted) return null; 

  return (
    <section className="bg-[#FAFAFA] py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 md:px-8 border-b border-gray-200">
      <div className="w-full max-w-[1700px] mx-auto">
        {isMobile ? (
          <div
            ref={scrollRef}
            className="flex flex-nowrap items-center gap-y-4 sm:gap-y-6 overflow-x-auto no-scrollbar whitespace-nowrap"
          >
            {duplicatedStats.map((stat, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center text-center px-2 sm:px-4 min-w-[120px] sm:min-w-[150px] md:min-w-[180px] shrink-0">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#22282B] leading-none">
                    {stat.value}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg font-medium text-[#22282B] mt-1 sm:mt-2">
                    {stat.label}
                  </p>
                </div>
                {index !== duplicatedStats.length - 1 && (
                  <div className="h-6 sm:h-8 w-[1px] bg-gray-300 mx-2 sm:mx-3 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center px-2 sm:px-4">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-[#22282B] leading-none">
                  {stat.value}
                </h3>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium text-[#22282B] mt-1 sm:mt-2 md:mt-3">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StatsSection;
