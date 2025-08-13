import json

import google.generativeai as genai

from app.core.config import get_settings

# Configure Gemini
settings = get_settings()
genai.configure(api_key=settings.GEMINI_API_KEY)


async def sse_chat_generator(
    re_prompt: str,
    context: str = "",
    temperature: float = 0.7,
    role: str = "user helpdesk assistant",
):
    """
    Async generator for SSE chat responses with Gemini API.

    Args:
        re_prompt: User's message/prompt
        context: Additional context for the conversation
        temperature: Controls response randomness (0.0-1.0)
        role: The persona AI should respond as
    """
    try:
        # Initial waiting status
        yield f"data: {json.dumps({'status': 'waiting', 'message': 'Waiting for Gemini API response...'})}\n\n"

        # Configure model with temperature
        model = genai.GenerativeModel(
            "gemini-1.5-pro-latest",
            generation_config={
                "temperature": min(max(temperature, 0.0), 1.0),  # Clamped to 0-1 range
                "max_output_tokens": 2048,
            },
        )

        # Build conversation history
        conversation = [
            {
                "role": "user",
                "parts": [
                    f"Role: Act as a {role}.\n"
                    f"Context: {context}\n\n"
                    f"User Question: {re_prompt}"
                ],
            }
        ]

        # Generate response
        response = await model.generate_content_async(conversation)

        # Successful response
        success_data = json.dumps({"status": "success", "message": response.text})
        yield f"data: {success_data}\n\n"

    except Exception as e:
        error_msg = f"Gemini API error: {str(e)}"
        error_data = json.dumps({"status": "error", "message": error_msg})
        yield f"data: {error_data}\n\n"
