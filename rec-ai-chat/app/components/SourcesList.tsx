import React, { useState } from 'react';
import { Source } from '../../types/chat';

interface SourcesListProps {
  sources: Source[];
  className?: string;
}

export const SourcesList: React.FC<SourcesListProps> = ({
  sources,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (sources.length === 0) return null;

  return (
    <div className={`mt-3 ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-blue-600 hover:text-blue-800 underline mb-2 flex items-center gap-1"
      >
        <span>{isExpanded ? '📚 Hide' : '📚 Show'} Sources ({sources.length})</span>
      </button>
      
      {isExpanded && (
        <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-lg border">
          {sources.map((source, index) => (
            <div key={index} className="bg-white p-3 rounded-md text-xs border border-gray-200">
              <div className="font-semibold text-gray-800 mb-1">{source.title}</div>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">{source.department}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">{source.type}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Score: {source.score.toFixed(2)}</span>
              </div>
              {source.preview && (
                <div className="text-gray-700 mt-2 text-sm leading-relaxed">{source.preview}</div>
              )}
              {source.url && (
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline mt-2 block text-sm font-medium"
                >
                  View Source →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
