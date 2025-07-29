"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loading } from "@/components/ui/loading"
import Header from "@/components/Header"
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle
} from "lucide-react"

interface Ticket {
  id: string
  title: string
  description: string
  category: string
  status: string
  email: string
  additionalInfo?: string
  summary?: string
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
}

export default function ManagePage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [ticketsPerPage] = useState(10)
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // Fetch tickets and categories on component mount
  useEffect(() => {
    fetchTickets()
    fetchCategories()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      if (response.ok) {
        const data = await response.json() as Ticket[]
        setTickets(data)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json() as Category[]
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setTickets(prev => prev.map(ticket => 
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        ))
      }
    } catch (error) {
      console.error('Error updating ticket status:', error)
    }
  }

  const deleteTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTickets(prev => prev.filter(ticket => ticket.id !== ticketId))
      }
    } catch (error) {
      console.error('Error deleting ticket:', error)
    }
  }

  const updateTicket = async (ticketData: Partial<Ticket>) => {
    if (!editingTicket) return

    try {
      const response = await fetch(`/api/tickets/${editingTicket.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      })

      if (response.ok) {
        setTickets(prev => prev.map(ticket => 
          ticket.id === editingTicket.id ? { ...ticket, ...ticketData } : ticket
        ))
        setShowEditModal(false)
        setEditingTicket(null)
      }
    } catch (error) {
      console.error('Error updating ticket:', error)
    }
  }

  // Filter tickets based on search term and category
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ticket.summary && ticket.summary.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All Categories" || ticket.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage)
  const startIndex = (currentPage - 1) * ticketsPerPage
  const endIndex = startIndex + ticketsPerPage
  const currentTickets = filteredTickets.slice(startIndex, endIndex)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'solved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-purple-100 text-purple-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
      'bg-orange-100 text-orange-800'
    ]
    const index = category.length % colors.length
    return colors[index]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loading size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading tickets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="manage" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-24">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Ticket Management</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage and track support tickets</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full sm:w-auto min-w-[200px] justify-between text-sm sm:text-base"
              >
                <span className="truncate">{selectedCategory}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSelectedCategory("All Categories")
                        setShowCategoryDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.name)
                          setShowCategoryDropdown(false)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {currentTickets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm sm:text-base">No tickets found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Desktop Table */}
                <table className="w-full hidden lg:table">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Title</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Summary</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{ticket.title}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {ticket.description}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-xs text-gray-600">
                          {ticket.email}
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`text-xs ${getCategoryColor(ticket.category)}`}>
                            {ticket.category}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </Badge>
                            {ticket.status === 'open' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateTicketStatus(ticket.id, 'solved')}
                                className="h-6 px-2 text-xs"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Solve
                              </Button>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs text-gray-600 max-w-xs">
                            {ticket.summary ? (
                              <div className="truncate" title={ticket.summary}>
                                {ticket.summary}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">No summary</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingTicket(ticket)
                                setShowEditModal(true)
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingTicket(ticket)
                                setShowEditModal(true)
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteTicket(ticket.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {currentTickets.map((ticket) => (
                    <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">{ticket.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {ticket.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingTicket(ticket)
                              setShowEditModal(true)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingTicket(ticket)
                              setShowEditModal(true)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteTicket(ticket.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Email:</span>
                          <span className="text-gray-700">{ticket.email}</span>
                        </div>
                        <Badge className={getCategoryColor(ticket.category)}>
                          {ticket.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                          {ticket.status === 'open' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateTicketStatus(ticket.id, 'solved')}
                              className="h-6 px-2 text-xs"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Solve
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {ticket.summary && (
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Summary:</span> {ticket.summary}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredTickets.length)} of {filteredTickets.length} tickets
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="text-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="text-xs"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit/View Modal */}
      {showEditModal && editingTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Edit Ticket</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowEditModal(false)
                  setEditingTicket(null)
                }}
                className="h-8 w-8 p-0"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input
                  value={editingTicket.title}
                  onChange={(e) => setEditingTicket({ ...editingTicket, title: e.target.value })}
                  className="text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingTicket.description}
                  onChange={(e) => setEditingTicket({ ...editingTicket, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingTicket.category}
                  onChange={(e) => setEditingTicket({ ...editingTicket, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editingTicket.status}
                  onChange={(e) => setEditingTicket({ ...editingTicket, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base"
                >
                  <option value="open">Open</option>
                  <option value="solved">Solved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  value={editingTicket.email}
                  onChange={(e) => setEditingTicket({ ...editingTicket, email: e.target.value })}
                  className="text-sm sm:text-base"
                />
              </div>

              {editingTicket.additionalInfo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                  <textarea
                    value={editingTicket.additionalInfo}
                    onChange={(e) => setEditingTicket({ ...editingTicket, additionalInfo: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[60px] sm:min-h-[80px] text-sm sm:text-base"
                  />
                </div>
              )}

              {editingTicket.summary && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                  <textarea
                    value={editingTicket.summary}
                    onChange={(e) => setEditingTicket({ ...editingTicket, summary: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[60px] sm:min-h-[80px] text-sm sm:text-base"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingTicket(null)
                  }}
                  className="w-full sm:w-auto text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updateTicket(editingTicket)}
                  className="w-full sm:w-auto text-sm"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 