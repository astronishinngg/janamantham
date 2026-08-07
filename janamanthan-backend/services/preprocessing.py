import re
import pandas as pd
from typing import List
from models.complaint import Complaint
from utils.logger import logger

class PreprocessingService:
    @staticmethod
    def clean_text(text: str) -> str:
        if not isinstance(text, str) or not text.strip():
            return ""
        # Lowercase, strip whitespace, remove URLs & special non-alphanumeric chars
        text = text.lower().strip()
        text = re.sub(r'https?://\S+|www\.\S+', '', text)
        text = re.sub(r'[^\w\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        return text

    @staticmethod
    def process_dataframe(df: pd.DataFrame, mapping: dict) -> List[Complaint]:
        """Cleans, drops invalid rows, normalizes fields into Complaint dataclass list."""
        complaints: List[Complaint] = []
        desc_col = mapping.get("description")
        cat_col = mapping.get("category")
        loc_col = mapping.get("location")
        date_col = mapping.get("date")
        status_col = mapping.get("status")
        days_col = mapping.get("resolution_days")
        id_col = mapping.get("id")
        
        # Drop rows with empty description
        df_clean = df.dropna(subset=[desc_col]).copy()
        
        for idx, row in df_clean.iterrows():
            desc_val = str(row[desc_col]).strip()
            if not desc_val or desc_val.lower() == 'nan':
                continue
                
            cleaned = PreprocessingService.clean_text(desc_val)
            if not cleaned or len(cleaned) < 3:
                continue
                
            comp_id = str(row[id_col]) if id_col and pd.notna(row[id_col]) else f"CMP-{idx+1:05d}"
            cat_val = str(row[cat_col]).strip() if cat_col and pd.notna(row[cat_col]) else "Uncategorized"
            loc_val = str(row[loc_col]).strip() if loc_col and pd.notna(row[loc_col]) else "Unknown Location"
            date_val = str(row[date_col]).strip() if date_col and pd.notna(row[date_col]) else None
            status_val = str(row[status_col]).strip() if status_col and pd.notna(row[status_col]) else "Open"
            
            res_days = None
            if days_col and pd.notna(row[days_col]):
                try:
                    res_days = float(row[days_col])
                except ValueError:
                    res_days = None

            c = Complaint(
                id=comp_id,
                description=desc_val,
                category=cat_val,
                location=loc_val,
                date=date_val,
                status=status_val,
                resolution_days=res_days,
                cleaned_text=cleaned
            )
            complaints.append(c)
            
        logger.info(f"Preprocessed {len(complaints)} valid complaints from {len(df)} raw rows.")
        return complaints
