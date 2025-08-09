"use client";
import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export interface BlogCard {
  tag: string;
  tagColor?: string;
  coverImage: string;
  coverImageAlt: string;
  title: string;
  description: string;
  href?: string;
}

interface QuickBlogSectionProps {
  title?: string;
  blogs: BlogCard[];
}

const QuickBlogSection: React.FC<QuickBlogSectionProps> = ({
  title = "Quick Blogs",
  blogs,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 464 : 600;
      scrollRef.current.scrollBy({
        left: dir === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full max-w-[110rem] mx-auto bg-[#FAFAFA] py-4 sm:py-6 md:py-8 lg:py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sm:mb-8 md:mb-10 px-4 sm:px-6 md:px-8 lg:px-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#22282B] leading-tight">
          {title}
        </h2>
        <div className="flex gap-3 sm:gap-4">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-lg sm:text-xl md:text-2xl rounded-full border-2 border-[#CED1D8] text-[#CED1D8] hover:bg-[#6A1B9A] hover:text-white hover:border-[#6A1B9A] transition-all duration-200 flex items-center justify-center"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-lg sm:text-xl md:text-2xl rounded-full border-2 border-[#CED1D8] text-[#CED1D8] hover:bg-[#6A1B9A] hover:text-white hover:border-[#6A1B9A] transition-all duration-200 flex items-center justify-center"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>

      {/* Scrollable Blog Cards */}
      <div ref={scrollRef} className="overflow-x-auto no-scrollbar pb-4 sm:pb-6 md:pb-8 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {blogs.map((blog, idx) => (
            <Link
              href={blog.href || "#"}
              key={idx}
              className="flex-shrink-0 w-[280px] h-[380px] sm:w-[320px] sm:h-[420px] md:w-[360px] md:h-[460px] lg:w-[400px] lg:h-[500px] xl:w-[440px] xl:h-[540px] 2xl:w-[480px] 2xl:h-[580px] bg-white border border-[#EDEDED] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Image Section */}
              <div className="p-4 sm:p-5 md:p-6 lg:p-7">
                {/* Tag above the image */}
                <div className="mb-3 sm:mb-4 md:mb-5">
                  <span
                    className={`inline-block px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base font-semibold rounded-full ${
                      blog.tagColor || "bg-[#6A1B9A] text-white"
                    }`}
                  >
                    {blog.tag}
                  </span>
                </div>
                
                {/* Image Container */}
                <div className="relative w-full h-[160px] sm:h-[180px] md:h-[200px] lg:h-[220px] xl:h-[240px] 2xl:h-[260px] rounded-xl sm:rounded-2xl overflow-hidden">
                  <Image
                    src={blog.coverImage}
                    alt={blog.coverImageAlt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="px-4 sm:px-5 md:px-6 lg:px-7 pb-4 sm:pb-5 md:pb-6 lg:pb-7 flex-1 flex flex-col">
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-bold text-[#22282B] mb-2 sm:mb-3 md:mb-4 leading-tight line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm sm:text-base md:text-base lg:text-lg text-gray-600 leading-relaxed line-clamp-3 sm:line-clamp-4 flex-1">
                  {blog.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickBlogSection;
