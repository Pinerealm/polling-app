"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { CreatePollData } from "@/types"

export async function createPoll(formData: FormData) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error("You must be logged in to create a poll")
  }

  // Extract form data
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const allowMultipleVotes = formData.get("allowMultipleVotes") === "on"
  const expiresAt = formData.get("expiresAt") as string
  
  // Extract options (they come as option-0, option-1, etc.)
  const options: string[] = []
  let optionIndex = 0
  while (formData.has(`option-${optionIndex}`)) {
    const option = formData.get(`option-${optionIndex}`) as string
    if (option.trim()) {
      options.push(option.trim())
    }
    optionIndex++
  }

  // Validate input
  if (!title?.trim()) {
    throw new Error("Poll title is required")
  }
  
  if (options.length < 2) {
    throw new Error("At least 2 options are required")
  }

  try {
    // Create the poll
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        created_by: user.id,
        allow_multiple_votes: allowMultipleVotes,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      })
      .select()
      .single()

    if (pollError) {
      console.error("Poll creation error:", pollError)
      throw new Error("Failed to create poll")
    }

    // Create poll options
    const optionsData = options.map(text => ({
      poll_id: poll.id,
      text,
    }))

    const { error: optionsError } = await supabase
      .from("poll_options")
      .insert(optionsData)

    if (optionsError) {
      console.error("Options creation error:", optionsError)
      throw new Error("Failed to create poll options")
    }

    // Revalidate the polls page to show the new poll
    revalidatePath("/polls")
    revalidatePath("/dashboard")

    // Redirect to the polls page with success message
    redirect("/polls?created=true")

  } catch (error) {
    console.error("Error creating poll:", error)
    throw error
  }
}

export async function createPollFromData(pollData: CreatePollData) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error("You must be logged in to create a poll")
  }

  // Validate input
  if (!pollData.title?.trim()) {
    throw new Error("Poll title is required")
  }
  
  if (pollData.options.length < 2) {
    throw new Error("At least 2 options are required")
  }

  try {
    // Create the poll
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert({
        title: pollData.title.trim(),
        description: pollData.description?.trim() || null,
        created_by: user.id,
        allow_multiple_votes: pollData.allowMultipleVotes,
        expires_at: pollData.expiresAt?.toISOString() || null,
      })
      .select()
      .single()

    if (pollError) {
      console.error("Poll creation error:", pollError)
      throw new Error("Failed to create poll")
    }

    // Create poll options
    const optionsData = pollData.options.map(text => ({
      poll_id: poll.id,
      text,
    }))

    const { error: optionsError } = await supabase
      .from("poll_options")
      .insert(optionsData)

    if (optionsError) {
      console.error("Options creation error:", optionsError)
      throw new Error("Failed to create poll options")
    }

    // Revalidate the polls page to show the new poll
    revalidatePath("/polls")
    revalidatePath("/dashboard")

    return { success: true, pollId: poll.id }

  } catch (error) {
    console.error("Error creating poll:", error)
    throw error
  }
}

export async function deletePoll(pollId: string) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error("You must be logged in to delete a poll")
  }

  try {
    // First verify the user owns this poll
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select("created_by")
      .eq("id", pollId)
      .single()

    if (pollError || !poll) {
      throw new Error("Poll not found")
    }

    if (poll.created_by !== user.id) {
      throw new Error("You can only delete your own polls")
    }

    // Delete the poll (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from("polls")
      .delete()
      .eq("id", pollId)
      .eq("created_by", user.id)

    if (deleteError) {
      console.error("Poll deletion error:", deleteError)
      throw new Error("Failed to delete poll")
    }

    // Revalidate the polls page and dashboard
    revalidatePath("/polls")
    revalidatePath("/dashboard")

    return { success: true }

  } catch (error) {
    console.error("Error deleting poll:", error)
    throw error
  }
}

export async function updatePoll(formData: FormData) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error("You must be logged in to update a poll")
  }

  // Extract form data
  const pollId = formData.get("pollId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const allowMultipleVotes = formData.get("allowMultipleVotes") === "on"
  const expiresAt = formData.get("expiresAt") as string
  
  // Extract options
  const options: Array<{ id?: string; text: string; isNew?: boolean }> = []
  let optionIndex = 0
  while (formData.has(`option-${optionIndex}`)) {
    const text = formData.get(`option-${optionIndex}`) as string
    const isNew = formData.get(`new-option-${optionIndex}`) === "true"
    const id = isNew ? undefined : (formData.get(`option-id-${optionIndex}`) as string)
    
    if (text.trim()) {
      options.push({ id, text: text.trim(), isNew })
    }
    optionIndex++
  }

  // Validate input
  if (!title?.trim()) {
    throw new Error("Poll title is required")
  }
  
  if (options.length < 2) {
    throw new Error("At least 2 options are required")
  }

  try {
    // First verify the user owns this poll
    const { data: existingPoll, error: pollError } = await supabase
      .from("polls")
      .select("created_by")
      .eq("id", pollId)
      .single()

    if (pollError || !existingPoll) {
      throw new Error("Poll not found")
    }

    if (existingPoll.created_by !== user.id) {
      throw new Error("You can only update your own polls")
    }

    // Update the poll
    const { error: updateError } = await supabase
      .from("polls")
      .update({
        title: title.trim(),
        description: description?.trim() || null,
        allow_multiple_votes: allowMultipleVotes,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", pollId)
      .eq("created_by", user.id)

    if (updateError) {
      console.error("Poll update error:", updateError)
      throw new Error("Failed to update poll")
    }

    // Handle options - delete existing ones and create new ones
    const { error: deleteOptionsError } = await supabase
      .from("poll_options")
      .delete()
      .eq("poll_id", pollId)

    if (deleteOptionsError) {
      console.error("Options deletion error:", deleteOptionsError)
      throw new Error("Failed to update poll options")
    }

    // Create new options
    const optionsData = options.map(option => ({
      poll_id: pollId,
      text: option.text,
    }))

    const { error: optionsError } = await supabase
      .from("poll_options")
      .insert(optionsData)

    if (optionsError) {
      console.error("Options creation error:", optionsError)
      throw new Error("Failed to create poll options")
    }

    // Revalidate the polls page and dashboard
    revalidatePath("/polls")
    revalidatePath("/dashboard")
    revalidatePath(`/polls/${pollId}`)

    return { success: true }

  } catch (error) {
    console.error("Error updating poll:", error)
    throw error
  }
}
