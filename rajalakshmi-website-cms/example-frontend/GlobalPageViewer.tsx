// Example React component demonstrating globals API usage

import React, { useState, useEffect } from 'react'

interface GlobalPage {
  slug: string
  title: string
  isActive: boolean
}

interface Section {
  id: string
  title: string
  type: string
  order: number
  isActive: boolean
  hasContent: boolean
}

interface PageData {
  title: string
  slug: string
  isActive: boolean
  sections: Section[]
}

interface SectionContent {
  title: string
  sectionId: string
  globalSlug: string
  content: any
}

const GlobalPageViewer: React.FC = () => {
  const [globalPages, setGlobalPages] = useState<GlobalPage[]>([])
  const [selectedPage, setSelectedPage] = useState<string>('')
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [sectionContent, setSectionContent] = useState<SectionContent | null>(null)
  const [loading, setLoading] = useState(false)

  // Load all global pages on component mount
  useEffect(() => {
    fetchGlobalPages()
  }, [])

  const fetchGlobalPages = async () => {
    try {
      const response = await fetch('/api/global-pages')
      const result = await response.json()
      if (result.success) {
        setGlobalPages(result.data)
      }
    } catch (error) {
      console.error('Error fetching global pages:', error)
    }
  }

  const fetchPageSections = async (pageSlug: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/${pageSlug}/sections`)
      const result = await response.json()
      if (result.success) {
        setPageData(result.data)
        setSelectedPage(pageSlug)
        setSelectedSection('')
        setSectionContent(null)
      }
    } catch (error) {
      console.error('Error fetching page sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSectionContent = async (pageSlug: string, sectionId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/${pageSlug}/sections/${sectionId}`)
      const result = await response.json()
      if (result.success) {
        setSectionContent(result.data)
        setSelectedSection(sectionId)
      }
    } catch (error) {
      console.error('Error fetching section content:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderContent = (content: any) => {
    if (typeof content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: content }} />
    }
    
    if (content && typeof content === 'object') {
      return (
        <div className="content-section">
          {content.content && (
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          )}
          
          {/* Render arrays (like lists) */}
          {Object.entries(content).map(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              return (
                <div key={key} className="content-array">
                  <h4>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</h4>
                  <ul>
                    {value.map((item, index) => (
                      <li key={index}>
                        {typeof item === 'object' ? (
                          <div>
                            {item.title && <strong>{item.title}</strong>}
                            {item.name && <strong>{item.name}</strong>}
                            {item.description && <p>{item.description}</p>}
                            {item.content && <div dangerouslySetInnerHTML={{ __html: item.content }} />}
                          </div>
                        ) : (
                          <span>{item}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            }
            return null
          })}
        </div>
      )
    }
    
    return <p>No content available</p>
  }

  return (
    <div className="global-page-viewer">
      <div className="layout">
        {/* Sidebar - Global Pages */}
        <div className="sidebar">
          <h2>Pages</h2>
          <nav>
            {globalPages.map((page) => (
              <button
                key={page.slug}
                onClick={() => fetchPageSections(page.slug)}
                className={selectedPage === page.slug ? 'active' : ''}
                disabled={loading}
              >
                {page.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {loading && <div className="loading">Loading...</div>}
          
          {pageData && !loading && (
            <>
              {/* Page Title */}
              <header>
                <h1>{pageData.title}</h1>
              </header>

              {/* Sections Grid */}
              {!selectedSection && (
                <div className="sections-grid">
                  <h2>Sections</h2>
                  <div className="grid">
                    {pageData.sections.map((section) => (
                      <div
                        key={section.id}
                        className="section-card"
                        onClick={() => fetchSectionContent(pageData.slug, section.id)}
                      >
                        <h3>{section.title}</h3>
                        <p>Click to view content</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section Content */}
              {sectionContent && (
                <div className="section-content">
                  <div className="section-header">
                    <button 
                      onClick={() => setSelectedSection('')}
                      className="back-button"
                    >
                      ← Back to Sections
                    </button>
                    <h2>{sectionContent.title}</h2>
                  </div>
                  
                  <div className="content">
                    {renderContent(sectionContent.content)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .global-page-viewer {
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .layout {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          width: 250px;
          background: #f8f9fa;
          padding: 1rem;
          border-right: 1px solid #dee2e6;
        }

        .sidebar h2 {
          margin: 0 0 1rem 0;
          color: #343a40;
        }

        .sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sidebar button {
          padding: 0.75rem;
          border: 1px solid #dee2e6;
          background: white;
          border-radius: 0.375rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }

        .sidebar button:hover {
          background: #e9ecef;
          border-color: #adb5bd;
        }

        .sidebar button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .sidebar button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .main-content {
          flex: 1;
          padding: 2rem;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #6c757d;
        }

        header h1 {
          margin: 0 0 2rem 0;
          color: #343a40;
          border-bottom: 2px solid #007bff;
          padding-bottom: 0.5rem;
        }

        .sections-grid h2 {
          margin: 0 0 1rem 0;
          color: #495057;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .section-card {
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .section-card:hover {
          border-color: #007bff;
          box-shadow: 0 4px 12px rgba(0,123,255,0.15);
          transform: translateY(-2px);
        }

        .section-card h3 {
          margin: 0 0 0.5rem 0;
          color: #343a40;
        }

        .section-card p {
          margin: 0;
          color: #6c757d;
          font-size: 0.875rem;
        }

        .section-content {
          animation: fadeIn 0.3s ease-in;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #dee2e6;
        }

        .back-button {
          padding: 0.5rem 1rem;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .back-button:hover {
          background: #5a6268;
        }

        .section-header h2 {
          margin: 0;
          color: #343a40;
        }

        .content {
          line-height: 1.6;
        }

        .content-section {
          margin-bottom: 2rem;
        }

        .content-array {
          margin: 1.5rem 0;
        }

        .content-array h4 {
          color: #495057;
          border-left: 4px solid #007bff;
          padding-left: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .content-array ul {
          list-style: none;
          padding: 0;
        }

        .content-array li {
          background: #f8f9fa;
          margin: 0.5rem 0;
          padding: 1rem;
          border-radius: 0.375rem;
          border-left: 3px solid #007bff;
        }

        .content-array li strong {
          color: #343a40;
          display: block;
          margin-bottom: 0.25rem;
        }

        .content-array li p {
          margin: 0.25rem 0 0 0;
          color: #6c757d;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default GlobalPageViewer
