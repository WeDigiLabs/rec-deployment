import Hero from "@/components/landingPage/Hero";
import HeroImageSlider from "@/components/landingPage/HeroImageSlider";
import AnnouncementsSection from "@/components/landingPage/AnnouncementsSection";
import GetStarted from "@/components/landingPage/GetStarted";
import QuickBlogsSection from "@/components/landingPage/QuickBlogsSection";
import TestimonialsSection from "@/components/landingPage/TestimonialsSection";
import StatsSection from "@/components/landingPage/Stats";
import AadhiFeatureSection from "@/components/landingPage/AadhiFeatureSection";

export default function LandingPage() {
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
      <AadhiFeatureSection />
      <AnnouncementsSection />
      <GetStarted />
      <QuickBlogsSection />
      <TestimonialsSection />
    </>
  );
}
