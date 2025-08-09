import Link from "next/link";

interface LinkTableProps {
  tableData: { id: number; label: string; link: string; isExternal?: boolean }[];
  title?: string;
  className?: string;
}

const LinkTable: React.FC<LinkTableProps> = ({ 
  tableData, 
  title = "Table Title",
  className = ""
}) => (
  <div className={`overflow-x-auto rounded-lg border border-gray-300 ${className}`}>
    <table className="min-w-full text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 border-b border-gray-300 text-left">{title}</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row) => {
          const isPdfLink = row.link.toLowerCase().includes('.pdf');
          return (
            <tr key={row.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-2">
                <Link 
                  href={row.link} 
                  className={`${isPdfLink 
                    ? 'text-red-600 hover:text-red-800' 
                    : 'text-[#6A1B9A] hover:text-[#4B116B]'
                  } underline transition-colors inline-flex items-center gap-2`}
                  target={row.isExternal ? "_blank" : "_self"} 
                  rel={row.isExternal ? "noopener noreferrer" : undefined}
                  title={isPdfLink ? 'Download PDF' : undefined}
                >
                  {isPdfLink && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                  {row.label}
                  {row.isExternal && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default LinkTable; 