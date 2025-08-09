"use client";
import React from 'react';
import Image from 'next/image';

export interface BlogCardProps {
  tag: string;
  tagColor?: string;
  coverImage: string;
  coverImageAlt: string;
  title: string;
  description: string;
  maxDescriptionLength?: number;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  tag,
  tagColor = "bg-foreground text-background",
  coverImage,
  coverImageAlt,
  title,
  description,
  maxDescriptionLength = 120,
  href,
  onClick,
  className = "",
}) => {

  const truncatedDescription = description.length > maxDescriptionLength 
    ? `${description.substring(0, maxDescriptionLength)}...` : description;  
    const CardContent = () => (
    <div className={`bg-background border border-foreground/20 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-80 sm:h-96 flex flex-col ${className}`}>      {/* Image Container with Tag Badge */}
      <div className="relative flex-shrink-0">
        <div className="aspect-video relative overflow-hidden h-36 sm:h-48">
          <Image
            src={coverImage}
            alt={coverImageAlt}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>{" "}
        {/* Tag Badge - Top Left */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <span
            className={`px-2 py-1 sm:px-3 text-xs font-semibold rounded-full ${tagColor}`}
          >
            {tag}
          </span>
        </div>
      </div>{" "}
      {/* Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col min-h-0">
        {/* Title */}
        <div className="mb-2 sm:mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-2 hover:text-foreground/80 transition-colors leading-tight">
            {title}
          </h3>
        </div>

        {/* Description */}
        <div className="flex-1 overflow-hidden">
          <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed line-clamp-3">
            {truncatedDescription}
          </p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block hover:no-underline">
        <CardContent />
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="block w-full text-left hover:no-underline"
      >
        <CardContent />
      </button>
    );
  }

  return <CardContent />;
};

export default BlogCard;
