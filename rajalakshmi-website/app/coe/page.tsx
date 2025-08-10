"use client";

import React, { useEffect, useState } from "react";
import Title from "@/components/Title";
import TimetableComponent from "@/components/TimetableComponent";
import { ClipboardCheck, Star, FileText } from "lucide-react";
import { fetchFromApi } from "@/lib/api";

interface COEItem {
  id: string;
  title: string;
  description: string;
  category: {
    name: string;
  };
  pdfFile: {
    url: string;
  };
}

interface ExamSectionLink {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode; // ✅ changed from JSX.Element
  fileType: string;
}

interface ExamSection {
  id: string;
  title: string;
  icon: React.ReactNode; // ✅ changed from JSX.Element
  badges: { text: string; variant: "ug" | "pg" | "special" | "new" }[];
  links: ExamSectionLink[];
}

export default function COE() {
  const [examSections, setExamSections] = useState<ExamSection[]>([]);

  useEffect(() => {
    async function fetchCOE() {
      try {
        const data = await fetchFromApi("/api/coe");

        const grouped: { [category: string]: ExamSectionLink[] } = {};

        (data.docs as COEItem[]).forEach((item) => {
          const category = item.category.name;
          if (!grouped[category]) {
            grouped[category] = [];
          }

          // Log PDF URL generation
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://reccms.flashserver.in';
          console.log('[COE PAGE] PDF URL generation:', {
            baseUrl,
            pdfFileUrl: item.pdfFile.url,
            fullUrl: `${baseUrl}${item.pdfFile.url}`,
            usingFallback: baseUrl === 'https://reccms.flashserver.in'
          });

          grouped[category].push({
            href: `${baseUrl}${item.pdfFile.url}`,
            title: item.title,
            subtitle: category,
            icon: <FileText className="w-5 h-5" />,
            fileType: "PDF",
          });
        });

        const sections: ExamSection[] = Object.entries(grouped).map(
          ([categoryName, links]) => {
            let icon: React.ReactNode = (
              <ClipboardCheck className="w-5 h-5 text-[#6A1B9A]" />
            );

            const badges: { text: string; variant: "ug" | "pg" | "special" | "new" }[] = [];

            const lowerCategory = categoryName.toLowerCase();

            if (lowerCategory.includes("special")) {
              icon = <Star className="w-5 h-5 text-[#6A1B9A]" />;
              badges.push({ text: "Special", variant: "special" });
            } else if (lowerCategory.includes("ug")) {
              badges.push({ text: "UG", variant: "ug" });
            } else if (lowerCategory.includes("pg")) {
              badges.push({ text: "PG", variant: "pg" });
            }

            badges.push({ text: "New", variant: "new" });

            return {
              id: categoryName.replace(/\s+/g, "-").toLowerCase(),
              title: categoryName,
              icon,
              badges,
              links,
            };
          }
        );

        setExamSections(sections);
      } catch (error) {
        console.error("Error fetching COE data:", error);
      }
    }

    fetchCOE();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Title
        title="Controller Of Examinations"
        badgeSrc="/assets/icons/ariia.svg"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Controller Of Examinations", isCurrentPage: true }
        ]}
      />

      <TimetableComponent
        examSections={examSections}
        showInfoAlert
        infoAlertContent="Timetables are subject to change. Please check regularly for updates."
      />
    </div>
  );
}
