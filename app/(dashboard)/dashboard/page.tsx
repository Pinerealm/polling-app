import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, TrendingUp, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PollActions } from "@/components/polls/poll-actions"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Please sign in to view your dashboard</h1>
          </div>
        </div>
      </div>
    )
  }

  // Fetch user's polls with options and vote counts
  const { data: userPolls, error: pollsError } = await supabase
    .from("polls")
    .select(`
      *,
      poll_options (*)
    `)
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })

  if (pollsError) {
    console.error("Error fetching user polls:", pollsError)
  }

  // Get vote counts for each poll
  const pollsWithVotes = await Promise.all(
    (userPolls || []).map(async (poll) => {
      const { data: votes } = await supabase
        .from("votes")
        .select("option_id")
        .eq("poll_id", poll.id)

      const voteCounts = votes?.reduce((acc, vote) => {
        acc[vote.option_id] = (acc[vote.option_id] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0)
      const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date()
      const isActive = poll.status === 'active' && !isExpired

      return {
        ...poll,
        totalVotes,
        isActive,
        voteCounts
      }
    })
  )

  // Calculate stats
  const totalVotes = pollsWithVotes.reduce((sum, poll) => sum + poll.totalVotes, 0)
  const activePolls = pollsWithVotes.filter(poll => poll.isActive).length

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
              <div className="text-2xl font-bold text-card-foreground">{pollsWithVotes.length}</div>
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
                <Link href="/polls/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Poll
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/polls">Browse All Polls</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* User's Polls */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Your Polls</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/polls">View All</Link>
            </Button>
          </div>

          {pollsWithVotes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">No polls yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first poll to start engaging with your community
                </p>
                <Button asChild>
                  <Link href="/polls/create">Create Your First Poll</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pollsWithVotes.map((poll) => (
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
                          {poll.totalVotes}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <Badge variant={poll.isActive ? "default" : "secondary"}>
                          {poll.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Options:</span>
                        <span className="font-medium text-card-foreground">
                          {poll.poll_options.length}
                        </span>
                      </div>
                    </div>
                    
                    <PollActions pollId={poll.id} />
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
