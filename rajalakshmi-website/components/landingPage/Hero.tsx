import Image from "next/image";
import HeroButtons from "./HeroButtons";

export default function Hero() {
  return (
    <div className="absolute md:relative w-full flex flex-col items-center mt-2 sm:mt-3 md:mt-2 px-4 sm:px-6 md:px-8
                    top-10 sm:top-0 left-0 right-0 z-20 pt-2 sm:pt-6 md:pt-0">
             
      {/* Decorative Star - Top Left (Desktop from md) */}
      <div className="hidden lg:flex absolute left-[12%] top-[30%] xl:left-[15%] xl:top-[35%]">
        <Image
          src="/assets/icons/Star.svg"
          alt="Decorative Star"
          width={40}
          height={40}
          className="w-10 h-10"
        />
      </div>

      {/* Decorative Star - Top Right (Desktop from md) */}
      <div className="hidden lg:flex absolute right-[15%] top-[18%] xl:right-[18%] xl:top-[20%]">
        <Image
          src="/assets/icons/Star.svg"
          alt="Decorative Star"
          width={28}
          height={28}
          className="w-7 h-7"
        />
      </div>

      {/* ARIIA Badge */}
      <div className="absolute right-3 top-10 sm:right-4 sm:top-3 md:right-[6%] md:top-[5%] xl:right-[8%] xl:top-[6%] flex flex-col items-end gap-1 sm:gap-2">
        <Image
          src="/assets/icons/ariia.svg"
          alt="ARIIA & NAAC Badge"
          width={152}
          height={152}
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 xl:w-28 xl:h-28 object-contain"
        />
      </div>

      {/* Status Badge */}
      <div className="flex items-center mt-8 sm:mt-10 md:mt-0 mb-2 sm:mb-4">
        <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2"></span>
        <span className="text-xs md:text-base text-black opacity-70 font-semibold font-[Montserrat]">
          Top Science & Technology Institution in India
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="text-center text-xl sm:text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-[1.1] tracking-[-0.03em] text-[#6A1B9A] font-[Montserrat] px-2 sm:px-4">
        Engineer Your Future
      </h1>

      {/* Subtitle */}
      <span className="font-manrope mt-2 md:mt-4 w-full max-w-xs sm:max-w-lg md:max-w-lg xl:max-w-2xl text-xs sm:text-base md:text-base font-semibold text-center leading-[150%] tracking-normal sm:px-6 mb-10">
        From Classroom to Career, Excellence, Innovation & Connections for life
      </span>

      {/* Hero Buttons - Show from md upward */}
      <div className="absolute -bottom-5 hidden sm:flex">
        <HeroButtons />
      </div>
    </div>
  );
}
