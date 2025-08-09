"use client";

import React, { useState } from 'react';

export interface ListingItem {
  id: string | number;
  title: string;
  description?: string;
  buttonText?: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export interface VerticalListingProps {
  title: string;
  items: ListingItem[];
  className?: string;
  selectedItemId?: string | number;
  onItemSelect?: (itemId: string | number) => void;
}

const VerticalListing: React.FC<VerticalListingProps> = ({
  title,
  items,
  className = '',
  selectedItemId,
  onItemSelect,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string | number | null>(null);

  const handleItemClick = (item: ListingItem) => {
    const itemId = item.id;
    
    // Update internal state
    setInternalSelectedId(itemId);
    
    // Call external handler if provided
    if (onItemSelect) {
      onItemSelect(itemId);
    }
    
    // Call item's onClick if provided
    if (item.onClick) {
      item.onClick();
    }
  };
  const isSelected = (itemId: string | number) => {
    // Use external selectedItemId if provided, otherwise use internal state
    const currentSelectedId = selectedItemId !== undefined ? selectedItemId : internalSelectedId;
    return currentSelectedId === itemId;
  };
  return (
    <div className={`flex flex-col items-center ${className} max-w-xs mx-auto`}>
      <div className="flex flex-col items-center w-full">
        {/* Title */}
        <div className="px-6 py-3 rounded-2xl font-bold text-base md:text-lg bg-[#6A1B9A] text-white mb-1 w-full text-center">
          {title}
        </div>
        
        <div className="bg-[#D9D9D9] rounded-2xl p-2 w-full">
          {/* Listing Items */}
          <div className="space-y-3 flex flex-col items-start w-full">
        {items.map((item) => (
          <div
            key={item.id}
            className="group w-full flex justify-start"
          >
            {/* Selectable Button */}
            <button
              onClick={() => handleItemClick(item)}
              className={`
                w-full px-4 py-2 rounded-2xl font-medium text-sm md:text-base
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-[#6A1B9A]/50 focus:ring-offset-2
                transform hover:scale-[1.02] active:scale-[0.98]                ${
                  isSelected(item.id)
                    ? 'bg-white text-black hover:bg-gray-50'
                    : 'bg-transparent text-black hover:bg-black/5'
                }
                text-left flex items-center gap-2
              `}
            >
              {/* Render icon if provided */}
              {item.icon && (
                <span className="inline-flex items-center justify-center h-6 w-6">
                  {item.icon}
                </span>
              )}
              {item.buttonText || 'Select'}
            </button>
          </div>        ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-8">
            <p className="text-foreground/50 text-sm md:text-base">
              No items available
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default VerticalListing;
