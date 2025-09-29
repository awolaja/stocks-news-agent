# Stock News Sentiment Analyzer

A Python-based AI agent that analyzes sentiment of stock news headlines using a pre-trained transformer model.

## Features

- Fetches recent news headlines for any stock ticker
- Analyzes sentiment (positive, negative, neutral) using DistilBERT
- Calculates overall sentiment statistics
- Generates human-readable summary
- Saves results to JSON file

## Installation

Install the required dependencies:

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Usage

Run the analyzer with a stock ticker:

\`\`\`bash
python stock_sentiment_analyzer.py AAPL
\`\`\`

Replace `AAPL` with any stock ticker (e.g., `TSLA`, `GOOGL`, `MSFT`).

## Optional: Add NewsAPI Key

For real-time news data, sign up for a free API key at [newsapi.org](https://newsapi.org) and replace the `api_key = "demo"` line in the script with your actual key.

Without an API key, the script uses mock data for demonstration purposes.

## Output

The script will:
1. Display sentiment analysis for each article in the console
2. Show overall sentiment statistics
3. Generate a summary with key insights
4. Save detailed results to a JSON file

## Example Output

\`\`\`
SENTIMENT ANALYSIS SUMMARY FOR AAPL
==================================================

Overall Sentiment: POSITIVE

Breakdown:
- Positive: 4 articles (80.0%)
- Negative: 1 articles (20.0%)
- Neutral: 0 articles (0.0%)

Average Confidence: 0.892

Key Insights:
- News sentiment for AAPL is predominantly positive
- Market appears optimistic about the company's prospects
