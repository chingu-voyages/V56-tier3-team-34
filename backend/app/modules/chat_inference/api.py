import os

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.modules.chat_inference.service import sse_chat_generator

# --- FastAPI Router ---
router = APIRouter(prefix="/chat", tags=["Chat Inference"])


class ChatRequest(BaseModel):
    message: str = "How can I get help?"  # Default message
    temperature: float = 0.7  # Default temperature
    role: str = "user helpdesk assistant"  # Default role


# Load context from file
def load_context():
    context = ""
    # Construct the absolute path to the instructions.txt file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    context_path = os.path.join(current_dir, "data", "instructions.txt")
    if os.path.exists(context_path):
        with open(context_path) as file:
            context = file.read().strip()
    return context


@router.get("/")
def get_chat_context():
    """
    Returns the chat context loaded from data/instructions.txt.
    """
    context = load_context()
    return {"context": context}


@router.post("/")
async def chat_inference_stream(request: ChatRequest):
    """
    Streams chat responses from Gemini API with configurable parameters.

    Parameters:
    - message: User's input prompt (required. default: "How can I get help?")
    - temperature: Controls randomness (0.0-1.0, default 0.7)
    - role: The persona the AI should adopt (default: "user helpdesk assistant")

    Context is automatically loaded from data/context.txt
    """
    context = load_context()

    return StreamingResponse(
        sse_chat_generator(
            re_prompt=request.message,
            context=context,
            temperature=request.temperature,
            role=request.role,
        ),
        media_type="text/event-stream",
    )
