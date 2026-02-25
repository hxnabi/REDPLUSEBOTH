import os
import json
import logging
from openai import OpenAI
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.utils.chatbot_knowledge import REDCONNECT_KNOWLEDGE_BASE

router = APIRouter()
logger = logging.getLogger(__name__)

class ChatRequest(BaseModel):
  message: str

class ChatResponse(BaseModel):
  answer: str
  topic: Optional[str] = None
  suggestions: List[str] = []

# Configure OpenAI API
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = None

if OPENAI_API_KEY:
    client = OpenAI(api_key=OPENAI_API_KEY)
else:
    logger.warning("OPENAI_API_KEY not found in environment variables. Chatbot will use fallback mode.")

def normalize(text: str) -> str:
  return text.strip().lower()

def get_fallback_response(message: str) -> ChatResponse:
  """
  Fallback rule-based logic when AI is unavailable.
  """
  text = normalize(message)

  # Greetings
  if any(keyword in text for keyword in ["hi", "hello", "hey", "greetings", "good morning", "good evening"]):
    return ChatResponse(
      topic="greeting",
      answer=(
        "Hello! I'm the RedConnect Assistant. I can help you find blood banks, check eligibility, "
        "or answer questions about blood donation.\n\n"
        "How can I help you today?"
      ),
      suggestions=[
        "Who can donate blood?",
        "Find a blood bank",
        "Request blood for a patient"
      ],
    )

  # Redirections / Navigation
  if any(keyword in text for keyword in ["find blood", "blood bank", "location", "near me"]):
    return ChatResponse(
      topic="navigation_bloodbanks",
      answer=(
        "You can search for blood banks in your area on our Blood Banks page. "
        "We have listings for major cities and states."
      ),
      suggestions=[
        "Who can donate blood?",
        "Request blood"
      ],
    )

  if any(keyword in text for keyword in ["request", "need blood", "patient"]):
    return ChatResponse(
      topic="navigation_request",
      answer=(
        "I'm taking you to the Request Blood page. Please fill in the patient details so we can assist you with finding a donor."
      ),
      suggestions=[
        "Track my request",
        "Find a blood bank"
      ],
    )

  if any(keyword in text for keyword in ["eligib", "who can donate", "can i donate", "eligible to donate"]):
    return ChatResponse(
      topic="eligibility",
      answer=(
        "Most healthy adults between 18 and 65 can donate blood. You should:\n"
        "- Weigh at least 50 kg\n"
        "- Have no active infections or fever\n"
        "- Not be pregnant or recently given birth\n"
        "- Not have donated whole blood in the last 3 months\n\n"
        "Final eligibility is always confirmed by the medical team at the donation site."
      ),
      suggestions=[
        "How often can I donate blood?",
        "What tests are done before donation?",
        "Is it safe to donate blood?",
      ],
    )

  if any(keyword in text for keyword in ["pain", "hurt", "does it hurt"]):
    return ChatResponse(
      topic="pain_and_comfort",
      answer=(
        "Blood donation is usually not very painful. You will feel:\n"
        "- A quick pinch when the needle is inserted\n"
        "- Mild pressure during the donation\n\n"
        "The procedure is done by trained staff, and they monitor you throughout to keep you safe "
        "and comfortable. You can always tell them if you feel unwell."
      ),
      suggestions=[
        "How long does donating blood take?",
        "What should I do after donating?",
      ],
    )

  if any(keyword in text for keyword in ["how long", "time", "duration", "take to donate"]):
    return ChatResponse(
      topic="duration",
      answer=(
        "The actual blood draw takes about 8–10 minutes. Including registration, a brief health "
        "check, and rest with snacks, you should plan for about 30–45 minutes in total."
      ),
      suggestions=[
        "How often can I donate blood?",
        "What should I eat before donating?",
      ],
    )

  if any(keyword in text for keyword in ["often", "frequency", "how many times", "how frequently"]):
    return ChatResponse(
      topic="frequency",
      answer=(
        "For whole blood donation, you can usually donate every 3 months. This gives your body "
        "enough time to fully replace your red blood cells.\n\n"
        "For other types like platelets or plasma, the interval can be shorter, but that is decided "
        "by the blood center based on local guidelines."
      ),
      suggestions=[
        "Who can donate blood?",
        "Is blood donation safe?",
      ],
    )

  if any(keyword in text for keyword in ["before donate", "eat before", "what should i eat", "drink before"]):
    return ChatResponse(
      topic="before_donation",
      answer=(
        "Before donating blood you should:\n"
        "- Eat a light, healthy meal (avoid very fatty or oily foods)\n"
        "- Drink plenty of water\n"
        "- Avoid alcohol for at least 24 hours\n"
        "- Sleep well the night before\n\n"
        "This helps keep your blood pressure stable and reduces the chance of dizziness."
      ),
      suggestions=[
        "What should I do after donating?",
        "Who is eligible to donate?",
      ],
    )
    
  if any(keyword in text for keyword in ["thank", "thanks"]):
    return ChatResponse(
      topic="appreciation",
      answer=(
        "You're welcome! Let me know if you need anything else."
      ),
      suggestions=[
        "Donate blood",
        "Find a blood bank"
      ],
    )

  if any(keyword in text for keyword in ["bye", "goodbye"]):
    return ChatResponse(
      topic="farewell",
      answer=(
        "Goodbye! Stay healthy and safe."
      ),
      suggestions=[],
    )

  # Default fallback
  return ChatResponse(
    topic="general",
    answer=(
      "I'm sorry, I didn't quite catch that. I can help with:\n"
      "- Finding blood banks\n"
      "- Eligibility for donation\n"
      "- Requesting blood for a patient\n\n"
      "Could you please rephrase your question?"
    ),
    suggestions=[
      "Who is eligible to donate blood?",
      "Is blood donation safe?",
      "How often can I donate blood?",
    ],
  )

