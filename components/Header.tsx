"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, MessageSquare } from "lucide-react"

interface HeaderProps {
  currentPage?: "home" | "assistant" | "manage"
}

export default function Header({ currentPage = "home" }: HeaderProps) {
  const isHomePage = currentPage === "home"
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm ${isHomePage ? 'bg-purple-950/50 border-b border-purple-800/30' : 'bg-white/95 shadow-sm border-b border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className={`text-2xl font-bold ${isHomePage ? 'text-white' : 'text-purple-600'}`}>
              N3XA SUPPORT
            </Link>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/manage">
              <Button
                variant={currentPage === "manage" ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${isHomePage ? 'text-white border-white hover:bg-white hover:text-purple-600' : ''}`}
              >
                <Settings className="w-4 h-4" />
                Manage Tickets
              </Button>
            </Link>
            <Link href="/assistant">
              <Button
                variant={currentPage === "assistant" ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${isHomePage ? 'text-white border-white hover:bg-white hover:text-purple-600' : ''}`}
              >
                <MessageSquare className="w-4 h-4" />
                Create Ticket
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
} 