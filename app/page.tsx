"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Zap,
  ArrowRight,
  Play,
  Users,
  Target,
  Camera,
  TrendingUp,
  FileText,
  HelpCircle,
  Search,
  Award,
} from "lucide-react"
import StickyHeader from "@/components/sticky-header"
import Link from "next/link"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <StickyHeader />

      <div className="pt-20">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Neural Network Animation */}
          <div className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rounded-full neural-pulse" />
          <div
            className="absolute top-32 left-32 w-3 h-3 bg-secondary/30 rounded-full neural-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute top-40 left-20 w-2 h-2 bg-accent/40 rounded-full neural-pulse"
            style={{ animationDelay: "1s" }}
          />

          {/* Data Flow Elements */}
          <div
            className="absolute top-1/3 w-2 h-2 bg-primary rounded-full data-flow"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute top-1/2 w-1.5 h-1.5 bg-secondary rounded-full data-flow"
            style={{ animationDelay: "2s" }}
          />
          <div className="absolute top-2/3 w-2 h-2 bg-accent rounded-full data-flow" style={{ animationDelay: "1s" }} />
        </div>

        {/* Hero Section */}
        <main className="relative z-10 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div
              className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <Badge className="mb-6 bg-accent/20 text-accent-foreground border-accent/30 hover:bg-accent/30 transition-colors">
                🚀 New: Interactive AI Detection Tools
              </Badge>

              <h1 className="font-serif font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
                Master the <span className="text-primary">Digital Age</span>
                <br />
                Navigate <span className="text-secondary">AI & Media</span>
                <br />
                with Confidence
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                In a world flooded with information and powered by AI, your ability to think critically is your
                superpower. Learn to identify misinformation, understand AI systems, and take control of your digital
                environment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button size="lg" className="text-lg px-8 py-6 group">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Learning
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="secondary" size="lg" className="text-lg px-8 py-6 group">
                  <Target className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Test Yourself!
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                  <div className="text-sm text-muted-foreground">Young People Empowered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">Improved Detection Skills</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-foreground mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Interactive Learning</div>
                </div>
              </div>
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <Link href="/deepfake-knowledge">
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Camera className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-serif font-semibold text-xl mb-3">Deepfakes Knowledge</h3>
                    <p className="text-muted-foreground mb-4">
                      Master the science behind deepfakes and learn to identify sophisticated AI-generated content.
                    </p>
                    <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                      Learn Detection <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/deepfake-detection">
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-accent/50 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                      <Search className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <h3 className="font-serif font-semibold text-xl mb-3">Deepfakes Detection</h3>
                    <p className="text-muted-foreground mb-4">
                      Use cutting-edge AI tools to analyze and verify the authenticity of digital media content.
                    </p>
                    <div className="flex items-center text-accent-foreground font-medium group-hover:translate-x-2 transition-transform">
                      Start Detecting <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/ai-manipulation-trends">
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-serif font-semibold text-xl mb-3">AI Manipulation Trends & News</h3>
                    <p className="text-muted-foreground mb-4">
                      Stay updated with the latest AI manipulation techniques and emerging digital threats.
                    </p>
                    <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                      Read Latest <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-secondary/50">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                    <Award className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-serif font-semibold text-xl mb-3">Deepfake Spotlight Challenge</h3>
                  <p className="text-muted-foreground mb-4">
                    Test your skills in our gamified challenges and compete with peers in detecting deepfakes.
                  </p>
                  <div className="flex items-center text-secondary font-medium group-hover:translate-x-2 transition-transform">
                    Take Challenge <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif font-semibold text-xl mb-3">AI Manipulation Trends & News</h3>
                  <p className="text-muted-foreground mb-4">
                    Stay updated with the latest AI manipulation techniques and emerging digital threats.
                  </p>
                  <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                    Read Latest <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-secondary/50">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                    <FileText className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-serif font-semibold text-xl mb-3">Digital Literacy Assessment</h3>
                  <p className="text-muted-foreground mb-4">
                    Get personalized insights into your digital literacy skills with our comprehensive assessment.
                  </p>
                  <div className="flex items-center text-secondary font-medium group-hover:translate-x-2 transition-transform">
                    Take Assessment <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-accent/50">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <HelpCircle className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-serif font-semibold text-xl mb-3">AI Mythbusters</h3>
                  <p className="text-muted-foreground mb-4">
                    Debunk common AI myths and misconceptions with evidence-based explanations and examples.
                  </p>
                  <div className="flex items-center text-accent-foreground font-medium group-hover:translate-x-2 transition-transform">
                    Bust Myths <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Demo Section */}
            <div
              className={`bg-card rounded-2xl p-8 md:p-12 mb-16 border-2 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="text-center mb-8">
                <h2 className="font-serif font-bold text-3xl md:text-4xl mb-4">See AI in Action</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Experience how AI processes information and learn to recognize its patterns and limitations.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Real-time Analysis</h4>
                      <p className="text-muted-foreground">
                        Watch AI analyze text, images, and videos in real-time to understand its decision-making
                        process.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Collaborative Learning</h4>
                      <p className="text-muted-foreground">
                        Join thousands of peers in identifying patterns and sharing insights about digital media.
                      </p>
                    </div>
                  </div>

                  <Button className="w-full sm:w-auto" size="lg">
                    Try Interactive Demo
                    <Play className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="relative">
                  <div className="bg-muted/50 rounded-xl p-6 border-2 border-dashed border-muted-foreground/20">
                    <div className="text-center text-muted-foreground">
                      <Brain className="w-16 h-16 mx-auto mb-4 float" />
                      <p className="text-lg font-medium">Interactive AI Demo</p>
                      <p className="text-sm">Click "Try Interactive Demo" to experience AI analysis</p>
                    </div>
                  </div>

                  {/* Floating elements around demo */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full neural-pulse" />
                  <div
                    className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary/20 rounded-full neural-pulse"
                    style={{ animationDelay: "1s" }}
                  />
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div
              className={`text-center transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <h2 className="font-serif font-bold text-3xl md:text-4xl mb-6">Ready to Take Control?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the movement of digitally literate young people who refuse to be manipulated by misinformation and
                AI bias.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 group"
                >
                  <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Start Your Journey
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 mt-24 px-6 py-12 border-t border-border">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="w-6 h-6 text-primary" />
              <span className="font-serif font-bold text-lg">VerifyAI</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Empowering the next generation with critical thinking skills for the digital age.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
