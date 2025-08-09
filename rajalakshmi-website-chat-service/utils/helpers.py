import re
from typing import Dict, List
from datetime import datetime

def clean_text(text: str) -> str:
    """Clean and normalize text input"""
    if not text:
        return ""
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s.,?!-]', '', text)
    
    return text

def extract_keywords(query: str) -> List[str]:
    """Extract relevant keywords from user query"""
    # Common stop words to filter out
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
        'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being'
    }
    
    # Split and clean words
    words = query.lower().split()
    keywords = [word.strip('.,?!') for word in words if word.lower() not in stop_words and len(word) > 2]
    
    return keywords

def format_response_with_sources(message: str, sources: List[Dict]) -> Dict:
    """Format response with source information"""
    formatted_sources = []
    
    for i, source in enumerate(sources, 1):
        source_info = {
            "id": i,
            "title": source.get("title", "Unknown"),
            "type": source.get("type", "content"),
            "department": source.get("department"),
            "score": round(source.get("score", 0.0), 3)
        }
        formatted_sources.append(source_info)
    
    return {
        "message": message,
        "sources": formatted_sources,
        "source_count": len(formatted_sources)
    }

def get_greeting_for_time() -> str:
    """Get appropriate greeting based on current time"""
    current_hour = datetime.now().hour
    
    if 5 <= current_hour < 12:
        return "Good morning"
    elif 12 <= current_hour < 17:
        return "Good afternoon"
    elif 17 <= current_hour < 21:
        return "Good evening"
    else:
        return "Hello"

def classify_query_intent(query: str) -> str:
    """Basic intent classification for user queries"""
    query_lower = query.lower()
    
    # Admission related keywords
    if any(word in query_lower for word in ['admission', 'apply', 'entrance', 'eligibility', 'fees', 'cost']):
        return "admissions"
    
    # Academic related keywords
    elif any(word in query_lower for word in ['course', 'curriculum', 'department', 'subject', 'faculty', 'syllabus']):
        return "academics"
    
    # Facilities related keywords
    elif any(word in query_lower for word in ['facility', 'lab', 'library', 'hostel', 'canteen', 'infrastructure']):
        return "facilities"
    
    # Placement related keywords
    elif any(word in query_lower for word in ['placement', 'job', 'company', 'salary', 'internship', 'career']):
        return "placements"
    
    # Campus life related keywords
    elif any(word in query_lower for word in ['club', 'activity', 'event', 'sport', 'cultural', 'fest']):
        return "campus_life"
    
    else:
        return "general"
