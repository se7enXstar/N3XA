"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Settings, MessageSquare, Menu, X } from "lucide-react"

interface HeaderProps {
  currentPage?: "home" | "assistant" | "manage"
}

export default function Header({ currentPage = "home" }: HeaderProps) {
  const isHomePage = currentPage === "home"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm ${isHomePage ? 'bg-purple-950/50 border-b border-purple-800/30' : 'bg-white/95 shadow-sm border-b border-gray-200'}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.svg" 
              alt="N3XA Support Logo" 
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <Link href="/" className={`text-xl sm:text-2xl font-bold ${isHomePage ? 'text-white' : 'text-purple-600'}`}>
              N3XA SUPPORT
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${isHomePage ? 'text-white hover:bg-white/20' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-b border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <Link href="/manage" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant={currentPage === "manage" ? "default" : "outline"}
                  className="w-full justify-start"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Tickets
                </Button>
              </Link>
              <Link href="/assistant" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant={currentPage === "assistant" ? "default" : "outline"}
                  className="w-full justify-start"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Create Ticket
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 