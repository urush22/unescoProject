"use client"

import type React from "react"

import { useState, useRef } from "react"
import { StickyHeader } from "@/components/sticky-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileImage,
  FileVideo,
  FileAudio,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Shield,
  Eye,
} from "lucide-react"

type DetectionType = "image" | "video" | "audio"
type ProcessingStatus = "idle" | "uploading" | "processing" | "complete"
type DetectionResult = "authentic" | "deepfake" | "suspicious"

interface AnalysisResult {
  result: DetectionResult
  confidence: number
  details: string[]
  processingTime: number
}

export default function DeepfakeDetectionPage() {
  const [detectionType, setDetectionType] = useState<DetectionType>("image")
  const [status, setStatus] = useState<ProcessingStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file)
    setStatus("uploading")
    setProgress(0)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('detectionType', detectionType)

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(uploadInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Call the backend API
      const response = await fetch('http://localhost:5000/api/deepfake/detect', {
        method: 'POST',
        body: formData,
      })

      clearInterval(uploadInterval)
      setProgress(100)
      setStatus("processing")

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Detection failed')
      }

      // Set the analysis result
      setAnalysisResult({
        result: result.result,
        confidence: result.confidence,
        details: result.details,
        processingTime: result.processingTime,
      })
      setStatus("complete")

    } catch (error) {
      console.error('Detection error:', error)
      setStatus("idle")
      setProgress(0)
      setUploadedFile(null)
      
      // You might want to show an error message to the user here
      alert(error instanceof Error ? error.message : 'Failed to process file. Please try again.')
    }
  }

  const resetDetection = () => {
    setStatus("idle")
    setProgress(0)
    setUploadedFile(null)
    setAnalysisResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getResultIcon = (result: DetectionResult) => {
    switch (result) {
      case "authentic":
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case "deepfake":
        return <XCircle className="w-8 h-8 text-red-500" />
      case "suspicious":
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />
    }
  }

  const getResultColor = (result: DetectionResult) => {
    switch (result) {
      case "authentic":
        return "text-green-600 bg-green-50 border-green-200"
      case "deepfake":
        return "text-red-600 bg-red-50 border-red-200"
      case "suspicious":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
    }
  }

  const getAcceptedFileTypes = () => {
    switch (detectionType) {
      case "image":
        return ".jpg,.jpeg,.png,.webp"
      case "video":
        return ".mp4,.avi,.mov,.webm"
      case "audio":
        return ".mp3,.wav,.m4a,.ogg"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <StickyHeader />

      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-primary/10 rounded-full">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4 font-serif">Deepfake Detection Center</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your media files and let our advanced AI analyze them for deepfake manipulation. Get instant
              results with detailed explanations.
            </p>
          </div>

          {/* Detection Type Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Choose Detection Type
              </CardTitle>
              <CardDescription>Select the type of media you want to analyze for deepfake manipulation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    type: "image" as DetectionType,
                    icon: FileImage,
                    label: "Image Detection",
                    desc: "Analyze photos for face swaps and manipulations",
                  },
                  {
                    type: "video" as DetectionType,
                    icon: FileVideo,
                    label: "Video Detection",
                    desc: "Detect deepfake videos and face replacements",
                  },
                  {
                    type: "audio" as DetectionType,
                    icon: FileAudio,
                    label: "Audio Detection",
                    desc: "Identify synthetic voices and audio cloning",
                  },
                ].map(({ type, icon: Icon, label, desc }) => (
                  <button
                    key={type}
                    onClick={() => setDetectionType(type)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      detectionType === type ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mb-2 ${detectionType === type ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <h3 className="font-semibold text-foreground">{label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload Area */}
          {status === "idle" && (
            <Card className="mb-8">
              <CardContent className="p-8">
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
                    dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Upload {detectionType.charAt(0).toUpperCase() + detectionType.slice(1)} File
                  </h3>
                  <p className="text-muted-foreground mb-6">Drag and drop your file here, or click to browse</p>
                  <Button onClick={() => fileInputRef.current?.click()} className="mb-4">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: {getAcceptedFileTypes().replace(/\./g, "").toUpperCase()}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={getAcceptedFileTypes()}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processing Status */}
          {(status === "uploading" || status === "processing") && (
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {status === "uploading" ? "Uploading File..." : "Analyzing Content..."}
                  </h3>
                  <p className="text-muted-foreground mb-6">{uploadedFile?.name}</p>
                  <div className="max-w-md mx-auto">
                    <Progress value={progress} className="mb-2" />
                    <p className="text-sm text-muted-foreground">{progress}% complete</p>
                  </div>
                  {status === "processing" && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Our AI is analyzing your {detectionType} for deepfake signatures...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {status === "complete" && analysisResult && (
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">{getResultIcon(analysisResult.result)}</div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Analysis Complete</h3>
                  <Badge className={`text-lg px-4 py-2 ${getResultColor(analysisResult.result)}`}>
                    {analysisResult.result.charAt(0).toUpperCase() + analysisResult.result.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="text-center">
                    <h4 className="font-semibold text-foreground mb-2">Confidence Level</h4>
                    <div className="text-3xl font-bold text-primary">{analysisResult.confidence}%</div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-foreground mb-2">Processing Time</h4>
                    <div className="text-3xl font-bold text-secondary">{analysisResult.processingTime}s</div>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-foreground mb-4">Analysis Details</h4>
                  <div className="space-y-2">
                    {analysisResult.details.map((detail, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={resetDetection} variant="outline">
                    Analyze Another File
                  </Button>
                  <Button>Download Report</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Our AI analyzes multiple factors including facial inconsistencies, temporal artifacts, and compression
                  patterns to detect deepfakes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Your files are processed securely and deleted immediately after analysis. We never store or share your
                  uploaded content.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accuracy Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Our detection system achieves 95%+ accuracy on current deepfake techniques and is continuously updated
                  with new detection methods.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
