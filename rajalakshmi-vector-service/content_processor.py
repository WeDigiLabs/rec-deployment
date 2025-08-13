"""
Core content processor for Rajalakshmi Engineering College Vector Service
Handles content extraction, chunking, and embedding generation
"""

import re
import uuid
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from bs4 import BeautifulSoup
import html2text
from markdownify import markdownify

from config import settings, COLLECTION_MAPPINGS, GLOBAL_MAPPINGS, DEPARTMENT_KEYWORDS

from config import settings, COLLECTION_MAPPINGS, GLOBAL_MAPPINGS, DEPARTMENT_KEYWORDS


logger = logging.getLogger(__name__)


@dataclass
class ContentChunk:
    """Represents a processed content chunk ready for embedding"""
    chunk_id: str
    content: str
    metadata: Dict[str, Any]
    source_id: str
    source_type: str  # 'collection' or 'global'
    content_type: str
    chunk_index: int
    total_chunks: int


class ContentProcessor:
    """Main content processor for Payload CMS data"""
    
    def __init__(self):
        self.html_converter = html2text.HTML2Text()
        self.html_converter.ignore_links = False
        self.html_converter.ignore_images = True
        self.html_converter.ignore_emphasis = False
        
    def process_webhook_payload(self, payload: Dict[str, Any]) -> List[ContentChunk]:
        """
        Process incoming webhook payload and return content chunks
        
        Args:
            payload: Webhook payload from Payload CMS
            
        Returns:
            List of processed content chunks
        """
        try:
            # Determine if it's a collection or global
            is_collection = 'collection' in payload
            is_global = 'global' in payload
            content_type = payload.get('collection') or payload.get('global')
            data = payload.get('data', {})
            
            logger.info(f"Processing {content_type} content for {payload.get('operation', 'unknown')} operation")
            logger.info(f"Payload keys: {list(payload.keys())}")
            logger.info(f"Is collection: {is_collection}, Is global: {is_global}")
            logger.info(f"Content type: {content_type}")
            
            if not content_type:
                logger.error("No content type found in payload")
                return []
            
            # Process based on content type
            if is_collection:
                logger.info(f"Processing as collection: {content_type}")
                return self._process_collection_content(content_type, data)
            elif is_global:
                logger.info(f"Processing as global: {content_type}")
                return self._process_global_content(content_type, data)
            else:
                logger.error("Could not determine if payload is collection or global")
                return []
                
        except Exception as e:
            logger.error(f"Error processing webhook payload: {str(e)}")
            return []
    
    def _process_collection_content(self, collection_type: str, data: Dict[str, Any]) -> List[ContentChunk]:
        """Process collection-based content"""
        
        if collection_type == "announcements":
            return self._process_announcement(data)
        elif collection_type == "blog-posts":
            return self._process_blog_post(data)
        elif collection_type == "testimonials":
            return self._process_testimonial(data)
        elif collection_type == "departments":
            return self._process_department(data)
        elif collection_type == "department-sections":
            return self._process_department_section(data)
        elif collection_type == "coe":
            return self._process_coe(data)
        elif collection_type == "dynamic-pages":
            return self._process_dynamic_page(data)
        else:
            logger.warning(f"Unknown collection type: {collection_type}")
            return self._process_generic_content(collection_type, data, "collection")
    
    def _process_global_content(self, global_type: str, data: Dict[str, Any]) -> List[ContentChunk]:
        """Process global-based content"""
        
        if global_type == "admissions":
            return self._process_admissions(data)
        elif global_type == "about":
            return self._process_about(data)
        elif global_type == "academics":
            return self._process_academics(data)
        elif global_type == "placement":
            return self._process_placement(data)
        elif global_type == "research":
            return self._process_research(data)
        elif global_type == "facilities":
            return self._process_facilities(data)
        else:
            logger.warning(f"Unknown global type: {global_type}")
            return self._process_generic_content(global_type, data, "global")
    
    def _process_announcement(self, data: Dict[str, Any]) -> List[ContentChunk]:
        """Process announcement content"""
        chunks = []
        
        # Extract main content
        title = data.get('title', '')
        content = data.get('content', '')
        excerpt = data.get('excerpt', '')
        priority = data.get('priority', 1)
        
        # Clean and combine content
        full_content = self._clean_html_content(f"{title}\n\n{excerpt}\n\n{content}")
        
        # Create metadata
        metadata = {
            "source_type": "collection",
            "source_collection": "announcements",
            "source_id": data.get('id', ''),
            "document_title": title,
            "content_type": "announcement",
            "category": "administrative",
            "announcement_type": data.get('type', 'general'),
            "priority_level": "high" if priority <= 2 else "medium",
            "is_urgent": priority == 1,
            "target_audience": ["all_students", "faculty"],
            "language": "en",
            "last_updated": data.get('updatedAt', datetime.now().isoformat()),
            "is_active": True,
            "searchable_keywords": self._extract_keywords(full_content),
            "search_boost": 1.2
        }
        
        # Create chunks
        content_chunks = self._chunk_text(full_content)
        for i, chunk_content in enumerate(content_chunks):
            chunk_metadata = metadata.copy()
            chunk_metadata.update({
                "chunk_index": i,
                "total_chunks": len(content_chunks),
                "content_length": len(chunk_content)
            })
            
            chunks.append(ContentChunk(
                chunk_id=str(uuid.uuid4()),
                content=chunk_content,
                metadata=chunk_metadata,
                source_id=data.get('id', ''),
                source_type="collection",
                content_type="announcements",
                chunk_index=i,
                total_chunks=len(content_chunks)
            ))
        
        return chunks
    
    def _process_department_section(self, data: Dict[str, Any]) -> List[ContentChunk]:
        """Process department section with dynamic content"""
        chunks = []
        
        # Extract department information
        department_data = data.get('department', {})
        department_name = department_data.get('name', 'General') if isinstance(department_data, dict) else str(department_data)
        section_title = data.get('title', 'Department Section')
        
        # Process dynamic sections
        dynamic_sections = data.get('dynamicSections', [])
        
        for section_idx, section in enumerate(dynamic_sections):
            section_type = section.get('contentType', 'unknown')
            
            if section_type == 'richText':
                chunks.extend(self._process_rich_text_section(section, department_name, section_title, section_idx))
                
                # ENHANCED: Extract links from rich text sections
                if 'content' in section:
                    content_data = section['content']
                    if isinstance(content_data, dict) and 'root' in content_data:
                        section_links = self._extract_links_from_content(content_data)
                        if section_links:
                            link_chunks = self._create_link_chunks(
                                section_links, 
                                f"dept-section-{section_idx}", 
                                "collection", 
                                "department-sections"
                            )
                            chunks.extend(link_chunks)
                            
            elif section_type == 'table':
                chunks.extend(self._process_table_section(section, department_name, section_title, section_idx))
            elif section_type == 'dynamicTable':
                chunks.extend(self._process_dynamic_table_section(section, department_name, section_title, section_idx))
            elif section_type == 'multipleTables':
                chunks.extend(self._process_multiple_tables_section(section, department_name, section_title, section_idx))
            else:
                # Generic section processing
                content = str(section.get('content', ''))
                if content:
                    chunks.extend(self._create_section_chunks(content, department_name, section_title, section_type, section_idx))
        
        return chunks
    
    def _process_rich_text_section(self, section: Dict[str, Any], department: str, section_title: str, section_idx: int) -> List[ContentChunk]:
        """Process rich text content section"""
        chunks = []
        
        content = section.get('content', '')
        clean_content = self._clean_html_content(content)
        
        # Add department context
        contextual_content = f"Department: {department}. Section: {section_title}. Content: {clean_content}"
        
        # Create metadata
        base_metadata = {
            "source_type": "collection",
            "source_collection": "department-sections",
            "document_title": section_title,
            "section_title": section.get('title', section_title),
            "content_type": "richText",
            "department": department,
            "category": "academic",
            "section_type": "content",
            "language": "en",
            "last_updated": datetime.now().isoformat(),
            "is_active": True,
            "searchable_keywords": self._extract_keywords(clean_content),
            "search_boost": 1.0
        }
        
        # Create chunks
        content_chunks = self._chunk_text(contextual_content)
        for i, chunk_content in enumerate(content_chunks):
            chunk_metadata = base_metadata.copy()
            chunk_metadata.update({
                "chunk_index": i,
                "total_chunks": len(content_chunks),
                "content_length": len(chunk_content),
                "section_index": section_idx
            })
            
            chunks.append(ContentChunk(
                chunk_id=str(uuid.uuid4()),
                content=chunk_content,
                metadata=chunk_metadata,
                source_id=f"dept-section-{section_idx}-{i}",
                source_type="collection",
                content_type="department-sections",
                chunk_index=i,
                total_chunks=len(content_chunks)
            ))
        
        return chunks
    
    def _process_table_section(self, section: Dict[str, Any], department: str, section_title: str, section_idx: int) -> List[ContentChunk]:
        """Process table content section"""
        chunks = []
        
        table_config = section.get('tableConfig', {})
        table_title = section.get('title', 'Table')
        
        # Extract table data
        headers = table_config.get('headers', [])
        rows = table_config.get('rows', [])
        
        # Create table summary
        table_summary = f"Table: {table_title}\nColumns: {', '.join(headers)}\nTotal rows: {len(rows)}"
        
        # Process individual rows
        for row_idx, row in enumerate(rows):
            row_content = []
            for col_idx, cell in enumerate(row):
                if col_idx < len(headers):
                    row_content.append(f"{headers[col_idx]}: {cell}")
            
            row_text = f"Department: {department}. Table: {table_title}. Row {row_idx + 1}: {'; '.join(row_content)}"
            
            # Create metadata for row
            row_metadata = {
                "source_type": "collection",
                "source_collection": "department-sections",
                "document_title": section_title,
                "section_title": table_title,
                "content_type": "table",
                "table_type": self._classify_table_type(table_title, headers),
                "department": department,
                "category": "academic",
                "section_type": "tabular_data",
                "table_headers": headers,
                "row_index": row_idx,
                "total_rows": len(rows),
                "language": "en",
                "last_updated": datetime.now().isoformat(),
                "is_active": True,
                "searchable_keywords": self._extract_keywords(row_text),
                "search_boost": 0.9
            }
            
            chunks.append(ContentChunk(
                chunk_id=str(uuid.uuid4()),
                content=row_text,
                metadata=row_metadata,
                source_id=f"table-{section_idx}-row-{row_idx}",
                source_type="collection",
                content_type="department-sections",
                chunk_index=row_idx,
                total_chunks=len(rows)
            ))
        
        # Add table summary chunk
        summary_metadata = {
            "source_type": "collection",
            "source_collection": "department-sections",
            "document_title": section_title,
            "section_title": table_title,
            "content_type": "table_summary",
            "table_type": self._classify_table_type(table_title, headers),
            "department": department,
            "category": "academic",
            "section_type": "tabular_data",
            "table_headers": headers,
            "total_rows": len(rows),
            "language": "en",
            "last_updated": datetime.now().isoformat(),
            "is_active": True,
            "searchable_keywords": self._extract_keywords(table_summary),
            "search_boost": 1.1
        }
        
        chunks.append(ContentChunk(
            chunk_id=str(uuid.uuid4()),
            content=f"Department: {department}. {table_summary}",
            metadata=summary_metadata,
            source_id=f"table-{section_idx}-summary",
            source_type="collection",
            content_type="department-sections",
            chunk_index=0,
            total_chunks=1
        ))
        
        return chunks
    
    def _process_generic_content(self, content_type: str, data: Dict[str, Any], source_type: str) -> List[ContentChunk]:
        """Generic content processing for unknown types"""
        chunks = []
        
        # Extract text content from all fields
        text_content = []
        for key, value in data.items():
            if isinstance(value, str) and value.strip():
                if key in ['title', 'name']:
                    text_content.insert(0, f"{key.title()}: {value}")
                else:
                    text_content.append(f"{key}: {value}")
        
        if not text_content:
            return chunks
        
        full_content = "\n".join(text_content)
        clean_content = self._clean_html_content(full_content)
        
        # Create basic metadata
        metadata = {
            "source_type": source_type,
            f"source_{source_type}": content_type,
            "source_id": data.get('id', ''),
            "document_title": data.get('title') or data.get('name', content_type),
            "content_type": "generic",
            "category": "general",
            "language": "en",
            "last_updated": data.get('updatedAt', datetime.now().isoformat()),
            "is_active": True,
            "searchable_keywords": self._extract_keywords(clean_content),
            "search_boost": 0.8
        }
        
        # Create chunks
        content_chunks = self._chunk_text(clean_content)
        for i, chunk_content in enumerate(content_chunks):
            chunk_metadata = metadata.copy()
            chunk_metadata.update({
                "chunk_index": i,
                "total_chunks": len(content_chunks),
                "content_length": len(chunk_content)
            })
            
            chunks.append(ContentChunk(
                chunk_id=str(uuid.uuid4()),
                content=chunk_content,
                metadata=chunk_metadata,
                source_id=data.get('id', ''),
                source_type=source_type,
                content_type=content_type,
                chunk_index=i,
                total_chunks=len(content_chunks)
            ))
        
        return chunks
    
    def _chunk_text(self, text: str, chunk_size: int = None, overlap: int = None) -> List[str]:
        """Split text into overlapping chunks"""
        chunk_size = chunk_size or settings.chunk_size
        overlap = overlap or settings.chunk_overlap
        
        if len(text) <= chunk_size:
            return [text]
        
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + chunk_size
            
            # Try to break at sentence boundaries
            if end < len(text):
                # Look for sentence endings
                for i in range(end, max(start + chunk_size // 2, 0), -1):
                    if text[i] in '.!?':
                        end = i + 1
                        break
                # If no sentence break found, look for word boundaries
                else:
                    for i in range(end, max(start + chunk_size // 2, 0), -1):
                        if text[i] == ' ':
                            end = i
                            break
            
            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)
            
            start = end - overlap
            if start >= len(text):
                break
        
        return chunks
    
    def _clean_html_content(self, content: str) -> str:
        """Clean HTML content and convert to plain text"""
        if not content:
            return ""
        
        # Convert HTML to markdown first, then to plain text
        try:
            # Use BeautifulSoup to clean HTML
            soup = BeautifulSoup(content, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()
            
            # Get text content
            text = soup.get_text()
            
            # Clean up whitespace
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = ' '.join(chunk for chunk in chunks if chunk)
            
            return text
        except Exception as e:
            logger.warning(f"Error cleaning HTML content: {str(e)}")
            # Fallback to simple text extraction
            return re.sub(r'<[^>]+>', '', content).strip()
    
    def _extract_keywords(self, text: str, max_keywords: int = 10) -> List[str]:
        """Extract keywords from text content"""
        if not text:
            return []
        
        # Simple keyword extraction
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        
        # Filter common stop words
        stop_words = {
            'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'use', 'way', 'she', 'many', 'oil', 'sit', 'words', 'long', 'make', 'thing', 'see', 'him', 'two', 'more', 'these', 'go', 'no', 'man', 'first', 'been', 'call', 'who', 'oil', 'sit', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part'
        }
        
        # Count word frequencies
        word_freq = {}
        for word in words:
            if word not in stop_words and len(word) > 3:
                word_freq[word] = word_freq.get(word, 0) + 1
        
        # Return top keywords
        keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        return [word for word, freq in keywords[:max_keywords]]
    
    def _extract_rich_text(self, content_data: Dict[str, Any]) -> str:
        """Extract text from structured rich text content"""
        if not isinstance(content_data, dict):
            return ""
        
        def extract_text_recursive(node):
            """Recursively extract text from rich text nodes"""
            text_parts = []
            
            if isinstance(node, dict):
                # Handle direct text content
                if 'text' in node:
                    text_parts.append(node['text'])
                
                # Handle children nodes
                if 'children' in node and isinstance(node['children'], list):
                    for child in node['children']:
                        child_text = extract_text_recursive(child)
                        if child_text.strip():
                            text_parts.append(child_text)
                
                # Handle linebreaks
                if node.get('type') == 'linebreak':
                    text_parts.append('\n')
                
                # Handle headings with special formatting
                if node.get('type') == 'heading':
                    tag = node.get('tag', 'h3')
                    level = '#' * (int(tag[1]) if len(tag) > 1 and tag[1].isdigit() else 3)
                    child_texts = []
                    if 'children' in node:
                        for child in node['children']:
                            child_text = extract_text_recursive(child)
                            if child_text.strip():
                                child_texts.append(child_text)
                    if child_texts:
                        return f'\n\n{level} {" ".join(child_texts)}\n\n'
                
                # Handle paragraphs
                if node.get('type') == 'paragraph' and 'children' in node:
                    para_texts = []
                    for child in node['children']:
                        child_text = extract_text_recursive(child)
                        if child_text.strip():
                            para_texts.append(child_text)
                    if para_texts:
                        return ' '.join(para_texts) + '\n\n'
                
                # ENHANCED: Handle lists properly
                if node.get('type') == 'list':
                    list_type = node.get('listType', 'bullet')
                    list_items = []
                    if 'children' in node:
                        for i, child in enumerate(node['children'], 1):
                            if child.get('type') == 'listitem':
                                item_text = extract_text_recursive(child)
                                if item_text.strip():
                                    if list_type == 'number':
                                        list_items.append(f"{i}. {item_text.strip()}")
                                    else:
                                        list_items.append(f"• {item_text.strip()}")
                    if list_items:
                        return '\n' + '\n'.join(list_items) + '\n\n'
                
                # ENHANCED: Handle list items
                if node.get('type') == 'listitem':
                    item_texts = []
                    if 'children' in node:
                        for child in node['children']:
                            child_text = extract_text_recursive(child)
                            if child_text.strip():
                                item_texts.append(child_text)
                    return ' '.join(item_texts)
                
                # ENHANCED: Handle links with URL preservation
                if node.get('type') == 'link':
                    link_text = ''
                    if 'children' in node:
                        link_texts = []
                        for child in node['children']:
                            child_text = extract_text_recursive(child)
                            if child_text.strip():
                                link_texts.append(child_text)
                        link_text = ' '.join(link_texts)
                    
                    # Extract URL from fields
                    url = ''
                    if 'fields' in node and 'url' in node['fields']:
                        url = node['fields']['url']
                    
                    if url and link_text:
                        return f"{link_text} [URL: {url}]"
                    return link_text
                        
            elif isinstance(node, list):
                for item in node:
                    item_text = extract_text_recursive(item)
                    if item_text.strip():
                        text_parts.append(item_text)
            
            elif isinstance(node, str):
                text_parts.append(node)
            
            return ' '.join(text_parts)
        
        # Start extraction from root
        if 'root' in content_data:
            extracted_text = extract_text_recursive(content_data['root'])
        else:
            extracted_text = extract_text_recursive(content_data)
            
        # Clean up extra whitespace
        lines = extracted_text.split('\n')
        cleaned_lines = []
        for line in lines:
            cleaned_line = line.strip()
            if cleaned_line:
                cleaned_lines.append(cleaned_line)
        
        return '\n\n'.join(cleaned_lines)
    
    def _classify_table_type(self, title: str, headers: List[str]) -> str:
        """Classify table type based on title and headers"""
        title_lower = title.lower()
        headers_lower = [h.lower() for h in headers]
        
        if any(word in title_lower for word in ['faculty', 'staff', 'professor']):
            return "faculty_list"
        elif any(word in title_lower for word in ['curriculum', 'syllabus', 'course']):
            return "course_curriculum"
        elif any(word in title_lower for word in ['equipment', 'lab', 'facility']):
            return "lab_equipment"
        elif any(word in title_lower for word in ['placement', 'company', 'recruit']):
            return "placement_stats"
        elif any(word in headers_lower for word in ['name', 'designation', 'qualification']):
            return "faculty_list"
        elif any(word in headers_lower for word in ['subject', 'code', 'credit']):
            return "course_curriculum"
        else:
            return "general_table"
    
    def _detect_department(self, content: str) -> Optional[str]:
        """Detect department from content"""
        content_lower = content.lower()
        
        for dept, keywords in DEPARTMENT_KEYWORDS.items():
            if any(keyword in content_lower for keyword in keywords):
                return dept
        
        return None
    
    def _create_section_chunks(self, content: str, department: str, section_title: str, 
                             content_type: str, section_idx: int) -> List[ContentChunk]:
        """Create chunks for generic section content"""
        chunks = []
        
        clean_content = self._clean_html_content(content)
        contextual_content = f"Department: {department}. Section: {section_title}. Content: {clean_content}"
        
        # Create metadata
        base_metadata = {
            "source_type": "collection",
            "source_collection": "department-sections",
            "document_title": section_title,
            "content_type": content_type,
            "department": department,
            "category": "academic",
            "language": "en",
            "last_updated": datetime.now().isoformat(),
            "is_active": True,
            "searchable_keywords": self._extract_keywords(clean_content),
            "search_boost": 0.9
        }
        
        # Create chunks
        content_chunks = self._chunk_text(contextual_content)
        for i, chunk_content in enumerate(content_chunks):
            chunk_metadata = base_metadata.copy()
            chunk_metadata.update({
                "chunk_index": i,
                "total_chunks": len(content_chunks),
                "content_length": len(chunk_content),
                "section_index": section_idx
            })
            
            chunks.append(ContentChunk(
                chunk_id=str(uuid.uuid4()),
                content=chunk_content,
                metadata=chunk_metadata,
                source_id=f"section-{section_idx}-{i}",
                source_type="collection",
                content_type="department-sections",
                chunk_index=i,
                total_chunks=len(content_chunks)
            ))
        
        return chunks
    
    # Placeholder methods for other content types
    def _process_blog_post(self, data: Dict[str, Any]) -> List[ContentChunk]:
        """Process blog post content"""
        return self._process_generic_content("blog-posts", data, "collection")
    
    def _process_testimonial(self, data: Dict[str, Any]) -> List[ContentChunk]:
        """Process testimonial content"""
        return self._process_generic_content("testimonials", data, "collection")
    
    def _process_department(self, data: Dict[str, Any]) -> List[ContentChunk]:
        """Process department content"""
        return self._process_generic_content("departments", data, "collection")
    
    def _process_coe(self, data: Dict[str, Any]) -> List[ContentChunk]:
        """Process COE content"""
        return self._process_generic_content("coe", data, "collection")
    
    def _process_dynamic_page(self, data: Dict[str, Any]) -> List[ContentChunk]:
        """Process dynamic page content"""
        return self._process_generic_content("dynamic-pages", data, "collection")
    
    def _process_admissions(self, data: Dict[str, Any]) -> List[ContentChunk]:
        """Process admissions global content"""
        return self._process_generic_content("admissions", data, "global")
    
    def _process_about(self, data: Dict[str, Any]) -> List[ContentChunk]:
        """Process about global content"""
        chunks = []
        
        # Extract meaningful content from about data
        content_parts = []
        
        # Add hero content
        if 'heroTitle' in data:
            content_parts.append(f"Title: {data['heroTitle']}")
        if 'heroSubtitle' in data:
            content_parts.append(f"Subtitle: {data['heroSubtitle']}")
        
        # Process sections if they exist
        sections = data.get('sections', [])
        for section in sections:
            if isinstance(section, dict):
                # Extract section content based on type
                section_type = section.get('blockType', '') or section.get('contentType', '')
                
                # Add section title if available
                if 'title' in section:
                    content_parts.append(f"\n## {section['title']}")
                
                if section_type == 'richText' and 'content' in section:
                    # Handle rich text content - it might be a dict with 'root' key
                    content_data = section['content']
                    if isinstance(content_data, dict) and 'root' in content_data:
                        # Extract text from structured content
                        extracted_text = self._extract_rich_text(content_data)
                        if extracted_text:
                            content_parts.append(extracted_text)
                    elif isinstance(content_data, str):
                        content_parts.append(self._clean_html_content(content_data))
                elif section_type == 'mixed' and 'content' in section:
                    # Handle mixed content type (like Accreditations)
                    content_data = section['content']
                    if isinstance(content_data, dict) and 'root' in content_data:
                        extracted_text = self._extract_rich_text(content_data)
                        if extracted_text:
                            content_parts.append(extracted_text)
                elif section_type == 'textSection':
                    if 'content' in section:
                        content_parts.append(self._clean_html_content(section['content']))
                elif section_type == 'heroSection':
                    if 'subtitle' in section:
                        content_parts.append(section['subtitle'])
                
                # ENHANCED: Handle image metadata
                if 'image' in section and isinstance(section['image'], dict):
                    image_info = section['image']
                    image_parts = []
                    if 'alt' in image_info and image_info['alt']:
                        image_parts.append(f"Image: {image_info['alt']}")
                    if 'filename' in image_info and image_info['filename']:
                        image_parts.append(f"File: {image_info['filename']}")
                    if 'url' in image_info and image_info['url']:
                        image_parts.append(f"Image URL: {image_info['url']}")
                    if image_parts:
                        content_parts.append(f"[{', '.join(image_parts)}]")
                
                # ENHANCED: Handle dynamic table config
                if 'dynamicTableConfig' in section:
                    table_config = section['dynamicTableConfig']
                    if 'columns' in table_config and table_config['columns']:
                        headers = [col.get('label', col.get('key', '')) for col in table_config['columns'] if col.get('label') or col.get('key')]
                        if headers:
                            content_parts.append(f"Table columns: {', '.join(headers)}")
                    
                    if 'rows' in table_config and table_config['rows']:
                        row_count = len([row for row in table_config['rows'] if row.get('rowData')])
                        if row_count > 0:
                            content_parts.append(f"Table contains {row_count} data rows")
                
                # ENHANCED: Handle multiple tables config
                if 'multipleTablesConfig' in section:
                    tables_config = section['multipleTablesConfig']
                    if isinstance(tables_config, list) and tables_config:
                        content_parts.append(f"Contains {len(tables_config)} tables")
                
                # Add more section types as needed
        
        # If no meaningful content found, fallback to generic processing
        if not content_parts:
            return self._process_generic_content("about", data, "global")
        
        # Combine all content
        full_content = "\n\n".join(content_parts)
        
        # Create metadata
        metadata = {
            "source_type": "global",
            "source_global": "about",
            "source_id": data.get('id', 'about'),
            "document_title": data.get('heroTitle', 'About Rajalakshmi Engineering College'),
            "content_type": "about",
            "category": "institutional",
            "language": "en",
            "last_updated": data.get('updatedAt', datetime.now().isoformat()),
            "is_active": True,
            "searchable_keywords": self._extract_keywords(full_content),
            "search_boost": 1.2
        }
        
        # Create chunks
        content_chunks = self._chunk_text(full_content)
        for i, chunk_content in enumerate(content_chunks):
            chunk_metadata = metadata.copy()
            chunk_metadata.update({
                "chunk_index": i,
                "total_chunks": len(content_chunks),
                "content_length": len(chunk_content)
            })
            
            chunks.append(ContentChunk(
                chunk_id=str(uuid.uuid4()),
                content=chunk_content,
                metadata=chunk_metadata,
                source_id=f"about-{i}",
                source_type="global",
                content_type="about",
                chunk_index=i,
                total_chunks=len(content_chunks)
            ))

        # ENHANCED: Extract and process links separately
        all_links = []
        for section in sections:
            if isinstance(section, dict):
                section_type = section.get('blockType', '') or section.get('contentType', '')
                if section_type in ['richText', 'mixed'] and 'content' in section:
                    content_data = section['content']
                    if isinstance(content_data, dict) and 'root' in content_data:
                        section_links = self._extract_links_from_content(content_data)
                        all_links.extend(section_links)
        
        # Create link chunks if any links were found
        if all_links:
            link_chunks = self._create_link_chunks(all_links, "about", "global", "about")
            chunks.extend(link_chunks)

        return chunks
    
    def _process_academics(self, data: Dict[str, Any]) -> List[ContentChunk]:
        """Process academics global content"""
        return self._process_generic_content("academics", data, "global")
    
    def _process_placement(self, data: Dict[str, Any]) -> List[ContentChunk]:
        """Process placement global content"""
        return self._process_generic_content("placement", data, "global")
    
    def _process_research(self, data: Dict[str, Any]) -> List[ContentChunk]:
        """Process research global content"""
        return self._process_generic_content("research", data, "global")
    
    def _process_facilities(self, data: Dict[str, Any]) -> List[ContentChunk]:
        """Process facilities global content"""
        return self._process_generic_content("facilities", data, "global")
    
    def _process_dynamic_table_section(self, section: Dict[str, Any], department: str, section_title: str, section_idx: int) -> List[ContentChunk]:
        """Process dynamic table section with enhanced handling"""
        chunks = []
        
        # Get the dynamic table configuration
        table_config = section.get('dynamicTableConfig', {})
        table_title = section.get('title', 'Dynamic Table')
        
        # Extract column information
        columns = table_config.get('columns', [])
        rows = table_config.get('rows', [])
        variant = table_config.get('variant', 'default')
        
        if not columns:
            return chunks
        
        # Create table summary
        headers = [col.get('label', col.get('key', '')) for col in columns if col.get('label') or col.get('key')]
        table_summary = f"Dynamic Table: {table_title}\nColumns: {', '.join(headers)}\nVariant: {variant}\nTotal rows: {len(rows)}"
        
        # Process table structure information
        structure_content = f"Department: {department}. Section: {section_title}. {table_summary}"
        
        # Create metadata for table structure
        structure_metadata = {
            "source_type": "collection",
            "source_collection": "department-sections",
            "document_title": section_title,
            "section_title": table_title,
            "content_type": "dynamic_table_structure",
            "table_type": self._classify_table_type(table_title, headers),
            "department": department,
            "category": "academic",
            "section_type": "tabular_data",
            "table_headers": headers,
            "table_variant": variant,
            "total_rows": len(rows),
            "language": "en",
            "last_updated": datetime.now().isoformat(),
            "is_active": True,
            "searchable_keywords": self._extract_keywords(structure_content),
            "search_boost": 1.0
        }
        
        chunks.append(ContentChunk(
            chunk_id=str(uuid.uuid4()),
            content=structure_content,
            metadata=structure_metadata,
            source_id=f"dynamic-table-{section_idx}-structure",
            source_type="collection",
            content_type="department-sections",
            chunk_index=0,
            total_chunks=1
        ))
        
        # Process individual rows if they exist and have data
        for row_idx, row in enumerate(rows):
            row_data = row.get('rowData', [])
            if not row_data:
                continue
                
            row_content = []
            for col_idx, cell_value in enumerate(row_data):
                if col_idx < len(headers) and cell_value:
                    row_content.append(f"{headers[col_idx]}: {cell_value}")
            
            if row_content:
                row_text = f"Department: {department}. Table: {table_title}. Row {row_idx + 1}: {'; '.join(row_content)}"
                
                # Create metadata for row
                row_metadata = structure_metadata.copy()
                row_metadata.update({
                    "content_type": "dynamic_table_row",
                    "row_index": row_idx,
                    "searchable_keywords": self._extract_keywords(row_text),
                    "search_boost": 0.9
                })
                
                chunks.append(ContentChunk(
                    chunk_id=str(uuid.uuid4()),
                    content=row_text,
                    metadata=row_metadata,
                    source_id=f"dynamic-table-{section_idx}-row-{row_idx}",
                    source_type="collection",
                    content_type="department-sections",
                    chunk_index=row_idx + 1,
                    total_chunks=len(rows) + 1
                ))
        
        return chunks
    
    def _process_multiple_tables_section(self, section: Dict[str, Any], department: str, section_title: str, section_idx: int) -> List[ContentChunk]:
        """Process multiple tables section with enhanced handling"""
        chunks = []
        tables_config = section.get('multipleTablesConfig', [])
        
        if not tables_config:
            return chunks
        
        # Create summary chunk for the multiple tables section
        summary_content = f"Department: {department}. Section: {section_title}. Contains {len(tables_config)} tables"
        
        summary_metadata = {
            "source_type": "collection",
            "source_collection": "department-sections",
            "document_title": section_title,
            "section_title": f"{section_title} - Multiple Tables",
            "content_type": "multiple_tables_summary",
            "department": department,
            "category": "academic",
            "section_type": "tabular_data",
            "table_count": len(tables_config),
            "language": "en",
            "last_updated": datetime.now().isoformat(),
            "is_active": True,
            "searchable_keywords": self._extract_keywords(summary_content),
            "search_boost": 1.0
        }
        
        chunks.append(ContentChunk(
            chunk_id=str(uuid.uuid4()),
            content=summary_content,
            metadata=summary_metadata,
            source_id=f"multiple-tables-{section_idx}-summary",
            source_type="collection",
            content_type="department-sections",
            chunk_index=0,
            total_chunks=1
        ))
        
        # Process each table in the multiple tables configuration
        for table_idx, table in enumerate(tables_config):
            if isinstance(table, dict):
                # Create a modified section for each table
                table_section = {
                    'title': table.get('title', f'Table {table_idx + 1}'),
                    'tableConfig': table.get('tableConfig', {}),
                    'dynamicTableConfig': table.get('dynamicTableConfig', {})
                }
                
                # Determine which type of table processing to use
                if 'dynamicTableConfig' in table and table['dynamicTableConfig']:
                    table_chunks = self._process_dynamic_table_section(
                        {'dynamicTableConfig': table['dynamicTableConfig'], 'title': table_section['title']}, 
                        department, 
                        section_title, 
                        f"{section_idx}-{table_idx}"
                    )
                elif 'tableConfig' in table and table['tableConfig']:
                    table_chunks = self._process_table_section(
                        {'tableConfig': table['tableConfig'], 'title': table_section['title']}, 
                        department, 
                        section_title, 
                        f"{section_idx}-{table_idx}"
                    )
                else:
                    # Generic table processing
                    table_content = f"Department: {department}. Section: {section_title}. Table: {table_section['title']}"
                    table_chunks = self._create_section_chunks(
                        table_content, 
                        department, 
                        section_title, 
                        "table", 
                        f"{section_idx}-{table_idx}"
                    )
                
                chunks.extend(table_chunks)
        
        return chunks

    def _extract_links_from_content(self, content_data: Dict[str, Any]) -> List[Dict[str, str]]:
        """Extract all links from content for separate indexing"""
        links = []
        
        def find_links_recursive(node):
            if isinstance(node, dict):
                if node.get('type') == 'link' and 'fields' in node:
                    link_info = {
                        'url': node['fields'].get('url', ''),
                        'text': '',
                        'link_type': node['fields'].get('linkType', 'custom'),
                        'new_tab': node['fields'].get('newTab', False)
                    }
                    
                    # Extract link text
                    if 'children' in node:
                        text_parts = []
                        for child in node['children']:
                            if isinstance(child, dict) and 'text' in child:
                                text_parts.append(child['text'])
                        link_info['text'] = ' '.join(text_parts)
                    
                    if link_info['url']:
                        links.append(link_info)
                
                # Recurse through children
                if 'children' in node:
                    for child in node['children']:
                        find_links_recursive(child)
            
            elif isinstance(node, list):
                for item in node:
                    find_links_recursive(item)
        
        if 'root' in content_data:
            find_links_recursive(content_data['root'])
        else:
            find_links_recursive(content_data)
        
        return links

    def _create_link_chunks(self, links: List[Dict[str, str]], source_id: str, source_type: str, content_type: str) -> List[ContentChunk]:
        """Create separate chunks for links found in content"""
        chunks = []
        
        for i, link in enumerate(links):
            if not link['url']:
                continue
                
            link_content = f"Link: {link['text']} - URL: {link['url']}"
            if link['link_type']:
                link_content += f" (Type: {link['link_type']})"
            
            link_metadata = {
                "source_type": source_type,
                f"source_{source_type}": content_type,
                "source_id": f"{source_id}-link-{i}",
                "document_title": f"Link: {link['text']}",
                "content_type": "link_reference",
                "category": "reference",
                "link_url": link['url'],
                "link_text": link['text'],
                "link_type": link['link_type'],
                "opens_new_tab": link['new_tab'],
                "language": "en",
                "last_updated": datetime.now().isoformat(),
                "is_active": True,
                "searchable_keywords": self._extract_keywords(link['text']),
                "search_boost": 0.8
            }
            
            chunks.append(ContentChunk(
                chunk_id=str(uuid.uuid4()),
                content=link_content,
                metadata=link_metadata,
                source_id=f"{source_id}-link-{i}",
                source_type=source_type,
                content_type=content_type,
                chunk_index=i,
                total_chunks=len(links)
            ))
        
        return chunks
