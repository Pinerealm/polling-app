"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Poll } from "@/types"
import { BarChart3, Users, TrendingUp, Plus, Eye, Edit, Trash2 } from "lucide-react"

// Mock data for demonstration
const mockUserPolls: Poll[] = [
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
  }
]

export default function DashboardPage() {
  const [userPolls, setUserPolls] = useState<Poll[]>(mockUserPolls)
  const [totalVotes, setTotalVotes] = useState(0)
  const [activePolls, setActivePolls] = useState(0)

  useEffect(() => {
    // Calculate stats
    const votes = userPolls.reduce((sum, poll) => 
      sum + poll.options.reduce((pollSum, option) => pollSum + option.votes, 0), 0
    )
    const active = userPolls.filter(poll => poll.isActive).length
    
    setTotalVotes(votes)
    setActivePolls(active)
  }, [userPolls])

  const handleViewPoll = (pollId: string) => {
    // TODO: Navigate to poll detail page
    console.log("Viewing poll:", pollId)
  }

  const handleEditPoll = (pollId: string) => {
    // TODO: Navigate to poll edit page
    console.log("Editing poll:", pollId)
  }

  const handleDeletePoll = (pollId: string) => {
    // TODO: Implement delete confirmation and logic
    console.log("Deleting poll:", pollId)
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back! Here's an overview of your polling activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Total Polls</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{userPolls.length}</div>
              <p className="text-xs text-muted-foreground">
                Created by you
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Total Votes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{totalVotes}</div>
              <p className="text-xs text-muted-foreground">
                Across all your polls
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Active Polls</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{activePolls}</div>
              <p className="text-xs text-muted-foreground">
                Currently running
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
              <CardDescription className="text-muted-foreground">
                Create a new poll or manage your existing ones
              </CardDescription>
            </CardHeader>
            <CardContent className="flex space-x-4">
              <Button asChild>
                <a href="/polls/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Poll
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/polls">Browse All Polls</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* User's Polls */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Your Polls</h2>
            <Button variant="outline" size="sm" asChild>
              <a href="/polls">View All</a>
            </Button>
          </div>

          {userPolls.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">No polls yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first poll to start engaging with your community
                </p>
                <Button asChild>
                  <a href="/polls/create">Create Your First Poll</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPolls.map((poll) => (
                <Card key={poll.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-card-foreground">{poll.title}</CardTitle>
                    {poll.description && (
                      <CardDescription className="line-clamp-2 text-muted-foreground">
                        {poll.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Total votes:</span>
                        <span className="font-medium text-card-foreground">
                          {poll.options.reduce((sum, option) => sum + option.votes, 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          poll.isActive 
                            ? 'status-active' 
                            : 'status-inactive'
                        }`}>
                          {poll.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewPoll(poll.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditPoll(poll.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeletePoll(poll.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
