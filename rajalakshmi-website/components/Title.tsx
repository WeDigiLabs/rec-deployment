import Image from "next/image";
import React from "react";
import Breadcrumb, { BreadcrumbItem } from "./Breadcrumb";

interface TitleProps {
  title: string;
  badgeSrc: string;
  subtitle?: string;
  breadcrumb?: boolean | string | React.ReactNode | BreadcrumbItem[];
}

const Title: React.FC<TitleProps> = ({ title, badgeSrc, subtitle, breadcrumb }) => {
  // Ensure title is a string to prevent errors
  const safeTitle = title || "Department";
  
  // Determine if the title is long
  const isLongTitle = safeTitle.length > 28;
  const titleClass = isLongTitle
    ? "text-2xl md:text-4xl"
    : "";

  let breadcrumbContent: React.ReactNode = null;
  if (breadcrumb === true) {
    breadcrumbContent = (
      <>
        <span>Department &gt; </span>
        <span className="font-semibold">{safeTitle}</span>
      </>
    );
  } else if (Array.isArray(breadcrumb)) {
    breadcrumbContent = <Breadcrumb items={breadcrumb} className="mt-2" />;
  } else if (typeof breadcrumb === "string") {
    breadcrumbContent = <span>{breadcrumb}</span>;
  } else if (breadcrumb && typeof breadcrumb !== "boolean") {
    breadcrumbContent = breadcrumb;
  }

  return (
    <div
      id="dept-banner"
      className="relative w-full pt-4 pb-2 mb-2 px-3 md:px-4 md:pt-8 md:pb-4 flex flex-col md:items-center md:justify-center"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col md:items-center md:justify-center">
        {/* Mobile: Row layout for banner */}
        <div className="flex flex-row items-center w-full max-w-full md:hidden overflow-hidden px-0 py-2 gap-x-2">
          <div className="flex flex-col flex-1 min-w-0 ml-2">
            <div className="flex items-center mb-1 min-w-0">
              <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2"></span>
              <span className="text-xs text-black opacity-70 font-semibold whitespace-nowrap overflow-hidden text-ellipsis min-w-0 truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Top Engineering University in India
              </span>
            </div>
            <span className={`block leading-tight font-bold min-w-0 whitespace-normal break-words ${titleClass}`} style={{ color: '#6A1B9A', fontFamily: 'Montserrat, sans-serif', letterSpacing: '-0.02em' }}>
              {safeTitle}
            </span>
            {subtitle && (
              <span className="block text-sm text-gray-600 mt-1 min-w-0 whitespace-normal break-words" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {subtitle}
              </span>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="w-12 h-12 flex items-center justify-center">
              <Image src={badgeSrc} alt="ARIIA Badge" width={28} height={28} className="w-12 h-12 object-contain" />
            </div>
          </div>
        </div>
        {/* Desktop: Original layout */}
        <div className="hidden md:flex relative w-full flex-col items-center">
          {/* Decorative Star Left */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <Image src="/assets/icons/Star.svg" alt="Decorative Star" width={40} height={40} />
          </div>
          {/* Decorative Star Right */}
          <div className="absolute top-[100px] right-[20px]">
            <Image src="/assets/icons/Star.svg" alt="Decorative Star" width={28} height={28} className="mt-2" />
          </div>
          {/* Badges Top Right */}
          <div className="absolute right-0 top-0 flex flex-col items-end gap-2">
            <Image src={badgeSrc} alt="ARIIA & NAAC Badge" width={152} height={152} className="w-[90px] h-[90px] object-contain" />
          </div>
          {/* Top Green Dot and Text */}
          <div className="flex items-center mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2"></span>
            <span className="text-xs md:text-sm text-black opacity-70 font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Top Engineering University in India
            </span>
          </div>
          {/* Main Title */}
          <h1
             className={`text-center font-bold ${titleClass}`}
             style={{
               fontFamily: 'Montserrat, sans-serif',
               fontWeight: 700,
               fontSize: isLongTitle ? undefined : '64px',
               lineHeight: 1.1,
               letterSpacing: '-0.03em',
               color: '#6A1B9A',
             }}
           >
             {safeTitle}
           </h1>
           {/* Subtitle */}
           {subtitle && (
             <p
               className="text-center mt-2 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
               style={{
                 fontFamily: 'Montserrat, sans-serif',
                 fontWeight: 400,
                 lineHeight: 1.4,
               }}
             >
               {subtitle}
             </p>
           )}
          {/* Breadcrumb */}
          {breadcrumbContent && (
            <div className="mt-2 text-[#222] opacity-70 text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {breadcrumbContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Title; 