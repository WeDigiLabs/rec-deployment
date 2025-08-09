import Link from "next/link";
import { Button } from "@/components";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center px-6 py-12 max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-none">
            404
          </h1>
        </div>

        {/* Main Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Oops! The page you&apos;re looking for seems to have wandered off. It
            might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link href="/">
            <Button className="px-8 py-3 border-2 hover:from-blue-700 hover:to-purple-700 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg" variant="primary-gradient">
              Go Back Home
            </Button>
          </Link>
          <Link href="/blogs">
            <Button className="px-8 py-3 border-2 hover:from-blue-700 hover:to-purple-700 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg" variant="primary-gradient">
              Explore Our Blog
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-gray-500 mb-4">You might also be looking for:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/about"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/departments"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Departments
            </Link>
            <Link
              href="/academics"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Academics
            </Link>
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20">
          <p className="text-gray-600 text-sm">
            Can&apos;t find what you&apos;re looking for? Try 
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-800 hover:underline ml-1"
            >
              contacting our support team
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce animation-delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
    </div>
  );
}
