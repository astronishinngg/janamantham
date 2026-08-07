import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
UPLOADS_DIR = BASE_DIR / "uploads"
REPORTS_DIR = BASE_DIR / "reports"
STATIC_DIR = BASE_DIR / "static"
SAMPLE_DATA_DIR = BASE_DIR / "sample_data"

# Create directories if not exist
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)
SAMPLE_DATA_DIR.mkdir(parents=True, exist_ok=True)

# OpenAI API Key & Local LLM URL (Qwen 9B / Gemma 4B via LM Studio / Ollama)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
LOCAL_LLM_URL = os.getenv("LOCAL_LLM_URL", "http://localhost:1234/v1")

# Default categories mapping for keyword classifier
DEFAULT_CATEGORIES = {
    "Water & Sanitation": ["water", "pipe", "drinking", "drain", "sewage", "supply", "leak", "tank", "borewell", "contamination", "tap"],
    "Roads & Infrastructure": ["road", "pothole", "street", "bridge", "asphalt", "tar", "footpath", "construction", "crack", "traffic light", "divider"],
    "Electricity & Power": ["power", "electricity", "voltage", "meter", "light", "transformer", "wire", "blackout", "outage", "current", "pole"],
    "Waste & Sanitation": ["garbage", "trash", "clean", "waste", "bin", "dump", "dirt", "sweeping", "odor", "smell", "drainage"],
    "Public Transport & Traffic": ["bus", "traffic", "transport", "signal", "vehicle", "parking", "auto", "route", "stop"],
    "Health & Safety": ["hospital", "health", "doctor", "medicine", "stray", "dog", "mosquito", "fever", "clinic", "pest"],
    "Civic Services & Taxes": ["tax", "birth certificate", "death certificate", "license", "property", "bill", "portal", "receipt", "ration"]
}
