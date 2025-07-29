import { NextRequest, NextResponse } from 'next/server'

interface ChatRequest {
  message: string
  conversationHistory: Array<{
    id: string
    type: "assistant" | "user"
    content: string
    timestamp: Date
  }>
  ticketData: {
    title: string
    category: string
    description: string
    email: string
    additionalInfo?: string
  }
}

interface ChatResponse {
  message: string
  ticketData?: Partial<{
    title: string
    category: string
    description: string
    email: string
    additionalInfo?: string
    summary?: string
  }>
  showButtons?: boolean
  buttons?: string[]
  reset?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ChatRequest
    
    // Get the base URL for internal API calls
    const baseUrl = request.nextUrl.origin

    const { message, conversationHistory, ticketData } = body

    // Check if user wants to restart
    if (message.toLowerCase().trim() === "start") {
      return NextResponse.json({
        message: "Hello! I'm your support assistant. I'll help you create a ticket so our team can get back to you quickly.\n\nLet's get started — what's the **title of your issue**?",
        reset: true
      })
    }

    // Get conversation state
    const userMessages = conversationHistory.filter(m => m.type === "user")
    const assistantMessages = conversationHistory.filter(m => m.type === "assistant")
    const isFirstUserMessage = userMessages.length === 1
    const lastAssistantMessage = assistantMessages[assistantMessages.length - 1]

    console.log('API Debug:', {
      message,
      userMessagesCount: userMessages.length,
      assistantMessagesCount: assistantMessages.length,
      isFirstUserMessage,
      lastAssistantMessageContent: lastAssistantMessage?.content?.substring(0, 100),
      ticketData
    })

    let response: ChatResponse = {
      message: "",
      ticketData: {},
      showButtons: false,
      buttons: []
    }

    console.log('=== API CALL START ===')
    console.log('Processing message:', message)
    console.log('Last assistant message:', lastAssistantMessage?.content)
    console.log('Ticket data:', ticketData)
    console.log('=== API CALL END ===')

