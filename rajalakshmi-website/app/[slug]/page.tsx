"use client";

import React, { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import { fetchFromApi, getImageUrl } from "@/lib/api";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { VerticalListing } from "@/components";
import LinkTable from "@/components/LinkTable";
import DynamicTable from "@/components/DynamicTable";
import Title from "@/components/Title"; // Import the Title component
import { normalizePageResponse } from "@/lib/unified-page-utils";
import YouTubeEmbed, { isYouTubeUrl } from "@/components/YouTubeEmbed";

interface RichTextChild {
  detail?: number;
  format?: number;
  mode?: string;
  style?: string;
  text?: string;
  type?: string;
  version?: number;
  children?: RichTextChild[];
  url?: string;
  fields?: { url?: string };
  id?: string;
  relationTo?: string;
  value?: {
    url?: string;
    alt?: string;
    width?: number;
    height?: number;
    filename?: string;
    mimeType?: string;
  };
}

interface RichTextNode {
  children?: RichTextChild[];
  direction?: string;
  format?: string;
  indent?: number;
  type?: string;
  version?: number;
  textFormat?: number;
  textStyle?: string;
  tag?: string;
  listType?: string;
  url?: string;
  fields?: { url?: string };
  id?: string;
  relationTo?: string;
  value?: {
    url?: string;
    alt?: string;
    width?: number;
    height?: number;
    filename?: string;
    mimeType?: string;
  };
}

interface RichTextContent {
  root?: {
    children?: RichTextNode[];
    direction?: string;
    format?: string;
    indent?: number;
    type?: string;
    version?: number;
  };
}

interface TableRow {
  id?: number;
  label: string;
  link: string;
  isExternal?: boolean;
}

interface DynamicTableColumn {
  key: string;
  label: string;
  width?: string;
}

interface DynamicTableRowCell {
  columnKey: string;
  value: string;
  isLink?: boolean;
  linkUrl?: string;
  isExternal?: boolean;
}

interface DynamicTableRow {
  rowData: DynamicTableRowCell[];
}

interface DynamicTableConfig {
  columns: DynamicTableColumn[];
  rows: DynamicTableRow[];
  variant?: "default" | "bordered" | "striped";
}

interface MultipleTableConfig {
  id: string;
  tableTitle: string;
  csvInput?: string;
  columns: DynamicTableColumn[];
  rows: DynamicTableRow[];
  variant?: "default" | "bordered" | "striped";
}

interface SectionImage {
  createdAt: string;
  updatedAt: string;
  alt?: string;
  uploadedBy?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  focalX?: number;
  focalY?: number;
  id: string;
  url?: string;
  thumbnailURL?: string | null;
}

interface GlobalSection {
  id: string;
  title: string;
  content: RichTextContent;
  contentType?:
    | "richText"
    | "table"
    | "dynamicTable"
    | "mixed"
    | "mixedDynamic"
    | "mixedMultipleTables";
  tableData?: TableRow[];
  dynamicTableConfig?: DynamicTableConfig;
  multipleTablesConfig?: MultipleTableConfig[];
  tableTitle?: string;
  order: number;
  isActive: boolean;
  image?: SectionImage;
}

interface HeroImage {
  id: string;
  alt?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  url?: string;
  thumbnailURL?: string;
}

interface GlobalPageData {
  id: string;
  createdAt: string;
  updatedAt: string;
  globalType: string;
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: HeroImage;
  sections: GlobalSection[];
  pageType?: "global" | "dynamic";
  source?: "globals" | "dynamic-pages";
}

// Rich text renderer component
const RichTextRenderer = ({ content }: { content: RichTextContent }) => {
  const renderChild = (
    child: RichTextChild,
    childIndex: number
  ): React.ReactNode => {
    if (!child) return null;

    // Handle link nodes (including autolink) - render as regular links
    if (child.type === "link" || child.type === "autolink" || child.url || child.fields?.url) {
      const href = child.url || child.fields?.url || "#";
      const linkText =
        child.children?.map((c: RichTextChild) => c.text).join("") || child.text || "Link";
      
      return (
        <a
          key={childIndex}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200 hover:no-underline hover:bg-blue-50 px-1 py-0.5 rounded"
        >
          {linkText}
        </a>
      );
    }

    // Handle linebreak nodes
    if (child.type === "linebreak") {
      return <br key={childIndex} />;
    }

    // Handle upload nodes (images)
    if (child.type === "upload" && child.value?.url) {
      return (
        <div key={childIndex} className="w-full flex justify-center my-6">
          <div className="relative w-full max-w-4xl">
            <Image
              src={getImageUrl(child.value.url)}
              alt={child.value.alt || "Content Image"}
              width={child.value.width || 800}
              height={child.value.height || 400}
              className="rounded-lg object-cover w-full h-auto min-h-[300px] max-h-[600px]"
              style={{ aspectRatio: `${child.value.width || 800}/${child.value.height || 400}` }}
              priority={false}
            />
          </div>
        </div>
      );
    }

    // Handle text nodes
    if (child.type === "text" || child.text) {
      let className = "";
      if (child.format === 1) className += "font-bold ";
      if (child.format === 2) className += "italic ";
      if (child.format === 4) className += "underline ";

      // Check if text contains URLs and convert them to links (but not YouTube embeds here)
      const text = child.text || "";
      // Enhanced URL regex to catch more URL patterns including file extensions
      const urlRegex = /(https?:\/\/[^\s<>"\[\]{}|\\^`]+(?:\.[a-zA-Z]{2,})?(?:\/[^\s<>"\[\]{}|\\^`]*)?)/g;
      const parts = text.split(urlRegex);
      
      if (parts.length > 1) {
        // Text contains URLs, render with links only (YouTube embeds handled at node level)
        const elements: React.ReactNode[] = [];
        
        parts.forEach((part, partIndex) => {
          if (urlRegex.test(part)) {
            // Clean up the URL (remove trailing punctuation)
            const cleanUrl = part.replace(/[.,;:!?]*$/, '');
            const isPdfLink = cleanUrl.toLowerCase().includes('.pdf');
            
            elements.push(
              <a
                key={partIndex}
                href={cleanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${isPdfLink 
                  ? 'text-red-600 hover:text-red-800' 
                  : 'text-blue-600 hover:text-blue-800'
                } underline font-medium transition-colors duration-200 hover:no-underline hover:bg-opacity-10 hover:bg-current px-1 py-0.5 rounded inline-flex items-center gap-1`}
                title={isPdfLink ? 'Download PDF' : 'Open link'}
              >
                {isPdfLink && (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
                {cleanUrl}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            );
          } else if (part) {
            // Regular text
            elements.push(
              <span key={partIndex} className={className.trim()}>
                {part}
              </span>
            );
          }
        });
        
        return elements;
      }

      return (
        <span key={childIndex} className={className.trim()}>
          {text}
        </span>
      );
    }

    // Handle nested children
    if (child.children) {
      return child.children.map((nestedChild, nestedIndex) =>
        renderChild(nestedChild, nestedIndex)
      );
    }

    return null;
  };

  const renderNode = (node: RichTextNode, index: number): React.ReactNode => {
    if (!node) return null;

    // Helper function to check if paragraph contains YouTube URLs
    const containsYouTubeUrl = (node: RichTextNode): boolean => {
      if (!node.children) return false;
      
      // Check for YouTube URLs in text content
      const fullText = node.children
        .map(child => child.text || "")
        .join("");
      
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const textUrls = fullText.match(urlRegex) || [];
      
      // Check for YouTube URLs in link nodes
      const linkUrls = node.children
        .filter(child => (child.type === "link" || child.type === "autolink" || child.url || child.fields?.url))
        .map(child => child.url || child.fields?.url || "")
        .filter(url => url);
      
      const allUrls = [...textUrls, ...linkUrls];
      
      return allUrls.some(url => isYouTubeUrl(url));
    };

    // Helper function to render paragraph with YouTube embeds
    const renderParagraphWithEmbeds = (node: RichTextNode, index: number) => {
      if (!node.children) return null;

      const elements: React.ReactNode[] = [];
      let hasYouTubeEmbeds = false;

      // Process each child to identify YouTube content
      node.children.forEach((child, childIndex) => {
        // Check if child is a YouTube link node
        if ((child.type === "link" || child.type === "autolink" || child.url || child.fields?.url)) {
          const href = child.url || child.fields?.url || "";
          if (isYouTubeUrl(href)) {
            hasYouTubeEmbeds = true;
            const linkText = child.children?.map((c: RichTextChild) => c.text).join("") || child.text || "YouTube video";
            elements.push(
              <YouTubeEmbed
                key={`youtube-link-${childIndex}`}
                url={href}
                title={linkText}
              />
            );
            return;
          }
        }

        // Check if child text contains YouTube URLs
        if (child.type === "text" || child.text) {
          const text = child.text || "";
          // Enhanced URL regex to catch more URL patterns
          const urlRegex = /(https?:\/\/[^\s<>"\[\]{}|\\^`]+(?:\.[a-zA-Z]{2,})?(?:\/[^\s<>"\[\]{}|\\^`]*)?)/g;
          const parts = text.split(urlRegex);
          
          if (parts.length > 1) {
            // Text contains URLs, check for YouTube
            parts.forEach((part, partIndex) => {
              if (urlRegex.test(part) && isYouTubeUrl(part)) {
                hasYouTubeEmbeds = true;
                elements.push(
                  <YouTubeEmbed
                    key={`youtube-text-${childIndex}-${partIndex}`}
                    url={part}
                    title="YouTube video"
                  />
                );
              } else if (part.trim()) {
                // Non-YouTube text part - let it be handled by regular text processing
                elements.push(
                  <span key={`text-${childIndex}-${partIndex}`} className="text-gray-700">
                    {part}
                  </span>
                );
              }
            });
            return;
          }
        }

        // Regular child (not YouTube related)
        elements.push(
          <span key={`child-${childIndex}`}>
            {renderChild(child, childIndex)}
          </span>
        );
      });

      if (!hasYouTubeEmbeds) {
        // No YouTube URLs found, render as normal paragraph
        return (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {node.children?.map(renderChild)}
          </p>
        );
      }

      // Has YouTube embeds, render as separate block elements
      const finalElements: React.ReactNode[] = [];
      let textBuffer: React.ReactNode[] = [];

      elements.forEach((element, elementIndex) => {
        if (React.isValidElement(element) && element.type === YouTubeEmbed) {
          // Flush any accumulated text as a paragraph
          if (textBuffer.length > 0) {
            finalElements.push(
              <p key={`para-${elementIndex}`} className="mb-4 text-gray-700 leading-relaxed">
                {textBuffer}
              </p>
            );
            textBuffer = [];
          }
          // Add the YouTube embed
          finalElements.push(element);
        } else {
          // Accumulate text elements
          textBuffer.push(element);
        }
      });

      // Flush any remaining text
      if (textBuffer.length > 0) {
        finalElements.push(
          <p key={`para-final`} className="mb-4 text-gray-700 leading-relaxed">
            {textBuffer}
          </p>
        );
      }

      return <div key={index}>{finalElements}</div>;
    };

    switch (node.type) {
      case "paragraph":
        // Check if paragraph contains YouTube URLs and handle accordingly
        if (containsYouTubeUrl(node)) {
          return renderParagraphWithEmbeds(node, index);
        }
        
        return (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {node.children?.map(renderChild)}
          </p>
        );

      case "heading":
        const headingLevel = node.tag || "h3";
        const headingText =
          node.children?.map((child) => child.text || "").join("") || "";

        switch (headingLevel) {
          case "h1":
            return (
              <h1
                key={index}
                className="text-3xl font-bold mb-4 text-purple-900"
              >
                {headingText}
              </h1>
            );
          case "h2":
            return (
              <h2
                key={index}
                className="text-2xl font-semibold mb-3 text-purple-900"
              >
                {headingText}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={index}
                className="text-xl font-semibold mb-3 text-purple-900"
              >
                {headingText}
              </h3>
            );
          case "h4":
            return (
              <h4
                key={index}
                className="text-lg font-semibold mb-2 text-purple-900"
              >
                {headingText}
              </h4>
            );
          case "h5":
            return (
              <h5
                key={index}
                className="text-base font-semibold mb-2 text-purple-900"
              >
                {headingText}
              </h5>
            );
          case "h6":
            return (
              <h6
                key={index}
                className="text-sm font-semibold mb-2 text-purple-900"
              >
                {headingText}
              </h6>
            );
          default:
            return (
              <h3
                key={index}
                className="text-xl font-semibold mb-3 text-purple-900"
              >
                {headingText}
              </h3>
            );
        }

      case "list":
        const listType = node.listType || "bullet";
        if (listType === "number") {
          return (
            <ol key={index} className="list-decimal pl-6 mb-4 space-y-2">
              {node.children?.map((child, childIndex) => (
                <li key={childIndex} className="text-gray-700">
                  {child.children?.map((nestedChild, nestedIndex) =>
                    renderChild(nestedChild, nestedIndex)
                  )}
                </li>
              ))}
            </ol>
          );
        } else {
          return (
            <ul key={index} className="list-disc pl-6 mb-4 space-y-2">
              {node.children?.map((child, childIndex) => (
                <li key={childIndex} className="text-gray-700">
                  {child.children?.map((nestedChild, nestedIndex) =>
                    renderChild(nestedChild, nestedIndex)
                  )}
                </li>
              ))}
            </ul>
          );
        }

      case "listitem":
        return (
          <li key={index} className="text-gray-700">
            {node.children?.map((child, childIndex) =>
              renderChild(child, childIndex)
            )}
          </li>
        );

      case "quote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-purple-300 pl-4 py-2 mb-4 italic text-gray-600 bg-purple-50"
          >
            {node.children?.map((child, childIndex) =>
              renderChild(child, childIndex)
            )}
          </blockquote>
        );

      case "upload":
        if (node.value?.url) {
          return (
            <div key={index} className="w-full flex justify-center my-6">
              <div className="relative w-full max-w-4xl">
                <Image
                  src={getImageUrl(node.value.url)}
                  alt={node.value.alt || "Content Image"}
                  width={node.value.width || 800}
                  height={node.value.height || 400}
                  className="rounded-lg object-cover w-full h-auto min-h-[300px] max-h-[600px]"
                  style={{ aspectRatio: `${node.value.width || 800}/${node.value.height || 400}` }}
                  priority={false}
                />
              </div>
            </div>
          );
        }
        return null;

      case "link":
      case "autolink":
        const href = node.url || node.fields?.url || "#";
        const linkText =
          node.children?.map((child) => child.text || "").join("") || "Link";
        
        // Check if it's a YouTube URL and render as embed
        if (isYouTubeUrl(href)) {
          return (
            <YouTubeEmbed
              key={index}
              url={href}
              title={linkText}
            />
          );
        }
        
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200 hover:no-underline hover:bg-blue-50 px-1 py-0.5 rounded"
          >
            {linkText}
          </a>
        );

      case "root":
        return (
          <div key={index}>
            {node.children?.map((child, childIndex) =>
              renderNode(child as RichTextNode, childIndex)
            )}
          </div>
        );

      default:
        if (node.children) {
          return (
            <div key={index} className="mb-2 text-gray-700">
              {node.children.map((child, childIndex) =>
                renderChild(child, childIndex)
              )}
            </div>
          );
        }
        return null;
    }
  };

  if (!content?.root?.children) {
    return <p className="text-gray-500 italic">No content available</p>;
  }

  return (
    <div className="prose max-w-none">
      {content.root.children.map((node, index) => renderNode(node, index))}
    </div>
  );
};

// Component for section images
const SectionImageComponent = ({ 
  image, 
  position = "top" 
}: { 
  image: SectionImage; 
  position?: "top" | "bottom" | "left" | "right";
}) => {
  const imageElement = (
    <div className={`
      ${position === "left" || position === "right" ? "flex-shrink-0" : "w-full"}
      ${position === "left" ? "mr-6" : ""}
      ${position === "right" ? "ml-6" : ""}
    `}>
      <div className="relative w-full max-w-4xl">
        <Image
          src={getImageUrl(image.url || "")}
          alt={image.alt || "Section Image"}
          width={image.width || 800}
          height={image.height || 400}
          className="rounded-lg object-cover w-full h-auto min-h-[300px] max-h-[600px]"
          style={{ aspectRatio: `${image.width || 800}/${image.height || 400}` }}
          priority={false}
        />
      </div>
    </div>
  );

  return imageElement;
};

// Section component
const SectionContent = ({ section }: { section: GlobalSection }) => {
  // Prepare table data for LinkTable component
  const formatTableData = (tableData: TableRow[]) => {
    return tableData.map((row, index) => ({
      id: index + 1, // Use index-based ID instead of database ID
      label: row.label,
      link: row.link,
      isExternal: row.isExternal || false,
    }));
  };

  const renderMainContent = () => {
    switch (section.contentType) {
      case "table":
        return (
          <div className="space-y-4">
            {section.tableData && section.tableData.length > 0 ? (
              <LinkTable
                tableData={formatTableData(section.tableData)}
                title={section.tableTitle || "Table Items"}
              />
            ) : (
              <p className="text-gray-500 italic">No table data available</p>
            )}
          </div>
        );

      case "dynamicTable":
        return (
          <div className="space-y-4">
            {section.dynamicTableConfig &&
            section.dynamicTableConfig.columns &&
            section.dynamicTableConfig.rows ? (
              <DynamicTable
                columns={section.dynamicTableConfig.columns}
                data={section.dynamicTableConfig.rows}
                title={section.tableTitle}
                variant={section.dynamicTableConfig.variant || "default"}
              />
            ) : (
              <p className="text-gray-500 italic">
                No dynamic table data available
              </p>
            )}
          </div>
        );

      case "mixed":
        return (
          <div className="space-y-6">
            {/* Rich Text Content */}
            {section.content && (
              <div className="text-gray-700">
                <RichTextRenderer content={section.content} />
              </div>
            )}

            {/* Table Data */}
            {section.tableData && section.tableData.length > 0 && (
              <div className="space-y-4">
                <LinkTable
                  tableData={formatTableData(section.tableData)}
                  title={section.tableTitle || "Related Links"}
                />
              </div>
            )}
          </div>
        );

      case "mixedDynamic":
        return (
          <div className="space-y-6">
            {/* Rich Text Content */}
            {section.content && (
              <div className="text-gray-700">
                <RichTextRenderer content={section.content} />
              </div>
            )}

            {/* Dynamic Table Data */}
            {section.dynamicTableConfig &&
              section.dynamicTableConfig.columns &&
              section.dynamicTableConfig.rows && (
                <div className="space-y-4">
                  <DynamicTable
                    columns={section.dynamicTableConfig.columns}
                    data={section.dynamicTableConfig.rows}
                    title={section.tableTitle || "Data Table"}
                    variant={section.dynamicTableConfig.variant || "default"}
                  />
                </div>
              )}
          </div>
        );

      case "mixedMultipleTables":
        return (
          <div className="space-y-6">
            {/* Rich Text Content */}
            {section.content && (
              <div className="text-gray-700">
                <RichTextRenderer content={section.content} />
              </div>
            )}

            {/* Multiple Tables */}
            {section.multipleTablesConfig && section.multipleTablesConfig.length > 0 && (
              <div className="space-y-8">
                {section.multipleTablesConfig.map((tableConfig, index) => (
                  <div key={tableConfig.id || index} className="space-y-4">
                    <DynamicTable
                      columns={tableConfig.columns}
                      data={tableConfig.rows}
                      title={tableConfig.tableTitle}
                      variant={tableConfig.variant || "default"}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default: // 'richText'
        return (
          <div className="text-gray-700">
            <RichTextRenderer content={section.content} />
          </div>
        );
    }
  };

  const renderContentWithImage = () => {
    const mainContent = renderMainContent();

    if (!section.image) {
      return mainContent;
    }

    return (
      <div className="space-y-6">
        <SectionImageComponent 
          image={section.image} 
          position="top"
        />
        {mainContent}
      </div>
    );
  };

  return (
    <div className="min-h-[600px] p-6">
     <div className="flex items-center gap-3 mb-6">
  <div className="w-1 h-8 bg-purple-700 rounded-sm" />
  <h2 className="text-2xl font-semibold text-gray-900">
    {section.title}
  </h2>
</div>


      {renderContentWithImage()}
    </div>
  );
};

export default function GlobalPage() {
  const params = useParams();
  const slug = params?.slug as string;
  


  // Define routes that should be handled by specific pages (not dynamic)
  

  // Check if this is a static route that should trigger 404 immediately

  const [globalData, setGlobalData] = useState<GlobalPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const fetchPageData = async () => {
      if (!slug) return;

        try {
        setLoading(true);

        let response = null;

        try {
          const globalResponse = await fetchFromApi(`/api/globals/${slug}`);
          
          // Handle both direct response and wrapped response formats
          if (globalResponse && globalResponse.success && globalResponse.data) {
            // Wrapped format from dynamic pages
            response = globalResponse.data;
            response.source = "dynamic-pages";
            response.pageType = "dynamic";
          } else if (globalResponse && globalResponse.id) {
            // Direct format from actual globals
            response = globalResponse;
            response.source = "globals";
            response.pageType = "global";
          }
        } catch (err) {
          // If globals fails, try the generic api endpoint
          try {
            const dynamicResponse = await fetchFromApi(`/api/${slug}`);
            
            // Handle the wrapped response format from dynamic pages
            if (dynamicResponse && dynamicResponse.success && dynamicResponse.data) {
              response = dynamicResponse.data;
              response.source = "dynamic-pages";
              response.pageType = "dynamic";
            } else if (dynamicResponse && dynamicResponse.id) {
              // Handle direct response format
              response = dynamicResponse;
              response.source = "dynamic-pages";
              response.pageType = "dynamic";
            }
          } catch (dynamicErr) {
            // Log both errors for debugging
            console.error("Error fetching from globals:", err);
            console.error("Error fetching from dynamic:", dynamicErr);
            // Both endpoints failed, throw the original error
            throw err;
          }
        }

        if (response && response.id) {
          // Log which source was used (helpful for debugging)
          console.log(
            `Page "${slug}" loaded from: ${
              response.source || "unknown"
            } (type: ${response.pageType || "unknown"})`
          );
          
          // Debug: Log the raw response data
          console.log('Raw response data:', JSON.stringify(response, null, 2));

          // Normalize the response using utility function
          const transformedData: GlobalPageData = normalizePageResponse(
            response,
            slug
          );
          
          // Debug: Log the transformed data
          console.log('Transformed data:', JSON.stringify(transformedData, null, 2));

          setGlobalData(transformedData);

          // Set first active section
          const activeSections = (transformedData.sections || []).filter(
            (section) => section.isActive !== false
          );
          if (activeSections.length > 0) {
            setActiveSection(activeSections[0].id);
          }
        } else {
          // If no response or no ID, trigger 404
          notFound();
        }
      } catch (err: unknown) {
        console.error("Error fetching page data:", err);

        // For any error during fetch, trigger 404 since this is a dynamic route
        // and any error indicates the page doesn't exist
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [slug]);

  const handleSectionClick = (sectionId: string | number) => {
    const id = String(sectionId);
    setActiveSection(id);
  };

  if (loading) {
    return (
      <LoadingProvider>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading page content...</p>
          </div>
        </div>
      </LoadingProvider>
    );
  }

  if (!globalData) {
    // For any missing data, trigger the proper 404 page
    notFound();
  }

  const activeSections = globalData.sections.filter(
    (section) => section.isActive
  );
  const activePageSection = activeSections.find(
    (section) => section.id === activeSection
  );

  // Create breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: globalData.heroTitle, isCurrentPage: true }
  ];

  return (
    <LoadingProvider>
      <div className="min-h-screen ">
        {/* Title Component  */}
        <Title
          title={globalData.heroTitle}
          subtitle={globalData.heroSubtitle}
          badgeSrc="/assets/icons/ariia.svg" 
          breadcrumb={breadcrumbItems}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {activeSections.length > 0 ? (
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
              {/* Sidebar with VerticalListing */}
              <aside className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0">
                <VerticalListing
                  title="SECTIONS"
                  items={activeSections.map((section) => ({
                    id: section.id,
                    title: section.title,
                    buttonText: section.title,
                  }))}
                  selectedItemId={activeSection}
                  onItemSelect={handleSectionClick}
                  className="!max-w-full"
                />
              </aside>

              {/* Content */}
              <main className="flex-1 min-h-[600px]">
                {activePageSection ? (
                  <SectionContent section={activePageSection} />
                ) : (
                  <div className="min-h-[600px] p-6">
                    <div className="text-center py-16">
                      <div className="text-gray-400 text-6xl mb-4">📄</div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Select a Section
                      </h2>
                      <p className="text-gray-600">
                        Choose a section from the sidebar to view its content.
                      </p>
                    </div>
                  </div>
                )}
              </main>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Content Available
              </h2>
              <p className="text-gray-600">
                This page doesn&apos;t have any sections configured yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </LoadingProvider>
  );
}