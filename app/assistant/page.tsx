"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loading } from "@/components/ui/loading"
import { Typewriter } from "@/components/ui/typewriter"
import { Send, Paperclip } from "lucide-react"
import { formatTimestamp } from "../../lib/utils"
import Header from "@/components/Header"

interface ChatMessage {
  id: string
  type: "assistant" | "user"
  content: string
  timestamp: Date
}

interface TicketData {
  title: string
  category: string
  description: string
  email: string
  additionalInfo?: string
  summary?: string
}

const CATEGORIES = [
  "Login Help",
  "Connection", 
  "App Crash",
  "Printing",
  "Setup Help",
  "Audio Issue",
  "Bug Report",
  "Slow Speed",
  "Upload Fail",
  "Display Bug"
]

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I'm your support assistant. I'll help you create a ticket so our team can get back to you quickly. Let's get started — what's the **title of your issue**?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [ticketData, setTicketData] = useState<TicketData>({
    title: "",
    category: "",
    description: "",
    email: ""
  })
  const [showButtons, setShowButtons] = useState(false)
  const [buttons, setButtons] = useState<string[]>([])
  const [typingMessages, setTypingMessages] = useState<Set<string>>(new Set())

  // Debug button state
  useEffect(() => {
    console.log('Button state changed:', { showButtons, buttons, buttonsLength: buttons.length })
  }, [showButtons, buttons])

  const handleSendMessage = async (messageText?: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
    }
    const messageToSend = messageText || inputMessage.trim()
    if (!messageToSend || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: messageToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    if (!messageText) {
      setInputMessage("")
    }
    // Hide buttons when sending any message
    setShowButtons(false)
    setButtons([])
    setIsLoading(true)

    try {
      console.log('Sending to API:', {
        message: messageToSend,
        ticketData,
        messagesCount: messages.length
      })
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          conversationHistory: messages,
          ticketData
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json() as {
        message: string
        ticketData?: Partial<TicketData>
        showButtons?: boolean
        buttons?: string[]
        reset?: boolean
      }
      
      console.log('Received from API:', data)
      
      // Handle reset
      if (data.reset) {
        setMessages([{
          id: "1",
          type: "assistant",
          content: data.message,
          timestamp: new Date()
        }])
        setTicketData({
          title: "",
          category: "",
          description: "",
          email: ""
        })
        setShowButtons(false)
        setButtons([])
        return
      }
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Update ticket data if provided
      if (data.ticketData) {
        setTicketData(prev => ({ ...prev, ...data.ticketData }))
      }
      
      // Update buttons state - only show buttons if explicitly requested
      setShowButtons(data.showButtons === true)
      setButtons(data.buttons || [])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I'm having trouble processing your request. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleButtonClick = (buttonText: string) => {
    // Hide buttons immediately when clicked
    setShowButtons(false)
    setButtons([])
    handleSendMessage(buttonText)
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="assistant" />
      <div className="flex h-screen pt-16">
        {/* Left Column - Ticket Preview */}
        <div className="w-[30%] bg-gray-900 p-6 overflow-y-auto">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Ticket Preview</h2>
            
            {/* Title */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <h3 className="text-white font-semibold">Title</h3>
                {isLoading && <Loading size="sm" className="ml-2 text-purple-400" />}
              </div>
              <Input
                placeholder="Title will appear here..."
                value={ticketData.title}
                readOnly
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">Related Categories</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    variant={ticketData.category === category ? "default" : "secondary"}
                    className={`${
                      ticketData.category === category 
                        ? "bg-purple-600 text-white" 
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <h3 className="text-white font-semibold">Description</h3>
                {isLoading && <Loading size="sm" className="ml-2 text-purple-400" />}
              </div>
              <Textarea
                placeholder="Description will appear here based on the selected title and category..."
                value={ticketData.description}
                readOnly
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[100px]"
              />
            </div>

            {/* Summary */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <h3 className="text-white font-semibold">Summary</h3>
                {isLoading && <Loading size="sm" className="ml-2 text-purple-400" />}
              </div>
              <Textarea
                placeholder="Summary will be generated here..."
                value={ticketData.summary || ""}
                readOnly
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[200px]"
              />
            </div>

            {/* Additional Information */}
            {ticketData.additionalInfo && (
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <h3 className="text-white font-semibold">Additional Information</h3>
                </div>
                <Textarea
                  placeholder="Additional information will appear here..."
                  value={ticketData.additionalInfo}
                  readOnly
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[60px]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Chat Interface */}
        <div className="w-[70%] bg-white flex flex-col">
          {/* Chat Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                  <p className="text-sm text-gray-500">
                    {isLoading ? "Processing..." : "Ready to help"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.type === "assistant" ? (
                    <Typewriter 
                      text={message.content} 
                      speed={100}
                      className="text-sm whitespace-pre-wrap"
                    />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <Loading size="sm" className="text-gray-600" />
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            {showButtons && buttons.length > 0 && (
              <div className="flex justify-end flex-wrap gap-2">
                {buttons.map((buttonText, index) => (
                  <button
                    key={index}
                    onClick={() => handleButtonClick(buttonText)}
                    className="px-3 py-1.5 text-xs font-medium text-purple-600 bg-white border border-purple-600 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {buttonText}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <Input
                placeholder={isLoading ? "Processing..." : "Type your message..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="min-w-[40px]"
              >
                {isLoading ? (
                  <Loading size="sm" className="text-white" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 