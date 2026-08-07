import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from config import STATIC_DIR
from routes import upload, reports
from utils.logger import logger
import os

app = FastAPI(
    title="JanaManthan API",
    description="AI-Powered Grievance Data Analysis & Governance Intelligence Platform API",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(upload.router)
app.include_router(reports.router)

# Mount Static Assets folder if it exists
assets_dir = STATIC_DIR / "assets"
if assets_dir.exists():
    app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

# Mount general static files
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static_files")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "JanaManthan Backend API", "version": "1.0.0"}

@app.get("/api-info")
def get_api_info():
    return {
        "message": "Welcome to JanaManthan Governance Intelligence API",
        "docs_url": "/docs",
        "dashboard_url": "/",
        "api_endpoints": {
            "upload_csv": "POST /api/upload",
            "upload_demo": "POST /api/upload-demo",
            "analyze": "POST /api/analyze/{upload_id}",
            "get_json_report": "GET /api/report/{upload_id}",
            "download_pdf_report": "GET /api/report/{upload_id}/pdf"
        }
    }

# SPA Fallback Catch-All Route: Any non-API route returns index.html for React Router
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # If API or docs route, let FastAPI handle or 404
    if full_path.startswith("api/") or full_path in ["docs", "openapi.json", "redoc"]:
        return JSONResponse(status_code=404, content={"detail": "API endpoint not found"})
    
    file_path = STATIC_DIR / full_path
    if file_path.exists() and file_path.is_file():
        return FileResponse(str(file_path))
    
    # Fallback to React index.html
    return FileResponse(str(STATIC_DIR / "index.html"))

if __name__ == "__main__":
    logger.info("Starting JanaManthan FastAPI server on http://0.0.0.0:8000")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

