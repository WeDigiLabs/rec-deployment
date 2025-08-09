// Utility functions for the unified page system

export interface PageSource {
  type: 'global' | 'dynamic';
  collection: 'globals' | 'dynamic-pages';
}

interface HeroImage {
  id: string;
  alt?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  url?: string;
  thumbnailURL?: string;
}

interface SEOData {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogImage?: HeroImage;
}

interface RichTextChild {
  detail?: number;
  format?: number;
  mode?: string;
  style?: string;
  text?: string;
  type?: string;
  version?: number;
  children?: RichTextChild[];
  url?: string;
  fields?: { url?: string };
}

interface RichTextNode {
  children?: RichTextChild[];
  direction?: string;
  format?: string;
  indent?: number;
  type?: string;
  version?: number;
  textFormat?: number;
  textStyle?: string;
  tag?: string;
  listType?: string;
  url?: string;
  fields?: { url?: string };
}

interface RichTextContent {
  root?: {
    children?: RichTextNode[];
    direction?: string;
    format?: string;
    indent?: number;
    type?: string;
    version?: number;
  };
}

interface TableRow {
  id?: number;
  label: string;
  link: string;
  isExternal?: boolean;
}

interface DynamicTableColumn {
  key: string;
  label: string;
  width?: string;
}

interface DynamicTableRowCell {
  columnKey: string;
  value: string;
  isLink?: boolean;
  linkUrl?: string;
  isExternal?: boolean;
}

interface DynamicTableRow {
  rowData: DynamicTableRowCell[];
}

interface DynamicTableConfig {
  columns: DynamicTableColumn[];
  rows: DynamicTableRow[];
  variant?: 'default' | 'bordered' | 'striped';
}

interface MultipleTableConfig {
  id: string;
  tableTitle: string;
  csvInput?: string;
  columns: DynamicTableColumn[];
  rows: DynamicTableRow[];
  variant?: 'default' | 'bordered' | 'striped';
}

interface PageSection {
  id: string;
  title: string;
  content: RichTextContent;
  contentType?: 'richText' | 'table' | 'dynamicTable' | 'mixed' | 'mixedDynamic' | 'mixedMultipleTables';
  tableData?: TableRow[];
  dynamicTableConfig?: DynamicTableConfig;
  multipleTablesConfig?: MultipleTableConfig[];
  tableTitle?: string;
  order: number;
  isActive: boolean;
}

export interface UnifiedPageResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  pageType: 'global' | 'dynamic';
  source: 'globals' | 'dynamic-pages';
  globalType: string;
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: HeroImage;
  sections: PageSection[];
  seo?: SEOData;
  priority?: number;
  category?: string;
  pageTitle?: string;
  title?: string;
  slug?: string;
  [key: string]: unknown;
}

/**
 * Determines if a response is from a dynamic page
 */
export const isDynamicPage = (response: UnifiedPageResponse | Record<string, unknown>): boolean => {
  return response?.pageType === 'dynamic' || response?.source === 'dynamic-pages';
};

/**
 * Determines if a response is from a global page
 */
export const isGlobalPage = (response: UnifiedPageResponse | Record<string, unknown>): boolean => {
  return response?.pageType === 'global' || response?.source === 'globals';
};

/**
 * Formats a slug for display (capitalizes and removes hyphens)
 */
export const formatSlugForDisplay = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Validates if a slug is properly formatted
 */
export const isValidSlug = (slug: string): boolean => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};

/**
 * Extracts SEO metadata from a unified page response
 */
export const extractSEOMetadata = (response: UnifiedPageResponse) => {
  const seo = response.seo || {};
  return {
    title: seo.metaTitle || response.heroTitle || response.pageTitle,
    description: seo.metaDescription || response.heroSubtitle,
    keywords: seo.keywords,
    ogImage: seo.ogImage || response.heroImage,
  };
};

/**
 * Determines the page priority for routing/navigation
 */
export const getPagePriority = (response: UnifiedPageResponse): number => {
  if (isDynamicPage(response)) {
    return response.priority || 0;
  }
  // Global pages have default high priority
  return 1000;
};

/**
 * Gets the canonical URL for a page
 */
