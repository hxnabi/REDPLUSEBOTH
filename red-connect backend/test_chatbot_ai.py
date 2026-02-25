import os
from dotenv import load_dotenv

# Load env vars BEFORE importing the module so GEMMINI_API_KEY is available
load_dotenv()

from app.routers.chatbot import get_chatbot_answer

def test_chatbot():
    print("Testing Chatbot with Gemini...")
    
    questions = [
        "Hi",
        "Hello",
        "How can I donate blood?",
        "Where can I find a blood bank?",
        "Is it painful?",
        "Can I donate if I have a tattoo?",
        "Thank you"
    ]
    
    for q in questions:
        print(f"\nUser: {q}")
        try:
            response = get_chatbot_answer(q)
            print(f"Bot ({response.topic}): {response.answer}")
            print(f"Suggestions: {response.suggestions}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    test_chatbot()
