"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import StickyHeader from "@/components/sticky-header"
import { ChevronRight, Eye, Brain, Shield, AlertTriangle, CheckCircle, Users, Film, Mic, Camera } from "lucide-react"

export default function DeepfakeKnowledgePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showAnswers, setShowAnswers] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 5)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleStepClick = (index: number) => {
    setCurrentStep(index)
  }

  const deepfakeSteps = [
    {
      title: "Data Collection",
      description: "Gathering extensive source material",
      icon: "📊",
      details:
        "This crucial first step involves collecting hundreds or thousands of images, videos, and audio recordings of the target person. High-quality deepfakes require diverse angles, lighting conditions, and expressions. The more data available, the more convincing the final result. Modern deepfake tools can work with as little as one photo, but professional-grade fakes need extensive datasets.",
    },
    {
      title: "Data Preprocessing",
      description: "Cleaning and organizing collected material",
      icon: "🔧",
      details:
        "Raw data is meticulously processed to ensure consistency. This includes face extraction, alignment, cropping to standard sizes, color correction, and noise reduction. Audio samples are cleaned and normalized. Poor preprocessing leads to obvious artifacts in the final deepfake, making detection easier.",
    },
    {
      title: "Model Training",
      description: "Using GANs to train neural networks",
      icon: "🧠",
      details:
        "Two neural networks compete in a 'game' - the Generator creates fake content while the Discriminator tries to detect it. Through thousands of iterations, both networks improve. The Generator learns to create increasingly realistic fakes, while the Discriminator becomes better at spotting them. This adversarial process is the heart of deepfake technology.",
    },
    {
      title: "Generation",
      description: "Creating synthetic content",
      icon: "✨",
      details:
        "The trained model generates new synthetic content by mapping the target person's features onto source video or audio. Real-time deepfakes can now be created during live video calls. Parameters like facial expressions, head movements, and voice intonation are carefully controlled to maintain realism.",
    },
    {
      title: "Post-Processing",
      description: "Refining output for maximum realism",
      icon: "🎨",
      details:
        "The final step involves manual refinement using video editing software. This includes color grading, smoothing temporal inconsistencies, adding motion blur, adjusting lighting, and removing telltale artifacts. Professional deepfakes often require significant post-processing to achieve broadcast quality.",
    },
  ]

  const detectionSigns = [
    {
      sign: "Unnatural Blinking",
      description:
        "Too few blinks (less than 17 per minute) or robotic intervals. Real humans blink 15-20 times per minute with natural variation.",
      severity: "high",
    },
    {
      sign: "Waxy Skin Texture",
      description:
        "Unnaturally smooth, plastic-like, or overly perfect skin that lacks natural imperfections, pores, or texture variation.",
      severity: "medium",
    },
    {
      sign: "Misaligned Lip Sync",
      description:
        "Audio doesn't perfectly match mouth movements, especially with complex sounds like 'P', 'B', and 'M' consonants.",
      severity: "high",
    },
    {
      sign: "Lighting Inconsistencies",
      description:
        "Face lighting doesn't match background or environment. Look for impossible shadow directions or glowing faces in dim settings.",
      severity: "medium",
    },
    {
      sign: "Stiff Body Movements",
      description:
        "Jerky, unnatural gestures or movements that don't flow naturally. Often the body language doesn't match the facial expressions.",
      severity: "low",
    },
    {
      sign: "Audio-Video Mismatch",
      description:
        "Robotic voice tones, unnatural pauses, missing ambient sounds, or voice that doesn't match the person's known speech patterns.",
      severity: "high",
    },
    {
      sign: "Facial Boundary Issues",
      description:
        "Blurred or inconsistent edges around the face, especially near hairlines, ears, or when the person turns their head.",
      severity: "medium",
    },
    {
      sign: "Inconsistent Eye Gaze",
      description:
        "Eyes that don't track properly, pupils of different sizes, or gaze that doesn't match head movement direction.",
      severity: "high",
    },
  ]

  const quizQuestions = [
    {
      question: "What is the most reliable sign of a deepfake video?",
      options: ["Poor video quality", "Unnatural blinking patterns", "Background noise", "Video length"],
      correct: 1,
      explanation:
        "Unnatural blinking patterns are one of the most reliable indicators because current AI struggles to replicate the natural, unconscious rhythm of human blinking (15-20 times per minute with natural variation).",
    },
    {
      question: "Which technology is primarily used to create deepfakes?",
      options: ["Machine Learning", "Generative Adversarial Networks (GANs)", "Blockchain", "Virtual Reality"],
      correct: 1,
      explanation:
        "GANs use two competing neural networks - a generator that creates fake content and a discriminator that tries to detect it. This adversarial training process produces increasingly realistic deepfakes.",
    },
    {
      question: "What should you check for lighting inconsistencies?",
      options: ["Video resolution", "Face vs background lighting", "Color saturation", "Frame rate"],
      correct: 1,
      explanation:
        "Lighting inconsistencies between the face and background are common deepfake giveaways. The AI often fails to match the lighting conditions, shadows, and reflections properly.",
    },
    {
      question: "How often do humans naturally blink per minute?",
      options: ["5-10 times", "15-20 times", "25-30 times", "35-40 times"],
      correct: 1,
      explanation:
        "Humans naturally blink 15-20 times per minute with natural variation. Deepfakes often show too few blinks or robotic, evenly-spaced blinking patterns.",
    },
    {
      question: "What is a major positive application of deepfake technology?",
      options: [
        "Creating fake news",
        "Digital resurrection of deceased actors",
        "Identity theft",
        "Political manipulation",
      ],
      correct: 1,
      explanation:
        "Digital resurrection allows deceased actors to appear in new films, preserves cultural heritage, and enables historical figures to 'speak' in educational content, creating powerful learning experiences.",
    },
  ]

  const deepfakeTypes = [
    {
      type: "Face Swap",
      icon: <Users className="w-6 h-6" />,
      description: "Replacing one person's face with another's in video content",
      methods: "FaceSwap, DeepFaceLab, Faceswap-GAN",
      difficulty: "Medium",
      timeRequired: "Hours to Days",
    },
    {
      type: "Face Reenactment",
      icon: <Film className="w-6 h-6" />,
      description: "Manipulating facial expressions and movements of existing footage",
      methods: "First Order Motion Model, Liquid Warping GAN",
      difficulty: "High",
      timeRequired: "Days to Weeks",
    },
    {
      type: "Voice Cloning",
      icon: <Mic className="w-6 h-6" />,
      description: "Replicating someone's voice to say anything",
      methods: "Tacotron, WaveNet, Real-Time Voice Cloning",
      difficulty: "Low",
      timeRequired: "Minutes to Hours",
    },
    {
      type: "Full Body Puppetry",
      icon: <Camera className="w-6 h-6" />,
      description: "Controlling entire body movements and gestures",
      methods: "Pose2Pose, DensePose, Motion Transfer",
      difficulty: "Very High",
      timeRequired: "Weeks to Months",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <StickyHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-destructive/10 text-destructive border-destructive/20">Critical Knowledge</Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Deepfake Knowledge Center
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Master the art of detecting AI-generated content. Learn how deepfakes work, spot the signs, and protect
              yourself from digital deception in our increasingly synthetic media landscape.
            </p>

            {/* Animated Neural Network Visualization */}
            <div className="relative w-full max-w-2xl mx-auto h-32 mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-5 gap-8 items-center">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-4 h-4 rounded-full bg-primary transition-all duration-500`}
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                      <div
                        className={`w-3 h-3 rounded-full bg-secondary transition-all duration-500`}
                        style={{ animationDelay: `${i * 0.2 + 0.5}s` }}
                      />
                    </div>
                  ))}
                </div>
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <line
                      key={i}
                      x1={`${20 + i * 20}%`}
                      y1="40%"
                      x2={`${40 + i * 20}%`}
                      y2="40%"
                      stroke="currentColor"
                      strokeWidth="1"
                      className={`text-primary/30 transition-all duration-500`}
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What are Deepfakes Section - Enhanced */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-8 text-center">
              Understanding Deepfakes: A Comprehensive Guide
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    What Are Deepfakes?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Deepfakes are synthetic media created using artificial intelligence that can convincingly replace a
                    person's likeness with someone else's. The term combines 'deep learning' and 'fake,' representing
                    the sophisticated AI technology behind these creations.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    They use deep neural networks to analyze thousands of images, videos, or audio samples to learn
                    patterns in facial expressions, voice characteristics, and mannerisms, then generate new content
                    that appears authentic but is entirely synthetic.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    The Growing Threat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Deepfake technology has become increasingly accessible and sophisticated. In 2024, deepfake attempts
                    occurred every 5 minutes globally, with financial losses exceeding $200 million in Q1 2025 alone.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Notable incidents include a $25 million fraudulent transfer in Hong Kong using deepfake video
                    conferencing, and Taylor Swift deepfakes garnering 45 million views in just 17 hours before removal.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-serif font-bold mb-6 text-center">Types of Deepfake Technology</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {deepfakeTypes.map((type, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 h-64 flex flex-col">
                    <CardHeader className="pb-3 flex-shrink-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">{type.icon}</div>
                        <CardTitle className="text-lg">{type.type}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                      <div className="space-y-2 mt-auto">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Difficulty:</span>
                          <Badge
                            variant={
                              type.difficulty === "Low"
                                ? "secondary"
                                : type.difficulty === "Medium"
                                  ? "outline"
                                  : "destructive"
                            }
                            className="ml-2"
                          >
                            {type.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium text-right">{type.timeRequired}</span>
                        </div>
                        <div className="text-xs">
                          <div className="flex items-start justify-between">
                            <span className="text-muted-foreground">Tools:</span>
                            <span className="font-medium text-right max-w-[60%]">{type.methods}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    Negative Impacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Misinformation & Fraud</h4>
                    <p className="text-sm text-muted-foreground">
                      Creating false evidence, fake news, and financial scams targeting individuals and organizations.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Non-consensual Content</h4>
                    <p className="text-sm text-muted-foreground">
                      Creating explicit or compromising content without permission, causing psychological harm and
                      reputation damage.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Political Manipulation</h4>
                    <p className="text-sm text-muted-foreground">
                      Fabricating speeches or actions by political figures to influence elections and public opinion.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Erosion of Trust</h4>
                    <p className="text-sm text-muted-foreground">
                      Making people question the authenticity of all media, undermining legitimate evidence and
                      journalism.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    Positive Applications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Digital Resurrection</h4>
                    <p className="text-sm text-muted-foreground">
                      Bringing deceased actors back for films, preserving cultural heritage, and enabling historical
                      figures to 'speak' in educational content.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Accessibility & Translation</h4>
                    <p className="text-sm text-muted-foreground">
                      Creating multilingual content, helping people with speech disabilities, and making media more
                      accessible globally.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Entertainment & Art</h4>
                    <p className="text-sm text-muted-foreground">
                      Reducing production costs in filmmaking, creating personalized content, and enabling new forms of
                      digital art and storytelling.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Privacy Protection</h4>
                    <p className="text-sm text-muted-foreground">
                      Protecting identities of whistleblowers, witnesses, and activists while allowing them to share
                      their stories safely.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center bg-destructive/5 border-destructive/20">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-destructive mb-2">442%</div>
                  <p className="text-sm text-muted-foreground">Increase in voice phishing attacks in late 2024</p>
                </CardContent>
              </Card>
              <Card className="text-center bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">45M</div>
                  <p className="text-sm text-muted-foreground">Views of Taylor Swift deepfakes in 17 hours</p>
                </CardContent>
              </Card>
              <Card className="text-center bg-secondary/5 border-secondary/20">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-secondary mb-2">$499K</div>
                  <p className="text-sm text-muted-foreground">Nearly transferred due to deepfake CFO scam</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How Deepfakes Work - Enhanced Interactive Flowchart */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-4">How Deepfakes Are Created</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Understanding the 5-step process behind deepfake creation helps you recognize potential vulnerabilities
                and detection opportunities. Each step requires specific expertise and resources.
              </p>
            </div>

            {/* Interactive Flowchart */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {deepfakeSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <Card
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 h-48 flex flex-col ${
                        currentStep === index ? "ring-2 ring-primary shadow-lg bg-primary/5" : ""
                      }`}
                      onClick={() => handleStepClick(index)}
                    >
                      <CardContent className="p-4 text-center h-full flex flex-col justify-between">
                        <div className="flex-1">
                          <div className="text-2xl mb-2">{step.icon}</div>
                          <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-3">{step.description}</p>
                        </div>
                        <div className="mt-auto pt-2">
                          <Badge variant={currentStep === index ? "default" : "outline"} className="text-xs">
                            Step {index + 1}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Arrow between steps */}
                    {index < deepfakeSteps.length - 1 && (
                      <ChevronRight className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
                    )}
                  </div>
                ))}
              </div>

              <Card className="mt-8 bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{deepfakeSteps[currentStep].icon}</span>
                    Step {currentStep + 1}: {deepfakeSteps[currentStep].title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{deepfakeSteps[currentStep].details}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Detection Signs - Enhanced */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-8 text-center">How to Spot Deepfakes</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Learn to identify telltale signs that can help you detect deepfakes without specialized tools. These
              visual and audio cues are your first line of defense against synthetic media.
            </p>

            <div className="grid gap-6">
              {detectionSigns.map((item, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          item.severity === "high"
                            ? "bg-destructive/10 text-destructive"
                            : item.severity === "medium"
                              ? "bg-accent/10 text-accent-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{item.sign}</h3>
                          <Badge
                            variant={
                              item.severity === "high"
                                ? "destructive"
                                : item.severity === "medium"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {item.severity} priority
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detection Tips */}
            <Card className="mt-12 bg-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent-foreground" />
                  Pro Detection Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
                    Look for inconsistent shadows - they should all point back to the same light source
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
                    Check if parallel lines converge at a single vanishing point in the background
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
                    Listen for robotic vocal tones or unnatural pauses in speech
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
                    Verify the context - does the situation seem logical and possible?
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
                    Cross-reference with multiple sources and check for official statements
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Interactive Quiz */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-8 text-center">Test Your Knowledge</h2>

            {!showQuizResults ? (
              <div className="space-y-6">
                {quizQuestions.map((question, qIndex) => (
                  <Card key={qIndex} className="w-full">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Question {qIndex + 1}: {question.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {question.options.map((option, oIndex) => (
                          <Button
                            key={oIndex}
                            variant={selectedAnswers[qIndex] === oIndex ? "default" : "outline"}
                            className={`w-full justify-start text-left h-auto p-4 bg-transparent hover:bg-primary/5 ${
                              selectedAnswers[qIndex] !== undefined
                                ? selectedAnswers[qIndex] === oIndex && oIndex !== question.correct
                                  ? "bg-red-100 border-red-300 text-red-700 hover:bg-red-100"
                                  : oIndex === question.correct
                                    ? "bg-green-100 border-green-300 text-green-700 hover:bg-green-100"
                                    : "bg-transparent hover:bg-muted/50 text-muted-foreground"
                                : "bg-transparent hover:bg-primary/5"
                            }`}
                            onClick={() => {
                              const newAnswers = [...selectedAnswers]
                              newAnswers[qIndex] = oIndex
                              setSelectedAnswers(newAnswers)

                              if (oIndex === question.correct) {
                                setQuizScore((prev) => prev + 1)
                              }

                              if (qIndex === quizQuestions.length - 1 && newAnswers.length === quizQuestions.length) {
                                setShowQuizResults(true)
                                setShowAnswers(true)
                              }
                            }}
                            disabled={selectedAnswers[qIndex] !== undefined}
                          >
                            <span className="mr-2 font-semibold">{String.fromCharCode(65 + oIndex)}.</span>
                            {option}
                          </Button>
                        ))}
                      </div>

                      {selectedAnswers[qIndex] !== undefined && (
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-green-600 mb-2">
                                Correct Answer: {String.fromCharCode(65 + question.correct)}.{" "}
                                {question.options[question.correct]}
                              </p>
                              <p className="text-sm text-muted-foreground">{question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {quizScore}/{quizQuestions.length}
                    </div>
                    <Progress value={(quizScore / quizQuestions.length) * 100} className="w-full max-w-xs mx-auto" />
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {quizScore === quizQuestions.length
                      ? "Perfect! You're well-equipped to spot deepfakes and understand the technology."
                      : quizScore >= quizQuestions.length / 2
                        ? "Good job! Keep practicing your detection skills and reviewing the content."
                        : "Keep learning! Review the detection signs and deepfake creation process above."}
                  </p>
                  <Button
                    onClick={() => {
                      setShowQuizResults(false)
                      setQuizScore(0)
                      setSelectedAnswers([])
                      setShowAnswers(false)
                    }}
                  >
                    Retake Quiz
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Stay Vigilant, Stay Informed</h2>
            <p className="text-muted-foreground mb-8">
              Deepfake technology is rapidly evolving, but so are detection methods. Keep your skills sharp, stay
              updated on new developments, and help others learn to identify synthetic media. Together, we can build a
              more media-literate society.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <a href="/advanced-quiz">Take Advanced Quiz</a>
              </Button>
              <Button size="lg" variant="outline">
                Share This Knowledge
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
