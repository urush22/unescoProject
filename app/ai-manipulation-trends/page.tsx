"use client"

import { useState } from "react"
import { StickyHeader } from "@/components/sticky-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Calendar, TrendingUp, AlertTriangle, Lightbulb, Shield } from "lucide-react"
import Link from "next/link"

export default function AIManipulationTrends() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", label: "All News", icon: TrendingUp },
    { id: "disasters", label: "AI Disasters", icon: AlertTriangle },
    { id: "innovations", label: "Innovations", icon: Lightbulb },
    { id: "manipulation", label: "Manipulation", icon: Shield },
  ]

  const newsItems = [
    {
      id: 1,
      category: "manipulation",
      title: "Hyper-Realistic AI News Anchors Fool the Internet",
      summary:
        "AI-generated news anchors created with tools like Google's Veo 3 are spreading fake news, including false reports about Canada declaring war on the US and J.K. Rowling's death.",
      date: "August 2025",
      source: "Euronews",
      link: "https://www.euronews.com/my-europe/2025/08/01/these-hyper-realistic-ai-generated-news-anchors-are-fooling-the-internet",
      image: "/ai-generated-news-anchor-on-television-screen-with.png",
      severity: "high",
    },
    {
      id: 2,
      category: "disasters",
      title: "Global AI Scam Surge Hits $12.4 Billion",
      summary:
        "Deepfakes and voice cloning technology drove a massive surge in AI-powered scams, with losses exceeding $12.4 billion in May 2025 alone.",
      date: "May 2025",
      source: "Crescendo AI",
      link: "https://www.crescendo.ai/news/latest-ai-news-and-updates",
      image: "/placeholder-67y1u.png",
      severity: "critical",
    },
    {
      id: 3,
      category: "innovations",
      title: "Universal Deepfake Detector Achieves 98% Accuracy",
      summary:
        "Researchers developed a new universal detector that can identify deepfake videos with 98% accuracy, offering hope in the fight against AI manipulation.",
      date: "August 2025",
      source: "Crescendo AI",
      link: "https://www.crescendo.ai/news/latest-ai-news-and-updates",
      image: "/placeholder-5oe5t.png",
      severity: "positive",
    },
    {
      id: 4,
      category: "disasters",
      title: "Teen Suicide After AI Sextortion Scam Prompts Senate Action",
      summary:
        "A teenager's suicide following an AI-generated sextortion scam in June 2025 has prompted urgent Senate action to address AI-powered exploitation.",
      date: "June 2025",
      source: "Crescendo AI",
      link: "https://www.crescendo.ai/news/latest-ai-news-and-updates",
      image: "/placeholder-2mcod.png",
      severity: "critical",
    },
    {
      id: 5,
      category: "manipulation",
      title: "Google's Veo 3 Can Create Deepfakes of Riots and Election Fraud",
      summary:
        "Google's latest AI model Veo 3 can generate convincing deepfakes of riots, election fraud, and conflict scenarios, raising concerns about potential misuse.",
      date: "August 2025",
      source: "Time Magazine",
      link: "https://time.com/7290050/veo-3-google-misinformation-deepfake/",
      image: "/placeholder-ck6i7.png",
      severity: "high",
    },
    {
      id: 6,
      category: "innovations",
      title: "Stanford Builds Virtual AI Scientist",
      summary:
        "Stanford researchers created a virtual AI scientist capable of running its own experiments, marking a breakthrough in autonomous scientific research.",
      date: "July 2025",
      source: "Crescendo AI",
      link: "https://www.crescendo.ai/news/latest-ai-news-and-updates",
      image: "/ai-scientist-robot-conducting-experiments-in-moder.png",
      severity: "positive",
    },
    {
      id: 7,
      category: "disasters",
      title: "AI Weather Models Fail to Predict Texas Floods",
      summary:
        "AI-powered weather prediction models failed to accurately forecast devastating Texas floods in July 2025, highlighting limitations in current AI systems.",
      date: "July 2025",
      source: "Crescendo AI",
      link: "https://www.crescendo.ai/news/latest-ai-news-and-updates",
      image: "/placeholder-smrbo.png",
      severity: "high",
    },
    {
      id: 8,
      category: "innovations",
      title: "Mind-Reading AI Converts Thoughts into Speech",
      summary:
        "Breakthrough AI technology developed in June 2025 can convert human thoughts directly into speech, opening new possibilities for communication assistance.",
      date: "June 2025",
      source: "Crescendo AI",
      link: "https://www.crescendo.ai/news/latest-ai-news-and-updates",
      image: "/placeholder-u2mlk.png",
      severity: "positive",
    },
    {
      id: 9,
      category: "manipulation",
      title: "BC Wildfire Service Warns of AI Misinformation",
      summary:
        "The BC Wildfire Service issued warnings about AI-generated images spreading misinformation during the 2025 fire season, causing confusion and uncertainty.",
      date: "August 2025",
      source: "Yahoo News Canada",
      link: "https://ca.news.yahoo.com/bc-wildfire-warns-ai-photos-232706567.html",
      image: "/placeholder-tmhl5.png",
      severity: "medium",
    },
    {
      id: 10,
      category: "innovations",
      title: "Magnetic Breakthrough Could Make AI 10x More Efficient",
      summary:
        "A magnetic breakthrough in July 2025 using spin waveguide networks could make AI processing 10 times more energy efficient than current methods.",
      date: "July 2025",
      source: "Science News",
      link: "https://www.sciencenews.org/",
      image: "/magnetic-spin-waveguide-networks-for-efficient-ai-.png",
      severity: "positive",
    },
  ]

  const filteredNews =
    selectedCategory === "all" ? newsItems : newsItems.filter((item) => item.category === selectedCategory)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      case "positive":
        return "bg-green-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical":
        return "Critical Alert"
      case "high":
        return "High Impact"
      case "medium":
        return "Medium Impact"
      case "positive":
        return "Positive Development"
      default:
        return "News Update"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <StickyHeader />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Live AI News Feed
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
            AI Manipulation
            <span className="text-primary"> Trends & News</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Stay informed about the latest developments in AI manipulation, deepfakes, breakthroughs, and their impact
            on society. Real-time updates from trusted sources worldwide.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </Button>
              )
            })}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <Card
                key={item.id}
                className="group hover:shadow-lg transition-all duration-300 hover:bg-card/50 border-border"
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getSeverityColor(item.severity)}>{getSeverityLabel(item.severity)}</Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    {item.date}
                    <span className="text-primary font-medium">• {item.source}</span>
                  </div>
                  <CardTitle className="text-lg font-serif group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed mb-4">{item.summary}</CardDescription>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                  >
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Read Full Article
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Stay Ahead of AI Developments</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Knowledge is your best defense against AI manipulation. Learn to identify deepfakes and stay informed about
            the latest trends.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/deepfake-knowledge" className="flex items-center gap-2">
                Learn About Deepfakes
                <Lightbulb className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/deepfake-detection" className="flex items-center gap-2">
                Test Detection Skills
                <Shield className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
