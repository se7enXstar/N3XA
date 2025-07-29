# AI Support Agent

A full-stack customer support application with AI-powered chat interface and ticket management system.

## Features

- **AI Chat Interface**: Guided conversation for creating support tickets
- **Ticket Management**: View, update, and manage support tickets
- **Modern UI**: Built with Next.js, TypeScript, ShadCn UI, and Tailwind CSS
- **AI Integration**: OpenAI GPT-4 for intelligent ticket summaries
- **Database**: PostgreSQL with Prisma ORM

## Getting Started

### Prerequisites

- Node.js 18+ and Yarn
- Python 3.8+ and pip
- PostgreSQL database

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd N3XA
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
yarn install

# Install Python dependencies
cd llmsev
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 3. Environment Setup

Copy the sample environment file and configure your variables:

```bash
cp .env.sample .env
```

Edit `.env` with your actual values:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database_name"

# OpenAI Configuration
OPENAI_API_KEY="sk-your-actual-openai-api-key"
```

### 4. Database Setup

```bash
# Generate Prisma client
yarn prisma generate

# Push schema to database
yarn prisma db push

# Seed initial data
yarn ts-node prisma/seed.ts
```

### 5. Start the Application

```bash
# Terminal 1: Start Next.js frontend
yarn dev

# Terminal 2: Start Python backend
cd llmsev
source venv/bin/activate
python3 run.py
```

### 6. Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

## Project Structure

```
N3XA/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── assistant/         # Chat interface
│   └── manage/           # Ticket management
├── components/            # React components
├── llmsev/               # Python backend
│   └── app/              # FastAPI application
├── prisma/               # Database schema
└── .env.sample           # Environment template
```

## Development

This project uses:
- **Frontend**: Next.js 14, TypeScript, ShadCn UI, Tailwind CSS
- **Backend**: Python FastAPI, Langchain, OpenAI
- **Database**: PostgreSQL, Prisma ORM
- **Package Manager**: Yarn

## Environment Variables

See `.env.sample` for all required environment variables.
