"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import StickyHeader from "@/components/sticky-header"
import { CheckCircle, Brain, Eye, ArrowLeft, Trophy, Target } from "lucide-react"
import Link from "next/link"

export default function AdvancedQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const advancedQuestions = [
    {
      type: "theoretical",
      question: "Which neural network architecture is most commonly used in modern deepfake generation?",
      options: [
        "Convolutional Neural Networks (CNNs)",
        "Generative Adversarial Networks (GANs)",
        "Recurrent Neural Networks (RNNs)",
        "Transformer Networks",
      ],
      correct: 1,
      explanation:
        "GANs consist of two competing networks - a generator and discriminator - that work together to create increasingly realistic synthetic content. This adversarial training process is the foundation of most deepfake technologies.",
      difficulty: "Expert",
    },
    {
      type: "image",
      question: "What is the most suspicious element in this deepfake detection scenario?",
      image: "/person-with-unnatural-lighting-on-face-compared-to.png",
      options: [
        "The person's clothing style",
        "Inconsistent lighting between face and background",
        "The video quality",
        "The person's hand gestures",
      ],
      correct: 1,
      explanation:
        "Lighting inconsistencies are one of the most reliable deepfake detection methods. The AI often fails to properly match the lighting conditions, shadows, and reflections between the synthetic face and the original background.",
      difficulty: "Advanced",
    },
    {
      type: "theoretical",
      question: "What is the 'uncanny valley' effect in deepfake detection?",
      options: [
        "When deepfakes look too perfect and lack natural human imperfections",
        "When audio doesn't match video timing",
        "When facial expressions are exaggerated",
        "When the background is blurred",
      ],
      correct: 0,
      explanation:
        "The uncanny valley refers to the unsettling feeling when something appears almost, but not quite, human. In deepfakes, this manifests as overly smooth skin, perfect symmetry, or lack of natural imperfections that make real humans unique.",
      difficulty: "Intermediate",
    },
    {
      type: "image",
      question: "Which visual cue would help you identify this as a potential deepfake?",
      image: "/close-up-of-person-with-misaligned-teeth-and-blurr.png",
      options: [
        "Hair texture and style",
        "Eye color and pupil size",
        "Teeth alignment and edge definition",
        "Skin tone consistency",
      ],
      correct: 2,
      explanation:
        "Teeth are notoriously difficult for AI to render correctly. Look for blurry tooth edges, unnatural alignment, inconsistent coloring, or teeth that appear to merge together - these are strong indicators of deepfake manipulation.",
      difficulty: "Advanced",
    },
    {
      type: "theoretical",
      question: "What is 'temporal consistency' in deepfake detection?",
      options: [
        "Making sure audio matches video length",
        "Ensuring facial features remain consistent across video frames",
        "Matching the video timestamp with real events",
        "Keeping the same camera angle throughout",
      ],
      correct: 1,
      explanation:
        "Temporal consistency refers to maintaining realistic continuity of facial features, expressions, and movements across consecutive video frames. Deepfakes often show flickering, morphing, or inconsistent features between frames.",
      difficulty: "Expert",
    },
    {
      type: "image",
      question: "What deepfake artifact is most visible in this scenario?",
      image: "/person-blinking-with-robotic-unnatural-timing-and-.png",
      options: [
        "Facial hair inconsistencies",
        "Unnatural blinking patterns",
        "Color saturation issues",
        "Background distortion",
      ],
      correct: 1,
      explanation:
        "Unnatural blinking is one of the most reliable deepfake indicators. Humans blink 15-20 times per minute with natural variation, while deepfakes often show too few blinks, robotic timing, or incomplete eyelid closure.",
      difficulty: "Intermediate",
    },
    {
      type: "theoretical",
      question: "Which technique is used to improve deepfake quality in post-processing?",
      options: [
        "Adding more training data",
        "Temporal smoothing and color correction",
        "Increasing video resolution",
        "Changing the audio track",
      ],
      correct: 1,
      explanation:
        "Post-processing involves temporal smoothing to reduce frame-to-frame inconsistencies, color correction to match lighting conditions, and manual refinement to remove artifacts - all crucial for creating convincing deepfakes.",
      difficulty: "Expert",
    },
    {
      type: "image",
      question: "What makes this image suspicious for deepfake manipulation?",
      image: "/person-with-shadows-pointing-in-different-directio.png",
      options: [
        "The person's facial expression",
        "Inconsistent shadow directions",
        "The background composition",
        "The image resolution",
      ],
      correct: 1,
      explanation:
        "In real photography, shadows from a single light source should all point back to that source. When shadows point in different directions, it indicates composite imagery or AI generation that failed to maintain consistent lighting physics.",
      difficulty: "Advanced",
    },
    {
      type: "theoretical",
      question: "What is 'adversarial training' in the context of deepfakes?",
      options: [
        "Training AI to detect deepfakes",
        "Two networks competing to create and detect fakes",
        "Training on adversarial examples",
        "Using multiple datasets simultaneously",
      ],
      correct: 1,
      explanation:
        "Adversarial training involves two neural networks: the generator creates fake content while the discriminator tries to detect it. They compete in a 'game' where both networks continuously improve, leading to increasingly realistic deepfakes.",
      difficulty: "Expert",
    },
    {
      type: "image",
      question: "Which detail would help confirm this as a deepfake?",
      image: "/person-speaking-with-mouth-movements-that-don-t-ma.png",
      options: [
        "Hand positioning and gestures",
        "Lip-sync accuracy with speech sounds",
        "Clothing wrinkles and folds",
        "Background focus and depth",
      ],
      correct: 1,
      explanation:
        "Lip-sync accuracy is crucial for believable deepfakes. Pay attention to whether mouth movements match specific sounds, especially consonants like 'P', 'B', and 'M' which require specific lip positions that AI often gets wrong.",
      difficulty: "Advanced",
    },
  ]

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)

    if (answerIndex === advancedQuestions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < advancedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setShowResults(false)
    setScore(0)
  }

  const getScoreMessage = () => {
    const percentage = (score / advancedQuestions.length) * 100
    if (percentage >= 90) return "Outstanding! You're a deepfake detection expert."
    if (percentage >= 80) return "Excellent! You have strong detection skills."
    if (percentage >= 70) return "Good job! You understand most detection principles."
    if (percentage >= 60) return "Not bad! Keep studying to improve your skills."
    return "Keep learning! Review the knowledge center for better understanding."
  }

  const currentQ = advancedQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-background">
      <StickyHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Link
              href="/deepfake-knowledge"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Knowledge Center
            </Link>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Advanced Deepfake Quiz
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Test your expert-level knowledge with challenging questions covering advanced detection techniques,
              technical concepts, and real-world scenarios. This quiz includes both theoretical and image-based
              questions.
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {!showResults ? (
              <>
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestion + 1} of {advancedQuestions.length}
                    </span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {currentQ.difficulty}
                    </Badge>
                  </div>
                  <Progress value={((currentQuestion + 1) / advancedQuestions.length) * 100} className="h-2" />
                </div>

                {/* Question Card */}
                <Card className="mb-8">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {currentQ.type === "theoretical" ? (
                        <Brain className="w-5 h-5 text-primary" />
                      ) : (
                        <Eye className="w-5 h-5 text-secondary" />
                      )}
                      <Badge variant={currentQ.type === "theoretical" ? "default" : "secondary"}>
                        {currentQ.type === "theoretical" ? "Theoretical" : "Image Analysis"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{currentQ.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Image for image-based questions */}
                    {currentQ.type === "image" && currentQ.image && (
                      <div className="mb-6">
                        <img
                          src={currentQ.image || "/placeholder.svg"}
                          alt="Deepfake analysis scenario"
                          className="w-full max-w-md mx-auto rounded-lg border shadow-sm"
                        />
                      </div>
                    )}

                    {/* Answer Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentQ.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                          className={`w-full justify-start text-left h-auto p-4 whitespace-normal break-words ${
                            selectedAnswers[currentQuestion] !== undefined
                              ? selectedAnswers[currentQuestion] === index && index !== currentQ.correct
                                ? "bg-red-100 border-red-300 text-red-700 hover:bg-red-100"
                                : index === currentQ.correct
                                  ? "bg-green-100 border-green-300 text-green-700 hover:bg-green-100"
                                  : "bg-transparent hover:bg-muted/50 text-muted-foreground"
                              : "bg-transparent hover:bg-primary/5"
                          }`}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={selectedAnswers[currentQuestion] !== undefined}
                        >
                          <div className="flex items-start gap-2 w-full">
                            <span className="font-semibold flex-shrink-0">{String.fromCharCode(65 + index)}.</span>
                            <span className="flex-1 text-left">{option}</span>
                          </div>
                        </Button>
                      ))}
                    </div>

                    {/* Explanation */}
                    {selectedAnswers[currentQuestion] !== undefined && (
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-green-600 mb-2">
                              Correct Answer: {String.fromCharCode(65 + currentQ.correct)}.{" "}
                              {currentQ.options[currentQ.correct]}
                            </p>
                            <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Next Button */}
                    {selectedAnswers[currentQuestion] !== undefined && (
                      <div className="mt-6 text-center">
                        <Button onClick={nextQuestion} size="lg">
                          {currentQuestion < advancedQuestions.length - 1 ? "Next Question" : "View Results"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Results Section */
              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Trophy className="w-16 h-16 text-accent" />
                  </div>
                  <CardTitle className="text-3xl mb-2">Quiz Complete!</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-8">
                    <div className="text-6xl font-bold text-primary mb-4">
                      {score}/{advancedQuestions.length}
                    </div>
                    <div className="text-2xl font-semibold mb-2">
                      {Math.round((score / advancedQuestions.length) * 100)}%
                    </div>
                    <Progress
                      value={(score / advancedQuestions.length) * 100}
                      className="w-full max-w-md mx-auto mb-4"
                    />
                    <p className="text-lg text-muted-foreground">{getScoreMessage()}</p>
                  </div>

                  {/* Performance Breakdown */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Brain className="w-5 h-5 text-primary" />
                          <span className="font-semibold">Theoretical Questions</span>
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {
                            advancedQuestions.filter(
                              (q, i) => q.type === "theoretical" && selectedAnswers[i] === q.correct,
                            ).length
                          }
                          /{advancedQuestions.filter((q) => q.type === "theoretical").length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/5 border-secondary/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Eye className="w-5 h-5 text-secondary" />
                          <span className="font-semibold">Image Analysis</span>
                        </div>
                        <div className="text-2xl font-bold text-secondary">
                          {
                            advancedQuestions.filter((q, i) => q.type === "image" && selectedAnswers[i] === q.correct)
                              .length
                          }
                          /{advancedQuestions.filter((q) => q.type === "image").length}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={resetQuiz} size="lg">
                      Retake Quiz
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link href="/deepfake-knowledge">Back to Knowledge Center</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