def get_chatbot_answer(message: str) -> ChatResponse:
    # If no API key or client, use fallback
    if not client:
        return get_fallback_response(message)

    try:
        # Prompt Engineering for JSON output
        prompt = f"""
        You are the AI Assistant for RedConnect. Use the following knowledge base to answer the user's question.
        
        KNOWLEDGE BASE:
        {REDCONNECT_KNOWLEDGE_BASE}
        
        USER QUESTION: "{message}"
        
        INSTRUCTIONS:
        1. Answer based ONLY on the knowledge base. If the answer is not there, politely say you don't know and suggest contacting support.
        2. Provide your response in strictly valid JSON format with the following keys:
           - "answer": The text of your answer. Keep it helpful, concise, and professional.
           - "topic": A short topic string (e.g., "eligibility", "donation_process", "general").
           - "suggestions": A list of 2-3 short follow-up questions the user might ask next.
        3. Do NOT include markdown code blocks (like ```json) in the response. Just return the raw JSON string.
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that outputs JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )
        
        text_response = response.choices[0].message.content.strip()
        
        # Cleanup markdown if present
        if text_response.startswith("```json"):
            text_response = text_response[7:]
        if text_response.startswith("```"):
            text_response = text_response[3:]
        if text_response.endswith("```"):
            text_response = text_response[:-3]
            
        data = json.loads(text_response.strip())
        
        return ChatResponse(
            answer=data.get("answer", "I'm having trouble understanding that right now."),
            topic=data.get("topic", "general"),
            suggestions=data.get("suggestions", [])
        )
        
    except Exception as e:
        logger.error(f"OpenAI API Error: {e}")
        # Fallback to rule-based system on error
        return get_fallback_response(message)

@router.post("/chatbot/query", response_model=ChatResponse)
def chatbot_query(request: ChatRequest) -> ChatResponse:
  return get_chatbot_answer(request.message)
