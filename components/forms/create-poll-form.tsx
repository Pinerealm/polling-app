"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreatePollData } from "@/types"
import { Plus, X, Calendar } from "lucide-react"

interface CreatePollFormProps {
  onSubmit: (data: CreatePollData) => void
  isLoading?: boolean
}

export function CreatePollForm({ onSubmit, isLoading = false }: CreatePollFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false)
  const [expiresAt, setExpiresAt] = useState("")

  const addOption = () => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const validOptions = options.filter(option => option.trim() !== "")
    if (validOptions.length < 2) {
      alert("Please provide at least 2 options")
      return
    }

    const formData: CreatePollData = {
      title: title.trim(),
      description: description.trim() || undefined,
      options: validOptions,
      allowMultipleVotes,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    }

    onSubmit(formData)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-card-foreground">Create New Poll</CardTitle>
        <CardDescription className="text-muted-foreground">
          Create a new poll for your community to vote on
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
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
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Poll"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
