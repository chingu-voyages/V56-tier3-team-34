import os
import google.generativeai as genai
from fastapi import APIRouter
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv(override=True)

# --- Gemini API Configuration ---
# Get your API key from an environment variable.
# You can get a key from https://aistudio.google.com/
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if not GEMINI_API_KEY:
    raise ValueError("Please set the GEMINI_API_KEY environment variable. You can get a key from https://aistudio.google.com/")

# Configure the generative AI library with the API key
genai.configure(api_key=GEMINI_API_KEY)

# --- FastAPI Router ---
router = APIRouter(prefix="/chat", tags=["Chat Inference"])

@router.get("/")
async def chat_inference():
    """
    This endpoint uses the Gemini API to generate a response to a fixed prompt.
    """
    try:
        # --- Model Initialization ---
        # Create an instance of the Gemini Pro model
        # You can also use other models like 'gemini-1.5-flash-latest'
        model = genai.GenerativeModel('gemini-1.5-pro-latest')

        # --- Content Generation ---
        # The prompt to send to the model
        prompt = "What is the meaning of life?"

        # Generate content using the model
        response = model.generate_content(prompt)

        # --- Return Response ---
        # Extract the text from the response and return it
        return {"message": response.text}

    except Exception as e:
        # Basic error handling
        print(f"An error occurred: {e}")
        return {"error": "Failed to generate content from Gemini API."}