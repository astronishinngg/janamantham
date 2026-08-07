from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class UploadResponse(BaseModel):
    upload_id: str
    filename: str
    total_records: int
    columns: List[str]
    message: str

class AnalysisStatusResponse(BaseModel):
    upload_id: str
    status: str  # "processing", "completed", "failed"
    progress: float
    message: str

class CategoryStat(BaseModel):
    category: str
    count: int
    percentage: float
    avg_resolution_days: Optional[float] = 0.0

class LocationStat(BaseModel):
    location: str
    count: int
    percentage: float

class ClusterStat(BaseModel):
    cluster_id: int
    topic_title: str
    category: str
    complaint_count: int
    recurrence_percentage: float
    sample_complaints: List[str]
    detected_root_cause: str

class RootCauseStat(BaseModel):
    title: str
    category: str
    severity: str  # High, Medium, Low
    description: str
    affected_locations: List[str]

class PriorityAction(BaseModel):
    priority: int
    title: str
    department: str
    recommended_action: str
    impact: str

class ExecutiveSummary(BaseModel):
    overview: str
    key_findings: List[str]
    critical_risk_areas: List[str]
    governance_insights: str

class ChartsData(BaseModel):
    categories_breakdown: Dict[str, int]
    locations_breakdown: Dict[str, int]
    status_breakdown: Dict[str, int]
    timeline_breakdown: Optional[Dict[str, int]] = {}

class GovernanceReport(BaseModel):
    upload_id: str
    generated_at: str
    total_complaints: int
    dataset_name: str
    executive_summary: ExecutiveSummary
    category_stats: List[CategoryStat]
    top_locations: List[LocationStat]
    clusters: List[ClusterStat]
    root_causes: List[RootCauseStat]
    priority_actions: List[PriorityAction]
    charts_data: ChartsData
    pdf_available: bool = True
