"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { fetchFromApi, getImageUrl } from "@/lib/api";
import { useRouter } from "next/navigation";

interface CardData {
  id: string;
  title: string;
  Image: {
    url: string;
    alt: string;
  };
  link: string;
  order: number;
}

interface CardProps {
  number: string;
  title: string;
  imageUrl: string;
  link?: string;
  offsetTop?: string;
  cardSize: "mobile" | "desktop";
}

const Card: React.FC<CardProps> = ({
  number,
  title,
  imageUrl,
  link,
  offsetTop,
  cardSize,
}) => {
  const router = useRouter();
  const isMobile = cardSize === "mobile";
  const width = isMobile ? 240 : 320;
  const height = isMobile ? 320 : 420;

  const handleCardClick = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <div
      className={`flex flex-col items-start ${offsetTop ?? ""} shrink-0 cursor-pointer transition-transform hover:scale-105`}
      style={{ width: `${width}px` }}
      onClick={handleCardClick}
    >
      <div
        className="rounded-[16px] sm:rounded-[20px] md:rounded-[24px] overflow-hidden shadow-md hover:shadow-lg transition-shadow"
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

const GetStartedSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardData, setCardData] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await fetchFromApi('/api/image-slider');
        if (response?.docs) {
          const formattedData = response.docs.map((item: CardData, index: number) => ({
            number: String(index + 1).padStart(2, '0'),
            title: item.title,
            imageUrl: getImageUrl(item.Image?.url),
            link: item.link
          }));
          setCardData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching image slider data:', error);
        // Fallback to default data
        setCardData([
          {
            number: "01",
            title: "Placement",
            imageUrl: "/assets/landing-page/info-placement.jpg",
            link: "/placement",
            cardSize: "mobile"
          },
          {
            number: "02",
            title: "Alumni",
            imageUrl: "/assets/landing-page/info-admission.jpg",
            link: "/alumni",
            cardSize: "mobile"
          },
          {
            number: "03",
            title: "University Ranks",
            imageUrl: "/assets/landing-page/info-result.jpg",
            link: "/university-ranks",
            cardSize: "mobile"
          },
          {
            number: "04",
            title: "Gallery",
            imageUrl: "/assets/landing-page/info-gallery.jpg",
            link: "/gallery",
            cardSize: "mobile"
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCardData();
  }, []);

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
  }, [cardData.length]);

  if (loading) {
    return (
      <section className="bg-[#FAFAFA] overflow-hidden py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="w-full flex items-center justify-center min-h-[400px]">
          <div className="text-[#22282B] text-lg">Loading...</div>
        </div>
      </section>
    );
  }

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
                {cardData[0] && <Card {...cardData[0]} offsetTop="mt-0" cardSize="desktop" />}
                <div className="flex flex-col items-center">
                  <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] leading-[44px] font-semibold text-[#22282B] mt-[20px] sm:mt-[30px] md:mt-[40px] mb-[-10px] sm:mb-[-15px] md:mb-[-20px] text-left">
                    Get <br /> Started Now
                  </h2>
                  {cardData[1] && <Card {...cardData[1]} offsetTop="mt-10 sm:mt-15 md:mt-20" cardSize="desktop" />}
                </div>
                {cardData[2] && <Card {...cardData[2]} offsetTop="mt-0" cardSize="desktop" />}
                {cardData[3] && <Card {...cardData[3]} offsetTop="mt-20 sm:mt-30 md:mt-40" cardSize="desktop" />}
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
