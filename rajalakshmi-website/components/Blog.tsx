import Title from "@/components/Title";
import BlogCard, { BlogCardProps } from "@/components/BlogCard";
import Image from "next/image";

interface BlogProps {
  mainBlog: {
    date: string;
    readTime: string;
    title: string;
    image: string;
    imageAlt: string;
    content: string[];
    category: string;
  };
  otherBlogs: BlogCardProps[];
}

const Blog: React.FC<BlogProps> = ({ mainBlog, otherBlogs }) => (
  <div className="min-h-screen font-sans relative overflow-hidden">
    <Title
      title="Quick Blogs"
      badgeSrc="/assets/icons/ariia.svg"
      breadcrumb={false}
    />
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-600">{mainBlog.date} - {mainBlog.readTime}</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-4">{mainBlog.title}</h1>
      <div className="w-full flex justify-center mb-6">
        <div className="relative w-full max-w-4xl">
          <Image
            src={mainBlog.image}
            alt={mainBlog.imageAlt}
            width={800}
            height={350}
            className="rounded-xl object-cover w-full h-auto min-h-[250px] max-h-[400px]"
            style={{ aspectRatio: '800/350' }}
          />
        </div>
      </div>
      <div className="text-base text-black mb-6">
        <p>{mainBlog.content[0]}</p>
      </div>
      <div className="text-lg font-semibold text-black mb-2">{mainBlog.content[1]}</div>
      <div className="text-base text-black mb-6">
        <p>{mainBlog.content[2]}</p>
      </div>
      <div className="text-lg font-semibold text-black mb-2">{mainBlog.content[3]}</div>
      <div className="text-base text-black mb-6">
        <p>{mainBlog.content[4]}</p>
      </div>
      <div className="mb-6">
        <a href="#" className="text-black underline text-base">{mainBlog.category}</a>
      </div>
    </div>
    <div className="w-full px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6 relative">
        Other Blogs
        <span className="block mx-auto mt-1 w-24 h-1 bg-[#6A1B9A] rounded-full"></span>
      </h2>
      <div className="flex flex-row gap-8 overflow-x-auto pb-4 scrollbar-hide">
        {otherBlogs.map((blog, idx) => (
          <div key={idx} className="min-w-[320px] max-w-xs w-full border-2 border-white rounded-2xl shadow-lg bg-white">
            <BlogCard {...blog} tagColor="bg-[#6A1B9A] text-white" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Blog; 