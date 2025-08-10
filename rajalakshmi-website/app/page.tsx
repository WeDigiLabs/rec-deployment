import Hero from "@/components/landingPage/Hero";
import HeroImageSlider from "@/components/landingPage/HeroImageSlider";
import AnnouncementsSection from "@/components/landingPage/AnnouncementsSection";
import GetStarted from "@/components/landingPage/GetStarted";
import QuickBlogsSection from "@/components/landingPage/QuickBlogsSection";
import TestimonialsSection from "@/components/landingPage/TestimonialsSection";
import StatsSection from "@/components/landingPage/Stats";

export default function LandingPage() {
  // Server-side logging
  console.log('[HOME PAGE - SERVER] Environment variables on server:', {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_CMS_API_URL: process.env.NEXT_PUBLIC_CMS_API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });

  const stats = [
    { value: "25+", label: "Years of Excellence" },
    { value: "10,000+", label: "Students Enrolled" },
    { value: "95%", label: "Placement Rate" },
    { value: "50+", label: "Industry Partners" },
    { value: "400+", label: "Expert Faculty" },
  ];

  return (
    <>
      <Hero />
      <HeroImageSlider />
      <StatsSection stats={stats} />
      <AnnouncementsSection />
      <GetStarted />
      <QuickBlogsSection />
      <TestimonialsSection />
    </>
  );
}
