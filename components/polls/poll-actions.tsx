"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { deletePoll } from "@/lib/actions/polls"

interface PollActionsProps {
  pollId: string
}

export function PollActions({ pollId }: PollActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const router = useRouter()

  const handleView = () => {
    router.push(`/polls/${pollId}`)
  }

  const handleEdit = () => {
    router.push(`/polls/${pollId}/edit`)
  }

  const handleDelete = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    startTransition(async () => {
      try {
        await deletePoll(pollId)
        router.refresh()
      } catch (error) {
        console.error("Failed to delete poll:", error)
        setShowDeleteConfirm(false)
      }
    })
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1"
        onClick={handleView}
      >
        <Eye className="h-4 w-4 mr-2" />
        View
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1"
        onClick={handleEdit}
      >
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </Button>
      <Button 
        variant={showDeleteConfirm ? "destructive" : "outline"}
        size="icon"
        onClick={handleDelete}
        disabled={isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="bg-card p-4 rounded-lg border shadow-lg">
            <p className="text-sm font-medium mb-3">Delete this poll?</p>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete"}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleCancelDelete}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
