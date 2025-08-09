import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

// Link data
const profileLinks = [
  { label: "About", href: "/about" },
  { label: "Accreditations", href: "/accreditations" },
  { label: "Certifications", href: "/certifications" },
  { label: "Governing Council", href: "/governing-council" },
  { label: "Dev Council", href: "/development-council" },
  { label: "MoU", href: "/mou" },
  { label: "Eminent Faculty", href: "/faculty" },
];

const academicsLinks = [
  { label: "Departments", href: "/departments" },
  { label: "Admissions", href: "/admissions" },
  { label: "Facilities", href: "/facilities" },
  { label: "Student Life", href: "/student-life" },
  { label: "Research", href: "/research" },
  { label: "Alumni", href: "/alumni" },
  { label: "Curriculum Feedback", href: "/feedback" },
];

const importantLinks = [
  { label: "Anti Ragging", href: "/anti-ragging" },
  { label: "HelpDesk", href: "/helpdesk" },
  { label: "ARIIA Data", href: "/ariia" },
  { label: "ARIIA Validation", href: "/ariia-validation" },
  { label: "NIRF", href: "/nirf" },
  { label: "NAAC-SSR", href: "/naac-ssr" },
];

const supportLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Help Center", href: "/help" },
  { label: "Support", href: "/support" },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAFAFA] text-[#22282B] px-10 py-10">
      <div className="max-w-[100rem] w-full mx-auto text-base space-y-10">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Column */}
          <div className="flex flex-col justify-between h-full md:space-y-0">
            <div className="flex md:items-center h-full">
              <div className="w-full">
                <div className="w-full flex justify-center md:justify-start">
                  <p className="font-semibold text-[14px] text-center md:text-left whitespace-nowrap">
                    We are a leading Engineering college in India,<br />
                    <span className="font-bold">Rajalakshmi Institutions</span>
                  </p>
                </div>

                {/* Social Icons - Hidden on mobile */}
                <div className="hidden md:flex space-x-4 mt-6 mb-3">
                  {[
                    { icon: <Facebook size={20} />, href: "https://www.facebook.com/myrecchennai" },
                    { icon: <Twitter size={20} />, href: "https://x.com/myrecchennai" },
                    { icon: <Instagram size={20} />, href: "https://www.instagram.com/rec_chennai/" },
                    { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/school/rajalakshmi-engineering-college/" },
                  ].map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full border"
                      style={{
                        color: "#6A1B9A",
                        backgroundColor: "#22282B0A",
                        borderColor: "#22282B36",
                        borderWidth: "1px",
                        transition: "all 0.3s",
                      }}
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Admission Open - Hidden on mobile */}
            <div className="hidden md:block text-center md:text-left">
              <h2 className="text-4xl md:text-5xl text-[#6A1B9A] font-bold mb-1 whitespace-nowrap">
                Admission<br />Open
              </h2>
              <p className="text-lg font-semibold whitespace-nowrap">UG | PG</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:text-left">
              {[profileLinks, academicsLinks, importantLinks, supportLinks].map((section, idx) => (
                <div key={idx}>
                  {idx === 0 && <h4 className="text-[#6A1B9A] font-bold mb-2 text-sm">PROFILE</h4>}
                  {idx === 1 && <h4 className="text-[#6A1B9A] font-bold mb-2 text-sm">ACADEMICS</h4>}
                  {idx === 2 && <h4 className="text-[#6A1B9A] font-bold mb-2 text-sm">IMPORTANT</h4>}
                  {idx === 3 && <ul className="space-y-1 pt-0 md:pt-8" />}
                  <ul className="space-y-1">
                    {section.map((item, i) => (
                      <li key={i}>
                        <a
                          href={item.href}
                          className="relative inline-block text-sm whitespace-nowrap after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-[#6A1B9A] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-9 sm:text-left">
              <div>
                <h4 className="text-[#6A1B9A] font-bold mb-2 text-sm">ADDRESS</h4>
                <p className="text-sm whitespace-nowrap">
                  Rajalakshmi Engineering College, <br />
                  Rajalakshmi Nagar Thandalam, <br />
                  Chennai - 602 105.
                </p>
              </div>
              <div>
                <h4 className="text-[#6A1B9A] font-bold mb-2 text-sm">PHONE</h4>
                <p className="text-sm whitespace-nowrap">+91-44-67181111, 67181112</p>
                <h4 className="text-[#6A1B9A] font-bold mt-3 mb-1 text-sm">EMAIL</h4>
                <a href="mailto:contact@rajalakshmi.org" className="hover:underline block text-sm whitespace-nowrap">
                  contact@rajalakshmi.org
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        {/* Mobile-only social icons */}
        <div className="md:hidden flex justify-between space-x-4">
          {[
            { icon: <Facebook size={30} />, href: "https://www.facebook.com/myrecchennai" },
            { icon: <Twitter size={30} />, href: "https://x.com/myrecchennai" },
            { icon: <Instagram size={30} />, href: "https://www.instagram.com/rec_chennai/" },
            { icon: <Linkedin size={30} />, href: "https://www.linkedin.com/school/rajalakshmi-engineering-college/" },
          ].map((item, index) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border"
              style={{
                color: "#6A1B9A",
                backgroundColor: "#22282B0A",
                borderColor: "#22282B36",
                borderWidth: "1px",
                transition: "all 0.3s",
              }}
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* Footer Text */}
        <div className="border-t pt-6 mt-6 text-[14px] text-[#22282B] font-bold flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="whitespace-nowrap">© Rajalakshmi Engineering College</p>
          <div className="hidden md:flex space-x-4 justify-center">
            <Link href="/faq" className="hover:underline text-sm whitespace-nowrap">FAQ</Link>
            <Link href="/terms" className="hover:underline text-sm whitespace-nowrap">Terms of Service</Link>
            <Link href="/privacy" className="hover:underline text-sm whitespace-nowrap">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;