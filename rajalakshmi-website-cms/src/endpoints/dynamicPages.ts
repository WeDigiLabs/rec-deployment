import type { Endpoint } from 'payload'

// Get a single dynamic page by slug
export const dynamicPageBySlugEndpoint: Endpoint = {
  path: '/:slug',
  method: 'get',
  handler: async (req) => {
    const { payload, routeParams } = req
    const { slug } = routeParams || {}

    if (!slug) {
      return Response.json(
        {
          success: false,
          error: 'Slug parameter is required',
        },
        { status: 400 }
      )
    }

    try {
      const pages = await payload.find({
        collection: 'dynamic-pages',
        where: {
          and: [
            {
              slug: {
                equals: slug,
              },
            },
            {
              isPublished: {
                equals: true,
              },
            },
          ],
        },
        limit: 1,
      })

      if (pages.docs.length === 0) {
        return Response.json(
          {
            success: false,
            error: 'Page not found',
          },
          { status: 404 }
        )
      }

      return Response.json({
        success: true,
        data: {
          ...pages.docs[0],
          // Transform sections to ensure compatibility
          sections: (pages.docs[0].sections || []).map((section: any) => {
            const transformedSection = {
              ...section,
              id: section.id || Math.random().toString(36),
              title: section.title || '',
              content: section.content || { root: { children: [] } },
              contentType: section.contentType || 'richText',
              order: section.order || 0,
              isActive: section.isActive !== false,
              tableData: section.tableData || [],
              tableTitle: section.tableTitle || '',
            }

            // Transform dynamicTableConfig if it exists
            if (section.dynamicTableConfig && (section.contentType === 'dynamicTable' || section.contentType === 'mixedDynamic')) {
              const { columns = [], rows = [] } = section.dynamicTableConfig
              
              // Check if we have rowData format (already transformed) vs raw data format
              const hasRowDataFormat = rows.length > 0 && rows[0].rowData && Array.isArray(rows[0].rowData);
              
              if (hasRowDataFormat) {
                // Data is already in rowData format, use as-is
                transformedSection.dynamicTableConfig = {
                  columns: columns.map((col: any) => ({
                    key: col.key,
                    label: col.label,
                    width: col.width || ''
                  })),
                  rows: rows,
                  variant: section.dynamicTableConfig.variant || 'default'
                }
              } else {
                // Transform rows from dynamic pages format to global pages format
                const transformedRows = rows.map((row: any, index: number) => {
                  const rowData: any[] = []
                  
                  // Handle multiple data formats:
                  // 1. CSV-parsed format: row.data contains key-value pairs
                  // 2. Manual format: row contains direct key-value pairs  
                  // 3. JSON format: row.data as JSON object
                  let dataSource = null;
                  
                  if (row.data) {
                    if (typeof row.data === 'string') {
                      try {
                        // Handle JSON string format
                        dataSource = JSON.parse(row.data);
                      } catch (e) {
                        // If not valid JSON, treat as object
                        dataSource = row.data;
                      }
                    } else if (typeof row.data === 'object') {
                      // Handle object format (CSV parsed)
                      dataSource = row.data;
                    }
                  } else {
                    // Handle direct row properties
                    dataSource = row;
                  }
                  
                  if (dataSource && typeof dataSource === 'object') {
                    columns.forEach((column: any) => {
                      const cellValue = dataSource[column.key] || '';
                      rowData.push({
                        columnKey: column.key,
                        value: String(cellValue),
                        isLink: false,
                        linkUrl: '',
                        isExternal: false,
                        id: `${row.id || index}_${column.key}`
                      })
                    })
                  }
                  
                  return {
                    rowData,
                    id: row.id || `row_${index}`
                  }
                })
                
                transformedSection.dynamicTableConfig = {
                  columns: columns.map((col: any) => ({
                    key: col.key,
                    label: col.label,
                    width: col.width || ''
                  })),
                  rows: transformedRows,
                  variant: section.dynamicTableConfig.variant || 'default'
                }
              }
            }

            return transformedSection
          })
        },
      })
    } catch (error) {
      console.error('Error fetching dynamic page:', error)
      return Response.json(
        {
          success: false,
          error: 'Failed to fetch page',
        },
        { status: 500 }
      )
    }
  },
}

