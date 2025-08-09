"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Title from '@/components/Title';
import { fetchFromApi, getImageUrl } from '@/lib/api';
import YouTubeEmbed, { isYouTubeUrl } from '@/components/YouTubeEmbed';

interface RichTextChild {
  type?: string;
  text?: string;
  format?: number;
  children?: RichTextChild[];
  url?: string;
  fields?: {
    url?: string;
    linkType?: string;
  };
  checked?: boolean; // Added for check list items
  value?: number; // Added for list items
}

interface RichTextNode {
  type?: string;
  children?: RichTextChild[];
  tag?: string;
  direction?: string;
  format?: string;
  indent?: number;
  version?: number;
  textFormat?: number;
  textStyle?: string;
  listType?: string; // Added for list nodes
  checked?: boolean; // Added for check list nodes
  value?: number | { url: string; alt?: string; filename?: string; mimeType?: string; filesize?: number; width?: number; height?: number }; // Union type for different value types
  start?: number; // Added for ordered lists
}

// Extended interfaces for specific node types
interface ListItemNode extends RichTextChild {
  type: 'listitem';
  checked?: boolean;
  value?: number;
}

interface UploadNode extends RichTextNode {
  type: 'upload';
  value?: {
    url: string;
    alt?: string;
    filename?: string;
    mimeType?: string;
    filesize?: number;
    width?: number;
    height?: number;
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

interface Author {
  id: string;
  email: string;
  role: string;
}

interface FeaturedImage {
  id: string;
  url: string;
  alt?: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: RichTextContent;
  featuredImage?: FeaturedImage;
  author: Author;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);
        
        // First try to fetch by slug (if the API supports it)
        let data;
        try {
          data = await fetchFromApi(`/api/blog-posts?where[slug][equals]=${slug}`);
          if (data?.docs && data.docs.length > 0) {
            setBlogPost(data.docs[0]);
            return;
          }
        } catch (slugError) {
          console.warn('Slug-based fetch failed, trying ID-based fetch:', slugError);
        }

        // If slug doesn't work, try by ID (assuming slug might be the ID)
        try {
          data = await fetchFromApi(`/api/blog-posts/${slug}`);
          setBlogPost(data);
        } catch (idError) {
          console.error('Both slug and ID-based fetch failed:', idError);
          setError('Blog post not found');
        }
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  const parseRichText = (content: RichTextContent | undefined): React.ReactElement[] => {
    if (!content || !content.root || !Array.isArray(content.root.children)) {
      return [];
    }

    return content.root.children.map((node: RichTextNode, index: number) => {
      if (node.type === 'paragraph') {
        const text = node.children?.map((child: RichTextChild, childIndex: number) => {
          if (child.type === 'text') {
            const text = child.text || '';
            
            // Check if the text contains YouTube URLs
            const youtubeUrlRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&\n?#\s]+)/g;
            const parts = text.split(youtubeUrlRegex);
            
            if (parts.length > 1) {
              // Text contains YouTube URLs, process them
              const elements: React.ReactNode[] = [];
              for (let i = 0; i < parts.length; i += 2) {
                const textPart = parts[i];
                const videoId = parts[i + 1];
                
                if (textPart) {
                  let element = <span key={`text-${i}`}>{textPart}</span>;
                  if (child.format === 1) element = <strong key={`text-${i}`}>{textPart}</strong>;
                  if (child.format === 2) element = <em key={`text-${i}`}>{textPart}</em>;
                  elements.push(element);
                }
                
                if (videoId) {
                  const fullUrl = text.match(new RegExp(`[^\\s]*${videoId}[^\\s]*`))?.[0] || `https://www.youtube.com/watch?v=${videoId}`;
                  elements.push(
                    <div key={`youtube-${i}`} className="my-4">
                      <YouTubeEmbed url={fullUrl} title="YouTube video" />
                    </div>
                  );
                }
              }
              return elements;
            }
            
            // No YouTube URLs, apply regular formatting
            let element = <span key={childIndex}>{text}</span>;
            if (child.format === 1) { // Bold
              element = <strong key={childIndex}>{text}</strong>;
            } else if (child.format === 2) { // Italic
              element = <em key={childIndex}>{text}</em>;
            }
            
            return element;
          } else if (child.type === 'autolink') {
            // Handle autolink nodes
            const href = child.fields?.url || child.url || '#';
            const linkText = child.children?.map((c: RichTextChild) => c.text).join('') || child.text || 'Link';
            
            // Check if it's a YouTube URL and render as embed
            if (isYouTubeUrl(href)) {
              return (
                <YouTubeEmbed
                  key={childIndex}
                  url={href}
                  title={linkText}
                />
              );
            }
            
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
          return child.text || '';
        }) || [];

        // Check if the entire paragraph is just a YouTube URL
        const paragraphText = text.map(item => typeof item === 'string' ? item : '').join('').trim();
        if (isYouTubeUrl(paragraphText)) {
          return (
            <div key={index} className="my-6">
              <YouTubeEmbed
                url={paragraphText}
                title="YouTube video"
              />
            </div>
          );
        }

        return (
          <p key={index} className="mb-4 text-[#333] text-base leading-relaxed">
            {text}
          </p>
        );
      } else if (node.type === 'heading') {
        const text = node.children?.map((child: RichTextChild) => child.text || '').join('') || '';
        const tag = node.tag || 'h2';
        
        if (tag === 'h1') {
          return (
            <h1 key={index} className="text-3xl font-bold text-[#6A1B9A] mb-6 mt-8">
              {text}
            </h1>
          );
        } else if (tag === 'h3') {
          return (
            <h3 key={index} className="text-xl font-bold text-[#6A1B9A] mb-4 mt-6">
              {text}
            </h3>
          );
        } else {
          return (
            <h2 key={index} className="text-2xl font-bold text-[#6A1B9A] mb-6 mt-8">
              {text}
            </h2>
          );
        }
      } else if (node.type === 'list') {
        const listItems = node.children?.map((listItem: RichTextChild, itemIndex: number) => {
          const itemText = listItem.children?.map((child: RichTextChild) => child.text || '').join('') || '';
          const isChecked = (listItem as ListItemNode).checked;
          
          if (node.listType === 'check') {
            return (
              <li key={itemIndex} className="flex items-start gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  className="mt-1 h-4 w-4 text-[#6A1B9A] border-gray-300 rounded focus:ring-[#6A1B9A]"
                />
                <span className="text-[#333] text-base leading-relaxed">{itemText}</span>
              </li>
            );
          } else {
            return (
              <li key={itemIndex} className="mb-2 text-[#333] text-base leading-relaxed">
                {itemText}
              </li>
            );
          }
        }) || [];

        if (node.listType === 'check') {
          return (
            <ul key={index} className="mb-6 list-none pl-0">
              {listItems}
            </ul>
          );
        } else if (node.listType === 'number') {
          return (
            <ol key={index} className="mb-6 list-decimal pl-6">
              {listItems}
            </ol>
          );
        } else if (node.listType === 'bullet') {
          return (
            <ul key={index} className="mb-6 list-disc pl-6">
              {listItems}
            </ul>
          );
        } else {
          // Default to unordered list
          return (
            <ul key={index} className="mb-6 list-disc pl-6">
              {listItems}
            </ul>
          );
        }
      } else if (node.type === 'quote') {
        const text = node.children?.map((child: RichTextChild) => child.text || '').join('') || '';
        return (
          <blockquote key={index} className="border-l-4 border-[#6A1B9A] pl-4 py-2 mb-6 italic text-gray-700 bg-gray-50 rounded-r">
            {text}
          </blockquote>
        );
      } else if (node.type === 'horizontalrule') {
        return (
          <hr key={index} className="my-8 border-gray-300" />
        );
      } else if (node.type === 'upload') {
        const imageData = (node as UploadNode).value;
        if (imageData && imageData.url) {
          // Ensure minimum dimensions for small images while maintaining aspect ratio
          const originalWidth = imageData.width || 800;
          const originalHeight = imageData.height || 400;
          const aspectRatio = originalWidth / originalHeight;
          
          // Set minimum display dimensions
          const minWidth = 400;
          const minHeight = 300;
          
          // Calculate display dimensions maintaining aspect ratio
          let displayWidth = originalWidth;
          let displayHeight = originalHeight;
          
          // If image is too small, scale it up to minimum size
          if (originalWidth < minWidth || originalHeight < minHeight) {
            if (aspectRatio > 1) {
              // Landscape: base on minimum width
              displayWidth = Math.max(minWidth, originalWidth);
              displayHeight = displayWidth / aspectRatio;
            } else {
              // Portrait or square: base on minimum height
              displayHeight = Math.max(minHeight, originalHeight);
              displayWidth = displayHeight * aspectRatio;
            }
          }
          
          return (
            <div key={index} className="my-6 flex justify-center">
              <div className="relative w-full max-w-4xl">
                <Image
                  src={getImageUrl(imageData.url)}
                  alt={imageData.alt || 'Blog image'}
                  width={displayWidth}
                  height={displayHeight}
                  className="rounded-lg object-contain w-full h-auto min-h-[300px] max-h-[600px]"
                  style={{ aspectRatio: `${displayWidth}/${displayHeight}` }}
                />
              </div>
            </div>
          );
        }
      }
      
      return <div key={index}></div>;
    }).filter(Boolean);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen font-sans relative overflow-hidden">
        <Title
          title="Blog"
          badgeSrc="/assets/icons/ariia.svg"
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Blogs", href: "/blogs" },
            { label: "Blog Post", isCurrentPage: true }
          ]}
        />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2 w-1/4"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen font-sans relative overflow-hidden">
        <Title
          title="Blog"
          badgeSrc="/assets/icons/ariia.svg"
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Blogs", href: "/blogs" },
            { label: "Blog Post", isCurrentPage: true }
          ]}
        />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-600 mb-4">
              {error || 'Blog post not found'}
            </h1>
            <Link
              href="/blogs"
              className="text-[#6A1B9A] hover:underline text-lg"
            >
              ← Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans relative overflow-hidden">
      <Title
        title="Blog"
        badgeSrc="/assets/icons/ariia.svg"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Blogs", href: "/blogs" },
          { label: blogPost.title, isCurrentPage: true }
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-6">
        {/* Blog Meta */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-600">
            {formatDate(blogPost.createdAt)}
          </span>
        </div>

        {/* Blog Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">
          {blogPost.title}
        </h1>

        {/* Blog Excerpt */}
        {blogPost.excerpt && (
          <div className="text-lg text-gray-700 mb-8 italic border-l-4 border-[#6A1B9A] pl-4">
            {blogPost.excerpt}
          </div>
        )}

        {/* Featured Image */}
        {blogPost.featuredImage && (
          <div className="w-full flex justify-center mb-8">
            <div className="relative w-full max-w-4xl">
              <Image
                src={getImageUrl(blogPost.featuredImage.url)}
                alt={blogPost.featuredImage.alt || blogPost.title}
                width={Math.max(blogPost.featuredImage.width || 800, 600)}
                height={Math.max(blogPost.featuredImage.height || 400, 400)}
                className="rounded-xl object-cover w-full h-auto min-h-[300px] max-h-[500px]"
                style={{ 
                  aspectRatio: `${blogPost.featuredImage.width || 800}/${blogPost.featuredImage.height || 400}` 
                }}
                priority
              />
            </div>
          </div>
        )}

        {/* Blog Content */}
        <div className="prose max-w-none">
          {parseRichText(blogPost.content)}
        </div>

        {/* Back to Blogs Link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/blogs"
            className="text-[#6A1B9A] hover:underline text-lg font-medium"
          >
            ← Back to All Blogs
          </Link>
        </div>
      </article>
    </div>
  );
}
