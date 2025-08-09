import React from 'react';
import Image from "next/image";
import { Source } from '../../types/chat';
import { SourcesList } from './SourcesList';

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
      <div className="w-full max-w-2xl mx-auto mt-6 text-[#22282B] px-6 py-4">
        <h2 className="text-2xl font-bold border-b border-gray-600 pb-2 mb-3">
          {question}
        </h2>
        <div className="text-base leading-[20px]">
          {isLoading ? (
            <div className="flex items-center gap-2 py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              <span className="text-purple-600">Getting answer from REC AI...</span>
            </div>
          ) : (
            <>
              <div className="whitespace-pre-wrap">
                {answer}
              </div>
              <SourcesList sources={sources} className="mt-4" />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto text-[#22282B] px-6 flex flex-col items-center justify-center">
      {/* Desktop layout - center aligned */}
      <div className="flex items-start gap-6 w-full max-w-4xl">
        <div className="flex-shrink-0">
          <Mascot size="small" className="z-0" />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl lg:text-4xl font-bold border-b border-gray-600 pb-2 mb-4">
            {question}
          </h2>
          <div className="text-lg leading-relaxed">
            {isLoading ? (
              <div className="flex items-center gap-3 py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="text-purple-600 text-base">Getting answer from REC AI...</span>
              </div>
            ) : (
              <>
                <div className="whitespace-pre-wrap">
                  {answer}
                </div>
                <SourcesList sources={sources} className="mt-6" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
