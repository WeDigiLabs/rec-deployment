import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => (
  <div className={className}>
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      components={{
        // Bold text
        strong: ({ children, ...props }) => (
          <strong {...props} className="font-bold text-purple-700">{children}</strong>
        ),
        // Unordered lists
        ul: ({ children, ...props }) => (
          <ul {...props} className="list-disc list-inside space-y-1 my-3 pl-4">{children}</ul>
        ),
        // Ordered lists
        ol: ({ children, ...props }) => (
          <ol {...props} className="list-decimal list-inside space-y-1 my-3 pl-4">{children}</ol>
        ),
        // List items
        li: ({ children, ...props }) => (
          <li {...props} className="text-gray-800 leading-relaxed">{children}</li>
        ),
        // Paragraphs
        p: ({ children, ...props }) => (
          <p {...props} className="mb-3 leading-relaxed">{children}</p>
        ),
        // Headers
        h1: ({ children, ...props }) => (
          <h1 {...props} className="text-2xl font-bold text-purple-800 mb-3 mt-4">{children}</h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 {...props} className="text-xl font-bold text-purple-700 mb-2 mt-3">{children}</h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 {...props} className="text-lg font-semibold text-purple-600 mb-2 mt-3">{children}</h3>
        ),
        // Code blocks
        code: ({ children, className, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return <code {...props} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>;
          }
          return (
            <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto my-3">
              <code {...props} className="text-sm font-mono">{children}</code>
            </pre>
          );
        },
        // Blockquotes
        blockquote: ({ children, ...props }) => (
          <blockquote {...props} className="border-l-4 border-purple-400 pl-4 py-2 my-3 bg-purple-50 italic">
            {children}
          </blockquote>
        ),
        // Links
        a: ({ children, href, ...props }) => (
          <a 
            {...props}
            href={href} 
            className="text-purple-600 hover:text-purple-800 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);
