import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    // During build or when no database URL, return empty array
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === 'production') {
      return NextResponse.json([])
    }
    
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Always return empty array on error to prevent build failures
    return NextResponse.json([])
  }
} 