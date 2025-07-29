import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface TicketRequest {
  title: string
  category: string
  description: string
  email: string
  additionalInfo?: string
  summary?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as TicketRequest
    
    // Validate required fields
    if (!body.title || !body.category || !body.description || !body.email) {
      console.error('Missing required fields:', { title: !!body.title, category: !!body.category, description: !!body.description, email: !!body.email })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const ticket = await prisma.ticket.create({
      data: {
        title: body.title,
        category: body.category,
        description: body.description,
        email: body.email,
        additionalInfo: body.additionalInfo,
        summary: body.summary,
        status: 'open'
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      ticketId: ticket.id 
    })
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json(
      { error: 'Failed to create ticket', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
} 