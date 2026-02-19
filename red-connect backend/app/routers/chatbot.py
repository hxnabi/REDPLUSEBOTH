from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional


router = APIRouter()


class ChatRequest(BaseModel):
  message: str


class ChatResponse(BaseModel):
  answer: str
  topic: Optional[str] = None
  suggestions: List[str] = []


def normalize(text: str) -> str:
  return text.strip().lower()


def get_chatbot_answer(message: str) -> ChatResponse:
  text = normalize(message)

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
        "Who should not donate blood?",
      ],
    )

  if any(keyword in text for keyword in ["after donating", "after donation", "post donation", "what to do after"]):
    return ChatResponse(
      topic="after_donation",
      answer=(
        "After donating blood you should:\n"
        "- Rest for 10–15 minutes and have snacks and fluids\n"
        "- Keep the bandage on for a few hours\n"
        "- Drink plenty of water for the next 24 hours\n"
        "- Avoid heavy lifting or intense exercise for the rest of the day\n\n"
        "If you feel dizzy, sit or lie down and raise your legs slightly. If symptoms continue, "
        "contact the blood center or a doctor."
      ),
      suggestions=[
        "How long does donating blood take?",
        "Is blood donation safe?",
      ],
    )

  if any(keyword in text for keyword in ["safe", "safety", "is it safe", "risk", "dangerous"]):
    return ChatResponse(
      topic="safety",
      answer=(
        "Blood donation is very safe when done at an approved center. Needles and bags are sterile "
        "and used only once. Your health is checked before donation, and staff monitor you during "
        "the process.\n\n"
        "Common minor side effects are light dizziness or bruising around the needle site, which "
        "usually go away quickly."
      ),
      suggestions=[
        "Who can donate blood?",
        "What happens to my blood after donation?",
      ],
    )

  if any(keyword in text for keyword in ["blood type", "compatible", "compatibility"]):
    return ChatResponse(
      topic="blood_type",
      answer=(
        "Blood type compatibility is important for safe transfusions.\n"
        "- Type O negative is called a universal donor for red cells\n"
        "- Type AB positive is a universal recipient\n"
        "- In practice, hospitals match both ABO and Rh type carefully\n\n"
        "For donation, you can give blood regardless of your type. The blood bank will test and "
        "store it for suitable patients."
      ),
      suggestions=[
        "Who can receive my blood?",
        "How often can I donate blood?",
      ],
    )

  if any(keyword in text for keyword in ["where", "nearest", "near me", "blood bank"]):
    return ChatResponse(
      topic="finding_blood_bank",
      answer=(
        "To find the nearest blood bank or donation camp, you can:\n"
        "- Use the Blood Bank section inside this application if available\n"
        "- Contact your local hospital for recommended centers\n"
        "- Check official health department or Red Cross websites in your region"
      ),
      suggestions=[
        "How do I prepare for my first donation?",
        "Is blood donation safe?",
      ],
    )

  if any(keyword in text for keyword in ["first time", "never donated", "new donor"]):
    return ChatResponse(
      topic="first_time_donor",
      answer=(
        "For first‑time donors, the process is simple:\n"
        "1) Register and fill out a short health questionnaire\n"
        "2) A nurse checks your blood pressure, pulse, and hemoglobin\n"
        "3) You donate blood while resting comfortably\n"
        "4) You relax, have snacks, and then can go home\n\n"
        "Staff will explain every step and answer any questions you have at the center."
      ),
      suggestions=[
        "What should I eat before donating?",
        "How long does donating blood take?",
      ],
    )

  return ChatResponse(
    topic="general",
    answer=(
      "I can help answer questions about blood donation, such as:\n"
      "- Who can donate and how often\n"
      "- How safe the process is\n"
      "- How to prepare before and after donation\n\n"
      "Please try asking in another way, for example:\n"
      "• Who is eligible to donate blood?\n"
      "• Is blood donation safe?\n"
      "• How often can I donate blood?"
    ),
    suggestions=[
      "Who is eligible to donate blood?",
      "Is blood donation safe?",
      "How often can I donate blood?",
    ],
  )


@router.post("/chatbot/query", response_model=ChatResponse)
def chatbot_query(request: ChatRequest) -> ChatResponse:
  return get_chatbot_answer(request.message)

