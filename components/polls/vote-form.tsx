"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface VoteFormProps {
  pollId: string
  options: Array<{
    id: string
    text: string
  }>
  allowMultipleVotes: boolean
  isActive: boolean
}

export function VoteForm({ pollId, options, allowMultipleVotes, isActive }: VoteFormProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  const handleOptionChange = (optionId: string) => {
    if (allowMultipleVotes) {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      )
    } else {
      setSelectedOptions([optionId])
    }
  }

  const handleVote = async () => {
    if (selectedOptions.length === 0) {
      setError("Please select at least one option")
      return
    }

    if (!allowMultipleVotes && selectedOptions.length > 1) {
      setError("You can only select one option")
      return
    }

    setError(null)

    startTransition(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setError("You must be logged in to vote")
          return
        }

        // Check if user has already voted
        const { data: existingVotes } = await supabase
          .from("votes")
          .select("option_id")
          .eq("poll_id", pollId)
          .eq("user_id", user.id)

        if (existingVotes && existingVotes.length > 0) {
          setError("You have already voted on this poll")
          return
        }

        // Create votes
        const votesData = selectedOptions.map(optionId => ({
          poll_id: pollId,
          option_id: optionId,
          user_id: user.id,
        }))

        const { error: voteError } = await supabase
          .from("votes")
          .insert(votesData)

        if (voteError) {
          throw voteError
        }

        // Refresh the page to show updated results
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to vote")
      }
    })
  }

  if (!isActive) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Poll Closed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This poll is no longer accepting votes.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cast Your Vote</CardTitle>
        <CardDescription>
          {allowMultipleVotes 
            ? "You can select multiple options" 
            : "Select one option"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <div className="space-y-3">
          {options.map((option) => (
            <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type={allowMultipleVotes ? "checkbox" : "radio"}
                name="poll-option"
                value={option.id}
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleOptionChange(option.id)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium">{option.text}</span>
            </label>
          ))}
        </div>

        <Button 
          onClick={handleVote} 
          className="w-full" 
          disabled={isPending || selectedOptions.length === 0}
        >
          {isPending ? "Voting..." : "Submit Vote"}
        </Button>
      </CardContent>
    </Card>
  )
}
