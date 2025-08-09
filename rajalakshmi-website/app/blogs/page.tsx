"use client";

import { useState, useEffect } from 'react';
import { fetchFromApi, getImageUrl } from '@/lib/api';
import { BlogCard } from '@/components';
import Title from '@/components/Title';

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
  featuredImage?: FeaturedImage;
  author: Author;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlogsResponse {
  docs: BlogPost[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const blogsPerPage = 12;

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const fetchBlogs = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: BlogsResponse = await fetchFromApi(
        `/api/blog-posts?where[isPublished][equals]=true&sort=-createdAt&limit=${blogsPerPage}&page=${page}`
      );
      
      setBlogs(response.docs || []);
      setTotalPages(response.totalPages || 1);
      setHasNextPage(response.hasNextPage || false);
      setHasPrevPage(response.hasPrevPage || false);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Utility function for date formatting (can be used in future enhancements)
  // const formatDate = (dateString: string): string => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   });
  // };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen font-sans relative overflow-hidden">
        <Title
          title="Blogs"
          badgeSrc="/assets/icons/ariia.svg"
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Blogs", isCurrentPage: true }
          ]}
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6A1B9A]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen font-sans relative overflow-hidden">
        <Title
          title="Blogs"
          badgeSrc="/assets/icons/ariia.svg"
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Blogs", isCurrentPage: true }
          ]}
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={() => fetchBlogs(currentPage)}
              className="mt-4 px-6 py-2 bg-[#6A1B9A] text-white rounded-lg hover:bg-[#5A1580] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans relative overflow-hidden">
      <Title
        title="Blogs"
        badgeSrc="/assets/icons/ariia.svg"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Blogs", isCurrentPage: true }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No blogs available at the moment.</p>
          </div>
        ) : (
          <>
            {/* Blogs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  tag="Blog"
                  tagColor="bg-[#6A1B9A] text-white"
                  coverImage={getImageUrl(blog.featuredImage?.url)}
                  coverImageAlt={blog.featuredImage?.alt || blog.title}
                  title={blog.title}
                  description={blog.excerpt}
                  href={`/blogs/${blog.slug}`}
                  className="h-full"
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 py-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrevPage || loading}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    hasPrevPage && !loading
                      ? 'bg-[#6A1B9A] text-white hover:bg-[#5A1580]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        className={`px-3 py-1 rounded transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[#6A1B9A] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } ${loading ? 'cursor-not-allowed' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNextPage || loading}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    hasNextPage && !loading
                      ? 'bg-[#6A1B9A] text-white hover:bg-[#5A1580]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
            
            {/* Page Info */}
            <div className="text-center text-gray-600 text-sm">
              Showing page {currentPage} of {totalPages}
              {loading && <span className="ml-2">(Loading...)</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}