"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PollCard } from "@/components/polls/poll-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Poll } from "@/types"
import { Plus, Search, Filter, CheckCircle } from "lucide-react"
import { PageHeader } from "@/components/navigation/page-header"

// Mock data for demonstration
const mockPolls: Poll[] = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Let's see what the community prefers for their next project",
    options: [
      { id: "1-1", text: "JavaScript/TypeScript", votes: 45, pollId: "1" },
      { id: "1-2", text: "Python", votes: 32, pollId: "1" },
      { id: "1-3", text: "Rust", votes: 18, pollId: "1" },
      { id: "1-4", text: "Go", votes: 12, pollId: "1" }
    ],
    createdBy: "user1",
    isActive: true,
    allowMultipleVotes: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "2",
    title: "Which framework should we use for the new project?",
    description: "Help us decide on the tech stack",
    options: [
      { id: "2-1", text: "Next.js", votes: 28, pollId: "2" },
      { id: "2-2", text: "React", votes: 22, pollId: "2" },
      { id: "2-3", text: "Vue.js", votes: 15, pollId: "2" }
    ],
    createdBy: "user2",
    isActive: true,
    allowMultipleVotes: true,
    expiresAt: new Date("2024-02-15"),
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10")
  }
]

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>(mockPolls)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterActive, setFilterActive] = useState(true)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const searchParams = useSearchParams()

  // Check for success message on component mount
  useEffect(() => {
    if (searchParams.get('created') === 'true') {
      setShowSuccessMessage(true)
      // Remove the query parameter from URL without page reload
      const url = new URL(window.location.href)
      url.searchParams.delete('created')
      window.history.replaceState({}, '', url.toString())
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)
    }
  }, [searchParams])

  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (poll.description && poll.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterActive ? poll.isActive : true
    return matchesSearch && matchesFilter
  })

  const handleVote = (pollId: string) => {
    // TODO: Implement voting logic
    console.log("Voting on poll:", pollId)
  }

  const handleView = (pollId: string) => {
    // TODO: Navigate to poll detail page
    console.log("Viewing poll:", pollId)
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <PageHeader 
            title="All Polls"
            description="Browse and vote on polls created by the community"
            backHref="/dashboard"
            backLabel="Back to Dashboard"
          />
          
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Poll created successfully!</p>
                <p className="text-sm text-green-600">Your poll is now live and ready for votes.</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-6">
            <Button asChild>
              <a href="/polls/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Poll
              </a>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search polls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={filterActive ? "default" : "outline"}
              onClick={() => setFilterActive(!filterActive)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>{filterActive ? "Active Only" : "All Polls"}</span>
            </Button>
          </div>
        </div>
        
        {filteredPolls.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">No polls found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "Be the first to create a poll!"}
            </p>
            {!searchTerm && (
              <Button asChild className="mt-4">
                <a href="/polls/create">Create Your First Poll</a>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                onVote={handleVote}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
