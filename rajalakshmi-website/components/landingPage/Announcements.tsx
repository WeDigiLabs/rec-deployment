"use client";

import React, { useState, useRef, useEffect } from "react";
import { getImageUrl } from "@/lib/api";

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
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // const doubledAnnouncements = [...announcements, ...announcements]; // duplicate for infinite loop

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
    <div className="w-full min-h-screen relative overflow-hidden bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Loading State */}
        {isVideoLoading && (
          <div className="absolute inset-0 z-10 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-[#6A1B9A] border-t-transparent"></div>
              <p className="text-base text-white/90 font-medium">Loading video...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {videoError && (
          <div className="absolute inset-0 z-10 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg text-center max-w-sm mx-4">
              <p className="text-white/90 text-lg font-medium mb-3">Video unavailable</p>
              <button 
                onClick={() => {
                  setVideoError(false);
                  setIsVideoLoading(true);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
                className="px-4 py-2 bg-[#6A1B9A] text-white rounded-md hover:bg-[#4a148c] transition-colors duration-200"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          className={`w-full h-screen md:h-auto md:min-h-screen object-cover transition-all duration-700 ${
            isVideoLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={getImageUrl('/api/media/file/rec_admissionsOpen.mp4')} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Optional Overlay for better text contrast if needed */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Announcements;
