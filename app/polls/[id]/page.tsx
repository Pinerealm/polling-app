import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, BarChart3 } from "lucide-react"
import { VoteForm } from "@/components/polls/vote-form"
import { PageHeader } from "@/components/navigation/page-header"

interface PollPageProps {
  params: {
    id: string
  }
}

export default async function PollPage({ params }: PollPageProps) {
  const supabase = await createClient()
  const { id } = await params
  
  // Fetch the poll with its options and creator info
  const { data: poll, error } = await supabase
    .from("polls")
    .select(`
      *,
      poll_options (*),
      profiles (name, email)
    `)
    .eq("id", id)
    .single()

  if (error || !poll) {
    notFound()
  }

  // Get vote counts for each option
  const { data: voteCounts } = await supabase
    .from("votes")
    .select("option_id")
    .eq("poll_id", id)

  // Calculate vote counts per option
  const optionVoteCounts = voteCounts?.reduce((acc, vote) => {
    acc[vote.option_id] = (acc[vote.option_id] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const totalVotes = Object.values(optionVoteCounts).reduce((sum, count) => sum + count, 0)

  const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date()
  const isActive = poll.status === 'active' && !isExpired

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader 
          title={poll.title}
          description={poll.description || undefined}
          backHref="/polls"
          backLabel="Back to Polls"
        />
        
        <div className="flex items-center gap-2 mb-6">
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Poll Options */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Poll Options
                </CardTitle>
                <CardDescription>
                  {totalVotes} total vote{totalVotes !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {poll.poll_options.map((option) => {
                  const voteCount = optionVoteCounts[option.id] || 0
                  const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0
                  
                  return (
                    <div key={option.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{option.text}</span>
                        <span className="text-sm text-muted-foreground">
                          {voteCount} vote{voteCount !== 1 ? 's' : ''} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Voting Form and Poll Info */}
          <div className="space-y-6">
            <VoteForm 
              pollId={poll.id}
              options={poll.poll_options}
              allowMultipleVotes={poll.allow_multiple_votes}
              isActive={isActive}
            />

            <Card>
              <CardHeader>
                <CardTitle>Poll Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Created by {poll.profiles?.name || poll.profiles?.email || 'Unknown'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Created {new Date(poll.created_at).toLocaleDateString()}
                  </span>
                </div>

                {poll.expires_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Expires {new Date(poll.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    Multiple votes: {poll.allow_multiple_votes ? 'Allowed' : 'Not allowed'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
