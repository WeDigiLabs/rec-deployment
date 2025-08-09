import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchFromApi } from "@/lib/api";

interface LinkItem {
  createdAt: string;
  updatedAt: string;
  label: string;
  href: string;
  isActive: boolean;
  order: number;
  id: string;
}

interface ApiResponse {
  docs: LinkItem[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: null;
  nextPage: null;
}

const SecondaryNavbar = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data: ApiResponse = await fetchFromApi('/api/secondary-nav');
        
        if (data.docs && data.docs.length > 0) {
          // Filter active links and sort by order
          const activeLinks = data.docs
            .filter(link => link.isActive)
            .sort((a, b) => a.order - b.order);
          setLinks(activeLinks);
        }
      } catch (error) {
        console.error('Failed to fetch secondary nav links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  if (loading) {
    return null; // or a loading skeleton
  }

  return (
    <div
      className="
        hidden md:flex absolute top-0 right-5 bg-[#B756F2]
        rounded-b-lg justify-around
        z-50 font-monrope
        transition-all duration-300 ease-in-out
        py-3 px-2 text-base
        lg:py-3 lg:px-2 lg:text-base
        md:py-2 md:px-1 md:text-sm
      "
    >
      {links.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="
            relative text-white font-medium px-4 group overflow-visible
            transition-all duration-500 ease-out
          "
        >
          <span className="relative z-10 group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-500 ease-out">
            {item.label}
          </span>
          <span className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <span
              className="absolute w-[180%] h-[180%] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"
              style={{
                filter: "blur(40px)", 
                background:
                  "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 40%, rgba(183,86,242,0.7) 70%, transparent 100%)",
                zIndex: "-1",
                mixBlendMode: "screen",
                transform: "scale(1.2)", 
              }}
            ></span>
          </span>
        </Link>
      ))}
    </div>
  );
};

export default SecondaryNavbar;

