from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any

@dataclass
class Complaint:
    id: str
    description: str
    category: Optional[str] = "Uncategorized"
    location: Optional[str] = "Unknown"
    date: Optional[str] = None
    status: Optional[str] = "Open"
    resolution_days: Optional[float] = None
    cleaned_text: Optional[str] = ""
    cluster_id: Optional[int] = -1

@dataclass
class ComplaintDataset:
    upload_id: str
    filename: str
    total_raw_rows: int
    cleaned_complaints: List[Complaint] = field(default_factory=list)
    columns: List[str] = field(default_factory=list)
