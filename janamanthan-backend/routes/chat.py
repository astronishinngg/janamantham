from fastapi import APIRouter
from pydantic import BaseModel
from services.chat_service import ChatService

from typing import Optional

router = APIRouter(prefix="/api", tags=["Chatbot"])

class ChatRequest(BaseModel):
    message: str
    upload_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    print(f"DEBUG CHAT REQUEST - Message: {request.message}, Upload ID: {request.upload_id}")
    response_text = ChatService.get_response(request.message, request.upload_id)
    return ChatResponse(response=response_text)
