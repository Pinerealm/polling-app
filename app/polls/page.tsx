"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PollCard } from "@/components/polls/poll-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/navigation/page-header"
import { getPolls } from "@/lib/actions/polls"
import { PollsSearchForm } from "@/components/polls/polls-search-form"
import { SuccessMessage } from "@/components/polls/success-message"
import { Poll } from "@/types"
import Link from "next/link"

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  const searchTerm = searchParams.get("search") || ""
  const filterActive = searchParams.get("active") !== "false"
  const showSuccessMessage = searchParams.get("created") === "true"

  // Fetch polls when component mounts or search params change
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true)
        setError(null)
        const fetchedPolls = await getPolls(searchTerm, filterActive)
        setPolls(fetchedPolls)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch polls")
      } finally {
        setLoading(false)
      }
    }

    fetchPolls()
  }, [searchTerm, filterActive])

  const handleVote = (pollId: string) => {
    // TODO: Implement voting logic
    console.log("Voting on poll:", pollId)
  }

  const handleView = (pollId: string) => {
    // Navigate to poll detail page
    router.push(`/polls/${pollId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading polls...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">Error loading polls</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
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
          {showSuccessMessage && <SuccessMessage />}
          
          <div className="flex items-center justify-between mb-6">
            <Button asChild>
              <Link href="/polls/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Poll
              </Link>
            </Button>
          </div>
          
          <PollsSearchForm searchTerm={searchTerm} filterActive={filterActive} />
        </div>
        
        {polls.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">No polls found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "Be the first to create a poll!"}
            </p>
            {!searchTerm && (
              <Button asChild className="mt-4">
                <Link href="/polls/create">Create Your First Poll</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
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
