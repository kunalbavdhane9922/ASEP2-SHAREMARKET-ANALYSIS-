from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import google.generativeai as genai


load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("API Key not found. Please check your .env file.")

genai.configure(api_key=API_KEY)

# Use full model name
model = genai.GenerativeModel(model_name="models/gemini-pro")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(req: MessageRequest):
    try:
        response = model.generate_content(req.message)
        return {"response": response.text}
    except Exception as e:
        return {"response": f"Error: {str(e)}"}
