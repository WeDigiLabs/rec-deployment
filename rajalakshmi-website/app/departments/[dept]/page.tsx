"use client";

import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { VerticalListing, DynamicTable, LinkTable } from "@/components";
import { fetchFromApi } from "@/lib/api";
import CollegeIcon from "@/components/icons/CollegeIcon";
import BookmarkIcon from "@/components/icons/BookmarkIcon";
import FileIcon from "@/components/icons/FileIcon";
import BinocularIcon from "@/components/icons/BinocularIcon";
import LabPanelIcon from "@/components/icons/LabPanelIcon";
import TrophyRoundedIcon from "@/components/icons/TrophyRoundedIcon";
import ClassLessonIcon from "@/components/icons/ClassLessonIcon";
import StaffFileIcon from "@/components/icons/StaffFileIcon";
import GuestIcon from "@/components/icons/GuestIcon";
import StarTopperIcon from "@/components/icons/StarTopperIcon";
import AboutIcon from "@/components/icons/AboutIcon";
import AimingFilledIcon from "@/components/icons/AimingFilledIcon";
import Title from "@/components/Title";

interface RichTextNode {
  type?: string;
  children?: RichTextChild[];
  tag?: string;
  value?: {
    url?: string;
    alt?: string;
  };
}

interface RichTextChild {
  type?: string;
  text?: string;
  format?: number;
  children?: RichTextChild[];
}

interface RichTextContent {
  root?: {
    children?: RichTextNode[];
  };
}

interface ImageData {
  url?: string;
  alt?: string;
}

interface ObjectiveItem {
  id: string;
  title: string;
  description: string;
}

interface OpportunityItem {
  title?: string;
  description: string;
  image?: ImageData;
}

interface LabImageItem {
  image?: ImageData;
}

interface LabItem {
  id: string;
  name: string;
  description: string;
  images?: LabImageItem[];
}

interface ClassroomImageItem {
  image?: ImageData;
}

interface ClassroomItem {
  id: string;
  name: string;
  capacity: string;
  facilities: string;
  images?: ClassroomImageItem[];
}

interface AchievementItem {
  id: string;
  title: string;
  description: string;
  date?: string;
  category?: string;
  image?: ImageData;
}

interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  qualification?: string;
  specialization?: string;
  experience?: string;
  image?: ImageData;
}

interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
}

interface GuestLecture {
  id: string;
  title: string;
  speaker: string;
  speakerDesignation?: string;
  organization: string;
  date: string;
  image?: ImageData;
}

interface MouItem {
  id: string;
  organization: string;
  purpose: string;
  duration: string;
  status: string;
}

interface RankHolder {
  studentName?: string;
  rank?: string;
  academicYear?: string;
  cgpa?: string;
  currentPosition?: string;
  photo?: ImageData;
}

interface HeroSection {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: ImageData;
  heroContent?: RichTextContent;
}

interface Introduction {
  content?: RichTextContent;
  image?: ImageData;
  isActive?: boolean;
}

interface PEOs {
  content?: RichTextContent;
  objectives?: ObjectiveItem[];
  contentType?: 'richText' | 'table' | 'dynamicTable' | 'mixed' | 'mixedDynamic';
  tableData?: TableRow[];
  dynamicTableConfig?: DynamicTableConfig;
  tableTitle?: string;
  isActive?: boolean;
}

interface POs {
  content?: RichTextContent;
  outcomes?: ObjectiveItem[];
  contentType?: 'richText' | 'table' | 'dynamicTable' | 'mixed' | 'mixedDynamic';
  tableData?: TableRow[];
  dynamicTableConfig?: DynamicTableConfig;
  tableTitle?: string;
  isActive?: boolean;
}

interface Opportunities {
  content?: RichTextContent;
  opportunityList?: OpportunityItem[];
  contentType?: 'richText' | 'table' | 'dynamicTable' | 'mixed' | 'mixedDynamic';
  tableData?: TableRow[];
  dynamicTableConfig?: DynamicTableConfig;
  tableTitle?: string;
  isActive?: boolean;
}

interface LabFacility {
  content?: RichTextContent;
  labs?: LabItem[];
  contentType?: 'richText' | 'table' | 'dynamicTable' | 'mixed' | 'mixedDynamic';
  tableData?: TableRow[];
  dynamicTableConfig?: DynamicTableConfig;
  tableTitle?: string;
  isActive?: boolean;
}

interface Faculty {
  content?: RichTextContent;
  facultyMembers?: FacultyMember[];
  contentType?: 'richText' | 'table' | 'dynamicTable' | 'mixed' | 'mixedDynamic';
  tableData?: TableRow[];
  dynamicTableConfig?: DynamicTableConfig;
  tableTitle?: string;
  isActive?: boolean;
}

interface Achievements {
  content?: RichTextContent;
  achievementList?: AchievementItem[];
  contentType?: 'richText' | 'table' | 'dynamicTable' | 'mixed' | 'mixedDynamic';
  tableData?: TableRow[];
  dynamicTableConfig?: DynamicTableConfig;
  tableTitle?: string;
  isActive?: boolean;
}

interface Classroom {
  content?: RichTextContent;
  classrooms?: ClassroomItem[];
  contentType?: 'richText' | 'table' | 'dynamicTable' | 'mixed' | 'mixedDynamic';
  tableData?: TableRow[];
  dynamicTableConfig?: DynamicTableConfig;
  tableTitle?: string;
  isActive?: boolean;
}

interface FacultyPublications {
  content?: RichTextContent;
  publications?: Publication[];
  contentType?: 'richText' | 'table' | 'dynamicTable' | 'mixed' | 'mixedDynamic';
  tableData?: TableRow[];
  dynamicTableConfig?: DynamicTableConfig;
  tableTitle?: string;
  isActive?: boolean;
}

interface GuestLectures {
  content?: RichTextContent;
  lectures?: GuestLecture[];
  contentType?: 'richText' | 'table' | 'dynamicTable' | 'mixed' | 'mixedDynamic';
  tableData?: TableRow[];
  dynamicTableConfig?: DynamicTableConfig;
  tableTitle?: string;
  isActive?: boolean;
}

interface Mous {
  content?: RichTextContent;
  mouList?: MouItem[];
  contentType?: 'richText' | 'table' | 'dynamicTable' | 'mixed' | 'mixedDynamic';
  tableData?: TableRow[];
  dynamicTableConfig?: DynamicTableConfig;
  tableTitle?: string;
  isActive?: boolean;
}

interface UniversityRankHolders {
  content?: RichTextContent;
  rankHolders?: RankHolder[];
  contentType?: 'richText' | 'table' | 'dynamicTable' | 'mixed' | 'mixedDynamic';
  tableData?: TableRow[];
  dynamicTableConfig?: DynamicTableConfig;
  tableTitle?: string;
  isActive?: boolean;
}

interface DepartmentInfo {
  createdAt: string;
  updatedAt: string;
  name: string;
  code: string;
  slug: string;
  shortName: string;
  description: string;
  isActive: boolean;
  order: number;
  id: string;
}

