import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from 'react'

export default function EndScreen() {
  const [text, setText] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const fullText = "The Doctor Will Be Seeing You Shortly!"

  useEffect(() => {
    let index = 0
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(typingInterval)
        setIsTypingComplete(true)
      }
    }, 100) // Adjust typing speed here

    return () => clearInterval(typingInterval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
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
