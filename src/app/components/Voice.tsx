'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import io from 'socket.io-client'

// Replace with the IP address and port of your AI assistant backend
const BACKEND_URL = 'http://localhost:5001'  // Changed to connect to your backend on port 5001
const socket = io(BACKEND_URL)

export default function VoiceAssistant() {
  const [isActive, setIsActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [response, setResponse] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
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

      ctx.strokeStyle = 'rgb(167, 139, 250)' // Tailwind's purple-400
      ctx.lineWidth = 3
      ctx.stroke()

      offset += 1
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    // Socket event listeners
    socket.on('connect', () => {
      console.log('Connected to AI assistant backend')
    })

    socket.on('ai_response', (data) => {
      setResponse(data.text)
    })

    socket.on('listening_status', (status) => {
      setIsListening(status.isListening)
    })

    socket.on('transcription', (data) => {
      console.log('Transcription:', data.text)
    })

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      setResponse("Error connecting to AI assistant. Please check the backend.")
    })

    return () => {
      cancelAnimationFrame(animationFrameId)
      socket.off('ai_response')
      socket.off('listening_status')
      socket.off('transcription')
      socket.off('connect_error')
      socket.disconnect()
    }
  }, [isActive])

  const startConversation = () => {
    setIsActive(true)
    socket.connect()
    socket.emit('start_conversation')
  }

  const stopConversation = () => {
    setIsActive(false)
    socket.emit('stop_conversation')
    socket.disconnect()
  }

  const toggleListening = () => {
    socket.emit('toggle_listening', { isListening: !isListening })
  }

  if (!isActive) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 to-pink-500">
        <Button
          onClick={startConversation}
          className="text-3xl font-bold py-10 px-16 rounded-full bg-white text-purple-600 hover:bg-purple-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Start Voice Assistant
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-purple-600">Voice Assistant</h1>
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={100} 
          className="w-full mb-6"
        />
        <Button
          onClick={toggleListening}
          className="w-full py-4 text-lg font-semibold bg-purple-500 hover:bg-purple-600 text-white transition-all duration-300 mb-4"
        >
          {isListening ? "Stop Listening" : "Start Listening"}
        </Button>
        {response && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p className="text-gray-800">{response}</p>
          </div>
        )}
        <Button
          onClick={stopConversation}
          className="w-full py-4 text-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-all duration-300 mt-4"
        >
          Stop Voice Assistant
        </Button>
      </div>
    </div>
  )
}
