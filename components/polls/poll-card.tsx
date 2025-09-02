"use client"

import { Poll } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Calendar } from "lucide-react"

interface PollCardProps {
  poll: Poll
  onVote?: (pollId: string) => void
  onView?: (pollId: string) => void
}

export function PollCard({ poll, onVote, onView }: PollCardProps) {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)
  const isExpired = poll.expiresAt && new Date() > poll.expiresAt

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg text-card-foreground">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="line-clamp-2 text-muted-foreground">
                {poll.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{totalVotes} votes</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {poll.options.slice(0, 3).map((option) => (
            <div key={option.id} className="flex items-center justify-between">
              <span className="text-sm text-card-foreground truncate flex-1">{option.text}</span>
              <span className="text-sm font-medium text-muted-foreground">
                {totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0}%
              </span>
            </div>
          ))}
          {poll.options.length > 3 && (
            <span className="text-sm text-muted-foreground">
              +{poll.options.length - 3} more options
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>
              {poll.expiresAt 
                ? `Expires ${new Date(poll.expiresAt).toLocaleDateString()}`
                : "No expiration"
              }
            </span>
          </div>
          
          {poll.allowMultipleVotes && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
              Multiple votes allowed
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          {onView && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onView(poll.id)}
            >
              View Details
            </Button>
          )}
          {onVote && !isExpired && (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onVote(poll.id)}
            >
              Vote Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