// Dynamic Section Types (similar to global sections)
interface DynamicTableColumn {
  key: string;
  label: string;
  width?: string;
}

interface DynamicTableCell {
  columnKey: string;
  value: string;
  isLink?: boolean;
  linkUrl?: string;
  isExternal?: boolean;
  id?: string;
}

interface DynamicTableRow {
  data?: { [key: string]: string | number | boolean };
  rowData?: Array<DynamicTableCell>;
  id?: string;
}

interface DynamicTableConfig {
  columns: DynamicTableColumn[];
  rows: DynamicTableRow[];
  variant?: 'default' | 'bordered' | 'striped';
}

interface TableRow {
  id?: string;
  label: string;
  link: string;
  isExternal?: boolean;
}

// Union type for all section types that can be rendered
type SectionDataType = PEOs | POs | Opportunities | LabFacility | Faculty | Achievements | Classroom | FacultyPublications | GuestLectures | Mous | UniversityRankHolders | undefined;

interface DynamicSection {
  id: string;
  title: string;
  contentType?: 'richText' | 'table' | 'dynamicTable' | 'mixed' | 'mixedDynamic';
  content?: RichTextContent;
  tableData?: TableRow[];
  dynamicTableConfig?: DynamicTableConfig;
  tableTitle?: string;
  image?: ImageData;
  order: number;
  isActive: boolean;
}

type DepartmentSection = {
  id: string;
  department: string;
  departmentCode: string;
  title?: string;
  dynamicSections?: DynamicSection[];
  heroSection?: HeroSection;
  introduction?: Introduction;
  peos?: PEOs;
  pos?: POs;
  opportunities?: Opportunities;
  labFacility?: LabFacility;
  faculty?: Faculty;
  achievements?: Achievements;
  classroom?: Classroom;
  facultyPublications?: FacultyPublications;
  guestLectures?: GuestLectures;
  mous?: Mous;
  universityRankHolders?: UniversityRankHolders;
};

const getBaseSidebarItems = () => [
  { id: 0, label: "Introduction", icon: <AboutIcon /> },
  { id: 1, label: "PEOs", icon: <AimingFilledIcon /> },
  { id: 2, label: "POs", icon: <CollegeIcon /> },
  { id: 3, label: "Opportunities", icon: <BinocularIcon /> },
  { id: 4, label: "Lab Facility", icon: <LabPanelIcon /> },
  { id: 5, label: "Achievements", icon: <TrophyRoundedIcon /> },
  { id: 6, label: "Classroom", icon: <ClassLessonIcon /> },
  { id: 7, label: "Faculty", icon: <StaffFileIcon /> },
  { id: 8, label: "Faculty Publication", icon: <BookmarkIcon /> },
  { id: 9, label: "Guest Lectures", icon: <GuestIcon /> },
  { id: 10, label: "MoUs", icon: <FileIcon /> },
  { id: 11, label: "University Rank Holder", icon: <StarTopperIcon /> },
];

