import React from "react"
import { TypeAnimation } from "react-type-animation"

interface TypewriterProps {
  text: string
  speed?: number
  className?: string
}

export function Typewriter({ 
  text, 
  speed = 50, 
  className = ""
}: TypewriterProps) {
  return (
    <TypeAnimation
      sequence={[text]}
      wrapper="span"
      speed={speed as any}
      style={{ 
        display: 'inline',
        whiteSpace: 'pre-wrap'
      }}
      className={className}
      cursor={false}
      repeat={0}
    />
  )
} 