'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Mic, MicOff, Stethoscope, Pill, Clipboard, Activity, Bot } from 'lucide-react'
import io from 'socket.io-client'
import styles from './Voice.module.css'

// Replace with the IP address and port of your AI assistant backend
const BACKEND_URL = 'http://localhost:5001'  // Changed to connect to your backend on port 5001
const socket = io(BACKEND_URL)

export default function VoiceAssistant() {
  const [isActive, setIsActive] = useState(false)
  const [response, setResponse] = useState("")
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Background animation
    const bgCanvas = backgroundCanvasRef.current
    if (!bgCanvas) return

    const bgCtx = bgCanvas.getContext('2d')
    if (!bgCtx) return

    bgCanvas.width = window.innerWidth
    bgCanvas.height = window.innerHeight

    const particles: { x: number; y: number; radius: number; dx: number; dy: number }[] = []
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5
      })
    }

    function animateBackground() {
      if (!bgCtx || !bgCanvas) return

      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height)
      
      particles.forEach(particle => {
        bgCtx.beginPath()
        bgCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        bgCtx.fillStyle = 'rgba(59, 130, 246, 0.5)'
        bgCtx.fill()

        particle.x += particle.dx
        particle.y += particle.dy

        if (particle.x < 0 || particle.x > bgCanvas.width) particle.dx = -particle.dx
        if (particle.y < 0 || particle.y > bgCanvas.height) particle.dy = -particle.dy
      })

      requestAnimationFrame(animateBackground)
    }

    animateBackground()

    // Voice visualization
    if (!isActive) {
      socket.disconnect();
      return;
    }

    socket.connect();

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let offset = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2)

      for (let i = 0; i < canvas.width; i++) {
        const y = Math.sin((i + offset) * 0.05) * 20 + canvas.height / 2
        ctx.lineTo(i, y)
      }

      ctx.strokeStyle = '#3B82F6'
      ctx.lineWidth = 2
      ctx.stroke()

      offset += 1
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    socket.on('connect', () => {
      console.log('Connected to AI assistant backend')
      setError(null)
    })

    socket.on('ai_response', (data) => {
      setResponse(data.text)
    })

    socket.on('transcription', (data) => {
      console.log('Transcription:', data.text)
    })

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      setError("Error connecting to AI assistant. Please check the backend.")
    })

    return () => {
      cancelAnimationFrame(animationFrameId)
      socket.off('ai_response')
      socket.off('transcription')
      socket.off('connect_error')
      socket.disconnect()
    }
  }, [isActive])

  const toggleConversation = () => {
    if (isActive) {
      setIsActive(false)
      socket.emit('stop_conversation')
      socket.disconnect()
    } else {
      setIsActive(true)
      socket.connect()
      socket.emit('start_conversation')
    }
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4 relative overflow-hidden">
      <canvas ref={backgroundCanvasRef} className="absolute inset-0" />
      <Card className="w-full max-w-md relative z-10">
        <div className="absolute top-2 left-2">
          <Bot className="w-6 h-6 text-blue-500" />
        </div>
        <CardHeader className="space-y-2 p-6 pb-2">
          <CardTitle className="text-2xl font-bold text-center">AI Physician Assistant</CardTitle>
          <CardDescription className="text-center text-base">
            Your virtual medical consultation companion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 px-6 pt-2 pb-4">
          <div className="bg-blue-50 p-3 rounded-lg mx-auto max-w-[80%]">
            <h3 className="text-xs font-semibold text-blue-700 mb-2">What you will discuss:</h3>
            <ul className="space-y-1 text-xs">
              <li className="flex items-center space-x-2">
                <Stethoscope className="w-3 h-3 text-blue-500" />
                <span className="text-blue-700">Health concerns</span>
              </li>
              <li className="flex items-center space-x-2">
                <Pill className="w-3 h-3 text-blue-500" />
                <span className="text-blue-700">Medication info</span>
              </li>
              <li className="flex items-center space-x-2">
                <Clipboard className="w-3 h-3 text-blue-500" />
                <span className="text-blue-700">Medical procedures</span>
              </li>
              <li className="flex items-center space-x-2">
                <Activity className="w-3 h-3 text-blue-500" />
                <span className="text-blue-700">Wellness advice</span>
              </li>
            </ul>
          </div>
          {isActive && (
            <canvas 
              ref={canvasRef} 
              width={250} 
              height={40} 
              className="w-full bg-blue-100 rounded-md"
            />
          )}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 text-xs" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          {response && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-2 text-xs" role="alert">
              <p className="font-bold">AI Response</p>
              <p>{response}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center pt-2 pb-6">
          <Button
            onClick={toggleConversation}
            className={`${
              isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-semibold py-5 px-10 rounded-full flex items-center space-x-4 transition-colors duration-300 text-xl ${styles.throb}`}
          >
            {isActive ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            <span>{isActive ? 'Stop' : 'Start'} Assistant</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
