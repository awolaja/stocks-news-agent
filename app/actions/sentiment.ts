"use server"

import { generateText } from "ai"

interface NewsItem {
  title: string
  sentiment: "positive" | "negative" | "neutral"
  score: number
  source: string
  publishedAt: string
}

interface SentimentResult {
  ticker: string
  overallSentiment: number
  positiveCount: number
  negativeCount: number
  neutralCount: number
  news: NewsItem[]
  summary: string
}

// Mock news data generator for demonstration
function generateMockNews(ticker: string): Array<{
  title: string
  source: string
  publishedAt: string
}> {
  const sources = ["Reuters", "Bloomberg", "CNBC", "Financial Times", "WSJ", "MarketWatch"]
  const templates = {
    positive: [
      `${ticker} beats earnings expectations, stock surges`,
      `${ticker} announces breakthrough innovation in core business`,
      `Analysts upgrade ${ticker} with bullish outlook`,
      `${ticker} reports record quarterly revenue growth`,
      `${ticker} expands market share in key segment`,
    ],
    negative: [
      `${ticker} faces regulatory challenges in key markets`,
      `${ticker} misses revenue targets, shares decline`,
      `Concerns grow over ${ticker}'s competitive position`,
      `${ticker} announces layoffs amid restructuring`,
      `Analysts downgrade ${ticker} citing headwinds`,
    ],
    neutral: [
      `${ticker} maintains steady performance in Q3`,
      `${ticker} announces routine board meeting results`,
      `Market analysts review ${ticker}'s quarterly report`,
      `${ticker} updates guidance for fiscal year`,
      `Industry report includes ${ticker} in sector analysis`,
    ],
  }

  const allTemplates = [
    ...templates.positive,
    ...templates.positive,
    ...templates.negative,
    ...templates.neutral,
    ...templates.neutral,
  ]

  return allTemplates.slice(0, 10).map((title, i) => ({
    title,
    source: sources[Math.floor(Math.random() * sources.length)],
    publishedAt: new Date(Date.now() - i * 3600000 * Math.random() * 24).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }))
}

export async function analyzeSentiment(ticker: string): Promise<SentimentResult> {
  // Validate ticker
  if (!ticker || ticker.length > 5) {
    throw new Error("Invalid ticker symbol")
  }

  // Generate mock news for demonstration
  const mockNews = generateMockNews(ticker)

  // Analyze sentiment for each headline using AI
  const analyzedNews: NewsItem[] = []

  for (const news of mockNews) {
    try {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: `Analyze the sentiment of this stock news headline and respond with ONLY a JSON object in this exact format:
{
  "sentiment": "positive" | "negative" | "neutral",
  "score": 0.0 to 1.0
}

Headline: "${news.title}"

Rules:
- "positive" = bullish, good news, growth, success
- "negative" = bearish, bad news, decline, problems
- "neutral" = factual, no clear direction
- score = confidence level (0.0 = very uncertain, 1.0 = very certain)`,
      })

      // Parse AI response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0])
        analyzedNews.push({
          title: news.title,
          sentiment: analysis.sentiment,
          score: analysis.score,
          source: news.source,
          publishedAt: news.publishedAt,
        })
      }
    } catch (error) {
      console.error("[v0] Error analyzing headline:", error)
      // Fallback to neutral if AI fails
      analyzedNews.push({
        title: news.title,
        sentiment: "neutral",
        score: 0.5,
        source: news.source,
        publishedAt: news.publishedAt,
      })
    }
  }

  // Calculate overall sentiment
  const positiveCount = analyzedNews.filter((n) => n.sentiment === "positive").length
  const negativeCount = analyzedNews.filter((n) => n.sentiment === "negative").length
  const neutralCount = analyzedNews.filter((n) => n.sentiment === "neutral").length

  const overallSentiment = Math.round((positiveCount * 100 + neutralCount * 50) / analyzedNews.length)

  // Generate summary using AI
  const { text: summary } = await generateText({
    model: "openai/gpt-4o-mini",
    prompt: `Based on these sentiment counts for ${ticker} stock news:
- Positive: ${positiveCount}
- Negative: ${negativeCount}
- Neutral: ${neutralCount}

Write a brief 2-3 sentence summary of the overall market sentiment and what's trending for this stock. Be professional and concise.`,
  })

  return {
    ticker,
    overallSentiment,
    positiveCount,
    negativeCount,
    neutralCount,
    news: analyzedNews,
    summary: summary.trim(),
  }
}
