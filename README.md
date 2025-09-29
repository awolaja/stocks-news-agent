# Stock News Sentiment Analyzer

A full-stack application that analyzes news sentiment for stock tickers using Python serverless functions on Vercel.

## Features

-  **Python Backend**: Serverless Python API for sentiment analysis
-  **Next.js Frontend**: Modern React UI with TypeScript
-  **Real-time Analysis**: Analyze sentiment from recent news headlines
-  **Professional Design**: Clean, financial-focused interface
-  **Vercel Deployment**: One-click deployment to Vercel

## Tech Stack

### Backend (Python)
- Python 3.9+ serverless functions
- Rule-based sentiment analysis (upgradeable to transformers)
- Mock news data generation

### Frontend (Next.js)
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui components

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+ (for local development)

### Installation

1. Clone the repository
2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

1. Click the "Publish" button in v0
2. Or push to GitHub and import to Vercel
3. Vercel will automatically detect the Python API and configure it

## API Endpoint

### POST /api/analyze

Analyzes sentiment for a given stock ticker.

**Request:**
\`\`\`json
{
  "ticker": "AAPL"
}
\`\`\`

**Response:**
\`\`\`json
{
  "ticker": "AAPL",
  "overallSentiment": 75,
  "positiveCount": 5,
  "negativeCount": 2,
  "neutralCount": 3,
  "news": [...],
  "summary": "Market sentiment for AAPL is predominantly bullish..."
}
\`\`\`

## Upgrading to Advanced Sentiment Analysis

To use transformers library for more accurate sentiment analysis:

1. Uncomment the dependencies in `requirements.txt`
2. Update `api/analyze.py` to use the transformers pipeline
3. Redeploy to Vercel

Note: This will increase cold start times and may require a paid Vercel plan for longer function execution times.

## License

MIT
