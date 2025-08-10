import React from 'react';
import Image from "next/image";
import { Source } from '../../types/chat';
import { SourcesList } from './SourcesList';
import { MarkdownRenderer } from './MarkdownRenderer';

// Shared Mascot Component
interface MascotProps {
  size: 'small' | 'large';
  className?: string;
}

const Mascot: React.FC<MascotProps> = ({ size, className = "" }) => {
  const dimensions = size === 'small' ? { width: 80, height: 80, classes: "w-20 h-20" } 
                                      : { width: 96, height: 96, classes: "w-24 h-24" };
  
  return (
    <Image
      src="/assets/mascot.png"
      alt="mascot"
      width={dimensions.width}
      height={dimensions.height}
      className={`${dimensions.classes} rounded-full border-4 border-purple-400 shadow-lg ${className}`}
    />
  );
};

interface ApiAnswerContentProps {
  question: string;
  answer: string;
  sources?: Source[];
  isMobile: boolean;
  isLoading?: boolean;
}

export const ApiAnswerContent: React.FC<ApiAnswerContentProps> = ({ 
  question, 
  answer, 
  sources = [], 
  isMobile,
  isLoading = false 
}) => {
  if (isMobile) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-4 sm:mt-6 text-[#22282B] px-4 sm:px-6 py-4">
        <h2 className="text-xl sm:text-2xl font-bold border-b border-gray-600 pb-2 mb-3 break-words">
          {question}
        </h2>
        <div className="text-sm sm:text-base leading-[20px]">
          {isLoading ? (
            <div className="flex items-center gap-2 py-4">
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-purple-600"></div>
              <span className="text-purple-600 text-sm sm:text-base">Getting answer from REC AI...</span>
            </div>
          ) : (
            <>
              <MarkdownRenderer 
                content={answer} 
                className="text-sm sm:text-base leading-[20px]"
              />
              <SourcesList sources={sources} className="mt-3 sm:mt-4" />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto text-[#22282B] px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start">
      {/* Desktop layout - responsive */}
      <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6 w-full max-w-6xl">
        <div className="flex-shrink-0 hidden lg:block">
          <Mascot size="small" className="z-0" />
        </div>
        <div className="flex-1 w-full">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold border-b border-gray-600 pb-2 mb-4 break-words">
            {question}
          </h2>
          <div className="text-base sm:text-lg leading-relaxed">
            {isLoading ? (
              <div className="flex items-center gap-3 py-6">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-purple-600"></div>
                <span className="text-purple-600 text-sm sm:text-base">Getting answer from REC AI...</span>
              </div>
            ) : (
              <>
                <MarkdownRenderer 
                  content={answer} 
                  className="text-base sm:text-lg leading-relaxed"
                />
                <SourcesList sources={sources} className="mt-4 sm:mt-6" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
