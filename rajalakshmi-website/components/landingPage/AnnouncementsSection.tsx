import { fetchFromApi } from "@/lib/api";
import Announcements from "./Announcements";

interface RichTextChild {
  text?: string;
}

interface RichTextNode {
  children?: RichTextChild[];
}

interface AnnouncementItem {
  title?: string;
  content?: {
    root?: {
      children?: RichTextNode[];
    };
  };
  linkText?: string;
  link?: string;
}

async function fetchAnnouncements() {
  try {
    const data = await fetchFromApi("/api/announcements?where[isActive][equals]=true&sort=-priority");
    const formattedAnnouncements = data?.docs?.map((item: AnnouncementItem) => ({
      title: item.title || "",
      description: item.content?.root?.children?.map((child: RichTextNode) =>
        child.children?.map((c: RichTextChild) => c.text || "").join(" ")
      ).join("\n") || "",
      links: [
        {
          label: item.linkText || "View more",
          href: item.link || "#",
        },
      ],
    })) || [];

    return formattedAnnouncements;
  } catch (err) {
    console.error("❌ Announcements Fetch Error:", err);
    // Provide fallback announcements
    return [
      {
        title: "Welcome to REC",
        description: "Experience excellence in engineering education at Rajalakshmi Engineering College.",
        links: [{ label: "Learn More", href: "#" }],
      }
    ];
  }
}

export default async function AnnouncementsSection() {
  const announcements = await fetchAnnouncements();

  return (
    <section className="bg-[#FAFAFA] px-4 sm:px-6 md:px-8">
      {announcements.length > 0 ? (
        <Announcements
          heading="Announcements"
          announcements={announcements}
        />
      ) : (
        <div className="text-center py-10">No announcements available.</div>
      )}
    </section>
  );
}