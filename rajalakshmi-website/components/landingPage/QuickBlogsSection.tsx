import { fetchFromApi, getImageUrl } from "@/lib/api";
import QuickBlogSection from "./QuickBlogs";

interface BlogItem {
  id?: string;
  slug?: string;
  category?: string;
  featuredImage?: { url?: string; alt?: string };
  title?: string;
  excerpt?: string;
}

async function fetchBlogs() {
  try {
    const data = await fetchFromApi("/api/blog-posts");
    console.log("Successfully fetched all blogs");

    const formattedBlogs = data?.docs?.map((item: BlogItem) => ({
      tag: item.category || "Blog",
      coverImage: getImageUrl(item.featuredImage?.url),
      coverImageAlt: item.featuredImage?.alt || "Blog Image",
      title: item.title || "",
      description: item.excerpt || "",
      href: `/blogs/${item.slug || item.id}`,
    })) || [];

    return formattedBlogs;
  } catch (err) {
    console.error("❌ Blogs Fetch Error:", err);
    return [
      {
        tag: "Campus Life",
        coverImage: "/assets/landing-page/blogimg.jpg",
        coverImageAlt: "Campus Activities",
        title: "Life at REC",
        description: "Discover the vibrant campus life and activities at Rajalakshmi Engineering College.",
        href: "/blogs"
      }
    ];
  }
}

export default async function QuickBlogsSection() {
  const blogs = await fetchBlogs();

  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-4 bg-[#FAFAFA]">
      <QuickBlogSection blogs={blogs} />
    </section>
  );
}