import React from "react"

interface LoadingProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Loading({ className = "", size = "md" }: LoadingProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3", 
    lg: "w-4 h-4"
  }

  return (
    <div className={`flex space-x-1 ${className}`}>
      <div 
        className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`}
        style={{ animationDelay: "0ms" }}
      />
      <div 
        className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`}
        style={{ animationDelay: "150ms" }}
      />
      <div 
        className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`}
        style={{ animationDelay: "300ms" }}
      />
    </div>
  )
} 