import { useEffect, useRef } from 'react'

export default function BackgroundAnimation() {
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
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

    // Cleanup function
    return () => {
      // If needed, add any cleanup logic here
    }
  }, [])

  return <canvas ref={backgroundCanvasRef} className="absolute inset-0" />
}
