"use client";

import React, { useState, useRef, useEffect } from "react";

export interface AnnouncementItem {
  title: string;
  description: string;
  links: { label: string; href: string }[];
}

interface AnnouncementsProps {
  heading: string;
  announcements: AnnouncementItem[];
}

const Announcements: React.FC<AnnouncementsProps> = ({
  heading,
  announcements,
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const doubledAnnouncements = [...announcements, ...announcements]; // duplicate for infinite loop

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      setIsVideoLoading(false);
    };

    const handleError = () => {
      setVideoError(true);
      setIsVideoLoading(false);
    };

    const handleLoadStart = () => {
      setIsVideoLoading(true);
      setVideoError(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, []);

  return (
    <div className="w-full py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
        {/* Video Section */}
        <div className="w-full lg:w-[60%] xl:w-[65%] mb-4 sm:mb-6 lg:mb-0 relative">
          {/* Loading State */}
          {isVideoLoading && (
            <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px] rounded-[12px] sm:rounded-[16px] md:rounded-[20px] lg:rounded-[24px] xl:rounded-[30px] bg-gray-200 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6A1B9A]"></div>
                <p className="text-sm text-gray-600">Loading video...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {videoError && (
            <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px] rounded-[12px] sm:rounded-[16px] md:rounded-[20px] lg:rounded-[24px] xl:rounded-[30px] bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Video unavailable</p>
                <button 
                  onClick={() => {
                    setVideoError(false);
                    setIsVideoLoading(true);
                    if (videoRef.current) {
                      videoRef.current.load();
                    }
                  }}
                  className="text-[#6A1B9A] text-sm underline hover:text-[#4a148c]"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Video Element */}
          <video
            ref={videoRef}
            className={`w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px] rounded-[12px] sm:rounded-[16px] md:rounded-[20px] lg:rounded-[24px] xl:rounded-[30px] object-cover transition-opacity duration-300 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/assets/landing-page/video-poster.jpg"
          >
            <source src="/assets/landing-page/rec_admissiosnsOpen.mp4" type="video/mp4" />
            <source src="/assets/landing-page/rec_admissionsOpen.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Announcements Vertical Slider */}
        <div className="flex flex-col justify-start items-center text-[#272727] w-full lg:w-[40%] xl:w-[35%] overflow-hidden relative">
          <h2 className="text-[clamp(1.5rem,4vw,2.375rem)] font-bold leading-[110%] tracking-[-1px] text-center capitalize font-[Montserrat] text-[#6A1B9A] mb-4 sm:mb-6 md:mb-8">
            {heading}
          </h2>

          <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] overflow-hidden relative group">
            <div
              className="flex flex-col animate-vertical-scroll"
              style={{
                animationDuration: `${doubledAnnouncements.length * 4}s`,
              }}
            >
              {doubledAnnouncements.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 text-center px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-5 lg:py-6"
                >
                  <strong className="block text-[clamp(0.875rem,2.5vw,1.25rem)] mb-1 sm:mb-2 font-semibold">
                    {item.title}
                  </strong>
                  <p className="leading-relaxed whitespace-pre-line text-[clamp(0.75rem,1.8vw,1rem)] mb-2 sm:mb-3">
                    {item.description}
                  </p>
                  <div className="text-[#6a1b9a] mt-1 sm:mt-2 space-y-1 text-[clamp(0.75rem,1.8vw,1rem)]">
                    {item.links.map((link, i) => (
                      <div key={i}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-[#4a148c] transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for infinite vertical scroll with pause on hover */}
      <style jsx>{`
        @keyframes vertical-scroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        .animate-vertical-scroll {
          animation-name: vertical-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-play-state: running;
        }
        .group:hover .animate-vertical-scroll {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Announcements;
