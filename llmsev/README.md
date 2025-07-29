# N3XA AI Support Assistant - Python Backend

This is the Python backend for the N3XA AI Support Assistant, built with FastAPI and Langchain.

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   Create a `.env` file in the `llmsev` directory with:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run the server:**
   ```bash
   python app/main.py
   ```
   
   Or with uvicorn directly:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

## API Endpoints

- `GET /` - Health check
- `POST /generate-summary` - Generate AI summary for support tickets
- `GET /health` - Health check endpoint

## Features

- **AI Summary Generation**: Uses OpenAI GPT-3.5-turbo to generate concise summaries of support tickets
- **CORS Support**: Configured to work with the Next.js frontend
- **Error Handling**: Proper error responses and logging
