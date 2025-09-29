"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, TrendingUp, TrendingDown, Minus, Search } from "lucide-react"
// import { analyzeSentiment } from "@/app/actions/sentiment"

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

export function StockSentimentAnalyzer() {
  const [ticker, setTicker] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SentimentResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!ticker.trim()) {
      setError("Please enter a stock ticker")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticker: ticker.toUpperCase() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze sentiment")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze sentiment")
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-success text-success-foreground"
      case "negative":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4" />
      case "negative":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getOverallSentimentLabel = (score: number) => {
    if (score >= 60) return { label: "Bullish", color: "text-success" }
    if (score <= 40) return { label: "Bearish", color: "text-destructive" }
    return { label: "Neutral", color: "text-muted-foreground" }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Stock Sentiment Analyzer</h1>
              <p className="mt-1 text-sm text-muted-foreground">Analyze news sentiment for any stock ticker</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle>Enter Stock Ticker</CardTitle>
              <CardDescription>Get real-time sentiment analysis from recent news headlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="e.g., AAPL, TSLA, MSFT"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  className="text-lg"
                  disabled={loading}
                />
                <Button onClick={handleAnalyze} disabled={loading || !ticker.trim()} size="lg" className="min-w-32">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
              {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <>
              {/* Overall Sentiment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Overall Sentiment for {result.ticker}</span>
                    <Badge
                      variant="outline"
                      className={`text-lg px-4 py-1 ${getOverallSentimentLabel(result.overallSentiment).color}`}
                    >
                      {getOverallSentimentLabel(result.overallSentiment).label}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sentiment Score */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Sentiment Score</span>
                      <span className="text-2xl font-bold">{result.overallSentiment}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full transition-all ${
                          result.overallSentiment >= 60
                            ? "bg-success"
                            : result.overallSentiment <= 40
                              ? "bg-destructive"
                              : "bg-warning"
                        }`}
                        style={{ width: `${result.overallSentiment}%` }}
                      />
                    </div>
                  </div>

                  {/* Sentiment Breakdown */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg border border-border bg-card p-4 text-center">
                      <div className="mb-1 flex items-center justify-center gap-2 text-success">
                        <TrendingUp className="h-5 w-5" />
                        <span className="text-2xl font-bold">{result.positiveCount}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Positive</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4 text-center">
                      <div className="mb-1 flex items-center justify-center gap-2 text-muted-foreground">
                        <Minus className="h-5 w-5" />
                        <span className="text-2xl font-bold">{result.neutralCount}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Neutral</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4 text-center">
                      <div className="mb-1 flex items-center justify-center gap-2 text-destructive">
                        <TrendingDown className="h-5 w-5" />
                        <span className="text-2xl font-bold">{result.negativeCount}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Negative</p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="rounded-lg bg-muted p-4">
                    <h3 className="mb-2 font-semibold text-foreground">Summary</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
                  </div>
                </CardContent>
              </Card>

              {/* News Headlines */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent News Headlines</CardTitle>
                  <CardDescription>Sentiment analysis of the latest {result.news.length} news articles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.news.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
                      >
                        <div className="flex-shrink-0">
                          <Badge className={`${getSentimentColor(item.sentiment)} flex items-center gap-1`}>
                            {getSentimentIcon(item.sentiment)}
                            {item.sentiment}
                          </Badge>
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-medium leading-snug text-foreground">{item.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{item.source}</span>
                            <span>•</span>
                            <span>{item.publishedAt}</span>
                            <span>•</span>
                            <span>Score: {(item.score * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