    // Handle "No" response first - this should catch all "No" responses
    console.log('Checking "No" condition:', message.toLowerCase() === "no", 'Has email:', !!ticketData.email, 'Email is not "No":', ticketData.email !== "No", 'Actual email:', ticketData.email)
    if (message.toLowerCase() === "no" && ticketData.email && ticketData.email !== "No") {
      console.log('Handling "No" response with email:', ticketData.email)
      console.log('Saving ticket data:', ticketData)
      
      try {
        const saveResponse = await fetch(`${baseUrl}/api/tickets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ticketData),
        })

        if (!saveResponse.ok) {
          const errorData = await saveResponse.text()
          console.error('Failed to save ticket:', saveResponse.status, errorData)
          throw new Error(`Failed to save ticket: ${saveResponse.status}`)
        }

        const saveResult = await saveResponse.json()
        console.log('Ticket saved successfully:', saveResult)

        response = {
          message: `✅ Got it — your support ticket has been submitted!\nA technician will contact you at **${ticketData.email}** soon.\n\nNeed anything else? Type **"start"** to open a new ticket.`,
          showButtons: false,
          buttons: []
        }
      } catch (error) {
        console.error('Error saving ticket:', error)
        response = {
          message: `❌ Sorry, there was an error saving your ticket. Please try again or contact support.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
          showButtons: false,
          buttons: []
        }
      }
    } else if (message.toLowerCase() === "yes" && ticketData.email && ticketData.email !== "No") {
      console.log('Handling "Yes" response')
      response = {
        message: "Sure — please provide the information you'd like to add.",
        showButtons: false
      }
    } else if (lastAssistantMessage?.content.includes("category")) {
      // User provided category (either typed or clicked button)
      const availableCategories = [
        "Login Help", "Connection", "App Crash", "Printing", "Setup Help",
        "Audio Issue", "Bug Report", "Slow Speed", "Upload Fail", "Display Bug"
      ]
      const userCategory = message.trim()
      const matchedCategory = availableCategories.find(cat =>
        cat.toLowerCase() === userCategory.toLowerCase() ||
        cat.toLowerCase().includes(userCategory.toLowerCase()) ||
        userCategory.toLowerCase().includes(cat.toLowerCase())
      )

      if (matchedCategory) {
        response = {
          message: "Thanks. Could you please **describe the issue in more detail**?\nInclude any steps you've already tried.",
          ticketData: { category: matchedCategory },
          showButtons: false
        }
      } else {
        response = {
          message: "I didn't recognize that category. Please select a category:",
          showButtons: true,
          buttons: [
            "Login Help", "Connection", "App Crash", "Printing", "Setup Help",
            "Audio Issue", "Bug Report", "Slow Speed", "Upload Fail", "Display Bug"
          ]
        }
      }
    } else if (lastAssistantMessage?.content.includes("describe")) {
      // User provided description
      response = {
        message: "Got it. What is your **email address** so we can contact you?",
        ticketData: { description: message },
        showButtons: false
      }
    } else if (lastAssistantMessage?.content.includes("email") && message.toLowerCase() !== "yes" && message.toLowerCase() !== "no") {
      // User provided email - generate summary via Python backend
      const email = message.trim()

      try {
        // Call Python backend to generate summary
        const summaryResponse = await fetch('http://localhost:8000/generate-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: ticketData.title,
            category: ticketData.category,
            description: ticketData.description,
            email: email
          }),
        })

        let summary = "User has provided issue details and contact information."
        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json() as { summary: string }
          summary = summaryData.summary
        }

        const ticketSummary = `**Title**: ${ticketData.title}\n**Category**: ${ticketData.category}\n**Description**: ${ticketData.description}\n**Email**: ${email}\n**Summary**: _${summary}_`

        console.log('Setting email in ticketData:', email)
        console.log('Sending response with buttons:', { showButtons: true, buttons: ["Yes", "No"] })
        response = {
          message: `Perfect — we'll contact you at **${email}**.\n\nHere's a summary of your ticket so far:\n${ticketSummary}\n\nIs there **any information you'd like to add** before we submit this ticket?`,
          ticketData: { email, summary },
          showButtons: true,
          buttons: ["Yes", "No"]
        }
      } catch (error) {
        console.error('Error generating summary:', error)
        // Fallback without AI summary
        const ticketSummary = `**Title**: ${ticketData.title}\n**Category**: ${ticketData.category}\n**Description**: ${ticketData.description}\n**Email**: ${email}`

        response = {
          message: `Perfect — we'll contact you at **${email}**.\n\nHere's a summary of your ticket so far:\n${ticketSummary}\n\nIs there **any information you'd like to add** before we submit this ticket?`,
          ticketData: { email },
          showButtons: true,
          buttons: ["Yes", "No"]
        }
      }
    } else if ((lastAssistantMessage?.content.includes("add") || lastAssistantMessage?.content.includes("information") || lastAssistantMessage?.content.includes("submit") || lastAssistantMessage?.content.includes("summary")) && (message.toLowerCase() === "yes" || message.toLowerCase() === "no")) {
      // User clicked Yes/No buttons - this should not be reached since we handle Yes/No at the top
      console.log('Processing Yes/No button click. Message:', message, 'TicketData:', ticketData, 'LastAssistantMessage:', lastAssistantMessage?.content)
      if (message.toLowerCase() === "no") {
        console.log('Saving ticket with data:', ticketData)
        
        try {
          // Save ticket to database
          const saveResponse = await fetch(`${baseUrl}/api/tickets`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticketData),
          })

          if (!saveResponse.ok) {
            const errorData = await saveResponse.text()
            console.error('Failed to save ticket:', saveResponse.status, errorData)
            throw new Error(`Failed to save ticket: ${saveResponse.status}`)
          }

          const saveResult = await saveResponse.json()
          console.log('Ticket saved successfully:', saveResult)

          response = {
            message: `✅ Got it — your support ticket has been submitted!\nA technician will contact you at **${ticketData.email}** soon.\n\nNeed anything else? Type **"start"** to open a new ticket.`,
            showButtons: false,
            buttons: []
          }
        } catch (error) {
          console.error('Error saving ticket:', error)
          response = {
            message: `❌ Sorry, there was an error saving your ticket. Please try again or contact support.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
            showButtons: false
          }
        }
      } else {
        response = {
          message: "Sure — please provide the information you'd like to add.",
          showButtons: false
        }
      }
        } else if (lastAssistantMessage?.content.includes("provide")) {
      // User provided additional info - update description and generate new summary
      const updatedDescription = `${ticketData.description}\n\nAdditional Information: ${message}`
      const updatedTicketData = { ...ticketData, description: updatedDescription, additionalInfo: message }
      
      try {
        // Generate new summary with updated description
        const summaryResponse = await fetch('http://localhost:8000/generate-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: ticketData.title,
            category: ticketData.category,
            description: updatedDescription,
            email: ticketData.email
          }),
        })
        
        let newSummary = "Updated summary based on additional information provided."
        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json() as { summary: string }
          newSummary = summaryData.summary
        }
        
        const updatedTicketSummary = `**Title**: ${ticketData.title}\n**Category**: ${ticketData.category}\n**Description**: ${updatedDescription}\n**Email**: ${ticketData.email}\n**Updated Summary**: _${newSummary}_`
        
        // Save ticket to database
        try {
          const saveResponse = await fetch(`${baseUrl}/api/tickets`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTicketData),
          })

          if (!saveResponse.ok) {
            const errorData = await saveResponse.text()
            console.error('Failed to save ticket:', saveResponse.status, errorData)
            throw new Error(`Failed to save ticket: ${saveResponse.status}`)
          }

          const saveResult = await saveResponse.json()
          console.log('Ticket saved successfully:', saveResult)
          
          response = {
            message: `✅ Thanks for the additional information.\n\nHere's your updated ticket summary:\n${updatedTicketSummary}\n\nYour support ticket has been submitted!\nWe'll be in touch at **${ticketData.email}** as soon as possible.\n\nYou can type **"start"** to open a new ticket anytime.`,
            ticketData: { description: updatedDescription, additionalInfo: message, summary: newSummary },
            showButtons: false,
            buttons: []
          }
        } catch (error) {
          console.error('Error saving ticket:', error)
          response = {
            message: `❌ Sorry, there was an error saving your ticket. Please try again or contact support.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
            showButtons: false,
            buttons: []
          }
        }
      } catch (error) {
        console.error('Error generating updated summary:', error)
        // Fallback without AI summary
        const updatedTicketSummary = `**Title**: ${ticketData.title}\n**Category**: ${ticketData.category}\n**Description**: ${updatedDescription}\n**Email**: ${ticketData.email}`
        
        // Save ticket to database
        const saveResponse = await fetch(`${baseUrl}/api/tickets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTicketData),
        })
        
        response = {
          message: `✅ Thanks for the additional information.\n\nHere's your updated ticket summary:\n${updatedTicketSummary}\n\nYour support ticket has been submitted!\nWe'll be in touch at **${ticketData.email}** as soon as possible.\n\nYou can type **"start"** to open a new ticket anytime.`,
          ticketData: { description: updatedDescription, additionalInfo: message },
          showButtons: false,
          buttons: []
        }
      }
    }

    // Ensure we always have a response
    if (!response.message) {
      console.log('No matching condition found. Message:', message, 'LastAssistantMessage:', lastAssistantMessage?.content)
      // Only show category selection if this is actually a new title input
      if (isFirstUserMessage || (!lastAssistantMessage?.content.includes("category") && !lastAssistantMessage?.content.includes("add") && !lastAssistantMessage?.content.includes("information") && !lastAssistantMessage?.content.includes("describe") && !lastAssistantMessage?.content.includes("email"))) {
        console.log('Handling first user message as title:', message)
        response = {
          message: "Got it. What **category** does this issue fall under?\n\nPlease select a category:",
          ticketData: { title: message },
          showButtons: true,
          buttons: [
            "Login Help", "Connection", "App Crash", "Printing", "Setup Help",
            "Audio Issue", "Bug Report", "Slow Speed", "Upload Fail", "Display Bug"
          ]
        }
      } else {
        // If we have ticket data but no matching condition, show an error
        response = {
          message: "I'm having trouble processing your request. Please try again or type 'start' to begin a new ticket.",
          showButtons: false,
          buttons: []
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 