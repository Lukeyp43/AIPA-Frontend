import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false })

export default function EndScreen() {
  const [text, setText] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })
  const fullText = "The Doctor Will Be Seeing You Shortly!"

  useEffect(() => {
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight })

    let index = 0
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(typingInterval)
        setIsTypingComplete(true)
        setTimeout(() => setShowConfetti(true), 1000) // Start confetti after 1 second
      }
    }, 100) // Adjust typing speed here

    return () => clearInterval(typingInterval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      {showConfetti && (
        <ReactConfetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <Card className="w-full max-w-md relative">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <h1 className={`text-3xl font-bold text-center text-blue-600 mb-4 ${isTypingComplete ? 'typed-text' : ''}`}>
            {text}
          </h1>
          <p className="text-center text-gray-600 mt-4">
            Thank you for using our AI Physician Assistant. A human doctor will review your consultation and contact you soon.
          </p>
        </CardContent>
      </Card>
      <style jsx>{`
        @keyframes underline {
          from { width: 0; }
          to { width: 100%; }
        }
        .typed-text {
          position: relative;
        }
        .typed-text::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -4px;
          height: 2px;
          width: 0;
          background-color: #2563EB;
          animation: underline 1s ease-in-out forwards;
        }
      `}</style>
    </div>
  )
}