export const getCanonicalUrl = (slug: string, baseUrl: string = ''): string => {
  return `${baseUrl}/${slug}`.replace(/\/+/g, '/');
};

/**
 * Transforms any page response to a consistent format
 */
export const normalizePageResponse = (response: Record<string, unknown>, slug: string): UnifiedPageResponse => {
  // Transform sections if needed
  let sections = (response.sections as PageSection[]) || [];
  
  // Handle dynamic table data transformation if needed
  /* eslint-disable @typescript-eslint/no-explicit-any */
  sections = sections.map((section: any) => {
    // Handle single dynamic table
    if (section.dynamicTableConfig && (section.contentType === 'dynamicTable' || section.contentType === 'mixedDynamic')) {
      const { columns = [], rows = [] } = section.dynamicTableConfig;
      
      // Check if rows are in dynamic pages format (with 'data' field)
      const needsTransformation = rows.some((row: any) => row.data && !row.rowData);
      
      if (needsTransformation) {
        const transformedRows = rows.map((row: any, index: number) => {
          if (row.data && typeof row.data === 'object') {
            const rowData: any[] = [];
            columns.forEach((column: any) => {
              rowData.push({
                columnKey: column.key,
                value: String(row.data[column.key] || ''),
                isLink: false,
                linkUrl: '',
                isExternal: false,
                id: `${row.id || index}_${column.key}`
              });
            });
            
            return {
              rowData,
              id: row.id || `row_${index}`
            };
          }
          return row;
        });
        
        section.dynamicTableConfig = {
          ...section.dynamicTableConfig,
          rows: transformedRows
        };
      }
    }

    // Handle multiple tables for mixedMultipleTables content type
    if (section.multipleTablesConfig && section.contentType === 'mixedMultipleTables') {
      section.multipleTablesConfig = section.multipleTablesConfig.map((tableConfig: any) => {
        const { columns = [], rows = [] } = tableConfig;
        
        // Check if rows are in dynamic pages format (with 'data' field)
        const needsTransformation = rows.some((row: any) => row.data && !row.rowData);
        
        if (needsTransformation) {
          const transformedRows = rows.map((row: any, index: number) => {
            if (row.data && typeof row.data === 'object') {
              const rowData: any[] = [];
              columns.forEach((column: any) => {
                rowData.push({
                  columnKey: column.key,
                  value: String(row.data[column.key] || ''),
                  isLink: false,
                  linkUrl: '',
                  isExternal: false,
                  id: `${row.id || index}_${column.key}`
                });
              });
              
              return {
                rowData,
                id: row.id || `row_${index}`
              };
            }
            return row;
          });
          
          return {
            ...tableConfig,
            rows: transformedRows
          };
        }
        
        return tableConfig;
      });
    }
    
    return section;
  });
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return {
    id: response.id as string,
    createdAt: (response.createdAt as string) || '',
    updatedAt: (response.updatedAt as string) || '',
    pageType: (response.pageType as 'global' | 'dynamic') || (response.slug ? 'dynamic' : 'global'),
    source: (response.source as 'globals' | 'dynamic-pages') || (response.slug ? 'dynamic-pages' : 'globals'),
    globalType: (response.globalType as string) || '',
    heroTitle: (response.heroTitle || response.pageTitle || response.title || formatSlugForDisplay(slug)) as string,
    heroSubtitle: response.heroSubtitle as string | undefined,
    heroImage: response.heroImage as HeroImage | undefined,
    sections: sections,
    seo: response.seo as SEOData | undefined,
    priority: response.priority as number | undefined,
    category: response.category as string | undefined,
    pageTitle: response.pageTitle as string | undefined,
    title: response.title as string | undefined,
    slug: response.slug as string | undefined,
    ...response
  };
};

/**
 * Gets breadcrumb data for a page
 */
export const getBreadcrumbData = (response: UnifiedPageResponse, slug: string) => {
  const breadcrumbs = [
    { label: 'Home', href: '/' }
  ];

  if (isDynamicPage(response) && response.category) {
    breadcrumbs.push({
      label: formatSlugForDisplay(response.category),
      href: `/category/${response.category}`
    });
  }

  breadcrumbs.push({
    label: response.heroTitle || formatSlugForDisplay(slug),
    href: `/${slug}`
  });

  return breadcrumbs;
};
