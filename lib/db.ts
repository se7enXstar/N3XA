// Simple in-memory database for now
// Later this will be replaced with Prisma

export interface Ticket {
  id: string
  title: string
  description: string
  category: string
  status: string
  userName?: string
  email: string
  additionalInfo?: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// In-memory storage
let tickets: Ticket[] = []
let categories: Category[] = [
  { id: "1", name: "Login Help", createdAt: new Date(), updatedAt: new Date() },
  { id: "2", name: "Connection", createdAt: new Date(), updatedAt: new Date() },
  { id: "3", name: "App Crash", createdAt: new Date(), updatedAt: new Date() },
  { id: "4", name: "Printing", createdAt: new Date(), updatedAt: new Date() },
  { id: "5", name: "Setup Help", createdAt: new Date(), updatedAt: new Date() },
  { id: "6", name: "Audio Issue", createdAt: new Date(), updatedAt: new Date() },
  { id: "7", name: "Bug Report", createdAt: new Date(), updatedAt: new Date() },
  { id: "8", name: "Slow Speed", createdAt: new Date(), updatedAt: new Date() },
  { id: "9", name: "Upload Fail", createdAt: new Date(), updatedAt: new Date() },
  { id: "10", name: "Display Bug", createdAt: new Date(), updatedAt: new Date() }
]

export const db = {
  // Ticket operations
  createTicket: (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Ticket => {
    const ticket: Ticket = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    tickets.push(ticket)
    return ticket
  },

  getTickets: (): Ticket[] => {
    return [...tickets]
  },

  getTicket: (id: string): Ticket | null => {
    const ticket = tickets.find(ticket => ticket.id === id)
    return ticket || null
  },

  updateTicket: (id: string, data: Partial<Omit<Ticket, 'id' | 'createdAt'>>): Ticket | null => {
    const index = tickets.findIndex(ticket => ticket.id === id)
    if (index === -1) return null
    
    const currentTicket = tickets[index]!
    const updatedTicket: Ticket = {
      id: currentTicket.id,
      title: data.title ?? currentTicket.title,
      description: data.description ?? currentTicket.description,
      category: data.category ?? currentTicket.category,
      status: data.status ?? currentTicket.status,
      userName: data.userName ?? currentTicket.userName,
      email: data.email ?? currentTicket.email,
      additionalInfo: data.additionalInfo ?? currentTicket.additionalInfo,
      createdAt: currentTicket.createdAt,
      updatedAt: new Date()
    }
    tickets[index] = updatedTicket
    return updatedTicket
  },

  deleteTicket: (id: string): boolean => {
    const index = tickets.findIndex(ticket => ticket.id === id)
    if (index === -1) return false
    
    tickets.splice(index, 1)
    return true
  },

  // Category operations
  getCategories: (): Category[] => {
    return [...categories]
  },

  getCategory: (id: string): Category | null => {
    return categories.find(category => category.id === id) || null
  },

  getCategoryByName: (name: string): Category | null => {
    return categories.find(category => category.name === name) || null
  }
} 