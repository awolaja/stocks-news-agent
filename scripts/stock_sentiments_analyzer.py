"""
Stock News Sentiment Analyzer
A beginner-friendly AI agent that analyzes sentiment of stock news headlines.

Usage:
    python stock_sentiment_analyzer.py AAPL
"""

import sys
import json
from datetime import datetime, timedelta
from transformers import pipeline
import requests

# Initialize sentiment analysis pipeline
print("[v0] Loading sentiment analysis model...")
sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)
print("[v0] Model loaded successfully!")

def fetch_stock_news(ticker: str, days_back: int = 7) -> list:
    """
    Fetch recent news headlines for a given stock ticker.
    
    Args:
        ticker: Stock ticker symbol (e.g., 'AAPL', 'TSLA')
        days_back: Number of days to look back for news
    
    Returns:
        List of news articles with title, description, and source
    """
    print(f"[v0] Fetching news for {ticker}...")
    
    # Using NewsAPI (free tier allows 100 requests/day)
    # For demo purposes, we'll use a mock API or you can add your own API key
    api_key = "demo"  # Replace with actual API key from newsapi.org
    
    # Calculate date range
    to_date = datetime.now()
    from_date = to_date - timedelta(days=days_back)
    
    # Build API URL
    url = f"https://newsapi.org/v2/everything"
    params = {
        "q": f"{ticker} stock OR {ticker} shares",
        "from": from_date.strftime("%Y-%m-%d"),
        "to": to_date.strftime("%Y-%m-%d"),
        "sortBy": "publishedAt",
        "language": "en",
        "apiKey": api_key,
        "pageSize": 10
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        
        # For demo purposes, if API key is invalid, return mock data
        if response.status_code == 401 or api_key == "demo":
            print("[v0] Using mock news data (add your NewsAPI key for real data)")
            return get_mock_news(ticker)
        
        response.raise_for_status()
        data = response.json()
        
        articles = []
        for article in data.get("articles", []):
            articles.append({
                "title": article.get("title", ""),
                "description": article.get("description", ""),
                "source": article.get("source", {}).get("name", "Unknown"),
                "url": article.get("url", ""),
                "publishedAt": article.get("publishedAt", "")
            })
        
        return articles
    
    except requests.exceptions.RequestException as e:
        print(f"[v0] Error fetching news: {e}")
        print("[v0] Using mock news data instead")
        return get_mock_news(ticker)

def get_mock_news(ticker: str) -> list:
    """
    Return mock news data for demonstration purposes.
    """
    mock_data = {
        "AAPL": [
            {"title": "Apple announces record-breaking quarterly earnings", "description": "Apple Inc. reported strong revenue growth driven by iPhone sales.", "source": "TechNews", "url": "", "publishedAt": "2025-09-28"},
            {"title": "Apple's new AI features impress analysts", "description": "Wall Street analysts praise Apple's latest AI integration in iOS.", "source": "MarketWatch", "url": "", "publishedAt": "2025-09-27"},
            {"title": "Apple stock reaches new all-time high", "description": "Shares of Apple hit record levels amid positive market sentiment.", "source": "Bloomberg", "url": "", "publishedAt": "2025-09-26"},
            {"title": "Concerns over Apple's supply chain in Asia", "description": "Analysts express worries about potential disruptions in Apple's manufacturing.", "source": "Reuters", "url": "", "publishedAt": "2025-09-25"},
            {"title": "Apple expands services revenue significantly", "description": "The company's services division shows impressive growth this quarter.", "source": "CNBC", "url": "", "publishedAt": "2025-09-24"},
        ],
        "TSLA": [
            {"title": "Tesla delivers record number of vehicles", "description": "Tesla reports strong delivery numbers exceeding analyst expectations.", "source": "AutoNews", "url": "", "publishedAt": "2025-09-28"},
            {"title": "Tesla faces regulatory challenges in Europe", "description": "European regulators scrutinize Tesla's autonomous driving features.", "source": "Reuters", "url": "", "publishedAt": "2025-09-27"},
            {"title": "Musk announces new Tesla factory location", "description": "Tesla plans to build a new manufacturing facility to meet growing demand.", "source": "Bloomberg", "url": "", "publishedAt": "2025-09-26"},
            {"title": "Tesla stock volatility concerns investors", "description": "Analysts note increased volatility in Tesla shares amid market uncertainty.", "source": "MarketWatch", "url": "", "publishedAt": "2025-09-25"},
            {"title": "Tesla's energy division shows promising growth", "description": "The company's solar and battery storage business expands rapidly.", "source": "GreenTech", "url": "", "publishedAt": "2025-09-24"},
        ]
    }
    
    return mock_data.get(ticker.upper(), [
        {"title": f"{ticker} shows mixed performance in recent trading", "description": f"Shares of {ticker} experience volatility amid market conditions.", "source": "Financial Times", "url": "", "publishedAt": "2025-09-28"},
        {"title": f"{ticker} announces strategic initiatives", "description": f"Company reveals new plans to drive growth and shareholder value.", "source": "WSJ", "url": "", "publishedAt": "2025-09-27"},
        {"title": f"Analysts update {ticker} price targets", "description": f"Wall Street firms revise their outlook on {ticker} stock.", "source": "Barron's", "url": "", "publishedAt": "2025-09-26"},
    ])

def analyze_sentiment(text: str) -> dict:
    """
    Analyze sentiment of a given text using the pre-trained model.
    
    Args:
        text: Text to analyze
    
    Returns:
        Dictionary with sentiment label and confidence score
    """
    if not text or len(text.strip()) == 0:
        return {"label": "NEUTRAL", "score": 0.5}
    
    result = sentiment_analyzer(text[:512])[0]  # Limit to 512 chars for model
    return result

def calculate_overall_sentiment(sentiments: list) -> dict:
    """
    Calculate overall sentiment statistics from individual sentiments.
    
    Args:
        sentiments: List of sentiment results
    
    Returns:
        Dictionary with overall statistics
    """
    if not sentiments:
        return {
            "positive_count": 0,
            "negative_count": 0,
            "neutral_count": 0,
            "positive_percentage": 0,
            "negative_percentage": 0,
            "neutral_percentage": 0,
            "average_confidence": 0
        }
    
    positive_count = sum(1 for s in sentiments if s["label"] == "POSITIVE")
    negative_count = sum(1 for s in sentiments if s["label"] == "NEGATIVE")
    neutral_count = len(sentiments) - positive_count - negative_count
    
    total = len(sentiments)
    average_confidence = sum(s["score"] for s in sentiments) / total
    
    return {
        "positive_count": positive_count,
        "negative_count": negative_count,
        "neutral_count": neutral_count,
        "positive_percentage": round((positive_count / total) * 100, 1),
        "negative_percentage": round((negative_count / total) * 100, 1),
        "neutral_percentage": round((neutral_count / total) * 100, 1),
        "average_confidence": round(average_confidence, 3)
    }

def generate_summary(ticker: str, articles: list, overall_stats: dict) -> str:
    """
    Generate a human-readable summary of the sentiment analysis.
    
    Args:
        ticker: Stock ticker symbol
        articles: List of analyzed articles
        overall_stats: Overall sentiment statistics
    
    Returns:
        Summary text
    """
    dominant_sentiment = "neutral"
    if overall_stats["positive_percentage"] > overall_stats["negative_percentage"]:
        dominant_sentiment = "positive"
    elif overall_stats["negative_percentage"] > overall_stats["positive_percentage"]:
        dominant_sentiment = "negative"
    
    summary = f"""
SENTIMENT ANALYSIS SUMMARY FOR {ticker}
{'=' * 50}

Overall Sentiment: {dominant_sentiment.upper()}

Breakdown:
- Positive: {overall_stats['positive_count']} articles ({overall_stats['positive_percentage']}%)
- Negative: {overall_stats['negative_count']} articles ({overall_stats['negative_percentage']}%)
- Neutral: {overall_stats['neutral_count']} articles ({overall_stats['neutral_percentage']}%)

Average Confidence: {overall_stats['average_confidence']}

Key Insights:
"""
    
    if dominant_sentiment == "positive":
        summary += f"- News sentiment for {ticker} is predominantly positive\n"
        summary += "- Market appears optimistic about the company's prospects\n"
    elif dominant_sentiment == "negative":
        summary += f"- News sentiment for {ticker} is predominantly negative\n"
        summary += "- Market shows concerns about the company's performance\n"
    else:
        summary += f"- News sentiment for {ticker} is mixed\n"
        summary += "- Market sentiment appears balanced with no clear direction\n"
    
    return summary

def main():
    """
    Main function to run the sentiment analysis agent.
    """
    print("\n" + "=" * 60)
    print("STOCK NEWS SENTIMENT ANALYZER")
    print("=" * 60 + "\n")
    
    # Get ticker from command line argument
    if len(sys.argv) < 2:
        print("Usage: python stock_sentiment_analyzer.py <TICKER>")
        print("Example: python stock_sentiment_analyzer.py AAPL")
        sys.exit(1)
    
    ticker = sys.argv[1].upper()
    print(f"Analyzing sentiment for: {ticker}\n")
    
    # Step 1: Fetch news articles
    articles = fetch_stock_news(ticker)
    
    if not articles:
        print(f"No news articles found for {ticker}")
        sys.exit(1)
    
    print(f"[v0] Found {len(articles)} articles\n")
    
    # Step 2: Analyze sentiment for each article
    print("[v0] Analyzing sentiment for each article...\n")
    analyzed_articles = []
    
    for i, article in enumerate(articles, 1):
        # Combine title and description for better sentiment analysis
        text = f"{article['title']}. {article.get('description', '')}"
        sentiment = analyze_sentiment(text)
        
        analyzed_articles.append({
            **article,
            "sentiment": sentiment["label"],
            "confidence": round(sentiment["score"], 3)
        })
        
        # Print individual article analysis
        sentiment_emoji = "🟢" if sentiment["label"] == "POSITIVE" else "🔴" if sentiment["label"] == "NEGATIVE" else "🟡"
        print(f"{i}. {sentiment_emoji} {sentiment['label']} ({sentiment['score']:.2f})")
        print(f"   {article['title']}")
        print(f"   Source: {article['source']}")
        print()
    
    # Step 3: Calculate overall sentiment
    sentiments = [{"label": a["sentiment"], "score": a["confidence"]} for a in analyzed_articles]
    overall_stats = calculate_overall_sentiment(sentiments)
    
    # Step 4: Generate and display summary
    summary = generate_summary(ticker, analyzed_articles, overall_stats)
    print("\n" + summary)
    
    # Step 5: Save results to JSON file
    output_file = f"sentiment_analysis_{ticker}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    output_data = {
        "ticker": ticker,
        "analysis_date": datetime.now().isoformat(),
        "overall_statistics": overall_stats,
        "articles": analyzed_articles
    }
    
    with open(output_file, 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"\n[v0] Results saved to: {output_file}")
    print("\n" + "=" * 60)
    print("ANALYSIS COMPLETE")
    print("=" * 60 + "\n")

if __name__ == "__main__":
    main()
