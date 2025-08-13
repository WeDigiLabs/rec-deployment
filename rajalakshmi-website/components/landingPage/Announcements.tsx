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
    <div className="w-full h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        {/* Loading State */}
        {isVideoLoading && (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6A1B9A]"></div>
              <p className="text-sm text-gray-600">Loading video...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {videoError && (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
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
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
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
      </div>
    </div>
  );
};

export default Announcements;
