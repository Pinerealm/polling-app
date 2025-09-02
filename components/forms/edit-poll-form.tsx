"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, Calendar } from "lucide-react"
import { updatePoll } from "@/lib/actions/polls"
import { useRouter } from "next/navigation"

interface EditPollFormProps {
  poll: {
    id: string
    title: string
    description: string | null
    allow_multiple_votes: boolean
    expires_at: string | null
    poll_options: Array<{
      id: string
      text: string
    }>
  }
}

export function EditPollForm({ poll }: EditPollFormProps) {
  const [title, setTitle] = useState(poll.title)
  const [description, setDescription] = useState(poll.description || "")
  const [options, setOptions] = useState(poll.poll_options.map(opt => ({ id: opt.id, text: opt.text })))
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(poll.allow_multiple_votes)
  const [expiresAt, setExpiresAt] = useState(
    poll.expires_at ? new Date(poll.expires_at).toISOString().slice(0, 16) : ""
  )
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const addOption = () => {
    setOptions([...options, { id: `new-${Date.now()}`, text: "" }])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], text: value }
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    const validOptions = options.filter(option => option.text.trim() !== "")
    if (validOptions.length < 2) {
      setError("Please provide at least 2 options")
      return
    }

    if (!title.trim()) {
      setError("Poll title is required")
      return
    }

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("pollId", poll.id)
        formData.append("title", title.trim())
        formData.append("description", description.trim())
        formData.append("allowMultipleVotes", allowMultipleVotes ? "on" : "off")
        if (expiresAt) {
          formData.append("expiresAt", expiresAt)
        }
        
        validOptions.forEach((option, index) => {
          formData.append(`option-${index}`, option.text)
          if (option.id.startsWith('new-')) {
            formData.append(`new-option-${index}`, "true")
          } else {
            formData.append(`option-id-${index}`, option.id)
          }
        })

        await updatePoll(formData)
        router.push("/dashboard")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update poll")
      }
    })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-card-foreground">Edit Poll</CardTitle>
        <CardDescription className="text-muted-foreground">
          Update your poll details and options
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Poll Title *
            </label>
            <Input
              id="title"
              type="text"
              placeholder="What would you like to ask?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Description (optional)
            </label>
            <Input
              id="description"
              type="text"
              placeholder="Add more context to your poll"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Poll Options *
            </label>
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => updateOption(index, e.target.value)}
                  required
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="multipleVotes"
                checked={allowMultipleVotes}
                onChange={(e) => setAllowMultipleVotes(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="multipleVotes" className="text-sm font-medium text-foreground">
                Allow multiple votes per person
              </label>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="expiresAt" className="text-sm font-medium text-foreground">
                Expiration Date (optional)
              </label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? "Updating..." : "Update Poll"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/dashboard")}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
