"use client";

import React from 'react';

interface YouTubeEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

// Function to extract YouTube video ID from various YouTube URL formats
export const extractYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

// Function to check if a URL is a YouTube URL
export const isYouTubeUrl = (url: string): boolean => {
  const youtubePatterns = [
    /(?:youtube\.com|youtu\.be)/i,
  ];

  return youtubePatterns.some(pattern => pattern.test(url));
};

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ 
  url, 
  title = "YouTube video player", 
  className = "" 
}) => {
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) {
    // Fallback to regular link if we can't extract video ID
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200 hover:no-underline hover:bg-blue-50 px-1 py-0.5 rounded"
      >
        {url}
      </a>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className={`relative w-full my-6 ${className}`}>
      <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
        <iframe
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default YouTubeEmbed;
