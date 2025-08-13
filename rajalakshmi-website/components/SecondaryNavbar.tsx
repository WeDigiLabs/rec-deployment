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
        hidden md:flex absolute top-0 right-5
        justify-around gap-2
        z-50 font-monrope
        transition-all duration-300 ease-in-out
        py-2 px-1.5 text-sm
        lg:py-2 lg:px-2 lg:text-sm
        md:py-1.5 md:px-1 md:text-xs
      "
    >
      {links.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="
            relative text-gray-700 hover:text-[#B756F2] font-normal px-2 group overflow-visible
            transition-all duration-300 ease-out text-sm
          "
        >
          <span className="relative z-10 group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-500 ease-out">
            {item.label}
          </span>
          <span className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <span
              className="absolute w-[180%] h-[180%] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"
              style={{
                filter: "blur(15px)", 
                background:
                  "radial-gradient(circle, rgba(183,86,242,0.15) 0%, rgba(183,86,242,0.1) 40%, transparent 70%)",
                zIndex: "-1",
                transform: "scale(1.05)", 
              }}
            ></span>
          </span>
        </Link>
      ))}
    </div>
  );
};

export default SecondaryNavbar;