// Endpoint that matches the exact global pages pattern: /api/globals/:slug
export const globalsPatternEndpoint: Endpoint = {
  path: '/globals/:slug',
  method: 'get',
  handler: async (req) => {
    const { slug } = req.routeParams as { slug: string }
    
    try {
      const dynamicPage = await req.payload.find({
        collection: 'dynamic-pages',
        where: {
          and: [
            { slug: { equals: slug } },
            { isPublished: { equals: true } }
          ]
        },
        limit: 1
      })

      if (dynamicPage.docs.length === 0) {
        return Response.json({ error: 'Dynamic page not found' }, { status: 404 })
      }

      const page = dynamicPage.docs[0]
      
      // Transform sections to match global pages format
      const transformedSections = (page.sections || []).map((section: any) => {
        const transformedSection = {
          ...section,
          id: section.id || Math.random().toString(36),
          title: section.title || '',
          content: section.content || { root: { children: [] } },
          contentType: section.contentType || 'richText',
          order: section.order || 0,
          isActive: section.isActive !== false,
          tableData: section.tableData || [],
          tableTitle: section.tableTitle || '',
        }

        // Transform dynamicTableConfig if it exists
        if (section.dynamicTableConfig && (section.contentType === 'dynamicTable' || section.contentType === 'mixedDynamic')) {
          const { columns = [], rows = [] } = section.dynamicTableConfig
          
          // Check if we have rowData format (already transformed) vs raw data format
          const hasRowDataFormat = rows.length > 0 && rows[0].rowData && Array.isArray(rows[0].rowData);
          
          if (hasRowDataFormat) {
            // Data is already in rowData format, but check if values are meaningful
            const hasEmptyValues = rows.some((row: any) => 
              row.rowData.some((cell: any) => 
                cell.columnKey !== 'id' && (!cell.value || cell.value === '')
              )
            );
            
            if (hasEmptyValues) {
              console.log('Detected empty values in rowData format - data may be corrupted');
              // Keep the existing structure but note the issue
              transformedSection.dynamicTableConfig = {
                columns: columns.map((col: any) => ({
                  key: col.key,
                  label: col.label,
                  width: col.width || ''
                })),
                rows: rows,
                variant: section.dynamicTableConfig.variant || 'default'
              }
            } else {
              // Data looks good, use as-is
              transformedSection.dynamicTableConfig = {
                columns: columns.map((col: any) => ({
                  key: col.key,
                  label: col.label,
                  width: col.width || ''
                })),
                rows: rows,
                variant: section.dynamicTableConfig.variant || 'default'
              }
            }
          } else {
            // Transform rows from dynamic pages format to global pages format
            const transformedRows = rows.map((row: any, index: number) => {
              const rowData: any[] = []
              
              // Handle multiple data formats:
              // 1. CSV-parsed format: row.data contains key-value pairs
              // 2. Manual format: row contains direct key-value pairs
              // 3. JSON format: row.data as JSON object
              let dataSource = null;
              
              if (row.data) {
                if (typeof row.data === 'string') {
                  try {
                    // Handle JSON string format
                    dataSource = JSON.parse(row.data);
                  } catch (e) {
                    // If not valid JSON, treat as object
                    dataSource = row.data;
                  }
                } else if (typeof row.data === 'object') {
                  // Handle object format (CSV parsed)
                  dataSource = row.data;
                }
              } else {
                // Handle direct row properties
                dataSource = row;
              }
              
              if (dataSource && typeof dataSource === 'object') {
                columns.forEach((column: any) => {
                  const cellValue = dataSource[column.key] || '';
                  rowData.push({
                    columnKey: column.key,
                    value: String(cellValue),
                    isLink: false,
                    linkUrl: '',
                    isExternal: false,
                    id: `${row.id || index}_${column.key}`
                  })
                })
              }
              
              return {
                rowData,
                id: row.id || `row_${index}`
              }
            })
            
            transformedSection.dynamicTableConfig = {
              columns: columns.map((col: any) => ({
                key: col.key,
                label: col.label,
                width: col.width || ''
              })),
              rows: transformedRows,
              variant: section.dynamicTableConfig.variant || 'default'
            }
          }
        }

        return transformedSection
      })
      
      // Transform the response to match global pages format exactly
      const transformedPage = {
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        globalType: page.slug, // Use slug as globalType to match global pages pattern
        heroTitle: page.heroTitle || page.pageTitle,
        heroSubtitle: page.heroSubtitle || '',
        sections: transformedSections,
        seo: page.seo || {},
        id: page.id,
        pageType: 'dynamic',
        source: 'dynamic-pages'
      }

      return Response.json({
        success: true,
        data: transformedPage
      })
    } catch (error) {
      console.error('Error fetching dynamic page:', error)
      return Response.json({ 
        success: false,
        error: 'Internal server error' 
      }, { status: 500 })
    }
  }
}
