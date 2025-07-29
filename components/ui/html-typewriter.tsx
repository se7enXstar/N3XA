import React, { useState, useEffect } from "react"

interface HTMLTypewriterProps {
  html: string
  speed?: number
  className?: string
}

export function HTMLTypewriter({ 
  html, 
  speed = 100, 
  className = ""
}: HTMLTypewriterProps) {
  const [displayedHTML, setDisplayedHTML] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Convert HTML to plain text for character counting
  const plainText = html.replace(/<[^>]*>/g, '')
  
  useEffect(() => {
    if (currentIndex < plainText.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
      }, speed)
      
      return () => clearTimeout(timer)
    }
  }, [currentIndex, speed, plainText.length])
  
  useEffect(() => {
    // Reconstruct HTML with the current character count
    let charCount = 0
    let result = ""
    let inTag = false
    let tagBuffer = ""
    
    for (let i = 0; i < html.length; i++) {
      const char = html[i]
      
      if (char === '<') {
        inTag = true
        tagBuffer = char
      } else if (char === '>') {
        inTag = false
        tagBuffer += char
        result += tagBuffer
        tagBuffer = ""
      } else if (inTag) {
        tagBuffer += char
      } else {
        if (charCount < currentIndex) {
          result += char
          charCount++
        } else {
          break
        }
      }
    }
    
    setDisplayedHTML(result)
  }, [currentIndex, html])
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: displayedHTML }}
    />
  )
} 