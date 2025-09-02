"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import type { Database } from "@/types/database"

type Poll = Database["public"]["Tables"]["polls"]["Row"] & {
  poll_options: Database["public"]["Tables"]["poll_options"]["Row"][]
  profiles: Database["public"]["Tables"]["profiles"]["Row"]
}

type CreatePollData = {
  title: string
  description?: string
  options: string[]
  allowMultipleVotes: boolean
  expiresAt?: Date
}

export function usePolls() {
  const { supabase, user } = useSupabase()
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all polls
  const fetchPolls = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from("polls")
        .select(`
          *,
          poll_options (*),
          profiles (*)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError

      setPolls(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch polls")
    } finally {
      setLoading(false)
    }
  }

  // Fetch user's polls
  const fetchUserPolls = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from("polls")
        .select(`
          *,
          poll_options (*),
          profiles (*)
        `)
        .eq("created_by", user.id)
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError

      setPolls(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user polls")
    } finally {
      setLoading(false)
    }
  }

  // Create a new poll
  const createPoll = async (pollData: CreatePollData) => {
    if (!user) throw new Error("User not authenticated")

    try {
      setError(null)

      // Create the poll
      const { data: poll, error: pollError } = await supabase
        .from("polls")
        .insert({
          title: pollData.title,
          description: pollData.description,
          created_by: user.id,
          allow_multiple_votes: pollData.allowMultipleVotes,
          expires_at: pollData.expiresAt?.toISOString(),
        })
        .select()
        .single()

      if (pollError) throw pollError

      // Create poll options
      const optionsData = pollData.options.map(text => ({
        poll_id: poll.id,
        text,
      }))

      const { error: optionsError } = await supabase
        .from("poll_options")
        .insert(optionsData)

      if (optionsError) throw optionsError

      // Refresh polls
      await fetchPolls()

      return poll
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create poll"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Vote on a poll
  const voteOnPoll = async (pollId: string, optionIds: string[]) => {
    if (!user) throw new Error("User not authenticated")

    try {
      setError(null)

      // Check if user has already voted on this poll
      const { data: existingVotes } = await supabase
        .from("votes")
        .select("option_id")
        .eq("poll_id", pollId)
        .eq("user_id", user.id)

      if (existingVotes && existingVotes.length > 0) {
        throw new Error("You have already voted on this poll")
      }

      // Create votes
      const votesData = optionIds.map(optionId => ({
        poll_id: pollId,
        option_id: optionId,
        user_id: user.id,
      }))

      const { error: voteError } = await supabase
        .from("votes")
        .insert(votesData)

      if (voteError) throw voteError

      // Refresh polls to show updated vote counts
      await fetchPolls()

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to vote"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Delete a poll
  const deletePoll = async (pollId: string) => {
    if (!user) throw new Error("User not authenticated")

    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from("polls")
        .delete()
        .eq("id", pollId)
        .eq("created_by", user.id)

      if (deleteError) throw deleteError

      // Refresh polls
      await fetchPolls()

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete poll"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Get poll results
  const getPollResults = async (pollId: string) => {
    try {
      const { data, error } = await supabase
        .rpc("get_poll_results", { poll_uuid: pollId })

      if (error) throw error

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get poll results")
      return []
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [])

  return {
    polls,
    loading,
    error,
    fetchPolls,
    fetchUserPolls,
    createPoll,
    voteOnPoll,
    deletePoll,
    getPollResults,
  }
}
