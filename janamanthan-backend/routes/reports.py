import json
from pathlib import Path
from typing import Dict
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
from config import UPLOADS_DIR, REPORTS_DIR
from schemas.report import GovernanceReport, AnalysisStatusResponse
from services.csv_reader import CSVReaderService
from services.preprocessing import PreprocessingService
from services.categorization import CategorizationService
from services.clustering import ClusteringService
from services.statistics import StatisticsService
from services.llm_service import LLMService
from services.report_generator import ReportGeneratorService
from utils.logger import logger

router = APIRouter(prefix="/api", tags=["Reports & Analysis"])

# In-memory store for generated reports (can be replaced by PostgreSQL/Redis)
REPORTS_CACHE: Dict[str, GovernanceReport] = {}

def find_upload_file(upload_id: str) -> Path:
    """Locates uploaded CSV file by upload_id prefix."""
    matches = list(UPLOADS_DIR.glob(f"{upload_id}_*.csv"))
    if not matches:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No uploaded file found with ID '{upload_id}'."
        )
    return matches[0]

@router.post("/analyze/{upload_id}", response_model=GovernanceReport)
async def analyze_dataset(upload_id: str):
    """Triggers end-to-end JanaManthan AI analysis pipeline on uploaded dataset."""
    csv_path = find_upload_file(upload_id)
    filename = csv_path.name.replace(f"{upload_id}_", "")
    
    logger.info(f"Starting analysis for upload_id: {upload_id} ({filename})")
    
    try:
        # Step 1: Read CSV
        df, columns = CSVReaderService.read_csv(csv_path)
        mapping = CSVReaderService.detect_column_mapping(columns)
        
        # Step 2: Clean & Preprocess
        complaints = PreprocessingService.process_dataframe(df, mapping)
        if not complaints:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CSV contains no valid text complaints after cleaning."
            )
            
        # Step 3: Categorization
        categorizer = CategorizationService()
        complaints = categorizer.categorize_dataset(complaints)
        
        # Step 4: Clustering
        clusters = ClusteringService.cluster_complaints(complaints, max_clusters=5)
        
        # Step 5: Statistics Computation
        stats = StatisticsService.compute_statistics(complaints)
        
        # Step 6: AI Analysis & LLM Policy Brief
        ai_insights = LLMService.generate_policy_insights(stats, clusters)
        
        # Step 7: Assemble Report & Generate PDF
        report = ReportGeneratorService.build_json_report(
            upload_id=upload_id,
            filename=filename,
            stats=stats,
            clusters=clusters,
            ai_insights=ai_insights
        )
        
        # Save PDF to disk
        ReportGeneratorService.generate_pdf_report(report)
        
        # Save JSON to disk & memory cache
        json_path = REPORTS_DIR / f"{upload_id}_report.json"
        with open(json_path, "w", encoding="utf-8") as f:
            f.write(report.model_dump_json(indent=2))
            
        REPORTS_CACHE[upload_id] = report
        logger.info(f"Analysis completed successfully for {upload_id}")
        return report
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during analysis pipeline: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during dataset analysis: {str(e)}"
        )

@router.get("/report/{upload_id}", response_model=GovernanceReport)
async def get_report_json(upload_id: str):
    """Returns JSON report for given upload_id."""
    if upload_id in REPORTS_CACHE:
        return REPORTS_CACHE[upload_id]
        
    json_path = REPORTS_DIR / f"{upload_id}_report.json"
    if json_path.exists():
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            report = GovernanceReport(**data)
            REPORTS_CACHE[upload_id] = report
            return report
            
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Report for upload ID '{upload_id}' not found. Please run POST /api/analyze/{upload_id} first."
    )

@router.get("/report/{upload_id}/pdf")
async def download_report_pdf(upload_id: str):
    """Downloads PDF report for given upload_id."""
    pdf_path = REPORTS_DIR / f"{upload_id}_report.pdf"
    
    if not pdf_path.exists():
        # Check if report json exists and re-generate PDF
        if upload_id in REPORTS_CACHE or (REPORTS_DIR / f"{upload_id}_report.json").exists():
            report = await get_report_json(upload_id)
            ReportGeneratorService.generate_pdf_report(report)
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"PDF report for upload ID '{upload_id}' not found. Please analyze dataset first."
            )
            
    return FileResponse(
        path=pdf_path,
        filename=f"JanaManthan_Governance_Report_{upload_id}.pdf",
        media_type="application/pdf"
    )
