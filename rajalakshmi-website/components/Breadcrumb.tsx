import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  className = "",
  showHomeIcon = true 
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav 
      className={`flex items-center space-x-1 text-sm text-gray-600 ${className}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isFirst = index === 0;

        return (
          <React.Fragment key={index}>
            {isFirst && showHomeIcon ? (
              <Link
                href={item.href || "/"}
                className="flex items-center hover:text-purple-600 transition-colors duration-200"
                aria-label="Home"
              >
                <Home className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center">
                {item.href && !item.isCurrentPage ? (
                  <Link
                    href={item.href}
                    className="hover:text-purple-600 transition-colors duration-200 font-medium"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={`${item.isCurrentPage ? 'text-purple-900 font-semibold' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                )}
              </div>
            )}
            
            {!isLast && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb; 