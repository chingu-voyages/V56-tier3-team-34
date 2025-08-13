import json
import os

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# Load environment variables from a .env file
load_dotenv(override=True)

# --- Gemini API Configuration ---
# Get your API key from an environment variable.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if not GEMINI_API_KEY:
    raise ValueError(
        "Please set the GEMINI_API_KEY environment variable. You can get a key from https://aistudio.google.com/"
    )

# Configure the generative AI library with the API key
genai.configure(api_key=GEMINI_API_KEY)

# --- FastAPI Router ---
router = APIRouter(prefix="/chat", tags=["Chat Inference"])


class ChatRequest(BaseModel):
    message: str


async def sse_chat_generator(re_prompt: str = "What is the meaning of life?"):
    """
    This async generator yields Server-Sent Events (SSE) with status updates
    for the chat inference process.
    """
    try:
        # --- Event 1: Waiting Status ---
        # Yield a "waiting" status, formatted for SSE
        waiting_message = {
            "status": "waiting",
            "message": "Waiting for Gemini API response...",
        }
        # Format the data for SSE: "data: {json_string}\n\n"
        yield f"data: {json.dumps(waiting_message)}\n\n"

        # --- Model Initialization & Content Generation ---
        model = genai.GenerativeModel("gemini-1.5-pro-latest")
        prompt = f"{re_prompt} Explain it like you are a cheerful philosopher."
        response = await model.generate_content_async(prompt)

        # --- Event 2: Successful Response ---
        # Yield the "success" status with the response, formatted for SSE
        success_message = {"status": "success", "message": response.text}
        # Format the data for SSE
        yield f"data: {json.dumps(success_message)}\n\n"

    except Exception as e:
        print(f"An error occurred: {e}")
        error_message = {
            "status": "error",
            "message": "Failed to generate content from Gemini API.",
        }
        # Format the data for SSE
        yield f"data: {json.dumps(error_message)}\n\n"


@router.post("/")
async def chat_inference_stream(request: ChatRequest):
    """
    This endpoint uses the Gemini API to generate a response to the user's prompt,
    streaming status updates to the client using Server-Sent Events (SSE).

    Expects a JSON payload with a "message" field containing the user's prompt.
    """
    return StreamingResponse(
        sse_chat_generator(request.message), media_type="text/event-stream"
    )
