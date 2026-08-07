from typing import List, Dict
from models.complaint import Complaint
from config import DEFAULT_CATEGORIES
from utils.logger import logger

class CategorizationService:
    def __init__(self, custom_categories: Dict[str, List[str]] = None):
        self.categories = custom_categories or DEFAULT_CATEGORIES

    def categorize_single(self, text: str) -> str:
        """Rule-based keyword classifier for single complaint text."""
        if not text:
            return "General Civic Issue"
            
        text_lower = text.lower()
        scores = {}
        
        for category, keywords in self.categories.items():
            score = sum(1 for kw in keywords if kw in text_lower)
            if score > 0:
                scores[category] = score
                
        if scores:
            # Pick category with highest matched keywords
            best_cat = max(scores, key=scores.get)
            return best_cat
            
        return "General Civic Issue"

    def categorize_dataset(self, complaints: List[Complaint]) -> List[Complaint]:
        """Categorizes all complaints in dataset."""
        categorized_count = 0
        for c in complaints:
            # If c.category is uninformative or missing, assign inferred category
            if not c.category or c.category.lower() in ["uncategorized", "unknown", "nan", "other", "none", ""]:
                c.category = self.categorize_single(c.cleaned_text)
                categorized_count += 1
            else:
                # Standardize category text
                c.category = c.category.strip().title()
                
        logger.info(f"Categorization complete. Auto-categorized {categorized_count} complaints.")
        return complaints