export default function DepartmentPage() {
  const params = useParams();
  const slugFromUrl = Array.isArray(params?.dept) ? params.dept[0] : params?.dept;
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedDept, setSelectedDept] = useState<DepartmentSection | undefined>(undefined);
  const [departmentInfo, setDepartmentInfo] = useState<DepartmentInfo | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [sidebarItems, setSidebarItems] = useState<Array<{id: string | number; label: string; icon: React.ReactNode}>>([]);

  // Convert DynamicTableRow[] to the format expected by DynamicTable component
  const convertDynamicTableData = (rows: DynamicTableRow[], columns: DynamicTableColumn[]): { rowData: { columnKey: string; value: string; isLink?: boolean; linkUrl?: string; isExternal?: boolean; }[] }[] => {
    console.log('Converting dynamic table data:', { rows, columns }); // Debug log
    
    return rows.map((row) => {
      // Handle backend structure where rowData is already in the correct format
      if (row.rowData && Array.isArray(row.rowData)) {
        const processedRowData = row.rowData.map((cell: DynamicTableCell, index: number) => {
          // Try to find matching column by index first (more reliable), then by key
          const matchingColumn = columns[index] || columns.find(col => col.key.trim() === cell.columnKey.trim());
          const finalColumnKey = matchingColumn?.key || cell.columnKey || String(index + 1);
          
          console.log(`Cell ${index}: columnKey=${cell.columnKey}, matchingColumn=${matchingColumn?.key}, finalColumnKey=${finalColumnKey}`); // Debug log
          
          return {
            columnKey: finalColumnKey,
            value: String(cell.value || ''),
            isLink: cell.isLink || false,
            linkUrl: cell.linkUrl,
            isExternal: cell.isExternal || false,
          };
        });
        
        console.log('Processed row data:', processedRowData); // Debug log
        return { rowData: processedRowData };
      }
      
      // Fallback: convert from data object format
      return {
        rowData: columns.map((column) => ({
          columnKey: column.key,
          value: String(row.data?.[column.key] || ''),
          isLink: false,
          linkUrl: undefined,
          isExternal: false,
        })),
      };
    });
  };

  // Generate dynamic sidebar items
  const generateSidebarItems = (dept: DepartmentSection | undefined, deptInfo: DepartmentInfo | undefined) => {
    const allBaseItems = getBaseSidebarItems();
    
    // Filter base items to only include sections that are active and have content available
    const availableBaseItems = allBaseItems.filter(item => {
      if (!dept) return false;
      
      switch (item.id) {
        case 0: // Introduction
          return dept.introduction && 
            dept.introduction.isActive !== false && (
              (dept.introduction.content && dept.introduction.content.root?.children?.length) ||
              deptInfo?.description
            );
        case 1: // PEOs
          return dept.peos && 
            dept.peos.isActive !== false && (
              (dept.peos.content && dept.peos.content.root?.children?.length) ||
              (dept.peos.objectives && dept.peos.objectives.length > 0) ||
              (dept.peos.tableData && dept.peos.tableData.length > 0) ||
              (dept.peos.dynamicTableConfig && dept.peos.dynamicTableConfig.rows && dept.peos.dynamicTableConfig.rows.length > 0)
            );
        case 2: // POs
          return dept.pos && 
            dept.pos.isActive !== false && (
              (dept.pos.content && dept.pos.content.root?.children?.length) ||
              (dept.pos.outcomes && dept.pos.outcomes.length > 0) ||
              (dept.pos.tableData && dept.pos.tableData.length > 0) ||
              (dept.pos.dynamicTableConfig && dept.pos.dynamicTableConfig.rows && dept.pos.dynamicTableConfig.rows.length > 0)
            );
        case 3: // Opportunities
          return dept.opportunities && 
            dept.opportunities.isActive !== false && (
              (dept.opportunities.content && dept.opportunities.content.root?.children?.length) ||
              (dept.opportunities.opportunityList && dept.opportunities.opportunityList.length > 0) ||
              (dept.opportunities.tableData && dept.opportunities.tableData.length > 0) ||
              (dept.opportunities.dynamicTableConfig && dept.opportunities.dynamicTableConfig.rows && dept.opportunities.dynamicTableConfig.rows.length > 0)
            );
        case 4: // Lab Facility
          return dept.labFacility && 
            dept.labFacility.isActive !== false && (
              (dept.labFacility.content && dept.labFacility.content.root?.children?.length) ||
              (dept.labFacility.labs && dept.labFacility.labs.length > 0) ||
              (dept.labFacility.tableData && dept.labFacility.tableData.length > 0) ||
              (dept.labFacility.dynamicTableConfig && dept.labFacility.dynamicTableConfig.rows && dept.labFacility.dynamicTableConfig.rows.length > 0)
            );
        case 5: // Achievements
          return dept.achievements && 
            dept.achievements.isActive !== false && (
              (dept.achievements.content && dept.achievements.content.root?.children?.length) ||
              (dept.achievements.achievementList && dept.achievements.achievementList.length > 0) ||
              (dept.achievements.tableData && dept.achievements.tableData.length > 0) ||
              (dept.achievements.dynamicTableConfig && dept.achievements.dynamicTableConfig.rows && dept.achievements.dynamicTableConfig.rows.length > 0)
            );
        case 6: // Classroom
          return dept.classroom && 
            dept.classroom.isActive !== false && (
              (dept.classroom.content && dept.classroom.content.root?.children?.length) ||
              (dept.classroom.classrooms && dept.classroom.classrooms.length > 0) ||
              (dept.classroom.tableData && dept.classroom.tableData.length > 0) ||
              (dept.classroom.dynamicTableConfig && dept.classroom.dynamicTableConfig.rows && dept.classroom.dynamicTableConfig.rows.length > 0)
            );
        case 7: // Faculty
          return dept.faculty && 
            dept.faculty.isActive !== false && (
              (dept.faculty.content && dept.faculty.content.root?.children?.length) ||
              (dept.faculty.facultyMembers && dept.faculty.facultyMembers.length > 0) ||
              (dept.faculty.tableData && dept.faculty.tableData.length > 0) ||
              (dept.faculty.dynamicTableConfig && dept.faculty.dynamicTableConfig.rows && dept.faculty.dynamicTableConfig.rows.length > 0)
            );
        case 8: // Faculty Publication
          return dept.facultyPublications && 
            dept.facultyPublications.isActive !== false && (
              (dept.facultyPublications.content && dept.facultyPublications.content.root?.children?.length) ||
              (dept.facultyPublications.publications && dept.facultyPublications.publications.length > 0) ||
              (dept.facultyPublications.tableData && dept.facultyPublications.tableData.length > 0) ||
              (dept.facultyPublications.dynamicTableConfig && dept.facultyPublications.dynamicTableConfig.rows && dept.facultyPublications.dynamicTableConfig.rows.length > 0)
            );
        case 9: // Guest Lectures
          return dept.guestLectures && 
            dept.guestLectures.isActive !== false && (
              (dept.guestLectures.content && dept.guestLectures.content.root?.children?.length) ||
              (dept.guestLectures.lectures && dept.guestLectures.lectures.length > 0) ||
              (dept.guestLectures.tableData && dept.guestLectures.tableData.length > 0) ||
              (dept.guestLectures.dynamicTableConfig && dept.guestLectures.dynamicTableConfig.rows && dept.guestLectures.dynamicTableConfig.rows.length > 0)
            );
        case 10: // MoUs
          return dept.mous && 
            dept.mous.isActive !== false && (
              (dept.mous.content && dept.mous.content.root?.children?.length) ||
              (dept.mous.mouList && dept.mous.mouList.length > 0) ||
              (dept.mous.tableData && dept.mous.tableData.length > 0) ||
              (dept.mous.dynamicTableConfig && dept.mous.dynamicTableConfig.rows && dept.mous.dynamicTableConfig.rows.length > 0)
            );
        case 11: // University Rank Holder
          return dept.universityRankHolders && 
            dept.universityRankHolders.isActive !== false && (
              (dept.universityRankHolders.content && dept.universityRankHolders.content.root?.children?.length) ||
              (dept.universityRankHolders.rankHolders && dept.universityRankHolders.rankHolders.length > 0) ||
              (dept.universityRankHolders.tableData && dept.universityRankHolders.tableData.length > 0) ||
              (dept.universityRankHolders.dynamicTableConfig && dept.universityRankHolders.dynamicTableConfig.rows && dept.universityRankHolders.dynamicTableConfig.rows.length > 0)
            );
        default:
          return false;
      }
    });
    
    let dynamicItems: Array<{id: string | number; label: string; icon: React.ReactNode}> = [];
    
    if (dept?.dynamicSections && Array.isArray(dept.dynamicSections)) {
      // Filter active dynamic sections and sort by order
      const activeDynamicSections = dept.dynamicSections
        .filter(section => section.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      
      dynamicItems = activeDynamicSections.map((section) => ({
        id: `dynamic-${section.id}`, // Use a unique identifier for dynamic sections
        label: section.title,
        icon: <FileIcon />, // Default icon for dynamic sections
      }));
    }
    
    return [...availableBaseItems, ...dynamicItems];
  };

  // Fetch department content directly using the slug
  useEffect(() => {
    async function fetchDepartmentData() {
      if (!slugFromUrl) return;
      
      try {
        setLoading(true);
        
        // Fetch the department content directly using the slug from URL
        const response: { success: boolean; data: { department: DepartmentInfo; sections: DepartmentSection[] } } = await fetchFromApi(`/api/department-content/${slugFromUrl}`);
        console.log('API Response:', response); // Debug log
        if (response?.success && response?.data) {
          console.log('Department Info:', response.data.department); // Debug log
          setDepartmentInfo(response.data.department);
          // Map the section data to the expected format
          const sectionData = response.data.sections?.[0];
          console.log('Section Data:', sectionData); // Debug log
          console.log('University Rank Holders in Section Data:', sectionData?.universityRankHolders); // Debug log
          if (sectionData) {
            // Use the new API structure directly - no transformation needed
            setSelectedDept(sectionData);
            // Generate sidebar items including dynamic sections
            const items = generateSidebarItems(sectionData, response.data.department);
            setSidebarItems(items);
          }
        }
      } catch (error) {
        console.error('Failed to fetch department data:', error);
        setSelectedDept(undefined);
        setDepartmentInfo(undefined);
        // Set empty sidebar items if data fetch fails since no content is available
        setSidebarItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDepartmentData();
  }, [slugFromUrl]);

  function parseRichText(content: RichTextContent | undefined): React.ReactElement[] {
    if (!content || !content.root || !Array.isArray(content.root.children)) return [];
    
    return content.root.children.map((node: RichTextNode, index: number) => {
      if (node.type === 'paragraph') {
        const text = node.children?.map((child: RichTextChild, childIndex: number) => {
          if (child.type === 'text') {
            const style: React.CSSProperties = {};
            if (child.format === 1) style.fontWeight = 'bold';
            if (child.format === 2) style.fontStyle = 'italic';
            return <span key={childIndex} style={style}>{child.text}</span>;
          } else if (child.type === 'linebreak') {
            return <br key={childIndex} />;
          }
          return child.text || '';
        }) || [];
        
        return (
          <p key={index} className="mb-4 text-[#333] text-sm sm:text-base md:text-lg">
            {text}
          </p>
        );
      } else if (node.type === 'heading') {
        const text = node.children?.map((child: RichTextChild) => child.text || '').join('') || '';
        const tag = node.tag || 'h2';
        if (tag === 'h1') {
          return (
            <h1 key={index} className="text-[#6A1B9A] font-bold text-xl sm:text-2xl md:text-3xl mb-4">
              {text}
            </h1>
          );
        } else if (tag === 'h3') {
          return (
            <h3 key={index} className="text-[#6A1B9A] font-bold text-base sm:text-lg md:text-xl mb-4">
              {text}
            </h3>
          );
        } else {
          return (
            <h2 key={index} className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-4">
              {text}
            </h2>
          );
        }
      } else if (node.type === 'list') {
        const isOrderedList = node.tag === 'ol';
        return isOrderedList ? (
          <ol key={index} className="list-decimal pl-6 text-[#333] space-y-2 mb-4 text-sm sm:text-base md:text-lg">
            {node.children?.map((listItem: RichTextChild, itemIndex: number) => (
              <li key={itemIndex}>
                {listItem.children?.map((child: RichTextChild) => child.text || '').join('') || ''}
              </li>
            ))}
          </ol>
        ) : (
          <ul key={index} className="list-disc pl-6 text-[#333] space-y-2 mb-4 text-sm sm:text-base md:text-lg">
            {node.children?.map((listItem: RichTextChild, itemIndex: number) => (
              <li key={itemIndex}>
                {listItem.children?.map((child: RichTextChild) => child.text || '').join('') || ''}
              </li>
            ))}
          </ul>
        );
      } else if (node.type === 'upload' && node.value?.url) {
        return (
          <div key={index} className="w-full flex justify-center my-4">
            <Image
              src={getImageUrl(node.value.url)}
              alt={node.value.alt || 'Content Image'}
              width={800}
              height={400}
              className="rounded-xl object-cover w-full max-w-3xl h-72 md:h-80"
            />
          </div>
        );
      }
      
      // Fallback for text content
      const text = node.children?.map((child: RichTextChild) => child.text || '').join('') || '';
      if (text.trim()) {
        return (
          <p key={index} className="mb-4 text-[#333] text-sm sm:text-base md:text-lg">
            {text}
          </p>
        );
      }
      
      return <div key={index}></div>;
    }).filter(Boolean);
  }

  function getImageUrl(url: string | undefined): string {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`;
  }

  // Component to render dynamic section content
  const renderDynamicSection = (section: DynamicSection) => {
    const formatTableData = (tableData: TableRow[]) => {
      return tableData.map((row, index) => ({
        id: typeof row.id === 'string' ? parseInt(row.id) || index + 1 : row.id || index + 1,
        label: row.label,
        link: row.link,
        isExternal: row.isExternal || false,
      }));
    };

    switch (section.contentType) {
      case 'table':
        return (
          <div className="space-y-4">
            {section.tableTitle && (
              <h3 className="text-lg font-semibold text-[#6A1B9A] border-b border-purple-100 pb-2">
                {section.tableTitle}
              </h3>
            )}
            {section.tableData && section.tableData.length > 0 ? (
              <LinkTable 
                tableData={formatTableData(section.tableData)} 
                title={section.tableTitle || "Table Items"}
              />
            ) : (
              <p className="text-gray-500 italic">No table data available</p>
            )}
          </div>
        );

      case 'dynamicTable':
        return (
          <div className="space-y-4">
            {section.tableTitle && (
              <h3 className="text-lg font-semibold text-[#6A1B9A] border-b border-purple-100 pb-2">
                {section.tableTitle}
              </h3>
            )}
            {section.dynamicTableConfig && section.dynamicTableConfig.columns && section.dynamicTableConfig.rows ? (
              <DynamicTable
                columns={section.dynamicTableConfig.columns}
                data={convertDynamicTableData(section.dynamicTableConfig.rows, section.dynamicTableConfig.columns)}
                title={section.tableTitle}
                variant={section.dynamicTableConfig.variant || 'default'}
              />
            ) : (
              <p className="text-gray-500 italic">No dynamic table data available</p>
            )}
          </div>
        );

      case 'mixed':
        return (
          <div className="space-y-6">
            {/* Rich Text Content */}
            {section.content && (
              <div className="text-[#333] text-sm sm:text-base md:text-lg">
                {parseRichText(section.content)}
              </div>
            )}
            
            {/* Table Data */}
            {section.tableData && section.tableData.length > 0 && (
              <div className="space-y-4">
                {section.tableTitle && (
                  <h3 className="text-lg font-semibold text-[#6A1B9A] border-b border-purple-100 pb-2">
                    {section.tableTitle}
                  </h3>
                )}
                <LinkTable 
                  tableData={formatTableData(section.tableData)} 
                  title={section.tableTitle || "Related Links"}
                />
              </div>
            )}
          </div>
        );

      case 'mixedDynamic':
        return (
          <div className="space-y-6">
            {/* Rich Text Content */}
            {section.content && (
              <div className="text-[#333] text-sm sm:text-base md:text-lg">
                {parseRichText(section.content)}
              </div>
            )}
            
            {/* Dynamic Table Data */}
            {section.dynamicTableConfig && section.dynamicTableConfig.columns && section.dynamicTableConfig.rows && (
              <div className="space-y-4">
                {section.tableTitle && (
                  <h3 className="text-lg font-semibold text-[#6A1B9A] border-b border-purple-100 pb-2">
                    {section.tableTitle}
                  </h3>
                )}
                <DynamicTable
                  columns={section.dynamicTableConfig.columns}
                  data={convertDynamicTableData(section.dynamicTableConfig.rows, section.dynamicTableConfig.columns)}
                  title={section.tableTitle || "Data Table"}
                  variant={section.dynamicTableConfig.variant || 'default'}
                />
              </div>
            )}
          </div>
        );

      default: // 'richText'
        return (
          <div className="text-[#333] text-sm sm:text-base md:text-lg">
            {section.content ? parseRichText(section.content) : (
              <p className="text-gray-500 italic">No content available</p>
            )}
          </div>
        );
    }
  };

  // Helper function to render section content with all content type checks
  const renderSectionContent = (
    sectionData: SectionDataType,
    sectionTitle: string,
    titleOverride?: string
  ) => {
    const elements = sectionData && sectionData.content ? parseRichText(sectionData.content) : [];
    const displayTitle = titleOverride || sectionTitle;

    // Check if we have dynamic table configuration
    if (sectionData && sectionData.contentType === 'dynamicTable' && sectionData.dynamicTableConfig && sectionData.dynamicTableConfig.columns && sectionData.dynamicTableConfig.rows) {
      return (
        <>
          <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">{displayTitle}</h2>
          {elements.length > 0 && elements}
          <DynamicTable
            columns={sectionData.dynamicTableConfig.columns}
            data={convertDynamicTableData(sectionData.dynamicTableConfig.rows, sectionData.dynamicTableConfig.columns)}
            title={sectionData.tableTitle || sectionTitle}
            variant={sectionData.dynamicTableConfig.variant || 'default'}
          />
        </>
      );
    }

    // Check if we have table data
    if (sectionData && sectionData.contentType === 'table' && sectionData.tableData && sectionData.tableData.length > 0) {
      const formatTableData = (tableData: TableRow[]) => {
        return tableData.map((row, index) => ({
          id: typeof row.id === 'string' ? parseInt(row.id) || index + 1 : row.id || index + 1,
          label: row.label,
          link: row.link,
          isExternal: row.isExternal || false,
        }));
      };
      
      return (
        <>
          <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">{displayTitle}</h2>
          {elements.length > 0 && elements}
          <LinkTable 
            tableData={formatTableData(sectionData.tableData)} 
            title={sectionData.tableTitle || sectionTitle}
          />
        </>
      );
    }

    // Check for mixed content (rich text + link table)
    if (sectionData && sectionData.contentType === 'mixed' && sectionData.tableData && sectionData.tableData.length > 0) {
      const formatTableData = (tableData: TableRow[]) => {
        return tableData.map((row, index) => ({
          id: typeof row.id === 'string' ? parseInt(row.id) || index + 1 : row.id || index + 1,
          label: row.label,
          link: row.link,
          isExternal: row.isExternal || false,
        }));
      };
      
      return (
        <>
          <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">{displayTitle}</h2>
          {elements.length > 0 && (
            <div className="mb-6">
              {elements}
            </div>
          )}
          <LinkTable 
            tableData={formatTableData(sectionData.tableData)} 
            title={sectionData.tableTitle || sectionTitle}
          />
        </>
      );
    }

    // Check for mixed dynamic content (rich text + dynamic table)
    if (sectionData && sectionData.contentType === 'mixedDynamic' && sectionData.dynamicTableConfig && sectionData.dynamicTableConfig.columns && sectionData.dynamicTableConfig.rows) {
      return (
        <>
          <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">{displayTitle}</h2>
          {elements.length > 0 && (
            <div className="mb-6">
              {elements}
            </div>
          )}
          <DynamicTable
            columns={sectionData.dynamicTableConfig.columns}
            data={convertDynamicTableData(sectionData.dynamicTableConfig.rows, sectionData.dynamicTableConfig.columns)}
            title={sectionData.tableTitle || sectionTitle}
            variant={sectionData.dynamicTableConfig.variant || 'default'}
          />
        </>
      );
    }

    // Default: return null, let the calling code handle the fallback
    return null;
  };

  function getSectionContent(dept: DepartmentSection | undefined, sidebarIndex: number) {
    if (!dept) return <div className="text-[#888] text-center py-16 text-sm sm:text-base md:text-lg">Section coming soon...</div>;
    
    // Get the actual section ID from the sidebar items instead of assuming index = section ID
    const sidebarItem = sidebarItems[sidebarIndex];
    if (!sidebarItem) return <div className="text-[#888] text-center py-16 text-sm sm:text-base md:text-lg">Section not found...</div>;
    
    const sectionId = sidebarItem.id;
    
    // Check if this is a dynamic section
    if (typeof sectionId === 'string' && sectionId.startsWith('dynamic-')) {
      const dynamicSectionId = sectionId.replace('dynamic-', '');
      const dynamicSection = dept.dynamicSections?.find(section => section.id === dynamicSectionId);
      
      if (dynamicSection) {
        return (
          <>
            <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-4">{dynamicSection.title}</h2>
            {renderDynamicSection(dynamicSection)}
          </>
        );
      }
    }
    
    // Handle base sections using the actual section ID
    switch (sectionId) {
      case 0: {
        const introduction = dept.introduction;
        const introElements = introduction && introduction.content ? parseRichText(introduction.content) : [];
        return (
          <>
            <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">Introduction</h2>
            {introElements.length > 0 ? introElements : (
              <p className="mb-4 text-[#333] text-sm sm:text-base md:text-lg">
                {departmentInfo?.description || 'Department information will be available soon.'}
              </p>
            )}
          </>
        );
      }
      case 1: {
        const peos = dept.peos;
        const peoElements = peos && peos.content ? parseRichText(peos.content) : [];
        const objectives = peos && Array.isArray(peos.objectives) ? peos.objectives : [];
        
        // Check if we have dynamic table configuration
        if (peos && peos.contentType === 'dynamicTable' && peos.dynamicTableConfig && peos.dynamicTableConfig.columns && peos.dynamicTableConfig.rows) {
          return (
            <>
              <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">PEOs</h2>
              {peoElements.length > 0 && peoElements}
              <DynamicTable
                columns={peos.dynamicTableConfig.columns}
                data={convertDynamicTableData(peos.dynamicTableConfig.rows, peos.dynamicTableConfig.columns)}
                title="Program Educational Objectives"
                variant={peos.dynamicTableConfig.variant || 'default'}
              />
            </>
          );
        }
        
        // Check if we have table data
        if (peos && peos.contentType === 'table' && peos.tableData && peos.tableData.length > 0) {
          const formatTableData = (tableData: TableRow[]) => {
            return tableData.map((row, index) => ({
              id: typeof row.id === 'string' ? parseInt(row.id) || index + 1 : row.id || index + 1,
              label: row.label,
              link: row.link,
              isExternal: row.isExternal || false,
            }));
          };
          
          return (
            <>
              <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">PEOs</h2>
              {peoElements.length > 0 && peoElements}
              <LinkTable 
                tableData={formatTableData(peos.tableData)} 
                title="Program Educational Objectives"
              />
            </>
          );
        }
        
        // Check for mixed content (rich text + link table)
        if (peos && peos.contentType === 'mixed' && peos.tableData && peos.tableData.length > 0) {
          const formatTableData = (tableData: TableRow[]) => {
            return tableData.map((row, index) => ({
              id: typeof row.id === 'string' ? parseInt(row.id) || index + 1 : row.id || index + 1,
              label: row.label,
              link: row.link,
              isExternal: row.isExternal || false,
            }));
          };
          
          return (
            <>
              <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">PEOs</h2>
              {peoElements.length > 0 && (
                <div className="mb-6">
                  {peoElements}
                </div>
              )}
              <LinkTable 
                tableData={formatTableData(peos.tableData)} 
                title={peos.tableTitle || "Program Educational Objectives"}
              />
            </>
          );
        }
        
        // Check for mixed dynamic content (rich text + dynamic table)
        if (peos && peos.contentType === 'mixedDynamic' && peos.dynamicTableConfig && peos.dynamicTableConfig.columns && peos.dynamicTableConfig.rows) {
          return (
            <>
              <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">PEOs</h2>
              {peoElements.length > 0 && (
                <div className="mb-6">
                  {peoElements}
                </div>
              )}
              <DynamicTable
                columns={peos.dynamicTableConfig.columns}
                data={convertDynamicTableData(peos.dynamicTableConfig.rows, peos.dynamicTableConfig.columns)}
                title={peos.tableTitle || "Program Educational Objectives"}
                variant={peos.dynamicTableConfig.variant || 'default'}
              />
            </>
          );
        }
        
        return (
          <>
            <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">PEOs</h2>
            {peoElements}
            <ul className="list-disc pl-6 text-[#333] space-y-2 mb-8 text-sm sm:text-base md:text-lg">
              {objectives.map((obj: ObjectiveItem) => (
                <li key={obj.id}><b>{obj.title}:</b> {obj.description}</li>
              ))}
            </ul>
          </>
        );
      }
      case 2: {
        const pos = dept.pos;
        const posElements = pos && pos.content ? parseRichText(pos.content) : [];
        const outcomes = pos && Array.isArray(pos.outcomes) ? pos.outcomes : [];
        
        // Check if we have dynamic table configuration
        if (pos && pos.contentType === 'dynamicTable' && pos.dynamicTableConfig && pos.dynamicTableConfig.columns && pos.dynamicTableConfig.rows) {
          return (
            <>
              <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">POs</h2>
              {posElements.length > 0 && posElements}
              <DynamicTable
                columns={pos.dynamicTableConfig.columns}
                data={convertDynamicTableData(pos.dynamicTableConfig.rows, pos.dynamicTableConfig.columns)}
                title="Program Outcomes"
                variant={pos.dynamicTableConfig.variant || 'default'}
              />
            </>
          );
        }
        
        // Check if we have table data
        if (pos && pos.contentType === 'table' && pos.tableData && pos.tableData.length > 0) {
          const formatTableData = (tableData: TableRow[]) => {
            return tableData.map((row, index) => ({
              id: typeof row.id === 'string' ? parseInt(row.id) || index + 1 : row.id || index + 1,
              label: row.label,
              link: row.link,
              isExternal: row.isExternal || false,
            }));
          };
          
          return (
            <>
              <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">POs</h2>
              {posElements.length > 0 && posElements}
              <LinkTable 
                tableData={formatTableData(pos.tableData)} 
                title="Program Outcomes"
              />
            </>
          );
        }
        
        // Check for mixed content (rich text + link table)
        if (pos && pos.contentType === 'mixed' && pos.tableData && pos.tableData.length > 0) {
          const formatTableData = (tableData: TableRow[]) => {
            return tableData.map((row, index) => ({
              id: typeof row.id === 'string' ? parseInt(row.id) || index + 1 : row.id || index + 1,
              label: row.label,
              link: row.link,
              isExternal: row.isExternal || false,
            }));
          };
          
          return (
            <>
              <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">POs</h2>
              {posElements.length > 0 && (
                <div className="mb-6">
                  {posElements}
                </div>
              )}
              <LinkTable 
                tableData={formatTableData(pos.tableData)} 
                title={pos.tableTitle || "Program Outcomes"}
              />
            </>
          );
        }
        
        // Check for mixed dynamic content (rich text + dynamic table)
        if (pos && pos.contentType === 'mixedDynamic' && pos.dynamicTableConfig && pos.dynamicTableConfig.columns && pos.dynamicTableConfig.rows) {
          return (
            <>
              <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">POs</h2>
              {posElements.length > 0 && (
                <div className="mb-6">
                  {posElements}
                </div>
              )}
              <DynamicTable
                columns={pos.dynamicTableConfig.columns}
                data={convertDynamicTableData(pos.dynamicTableConfig.rows, pos.dynamicTableConfig.columns)}
                title={pos.tableTitle || "Program Outcomes"}
                variant={pos.dynamicTableConfig.variant || 'default'}
              />
            </>
          );
        }
        
        return (
          <>
            <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">POs</h2>
            {posElements}
            <ul className="list-disc pl-6 text-[#333] space-y-2 mb-8 text-sm sm:text-base md:text-lg">
              {outcomes.map((obj: ObjectiveItem) => (
                <li key={obj.id}><b>{obj.title}:</b> {obj.description}</li>
              ))}
            </ul>
          </>
        );
      }
      case 3: {
        const opp = dept.opportunities;
        const oppElements = opp && opp.content ? parseRichText(opp.content) : [];
        const oppList = opp && Array.isArray(opp.opportunityList) ? opp.opportunityList : [];
        
        // Check if we have dynamic table configuration
        if (opp && opp.contentType === 'dynamicTable' && opp.dynamicTableConfig && opp.dynamicTableConfig.columns && opp.dynamicTableConfig.rows) {
          return (
            <>
              <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">Opportunities</h2>
              {oppElements.length > 0 && oppElements}
              <DynamicTable
                columns={opp.dynamicTableConfig.columns}
                data={convertDynamicTableData(opp.dynamicTableConfig.rows, opp.dynamicTableConfig.columns)}
                title="Career Opportunities"
                variant={opp.dynamicTableConfig.variant || 'default'}
              />
            </>
          );
        }
        
        // Check if we have table data
        if (opp && opp.contentType === 'table' && opp.tableData && opp.tableData.length > 0) {
          const formatTableData = (tableData: TableRow[]) => {
            return tableData.map((row, index) => ({
              id: typeof row.id === 'string' ? parseInt(row.id) || index + 1 : row.id || index + 1,
              label: row.label,
              link: row.link,
              isExternal: row.isExternal || false,
            }));
          };
          
          return (
            <>
              <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">Opportunities</h2>
              {oppElements.length > 0 && oppElements}
              <LinkTable 
                tableData={formatTableData(opp.tableData)} 
                title="Career Opportunities"
              />
            </>
          );
        }
        
        // Check for mixed content (rich text + link table)
        if (opp && opp.contentType === 'mixed' && opp.tableData && opp.tableData.length > 0) {
          const formatTableData = (tableData: TableRow[]) => {
            return tableData.map((row, index) => ({
              id: typeof row.id === 'string' ? parseInt(row.id) || index + 1 : row.id || index + 1,
              label: row.label,
              link: row.link,
              isExternal: row.isExternal || false,
            }));
          };
          
          return (
            <>
              <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">Opportunities</h2>
              {oppElements.length > 0 && (
                <div className="mb-6">
                  {oppElements}
                </div>
              )}
              <LinkTable 
                tableData={formatTableData(opp.tableData)} 
                title={opp.tableTitle || "Career Opportunities"}
              />
            </>
          );
        }
        
        // Check for mixed dynamic content (rich text + dynamic table)
        if (opp && opp.contentType === 'mixedDynamic' && opp.dynamicTableConfig && opp.dynamicTableConfig.columns && opp.dynamicTableConfig.rows) {
          return (
            <>
              <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">Opportunities</h2>
              {oppElements.length > 0 && (
                <div className="mb-6">
                  {oppElements}
                </div>
              )}
              <DynamicTable
                columns={opp.dynamicTableConfig.columns}
                data={convertDynamicTableData(opp.dynamicTableConfig.rows, opp.dynamicTableConfig.columns)}
                title={opp.tableTitle || "Career Opportunities"}
                variant={opp.dynamicTableConfig.variant || 'default'}
              />
            </>
          );
        }
        
        return (
          <>
            <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">Opportunities</h2>
            {oppElements}
            <ul className="list-disc pl-6 text-[#333] space-y-6 mb-8 text-sm sm:text-base md:text-lg">
              {oppList.map((obj: OpportunityItem, idx: number) => (
                <li key={idx}>
                  <b>{obj.title || 'Opportunity'}:</b> {obj.description}
                  {obj.image && obj.image.url && (
                    <div className="w-full flex justify-center my-4">
                      <Image
                        src={getImageUrl(obj.image.url)}
                        alt={obj.image.alt || obj.title || 'Opportunity'}
                        width={800}
                        height={340}
                        className="rounded-xl object-cover w-full max-w-3xl h-72 md:h-80"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        );
      }
      case 4: {
        const lab = dept.labFacility;
        const labElements = lab && lab.content ? parseRichText(lab.content) : [];
        const labs = lab && Array.isArray(lab.labs) ? lab.labs : [];
        
        // Check if we have dynamic table configuration
        if (lab && lab.contentType === 'dynamicTable' && lab.dynamicTableConfig && lab.dynamicTableConfig.columns && lab.dynamicTableConfig.rows) {
          return (
            <>
              <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">Lab Facility</h2>
              {labElements.length > 0 && labElements}
              <DynamicTable
                columns={lab.dynamicTableConfig.columns}
                data={convertDynamicTableData(lab.dynamicTableConfig.rows, lab.dynamicTableConfig.columns)}
                title="Laboratory Facilities"
                variant={lab.dynamicTableConfig.variant || 'default'}
              />
            </>
          );
        }
        
        // Check if we have table data
        if (lab && lab.contentType === 'table' && lab.tableData && lab.tableData.length > 0) {
          const formatTableData = (tableData: TableRow[]) => {
            return tableData.map((row, index) => ({
              id: typeof row.id === 'string' ? parseInt(row.id) || index + 1 : row.id || index + 1,
              label: row.label,
              link: row.link,
              isExternal: row.isExternal || false,
            }));
          };
          
          return (
            <>
              <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">Lab Facility</h2>
              {labElements.length > 0 && labElements}
              <LinkTable 
                tableData={formatTableData(lab.tableData)} 
                title="Laboratory Facilities"
              />
            </>
          );
        }
        
        // Check for mixed content (rich text + link table)
        if (lab && lab.contentType === 'mixed' && lab.tableData && lab.tableData.length > 0) {
          const formatTableData = (tableData: TableRow[]) => {
            return tableData.map((row, index) => ({
              id: typeof row.id === 'string' ? parseInt(row.id) || index + 1 : row.id || index + 1,
              label: row.label,
              link: row.link,
              isExternal: row.isExternal || false,
            }));
          };
          
          return (
            <>
              <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">Lab Facility</h2>
              {labElements.length > 0 && (
                <div className="mb-6">
                  {labElements}
                </div>
              )}
              <LinkTable 
                tableData={formatTableData(lab.tableData)} 
                title={lab.tableTitle || "Laboratory Facilities"}
              />
            </>
          );
        }
        
        // Check for mixed dynamic content (rich text + dynamic table)
        if (lab && lab.contentType === 'mixedDynamic' && lab.dynamicTableConfig && lab.dynamicTableConfig.columns && lab.dynamicTableConfig.rows) {
          return (
            <>
              <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">Lab Facility</h2>
              {labElements.length > 0 && (
                <div className="mb-6">
                  {labElements}
                </div>
              )}
              <DynamicTable
                columns={lab.dynamicTableConfig.columns}
                data={convertDynamicTableData(lab.dynamicTableConfig.rows, lab.dynamicTableConfig.columns)}
                title={lab.tableTitle || "Laboratory Facilities"}
                variant={lab.dynamicTableConfig.variant || 'default'}
              />
            </>
          );
        }
        
        return (
          <>
            <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">Lab Facility</h2>
            {labElements}
            <ul className="list-disc pl-6 text-[#333] space-y-6 mb-8 text-sm sm:text-base md:text-lg">
              {labs.map((obj: LabItem) => (
                <li key={obj.id}>
                  <b>{obj.name}:</b> {obj.description}
                  {Array.isArray(obj.images) && obj.images.length > 0 && obj.images.map((img: LabImageItem, idx: number) => img.image && img.image.url && (
                    <div key={idx} className="w-full flex justify-center my-4">
                      <Image
                        src={getImageUrl(img.image.url)}
                        alt={img.image.alt || obj.name}
                        width={800}
                        height={340}
                        className="rounded-xl object-cover w-full max-w-3xl h-72 md:h-80"
                      />
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </>
        );
      }
      case 5: {
        const ach = dept.achievements;
        const achList = ach && Array.isArray(ach.achievementList) ? ach.achievementList : [];
        
        // Try to render with the helper function first
        const renderedContent = renderSectionContent(ach, "Achievements");
        if (renderedContent) {
          return renderedContent;
        }
        
        // Fallback to default rich text + list rendering
        const achElements = ach && ach.content ? parseRichText(ach.content) : [];
        return (
          <>
            <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">Achievements</h2>
            {achElements}
            <ul className="list-disc pl-6 text-[#333] space-y-6 mb-8 text-sm sm:text-base md:text-lg">
              {achList.map((obj: AchievementItem) => (
                <li key={obj.id}>
                  <b>{obj.title}:</b> {obj.description}
                  {obj.date && <span className="text-[#666]"> - {new Date(obj.date).toLocaleDateString()}</span>}
                  {obj.category && <span className="text-[#666]"> ({obj.category})</span>}
                  {obj.image && obj.image.url && (
                    <div className="w-full flex justify-center my-4">
                      <Image
                        src={getImageUrl(obj.image.url)}
                        alt={obj.image.alt || obj.title}
                        width={800}
                        height={340}
                        className="rounded-xl object-cover w-full max-w-3xl h-72 md:h-80"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        );
      }
      case 6: {
        const classroom = dept.classroom;
        const classList = classroom && Array.isArray(classroom.classrooms) ? classroom.classrooms : [];
        
        // Try to render with the helper function first
        const renderedContent = renderSectionContent(classroom, "Classroom");
        if (renderedContent) {
          return renderedContent;
        }
        
        // Fallback to default rich text + list rendering
        const classDesc = classroom && classroom.content ? parseRichText(classroom.content) : [];
        return (
          <>
            <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">Classroom</h2>
            {classDesc}
            <ul className="list-disc pl-6 text-[#333] space-y-6 mb-8 text-sm sm:text-base md:text-lg">
              {classList.map((obj: ClassroomItem) => (
                <li key={obj.id}>
                  <b>{obj.name}:</b> Capacity: {obj.capacity}, Facilities: {obj.facilities}
                  {Array.isArray(obj.images) && obj.images.length > 0 && obj.images.map((img: ClassroomImageItem, idx: number) => img.image && img.image.url && (
                    <div key={idx} className="w-full flex justify-center my-4">
                      <Image
                        src={getImageUrl(img.image.url)}
                        alt={img.image.alt || obj.name}
                        width={800}
                        height={340}
                        className="rounded-xl object-cover w-full max-w-3xl h-72 md:h-80"
                      />
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </>
        );
      }
      case 7: {
        const faculty = dept.faculty;
        const facultyList = faculty && Array.isArray(faculty.facultyMembers) ? faculty.facultyMembers : [];
        
        // Try to render with the helper function first
        const renderedContent = renderSectionContent(faculty, "Faculty");
        if (renderedContent) {
          return renderedContent;
        }
        
        // Fallback to default rich text + list rendering
        const facultyDesc = faculty && faculty.content ? parseRichText(faculty.content) : [];
        return (
          <>
            <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">Faculty</h2>
            {facultyDesc}
            <ul className="list-disc pl-6 text-[#333] space-y-6 mb-8 text-sm sm:text-base md:text-lg">
              {facultyList.map((obj: FacultyMember) => (
                <li key={obj.id}>
                  <b>{obj.name}:</b> {obj.designation}
                  {obj.qualification && `, ${obj.qualification}`}
                  {obj.specialization && `, ${obj.specialization}`}
                  {obj.experience && `, Experience: ${obj.experience}`}
                  {obj.image && obj.image.url && (
                    <div className="w-full flex justify-center my-4">
                      <Image
                        src={getImageUrl(obj.image.url)}
                        alt={obj.image.alt || obj.name}
                        width={400}
                        height={200}
                        className="rounded-xl object-cover w-full max-w-xl h-40 md:h-48"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        );
      }
      case 8: {
        const pub = dept.facultyPublications;
        const pubList = pub && Array.isArray(pub.publications) ? pub.publications : [];
        
        // Try to render with the helper function first
        const renderedContent = renderSectionContent(pub, "Faculty Publication");
        if (renderedContent) {
          return renderedContent;
        }
        
        // Fallback to default rich text + list rendering
        const pubDesc = pub && pub.content ? parseRichText(pub.content) : [];
        return (
          <>
            <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">Faculty Publication</h2>
            {pubDesc}
            <ul className="list-disc pl-6 text-[#333] space-y-2 mb-8 text-sm sm:text-base md:text-lg">
              {pubList.map((obj: Publication) => (
                <li key={obj.id}><b>{obj.title}:</b> {obj.authors}, {obj.journal}, {obj.year}</li>
              ))}
            </ul>
          </>
        );
      }
      case 9: {
        const guest = dept.guestLectures;
        const guestList = guest && Array.isArray(guest.lectures) ? guest.lectures : [];
        
        // Try to render with the helper function first
        const renderedContent = renderSectionContent(guest, "Guest Lectures");
        if (renderedContent) {
          return renderedContent;
        }
        
        // Fallback to default rich text + list rendering
        const guestDesc = guest && guest.content ? parseRichText(guest.content) : [];
        return (
          <>
            <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">Guest Lectures</h2>
            {guestDesc}
            <ul className="list-disc pl-6 text-[#333] space-y-6 mb-8 text-sm sm:text-base md:text-lg">
              {guestList.map((obj: GuestLecture) => (
                <li key={obj.id}>
                  <b>{obj.title}:</b> {obj.speaker}
                  {obj.speakerDesignation && ` - ${obj.speakerDesignation}`}
                  , {obj.organization}
                  {obj.date && `, ${new Date(obj.date).toLocaleDateString()}`}
                  {obj.image && obj.image.url && (
                    <div className="w-full flex justify-center my-4">
                      <Image
                        src={getImageUrl(obj.image.url)}
                        alt={obj.image.alt || obj.title}
                        width={800}
                        height={340}
                        className="rounded-xl object-cover w-full max-w-3xl h-72 md:h-80"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        );
      }
      case 10: {
        const mous = dept.mous;
        const mouList = mous && Array.isArray(mous.mouList) ? mous.mouList : [];
        
        // Try to render with the helper function first
        const renderedContent = renderSectionContent(mous, "MoUs");
        if (renderedContent) {
          return renderedContent;
        }
        
        // Fallback to default rich text + list rendering
        const mouDesc = mous && mous.content ? parseRichText(mous.content) : [];
        return (
          <>
            <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">MoUs</h2>
            {mouDesc}
            <ul className="list-disc pl-6 text-[#333] space-y-2 mb-8 text-sm sm:text-base md:text-lg">
              {mouList.map((obj: MouItem) => (
                <li key={obj.id}><b>{obj.organization}:</b> {obj.purpose}, Duration: {obj.duration}, Status: {obj.status}</li>
              ))}
            </ul>
          </>
        );
      }
      case 11: {
        const rank = dept.universityRankHolders;
        const rankList = rank && Array.isArray(rank.rankHolders) ? rank.rankHolders : [];
        
        console.log('University Rank Holders Data:', rank); // Debug log
        
        // Try to render with the helper function first
        const renderedContent = renderSectionContent(rank, "University Rank Holder");
        if (renderedContent) {
          return renderedContent;
        }
        
        // Fallback to list format if available
        const rankDesc = rank && rank.content ? parseRichText(rank.content) : [];
        return (
          <>
            <h2 className="text-[#6A1B9A] font-bold text-lg sm:text-xl md:text-2xl mb-2">University Rank Holder</h2>
            {rankDesc}
            {rankList.length > 0 ? (
              <ul className="list-disc pl-6 text-[#333] space-y-6 mb-8 text-sm sm:text-base md:text-lg">
                {rankList.map((obj: RankHolder, idx: number) => (
                  <li key={idx}>
                    <b>{obj.studentName || 'Student'}:</b> 
                    {obj.rank && ` Rank: ${obj.rank}`}
                    {obj.academicYear && ` Year: ${obj.academicYear}`}
                    {obj.cgpa && ` CGPA: ${obj.cgpa}`}
                    {obj.currentPosition && ` Position: ${obj.currentPosition}`}
                    {obj.photo && obj.photo.url && (
                      <div className="w-full flex justify-center my-4">
                        <Image
                          src={getImageUrl(obj.photo.url)}
                          alt={obj.photo.alt || obj.studentName || 'Student'}
                          width={400}
                          height={200}
                          className="rounded-xl object-cover w-full max-w-xl h-40 md:h-48"
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No rank holders data available</p>
            )}
          </>
        );
      }
      default:
        return (
          <div className="text-[#888] text-center py-16 text-sm sm:text-base md:text-lg">
            Section coming soon...
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen font-sans relative overflow-hidden">
      <Title 
        title={departmentInfo?.name || "Department"} 
        badgeSrc="/assets/icons/ariia.svg" 
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Departments", href: "/departments" },
          { label: departmentInfo?.name || "Department", isCurrentPage: true }
        ]}
      />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 py-8 px-4">
        <aside className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0">
          <VerticalListing
            title="SECTIONS"
            items={sidebarItems.map((item) => ({
              id: item.id,
              title: item.label,
              buttonText: item.label,
              icon: item.icon,
            }))}
            selectedItemId={activeIndex}
            onItemSelect={(itemId) => setActiveIndex(Number(itemId))}
            className="!max-w-full"
          />
        </aside>
        <main className="flex-1 rounded-2xl">
          {loading ? (
            <div className="text-[#888] text-center py-16 text-sm sm:text-base md:text-lg">
              Loading department information...
            </div>
          ) : (
            getSectionContent(selectedDept, activeIndex)
          )}
        </main>
      </div>
    </div>
  );
}
