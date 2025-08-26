"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Brain, Menu, X, Play, Target, Users } from "lucide-react"
import Link from "next/link"

export default function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigationItems = [
    { name: "Deepfakes Knowledge", href: "/deepfake-knowledge" },
    { name: "Deepfake Spotlight Challenge", href: "#deepfake-spotlight-challenge" },
    { name: "Deepfake Detection", href: "/deepfake-detection" },
    { name: "AI Manipulation Trends & News Feed", href: "/ai-manipulation-trends" },
    { name: "Personalized Digital Literacy Assessment", href: "#digital-literacy-assessment" },
    { name: "AI Mythbusters", href: "#ai-mythbusters" },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50" : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="w-7 h-7 text-primary" />
              <span className="font-serif font-bold text-xl">VerifyAI</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Button
                size="lg"
                className="text-base px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 group transition-all duration-300 hover:scale-105"
              >
                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Start Learning
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="text-base px-6 py-3 group transition-all duration-300 hover:scale-105"
              >
                <Target className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Take the Quiz
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-6 py-3 group transition-all duration-300 hover:scale-105 bg-transparent"
              >
                <Users className="w-4 h-4 mr-2 group-hover:bounce transition-transform" />
                Join Community
              </Button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-background/98 backdrop-blur-md border-l border-border shadow-2xl z-40 transform transition-transform duration-300 overflow-y-auto ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-20 px-6 pb-6 min-h-full">
          <div className="space-y-4 mb-8">
            <Button className="w-full justify-start text-left" size="lg">
              <Play className="w-4 h-4 mr-3" />
              Start Learning
            </Button>
            <Button variant="secondary" className="w-full justify-start text-left" size="lg">
              <Target className="w-4 h-4 mr-3" />
              Take the Quiz
            </Button>
            <Button variant="outline" className="w-full justify-start text-left bg-transparent" size="lg">
              <Users className="w-4 h-4 mr-3" />
              Join Community
            </Button>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">Explore Topics</h3>
            <div className="space-y-3 flex-1">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="block py-2 px-3 rounded-lg hover:bg-muted transition-colors text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  )
}

export { StickyHeader }
