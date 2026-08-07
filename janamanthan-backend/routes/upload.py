import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from config import UPLOADS_DIR
from schemas.report import UploadResponse
from services.csv_reader import CSVReaderService
from utils.logger import logger

router = APIRouter(prefix="/api", tags=["Upload"])

@router.post("/upload", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_csv(file: UploadFile = File(...)):
    """Uploads CSV file, validates columns, saves to storage, and returns upload_id."""
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only CSV files (.csv) are supported."
        )
        
    upload_id = str(uuid.uuid4())[:8]
    save_path = UPLOADS_DIR / f"{upload_id}_{file.filename}"
    
    try:
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        logger.info(f"File uploaded successfully: {file.filename} -> {save_path}")
        
        # Read & Validate CSV
        df, columns = CSVReaderService.read_csv(save_path)
        
        return UploadResponse(
            upload_id=upload_id,
            filename=file.filename,
            total_records=len(df),
            columns=columns,
            message="File uploaded and validated successfully. Ready for analysis."
        )
        
    except Exception as e:
        logger.error(f"Error processing uploaded CSV: {e}")
        if save_path.exists():
            save_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to read or parse CSV file: {str(e)}"
        )

@router.post("/upload-demo", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_demo_dataset():
    """Loads pre-generated sample grievances dataset directly into upload storage."""
    from config import SAMPLE_DATA_DIR
    sample_file = SAMPLE_DATA_DIR / "sample_grievances.csv"
    
    if not sample_file.exists():
        # Auto-generate if missing
        import subprocess
        subprocess.run(["python3", str(SAMPLE_DATA_DIR.parent / "sample_data" / "generate_sample_csv.py")], check=True)
        
    upload_id = str(uuid.uuid4())[:8]
    save_path = UPLOADS_DIR / f"{upload_id}_sample_grievances.csv"
    
    try:
        shutil.copy(sample_file, save_path)
        df, columns = CSVReaderService.read_csv(save_path)
        
        return UploadResponse(
            upload_id=upload_id,
            filename="sample_grievances.csv",
            total_records=len(df),
            columns=columns,
            message="Sample demo dataset loaded successfully. Ready for analysis."
        )
    except Exception as e:
        logger.error(f"Error loading demo dataset: {e}")
        if save_path.exists():
            save_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load demo dataset: {str(e)}"
        )
