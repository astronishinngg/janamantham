import pandas as pd
import io
from pathlib import Path
from typing import Tuple, List, Dict, Any
from utils.logger import logger

class CSVReaderService:
    @staticmethod
    def read_csv(file_path: Path) -> Tuple[pd.DataFrame, List[str]]:
        """Reads CSV with encoding and separator auto-detection fallback."""
        encodings = ['utf-8', 'utf-8-sig', 'iso-8859-1', 'cp1252', 'latin1']
        separators = [',', ';', '\t']
        df = None
        
        for enc in encodings:
            for sep in separators:
                try:
                    df_candidate = pd.read_csv(file_path, encoding=enc, sep=sep)
                    if df_candidate is not None and not df_candidate.empty and len(df_candidate.columns) >= 1:
                        # Check if parsed cleanly
                        if len(df_candidate.columns) == 1 and ',' in str(df_candidate.columns[0]):
                            continue  # Wrong separator, try comma
                        df = df_candidate
                        logger.info(f"Successfully loaded CSV with encoding '{enc}' & sep '{sep}'. Shape: {df.shape}")
                        break
                except Exception as e:
                    continue
            if df is not None:
                break
                
        if df is None or df.empty:
            raise ValueError("CSV file is empty, corrupted, or could not be parsed with supported encodings/separators.")
            
        columns = [str(c).strip() for c in df.columns]
        df.columns = columns
        return df, columns

    @staticmethod
    def detect_column_mapping(columns: List[str]) -> Dict[str, str]:
        """Auto-detects mapping for standard fields like description, location, date, category, status."""
        cols_lower = {c.lower(): c for c in columns}
        
        mapping = {
            "description": None,
            "category": None,
            "location": None,
            "date": None,
            "status": None,
            "resolution_days": None,
            "id": None
        }
        
        # Search patterns
        for key, patterns in {
            "description": ["description", "complaint", "issue", "text", "details", "grievance", "remarks", "summary"],
            "category": ["category", "department", "dept", "type", "sector", "domain"],
            "location": ["location", "district", "city", "ward", "area", "address", "region", "zone", "place"],
            "date": ["date", "created_at", "time", "submitted", "timestamp", "registered"],
            "status": ["status", "state", "resolution_status", "stage"],
            "resolution_days": ["days", "resolution_days", "time_taken", "duration", "turnaround"],
            "id": ["id", "grievance_id", "complaint_id", "ticket_id", "sl_no", "sno"]
        }.items():
            for p in patterns:
                matched = [c for col_l, c in cols_lower.items() if p in col_l]
                if matched:
                    mapping[key] = matched[0]
                    break
                    
        # Fallback for description: pick the text column with highest average string length if not detected
        if not mapping["description"]:
            mapping["description"] = columns[0]
            
        logger.info(f"Detected Column Mapping: {mapping}")
        return mapping
