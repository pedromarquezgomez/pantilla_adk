# main.py
import os
from fastapi import FastAPI
from pydantic import BaseModel
from vertexai.preview import reasoning_engines
from adk_short_bot.agent import root_agent

# Crear la aplicación FastAPI
app = FastAPI(title="ADK Short Bot", description="A bot that shortens messages")

# Crear la instancia de ADK
adk_app = reasoning_engines.AdkApp(
    agent=root_agent,
    enable_tracing=True,
)

# Modelos para las requests
class MessageRequest(BaseModel):
    message: str
    user_id: str = "default_user"
    session_id: str = None

class CreateSessionRequest(BaseModel):
    user_id: str = "default_user"

@app.get("/")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ADK Short Bot"}

@app.post("/sessions")
def create_session(request: CreateSessionRequest):
    """Create a new session"""
    session = adk_app.create_session(user_id=request.user_id)
    return {
        "session_id": session.id,
        "user_id": session.user_id,
        "app_name": session.app_name
    }

@app.post("/chat")
def chat(request: MessageRequest):
    """Send a message to the agent"""
    # If no session_id provided, create a new session
    if not request.session_id:
        session = adk_app.create_session(user_id=request.user_id)
        session_id = session.id
    else:
        session_id = request.session_id
    
    # Stream the response
    responses = []
    for event in adk_app.stream_query(
        user_id=request.user_id,
        session_id=session_id,
        message=request.message,
    ):
        responses.append(str(event))
    
    return {
        "session_id": session_id,
        "user_id": request.user_id,
        "message": request.message,
        "response": " ".join(responses)
    } 