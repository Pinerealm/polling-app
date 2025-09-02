"use client"

import { useState, useEffect } from "react"
import { PollCard } from "@/components/polls/poll-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Poll } from "@/types"
import { Plus, Search, Filter } from "lucide-react"

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">All Polls</h1>
            <Button asChild>
              <a href="/polls/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Poll
              </a>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No polls found</h3>
            <p className="text-gray-700">
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
