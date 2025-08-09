"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Logo from "./Logo";
import { Button, NavBar } from "./index";
import { fetchFromApi } from "../lib/api";
import SecondaryNavbar from "./SecondaryNavbar";

type Department = {
  id: string;
  name: string;
  code: string;
  slug: string;
  shortName: string;
  isActive: boolean;
  order: number;
};

const admissionDropdownOptions = [
  { label: "UG Admissions", href: "/admissions/ug" },
  { label: "PG Admissions", href: "/admissions/pg" },
  { label: "Accelerated Masters", href: "/admissions/accelerated-masters" },
  { label: "3+1 Programme", href: "/admissions/3plus1" },
];
const feeDropdownOptions = [
  { label: "College Fee", href: "/fee/college" },
  { label: "Exam Fee", href: "/fee/exam" },
];

const Header = () => {
  const [departmentSubmenus, setDepartmentSubmenus] = useState<{ label: string; href: string }[]>([]);
  const [admissionDropdownOpen, setAdmissionDropdownOpen] = useState(false);
  const [feeDropdownOpen, setFeeDropdownOpen] = useState(false);
  const admissionRef = useRef(null);
  const feeRef = useRef(null);
  const admissionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const feeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetchFromApi("/api/departments-nav");
        if (response?.success && response?.data) {
          const formattedDepartments = response.data
            .sort((a: Department, b: Department) => a.order - b.order) // Sort by order field
            .map((dept: Department) => ({
              label: dept.name,
              href: `/departments/${dept.slug}` // Using slug instead of shortName for better URL structure
            }));
          setDepartmentSubmenus(formattedDepartments);
        }
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        // Fallback to empty array if API fails
        setDepartmentSubmenus([]);
      }
    };

    fetchDepartments();
  }, []);

  const navItems = useMemo(() => [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Department", href: "/department", dropdown: departmentSubmenus },
    { label: "COE", href: "/coe" },
    { label: "Academics", href: "/academics"},
    { label: "Admissions", href: "/admissions"},
    { label: "Placements", href: "/placement"},
    { label: "Facilities", href: "/facilities"},  
    { label: "Research", href: "/research" },
    { label: "Student Life", href: "/student-life"},
    { label: "Alumni", href: "/alumni" },
  ], [departmentSubmenus]);

  const handleAdmissionMouseEnter = () => {
    if (admissionTimeoutRef.current) {
      clearTimeout(admissionTimeoutRef.current);
      admissionTimeoutRef.current = null;
    }
    setAdmissionDropdownOpen(true);
  };

  const handleAdmissionMouseLeave = () => {
    admissionTimeoutRef.current = setTimeout(() => {
      setAdmissionDropdownOpen(false);
    }, 200); // 200ms delay
  };

  const handleFeeMouseEnter = () => {
    if (feeTimeoutRef.current) {
      clearTimeout(feeTimeoutRef.current);
      feeTimeoutRef.current = null;
    }
    setFeeDropdownOpen(true);
  };

  const handleFeeMouseLeave = () => {
    feeTimeoutRef.current = setTimeout(() => {
      setFeeDropdownOpen(false);
    }, 200); // 200ms delay
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (admissionTimeoutRef.current) clearTimeout(admissionTimeoutRef.current);
      if (feeTimeoutRef.current) clearTimeout(feeTimeoutRef.current);
    };
  }, []);

  return (
    <header className="m-1 sm:m-3 sm:ml-6 sm:mr-6 lg:m-2 xl:m-4 xl:mr-6">
      {/* Secondary Navbar */}
      <SecondaryNavbar />

      {/* XL and above */}
      <div className="hidden xl:flex items-center justify-between gap-2 xl:gap-4">
        <div className="flex items-center justify-center min-w-[140px] sm:min-w-[160px] lg:min-w-[180px] xl:min-w-[200px]">
          <Logo width={128} height={128} className="sm:w-32 sm:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40" />
        </div>
        {/* Center: NavBar */}
        <div className="flex-1 flex justify-center min-w-0">
          <NavBar items={navItems} moreItemsCount={8} />
        </div>
        {/* Right: Admission and Fee Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 min-w-[140px] sm:min-w-[160px] lg:min-w-[180px] xl:min-w-[200px] justify-end">
          {/* Admissions Button with Dropdown */}
          <div
            className="relative group"
            onMouseEnter={handleAdmissionMouseEnter}
            onMouseLeave={handleAdmissionMouseLeave}
            ref={admissionRef}
          >
            <Button
              variant="transparent"
              size="sm"
              className="border border-[#6A1B9A] shadow-lg text-[#6A1B9A] font-semibold whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[#f3eaff] transition-all duration-200"
              aria-haspopup="true"
              aria-expanded={admissionDropdownOpen}
              aria-controls="admission-dropdown"
            >
              Apply Now
            </Button>
            {/* Dropdown */}
            <div
              id="admission-dropdown"
              className={`absolute right-0 mt-2 w-56 bg-white border border-[#6A1B9A]/20 rounded-xl shadow-2xl z-50 py-2 transition-all duration-200 ${admissionDropdownOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
              style={{ minWidth: "200px" }}
              role="menu"
              tabIndex={-1}
              onMouseEnter={handleAdmissionMouseEnter}
              onMouseLeave={handleAdmissionMouseLeave}
            >
              {/* Pointer Arrow */}
              <div className="absolute top-0 right-6 w-3 h-3 bg-white border-t border-l border-[#6A1B9A]/20 rotate-45 -translate-y-1/2 z-10"></div>
              {admissionDropdownOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => window.location.href = option.href}
                  className="block w-full text-left px-5 py-2 text-sm text-[#6A1B9A] hover:bg-[#F3E8FF] hover:text-[#5A1582] rounded-lg transition-all duration-150 font-medium"
                  role="menuitem"
                  tabIndex={0}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          {/* Fee Link Button with Dropdown */}
          <div
            className="relative group"
            onMouseEnter={handleFeeMouseEnter}
            onMouseLeave={handleFeeMouseLeave}
            ref={feeRef}
          >
            <Button
              variant="transparent"
              size="sm"
              className="border border-[#6A1B9A] shadow-lg text-[#6A1B9A] font-semibold whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[#f3eaff] transition-all duration-200"
              aria-haspopup="true"
              aria-expanded={feeDropdownOpen}
              aria-controls="fee-dropdown"
            >
              Fee Link
            </Button>
            {/* Dropdown */}
            <div
              id="fee-dropdown"
              className={`absolute right-0 mt-2 w-48 bg-white border border-[#6A1B9A]/20 rounded-xl shadow-2xl z-50 py-2 transition-all duration-200 ${feeDropdownOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
              style={{ minWidth: "170px" }}
              role="menu"
              tabIndex={-1}
              onMouseEnter={handleFeeMouseEnter}
              onMouseLeave={handleFeeMouseLeave}
            >
              {/* Pointer Arrow */}
              <div className="absolute top-0 right-6 w-3 h-3 bg-white border-t border-l border-[#6A1B9A]/20 rotate-45 -translate-y-1/2 z-10"></div>
              {feeDropdownOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => window.location.href = option.href}
                  className="block w-full text-left px-5 py-2 text-sm text-[#6A1B9A] hover:bg-[#F3E8FF] hover:text-[#5A1582] rounded-lg transition-all duration-150 font-medium"
                  role="menuitem"
                  tabIndex={0}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* LG only: moreItemsCount=7 */}
      <div className="hidden lg:flex xl:hidden items-center justify-between gap-2 xl:gap-4">
        <div className="flex items-center justify-center min-w-[140px] sm:min-w-[160px] lg:min-w-[180px] xl:min-w-[200px]">
          <Logo width={128} height={128} className="sm:w-32 sm:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40" />
        </div>
        {/* Center: NavBar with fewer items */}
        <div className="flex-1 flex justify-center min-w-0">
          <NavBar items={navItems} moreItemsCount={5} />
        </div>
        {/* Right: Admission and Fee Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 min-w-[140px] sm:min-w-[160px] lg:min-w-[180px] xl:min-w-[200px] justify-end">
          <Button variant="transparent" size="sm" className="border border-[#6A1B9A] shadow-lg text-[#6A1B9A] font-semibold whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[#f3eaff] transition-all duration-200">Admission</Button>
          <Button variant="transparent" size="sm" className="border border-[#6A1B9A] shadow-lg text-[#6A1B9A] font-semibold whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[#f3eaff] transition-all duration-200">Fee Link</Button>
        </div>
      </div>
      {/* MD only: moreItemsCount=5 */}
      <div className="hidden md:flex lg:hidden items-center justify-between gap-2">
        <div className="flex items-center justify-start min-w-[120px] sm:min-w-[140px]">
          <Logo width={96} height={96} className="sm:w-28 sm:h-28" />
        </div>
        {/* Center: NavBar with fewer items */}
        <div className="flex-1 flex justify-center min-w-0">
          <NavBar items={navItems} moreItemsCount={4} />
        </div>
        {/* Right: Admission and Fee Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-[120px] sm:min-w-[140px] justify-end">
          <Button variant="transparent" size="sm" className="border border-[#6A1B9A] shadow-lg text-[#6A1B9A] font-semibold whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[#f3eaff] transition-all duration-200">Admission</Button>
          <Button variant="transparent" size="sm" className="border border-[#6A1B9A] shadow-lg text-[#6A1B9A] font-semibold whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[#f3eaff] transition-all duration-200">Fee Link</Button>
        </div>
      </div>
      {/* Mobile Layout: all items in hamburger */}
      <div className="flex flex-row md:hidden w-full items-center justify-between p-3">
        <div className="flex items-center">
          <Logo width={128} height={128} className="sm:w-36 sm:h-36" />
        </div>
        <div className="flex items-center">
          <NavBar items={navItems} />
        </div>
      </div>
    </header>
  );
};

export default Header;
