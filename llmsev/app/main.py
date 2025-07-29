from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import HumanMessage, SystemMessage
import json

# Load environment variables from root .env file
load_dotenv("../.env")

app = FastAPI(title="N3XA AI Support Assistant", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client (will be None if no API key, but that's okay for testing)
llm = None
if os.getenv("OPENAI_API_KEY"):
    llm = ChatOpenAI(
        model="gpt-4",
        temperature=0.7,
        api_key=os.getenv("OPENAI_API_KEY")
    )

class SummaryRequest(BaseModel):
    title: str
    category: str
    description: str
    email: str

class SummaryResponse(BaseModel):
    summary: str

@app.get("/")
async def root():
    return {"message": "N3XA AI Support Assistant API"}

@app.post("/generate-summary", response_model=SummaryResponse)
async def generate_summary(request: SummaryRequest):
    try:
        if not llm:
            # Fallback summary if no OpenAI API key is available
            summary = f"The user has reported an issue with '{request.title}' which falls under the {request.category} category. The problem described is: {request.description}. This appears to be a standard support request that requires attention from our technical team."
            return SummaryResponse(summary=summary)
        
        # Create a prompt for generating ticket summary
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a friendly and helpful AI assistant that creates detailed summaries of support tickets. 
            Your task is to analyze the ticket information and create a warm, professional summary that captures the key issue, 
            context, and potential impact. Write exactly 3 sentences that are informative and empathetic."""),
            ("human", """Please create a friendly and detailed summary for this support ticket:
            
            Title: {title}
            Category: {category}
            Description: {description}
            Email: {email}
            
            Summary:""")
        ])
        
        # Generate the summary
        messages = prompt.format_messages(
            title=request.title,
            category=request.category,
            description=request.description,
            email=request.email
        )
        
        response = llm.invoke(messages)
        summary = response.content.strip()
        
        return SummaryResponse(summary=summary)
        
    except Exception as e:
        print(f"Error generating summary: {e}")
        # Fallback summary on error
        summary = f"The user has reported an issue with '{request.title}' which falls under the {request.category} category. The problem described is: {request.description}. This appears to be a standard support request that requires attention from our technical team."
        return SummaryResponse(summary=summary)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 