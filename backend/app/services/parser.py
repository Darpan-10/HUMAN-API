# app/services/parser.py
import re
from typing import List
import logging

logger = logging.getLogger(__name__)

STOP_WORDS = {"i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours",
              "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers",
              "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves",
              "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are",
              "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does",
              "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until",
              "while", "of", "at", "by", "for", "with", "about", "against", "between", "into",
              "through", "during", "before", "after", "above", "below", "to", "from", "up", "down",
              "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here",
              "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more",
              "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so",
              "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"}

TECH_KEYWORDS = {
    "mobile", "app", "web", "ai", "machine learning", "data science", "blockchain",
    "react", "python", "javascript", "mongodb", "fastapi", "flutter", "swift",
    "sustainability", "campus", "events", "social", "network"
}

# Pre-compute multi-word terms for efficient matching
_MULTI_WORD_KEYWORDS = sorted(
    [kw for kw in TECH_KEYWORDS if " " in kw],
    key=len, reverse=True  # longest first to avoid partial matches
)


def extract_keywords(text: str) -> List[str]:
    """Extract keywords from intent text"""
    
    # FAILURE POINT 1: Handle None or non-string input
    if not text or not isinstance(text, str):
        logger.warning("extract_keywords: Invalid input (None or non-string)")
        return []
    
    try:
        lower_text = text.lower()
        keywords = []

        # Step 1: Match multi-word tech terms first (e.g. "machine learning")
        for term in _MULTI_WORD_KEYWORDS:
            if term in lower_text:
                keywords.append(term)

        # Step 2: Extract single words, filter stop words
        words = re.findall(r'\b[a-z]+\b', lower_text)
        keywords.extend(w for w in words if w not in STOP_WORDS and len(w) > 2)
        
        # Return unique keywords (max 10 to avoid bloat)
        return list(dict.fromkeys(keywords))[:10]
        
    # FAILURE POINT 2: Regex or processing fails
    except Exception as e:
        logger.error(f"extract_keywords error: {e}")
        return []


def parse_intent(text: str) -> dict:
    """Parse intent text and extract metadata"""
    
    if not text or not isinstance(text, str):
        return {"text": "", "keywords": [], "error": "Invalid input"}
    
    try:
        keywords = extract_keywords(text)
        return {
            "text": text.strip(),
            "keywords": keywords,
            "keyword_count": len(keywords)
        }
    except Exception as e:
        logger.error(f"parse_intent error: {e}")
        return {"text": text, "keywords": [], "error": str(e)}