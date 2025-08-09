import React from "react";
import Image from "next/image";

interface ImageFrameProps {
  imageUrl: string;
  number: string | number;
  name: string;
  imageAlt?: string;
  className?: string;
}

/**
 * Renders a vertical rectangular image frame with a number at the top left and a name at the bottom right.
 */
const ImageFrame: React.FC<ImageFrameProps> = ({
  imageUrl,
  number,
  name,
  imageAlt = "Image",
  className = ""
}) => {
  return (
    <div
      className={`relative w-40 h-56 sm:w-48 sm:h-64 md:w-56 md:h-80 rounded-xl overflow-hidden shadow-lg bg-background border border-foreground/10 ${className}`}
      style={{ aspectRatio: "3/4", transform: "scale(1.20)" }}
    >
      {/* Image */}
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-cover opacity-80"
        loading="lazy"
      />
      {/* Number (bottom left) */}
      <span className="absolute bottom-2 left-2 text-white text-lg font-bold px-3 py-1 rounded-lg shadow">
        {number}
      </span>
      {/* Name (bottom right) */}
      <span className="absolute bottom-2 right-2 text-white text-base font-medium px-3 py-1 rounded-lg shadow">
        {name}
      </span>
    </div>
  );
};

export default ImageFrame;
