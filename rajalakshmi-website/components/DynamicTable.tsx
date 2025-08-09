import Link from "next/link";

interface TableColumn {
  key: string;
  label: string;
  width?: string;
}

interface TableRowCell {
  columnKey: string;
  value: string;
  isLink?: boolean;
  linkUrl?: string;
  isExternal?: boolean;
}

interface TableRow {
  rowData: TableRowCell[];
}

interface DynamicTableProps {
  columns: TableColumn[];
  data: TableRow[];
  title?: string;
  className?: string;
  variant?: 'default' | 'bordered' | 'striped';
}

const DynamicTable: React.FC<DynamicTableProps> = ({ 
  columns,
  data,
  title,
  className = "",
  variant = 'default'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'bordered':
        return 'border-2 border-gray-400';
      case 'striped':
        return 'border border-gray-300';
      default:
        return 'border border-gray-300';
    }
  };

  const getRowClasses = (index: number) => {
    const baseClasses = "border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors";
    if (variant === 'striped' && index % 2 === 1) {
      return `${baseClasses} bg-gray-50`;
    }
    return baseClasses;
  };

  const renderCellContent = (cell: TableRowCell) => {
    if (cell.isLink && cell.linkUrl) {
      const isPdfLink = cell.linkUrl.toLowerCase().includes('.pdf');
      return (
        <Link 
          href={cell.linkUrl}
          className={`${isPdfLink 
            ? 'text-red-600 hover:text-red-800' 
            : 'text-[#6A1B9A] hover:text-[#4B116B]'
          } underline transition-colors inline-flex items-center gap-1`}
          target={cell.isExternal ? "_blank" : "_self"}
          rel={cell.isExternal ? "noopener noreferrer" : undefined}
          title={isPdfLink ? 'Download PDF' : undefined}
        >
          {isPdfLink && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
          {cell.value}
          {cell.isExternal && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          )}
        </Link>
      );
    }
    
    // Auto-detect URLs in cell content and make them clickable
    const urlRegex = /(https?:\/\/[^\s<>"\[\]{}|\\^`]+(?:\.[a-zA-Z]{2,})?(?:\/[^\s<>"\[\]{}|\\^`]*)?)/g;
    const text = cell.value;
    const urlMatch = text.match(urlRegex);
    
    if (urlMatch && urlMatch.length > 0) {
      // If the entire cell content is a URL, render it as a link
      if (urlMatch[0] === text.trim()) {
        const isPdfLink = text.toLowerCase().includes('.pdf');
        return (
          <Link 
            href={text.trim()}
            className={`${isPdfLink 
              ? 'text-red-600 hover:text-red-800' 
              : 'text-[#6A1B9A] hover:text-[#4B116B]'
            } underline transition-colors inline-flex items-center gap-1`}
            target="_blank"
            rel="noopener noreferrer"
            title={isPdfLink ? 'Download PDF' : 'Open link'}
          >
            {isPdfLink && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
            {text}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        );
      }
      
      // If text contains URLs mixed with other content, render with inline links
      const parts = text.split(urlRegex);
      return (
        <span>
          {parts.map((part, index) => {
            if (urlRegex.test(part)) {
              const isPdfLink = part.toLowerCase().includes('.pdf');
              return (
                <Link 
                  key={index}
                  href={part}
                  className={`${isPdfLink 
                    ? 'text-red-600 hover:text-red-800' 
                    : 'text-[#6A1B9A] hover:text-[#4B116B]'
                  } underline transition-colors inline-flex items-center gap-1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={isPdfLink ? 'Download PDF' : 'Open link'}
                >
                  {isPdfLink && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                  {part}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              );
            }
            return part;
          })}
        </span>
      );
    }
    
    return cell.value;
  };

  const getCellForColumn = (row: TableRow, columnKey: string): TableRowCell | undefined => {
    return row.rowData?.find(cell => cell.columnKey === columnKey);
  };

  return (
    <div className={`overflow-x-auto rounded-lg ${getVariantClasses()} ${className}`}>
      {title && (
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column) => (
              <th 
                key={column.key}
                className={`px-4 py-2 border-b border-gray-300 text-left font-medium text-gray-700 ${column.width || ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={getRowClasses(index)}>
              {columns.map((column) => {
                const cell = getCellForColumn(row, column.key);
                return (
                  <td key={column.key} className="px-4 py-2 border-r border-gray-200 last:border-r-0">
                    {cell ? renderCellContent(cell) : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
