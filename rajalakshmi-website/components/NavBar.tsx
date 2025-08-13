"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from "next/navigation";

export interface NavBarProps {
  items: ({ label: string | React.ReactElement; href?: string; onClick?: () => void; dropdown?: { label: string; href?: string; onClick?: () => void }[]; className?: string })[];
  className?: string;
  defaultActiveIndex?: number;
  moreItemsCount?: number;
}

const NavBar: React.FC<NavBarProps> = ({
  items,
  className = '',
  defaultActiveIndex = 0,
  moreItemsCount = 8,
}) => {
  const router = useRouter();
  const [pathname, setPathname] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [openMobileDropdownIndex, setOpenMobileDropdownIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: '0px', width: '0px' });
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  const desktopItems = items.slice(0, moreItemsCount);
  const moreItems = items.slice(moreItemsCount);
  const hasMoreItems = moreItems.length > 0;

  useEffect(() => {
    setMounted(true);
    setPathname(window.location.pathname);
  }, []);

  const isPathActive = useCallback((href: string | undefined): boolean => {
    if (!href || !mounted) return false;
    
    if (pathname === href) return true;
    
    if (href === "/department" && pathname.startsWith("/departments/")) {
      return true;
    }
    
    // For other sections, check if current path starts with the href
    if (href !== "/" && pathname.startsWith(href)) {
      return true;
    }
    
    return false;
  }, [pathname, mounted]);

  // Function to find the active index based on current pathname
  const findActiveIndex = useCallback((): number => {
    if (!mounted) return defaultActiveIndex;
    
    // Check regular items first
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (isPathActive(item.href)) {
        return i;
      }
      
      // Check dropdown items
      if (item.dropdown) {
        for (const subItem of item.dropdown) {
          if (isPathActive(subItem.href)) {
            return i;
          }
        }
      }
    }
    
    return defaultActiveIndex;
  }, [mounted, defaultActiveIndex, items, isPathActive]);

  // Update indicator position when active index changes
  const updateIndicatorPosition = (index: number) => {
    if (!navRef.current || !itemRefs.current[index]) return;
    
    const navRect = navRef.current.getBoundingClientRect();
    const itemRect = itemRefs.current[index]?.getBoundingClientRect();
    
    if (itemRect) {
      const left = itemRect.left - navRect.left;
      const width = itemRect.width;
      
      setIndicatorStyle({
        left: `${left}px`,
        width: `${width}px`
      });
    }
  };

  // Update active index when pathname changes
  useEffect(() => {
    if (mounted) {
      const newActiveIndex = findActiveIndex();
      setActiveIndex(newActiveIndex);
      // Make navbar visible after active state is set
      setIsVisible(true);
      
      // Update indicator position after a short delay to ensure DOM is ready
      setTimeout(() => {
        updateIndicatorPosition(newActiveIndex);
      }, 50);
    }
  }, [pathname, mounted, findActiveIndex]);

  // Update indicator position when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (mounted) {
        updateIndicatorPosition(activeIndex);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex, mounted]);

  const handleItemClick = (index: number, item: { label: string | React.ReactElement; href?: string; onClick?: () => void; dropdown?: { label: string; href?: string; onClick?: () => void }[] }) => {
    if (!item.dropdown) {
      setActiveIndex(index);
      updateIndicatorPosition(index);
    }
    setIsMobileMenuOpen(false); 
    if (item.onClick) {
      item.onClick();
    }
    if (item.href) {
      router.push(item.href);
    }
  };

  const handleDropdownItemClick = (parentIndex: number, subItem: { label: string; href?: string; onClick?: () => void }) => {
    setActiveIndex(parentIndex);
    updateIndicatorPosition(parentIndex);
    setHoveredIndex(null);
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    if (subItem.onClick) {
      subItem.onClick();
    } else if (subItem.href) {
      window.location.href = subItem.href;
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-nav-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const baseClasses = 'bg-[#6A1B9A] rounded-3xl p-2 shadow-lg relative';
  const itemBaseClasses = 'px-4 py-2 rounded-2xl font-medium transition-all duration-300 ease-in-out cursor-pointer text-center relative z-10';
  const itemInactiveClasses = 'text-white hover:bg-[#FFFFFF] hover:text-[#6A1B9A]';
  const itemActiveClasses = 'text-[#6A1B9A]';

  return (
    <div className={`mobile-nav-container transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <nav className={`${baseClasses} ${className} hidden md:flex w-full max-w-full relative z-40`} ref={navRef}>
        {mounted && (
          <div 
            className="absolute top-2 bottom-2 bg-[#FFFFFF] rounded-2xl transition-all duration-500 ease-in-out z-0"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
          />
        )}
        
        <div className="flex flex-nowrap gap-1 justify-center items-center w-full relative z-10">
          {desktopItems.map((item, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 z-50"
              onMouseEnter={() => {
                if (dropdownTimeout) {
                  clearTimeout(dropdownTimeout);
                  setDropdownTimeout(null);
                }
                setHoveredIndex(index);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => {
                  setHoveredIndex(null);
                }, 150);
                setDropdownTimeout(timeout);
              }}
            >
              <button
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className={`${itemBaseClasses} ${
                  activeIndex === index ? itemActiveClasses : itemInactiveClasses
                } ${item.className ? item.className : ''} text-xs px-3 py-2 whitespace-nowrap min-w-0`}
                onClick={() => !item.dropdown && handleItemClick(index, item)}
                type="button"
                tabIndex={0}
                aria-haspopup={!!item.dropdown}
                aria-expanded={hoveredIndex === index}
                disabled={!!item.dropdown}
              >
                {item.label}
              </button>
              {item.dropdown && hoveredIndex === index && (
                <div 
                  className="absolute left-0 top-full mt-1 w-auto min-w-[12rem] bg-white rounded-xl shadow-lg z-[9999] p-2 transition-all duration-200 ease-in-out"
                  onMouseEnter={() => {
                    if (dropdownTimeout) {
                      clearTimeout(dropdownTimeout);
                      setDropdownTimeout(null);
                    }
                    setHoveredIndex(index);
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => {
                      setHoveredIndex(null);
                    }, 150);
                    setDropdownTimeout(timeout);
                  }}
                >
                  {item.dropdown.map((sub, subIdx) => (
                    <button
                      key={subIdx}
                      onClick={() => handleDropdownItemClick(index, sub)}
                      className={`block w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ease-in-out my-1 text-sm whitespace-nowrap ${
                        isPathActive(sub.href)
                          ? 'bg-[#F3E8FF] text-[#5A1582]'
                          : 'text-[#6A1B9A] hover:bg-[#F3E8FF] hover:text-[#5A1582]'
                      }`}
                      type="button"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {hasMoreItems && (
            <div
              className="relative flex-shrink-0 z-50"
              onMouseEnter={() => {
                if (dropdownTimeout) {
                  clearTimeout(dropdownTimeout);
                  setDropdownTimeout(null);
                }
                setHoveredIndex(999);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => {
                  setHoveredIndex(null);
                }, 150);
                setDropdownTimeout(timeout);
              }}
            >
              <button
                ref={(el) => {
                  itemRefs.current[desktopItems.length] = el;
                }}
                className={`${itemBaseClasses} ${itemInactiveClasses} text-xs px-2 py-2 whitespace-nowrap`}
              >
                More
              </button>
              {hoveredIndex === 999 && (
                <div 
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg z-[9999] p-2 transition-all duration-200 ease-in-out"
                  onMouseEnter={() => {
                    if (dropdownTimeout) {
                      clearTimeout(dropdownTimeout);
                      setDropdownTimeout(null);
                    }
                    setHoveredIndex(999);
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => {
                      setHoveredIndex(null);
                    }, 150);
                    setDropdownTimeout(timeout);
                  }}
                >
                  {moreItems.map((item, moreIndex) => (
                    <button
                      key={moreIndex}
                      onClick={() => handleItemClick(desktopItems.length + moreIndex, item)}
                      className={`block w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ease-in-out my-1 whitespace-normal ${
                        activeIndex === (desktopItems.length + moreIndex)
                          ? 'bg-[#F3E8FF] text-[#5A1582]'
                          : 'text-[#6A1B9A] hover:bg-[#F3E8FF] hover:text-[#5A1582]'
                      }`}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      <div className="md:hidden">
        <button
          className="bg-[#6A1B9A] rounded-3xl p-3 shadow-lg text-white hover:bg-[#5A1582] transition-all duration-300 ease-in-out"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className={`w-full h-0.5 bg-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-full h-0.5 bg-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-full h-0.5 bg-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </div>
        </button>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-in-out">
            <div 
              className={`fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-[#6A1B9A] shadow-2xl transform transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
              } overflow-y-auto max-h-screen`}
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:bg-white/10 rounded-full p-2 transition-all duration-200 ease-in-out"
                  aria-label="Close navigation menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="px-6 pb-6">
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="relative">
                      <button
                        className={`w-full text-left px-4 py-3 rounded-2xl font-medium transition-all duration-300 ease-in-out ${
                          activeIndex === index 
                            ? 'bg-[#FFFFFF] text-[#6A1B9A]' 
                            : 'text-white hover:bg-[#FFFFFF] hover:text-[#6A1B9A]'
                        } ${item.className ? item.className : ''}`}
                        onClick={() => {
                          if (item.dropdown) {
                            setOpenMobileDropdownIndex(openMobileDropdownIndex === index ? null : index);
                          } else {
                            handleItemClick(index, item);
                            setOpenMobileDropdownIndex(null);
                          }
                        }}
                        type="button"
                        tabIndex={0}
                        aria-haspopup={!!item.dropdown}
                        aria-expanded={openMobileDropdownIndex === index}
                      >
                        {item.label}
                      </button>
                      {item.dropdown && openMobileDropdownIndex === index && (
                        <div className="ml-4 mt-1 bg-[#6A1B9A] rounded-xl z-50 py-2 transition-all duration-200 ease-in-out">
                          {item.dropdown.map((sub, subIdx) => (
                            <button
                              key={subIdx}
                              onClick={() => {
                                handleDropdownItemClick(index, sub);
                                setIsMobileMenuOpen(false);
                                setOpenMobileDropdownIndex(null);
                              }}
                              className={`block w-full text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ease-in-out text-sm whitespace-normal break-words ${
                                isPathActive(sub.href)
                                  ? 'bg-[#58157d] text-white'
                                  : 'text-white hover:bg-[#58157d] hover:text-white'
                              }`}
                              type="button"
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
