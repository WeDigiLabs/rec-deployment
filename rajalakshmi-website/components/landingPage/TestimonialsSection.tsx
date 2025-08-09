import { fetchFromApi, getImageUrl } from "@/lib/api";
import TestimonialSlider from "./Testimonials";

interface TestimonialItem {
  quote?: string;
  authorName?: string;
  authorTitle?: string;
  authorImage?: { url?: string };
}

async function fetchTestimonials() {
  try {
    const data = await fetchFromApi("/api/testimonials?where[isActive][equals]=true");
    const formattedTestimonials = data?.docs?.map((item: TestimonialItem) => ({
      quote: item.quote || "",
      name: item.authorName || "",
      role: item.authorTitle || "",
      image: getImageUrl(item.authorImage?.url),
    })) || [];
    return formattedTestimonials;
  } catch (error) {
    console.error("❌ Testimonials Fetch Error:", error);
    // Provide fallback testimonials
    return [
      {
        quote: "REC has provided me with excellent opportunities to grow both academically and professionally.",
        name: "Alumni Student",
        role: "Software Engineer",
        image: "/assets/landing-page/sylendrababu.jpg",
      }
    ];
  }
}

export default async function TestimonialsSection() {
  const testimonials = await fetchTestimonials();

  return (
    <section className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 bg-[#FAFAFA]">
      {testimonials.length > 0 ? (
        <TestimonialSlider testimonials={testimonials} />
      ) : (
        <div className="text-center py-10">No testimonials available.</div>
      )}
    </section>
  );
}