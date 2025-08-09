import ImageSlider from "./ImageSlider";
import { fetchFromApi, getImageUrl } from "@/lib/api";
import HeroButtons from "./HeroButtons";

interface SliderItem {
  id: string;
  title?: string;
  desktopImage?: { url?: string };
  mobileImage?: { url?: string };
}

interface SliderFormattedItem {
  id: string;
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
}

async function fetchSliderData() {
  try {
    const data = await fetchFromApi("/api/home-slider?where[isActive][equals]=true&sort=order");
    const formattedSlides = data?.docs?.map((item: SliderItem) => ({
      id: item.id,
      desktopSrc: getImageUrl(item.desktopImage?.url),
      mobileSrc: getImageUrl(item.mobileImage?.url),
      alt: item.title || "Slider image",
    })) || [];

    const desktopSlides = formattedSlides.map((slide: SliderFormattedItem) => ({
      id: slide.id,
      src: slide.desktopSrc,
      alt: slide.alt,
    }));

    const mobileSlides = formattedSlides.map((slide: SliderFormattedItem) => ({
      id: slide.id,
      src: slide.mobileSrc || slide.desktopSrc,
      alt: slide.alt,
    }));

    return { desktopSlides, mobileSlides };
  } catch (err) {
    console.error("❌ Slider Fetch Error:", err);
    
    // Provide fallback data when API fails
    const fallbackSlides = [
      {
        id: 1,
        src: "/assets/landing-page/asupg.png",
        alt: "Rajalakshmi Engineering College",
      },
      {
        id: 2,
        src: "/assets/landing-page/asuug.png", 
        alt: "Campus Life",
      }
    ];
    
    return { desktopSlides: fallbackSlides, mobileSlides: fallbackSlides };
  }
}

export default async function HeroImageSlider({ 
  className = ""
}: { className?: string }) {
  const { desktopSlides: slides, mobileSlides } = await fetchSliderData();

  return (
    <section className={`relative w-full overflow-hidden ${className}`}>
      <div className="relative">
        {slides.length > 0 ? (
          <ImageSlider
            slides={slides.map(({ id, ...rest }: { id: string; src: string; alt: string }, index: number) => ({
              id: isNaN(Number(id)) ? index : Number(id),
              ...rest,
            }))}
            mobileSlides={mobileSlides.map(({ id, ...rest }: { id: string; src: string; alt: string }, index: number) => ({
              id: isNaN(Number(id)) ? index : Number(id),
              ...rest,
            }))}
          />
        ) : (
          <div className="text-center py-10 px-4">No slider images available.</div>
        )}

        {/* Call-to-Action Buttons - Only visible on mobile */}
<div className="absolute bottom-8 items-center justify-center w-full flex sm:hidden">
        <HeroButtons />
      </div>
      </div>
    </section>
  );
}