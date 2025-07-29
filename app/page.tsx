import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"

export const metadata: Metadata = {
  title: "N3XA Support Agent",
  description: "AI-powered customer support application",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    url: "https://n3xa-support.vercel.app/",
    images: [
      {
        width: 1200,
        height: 630,
        url: "https://n3xa-support.vercel.app/og-image.png",
      },
    ],
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-600 flex flex-col">
      <Header currentPage="home" />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-white">AI Support</span>
            <span className="text-purple-200"> Agent</span>
          </h1>
          
          {/* Sub-headline */}
          <p className="text-xl md:text-2xl text-purple-200 mb-12 max-w-3xl mx-auto">
            Intelligent customer support powered by AI
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* Manage Tickets Button */}
            <div className="flex flex-col items-center">
                                 <Link href="/manage">
                <Button 
                  size="lg" 
                  className="bg-purple-800 hover:bg-purple-700 text-white border border-purple-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                >
                  Manage Tickets
                  <svg 
                    className="ml-2 w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </Button>
              </Link>
              <p className="text-purple-200 text-sm mt-2 max-w-xs">
                Access and manage support tickets created by users
              </p>
            </div>

            {/* Create Ticket Button */}
            <div className="flex flex-col items-center">
              <Link href="/assistant">
                <Button 
                  size="lg" 
                  className="bg-purple-800 hover:bg-purple-700 text-white border border-purple-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                >
                  Create Ticket
                  <svg 
                    className="ml-2 w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </Button>
              </Link>
              <p className="text-purple-200 text-sm mt-2 max-w-xs">
                Start a conversation with our AI assistant to create a support ticket
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
