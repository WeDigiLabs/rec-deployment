import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';

interface TimetableLink {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  fileType?: string;
}

interface ExamSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  badges: Array<{
    text: string;
    variant: 'new' | 'ug' | 'pg' | 'special';
  }>;
  links: TimetableLink[];
}

interface TimetableComponentProps {
  examSections?: ExamSection[];
  showInfoAlert?: boolean;
  infoAlertContent?: string;
}

const TimetableComponent: React.FC<TimetableComponentProps> = ({
  examSections = [],
  showInfoAlert = false,
  infoAlertContent = '',
}) => {
  const getBadgeStyles = (variant: string) => {
    const baseStyles =
      'inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium';
    switch (variant) {
      case 'new':
        return `${baseStyles} bg-amber-100 text-amber-800`;
      case 'ug':
        return `${baseStyles} bg-purple-100 text-[#6A1B9A]`;
      case 'pg':
        return `${baseStyles} bg-purple-100 text-purple-700`;
      case 'special':
        return `${baseStyles} bg-red-100 text-red-600`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {showInfoAlert && infoAlertContent && (
        <div className="bg-blue-50 border-l-4 border-[#6A1B9A] p-3 sm:p-4 rounded-lg">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="ml-3 text-sm text-blue-700">{infoAlertContent}</p>
          </div>
        </div>
      )}

      {examSections.length > 0 ? (
        <div className="space-y-6">
          {examSections.map((section) => (
            <div
              key={section.id}
              className="sm:bg-white sm:rounded-xl sm:border sm:border-gray-200 sm:shadow-sm"
            >
              {/* Header */}
              <div className="p-4 sm:p-6 sm:border-b sm:border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  {/* Title + Icon */}
                  <div className="flex items-center gap-2 mb-2 sm:mb-0">
                    <span className="hidden sm:inline text-[#6A1B9A]">{section.icon}</span>
                    <h3 className="text-base sm:text-xl font-semibold text-gray-900">
                      {section.title}
                    </h3>
                  </div>
                  <div className="mt-2 w-20 h-1 rounded sm:hidden" style={{ backgroundColor: '#6A1B9A' }}></div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 justify-end">
                    {section.badges.map((badge, i) => (
                      <span key={i} className={getBadgeStyles(badge.variant)}>
                        {badge.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="grid gap-3 p-4 sm:p-6">
                {section.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#f9f9f9] rounded-lg p-4 group transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-30 hover:backdrop-blur-md hover:shadow-md"
                  >
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      {/* Icon */}
                      {link.icon && (
                        <span className="hidden sm:inline text-[#6A1B9A]">
                          {link.icon}
                        </span>
                      )}
                      <div className="flex flex-col">
                        <div className="font-semibold text-sm sm:text-base group-hover:text-[#6A1B9A]">
                          {link.title}
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-[#6A1B9A]/80">
                          {link.subtitle}
                        </div>
                      </div>
                    </div>

                    {/* File type and external link */}
                    <div className="flex items-center gap-2 top-2 self-end sm:self-auto">
                      {link.fileType && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded group-hover:bg-[#6A1B9A]/20 group-hover:text-[#6A1B9A]">
                          {link.fileType}
                        </span>
                      )}
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#6A1B9A]" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-600 mb-2">
            No Timetables Available
          </h3>
          <p className="text-sm sm:text-base text-gray-500">
            No exam schedules are currently available to display.
          </p>
        </div>
      )}
    </div>
  );
};

export default TimetableComponent;
