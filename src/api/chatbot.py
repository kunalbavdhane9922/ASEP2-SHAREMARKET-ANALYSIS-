from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
# from google import genai
import google.generativeai as genai


# Initialize Gemini client
client = genai.Client(api_key="AIzaSyA50z1h7_PioQAL45pxzAIWYdtHT2kGY6w")
    # print(response.text)  # use the correct model name
# user_msg = input("Enter your input : ")
# response = client.models.generate_content(
#         model="gemini-2.0-flash",
#         contents= str(user_msg),
#     )
# reply = response.text
# print(reply)  # Print the response for debugging
app = FastAPI()

# CORS middleware to allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace * with your frontend domain
    allow_methods=["*"],
    allow_headers=["*"],
)
# file = open(".txt", "r")
@app.post("/chat")
async def chat(req: Request):
    data = await req.json()
    user_msg = data.get("message", "")
    reply = ""
    # Send message to Gemini model
    try:
        response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents= str(user_msg),
    )
        reply = response.text
        # for i in reply :
        #     if  i == "Google" :
        #         reply = reply.replace("Google", "kunal bavdhane")  
        #         print(reply)  # Print the response for debugging
    except Exception as e:
        reply = f"Error generating response: {e}"

    return {"reply": reply}
