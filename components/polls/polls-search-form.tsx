"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

interface PollsSearchFormProps {
  searchTerm: string
  filterActive: boolean
}

export function PollsSearchForm({ searchTerm, filterActive }: PollsSearchFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    
    if (localSearchTerm.trim()) {
      params.set("search", localSearchTerm.trim())
    } else {
      params.delete("search")
    }
    
    router.push(`/polls?${params.toString()}`)
  }

  const handleFilterToggle = () => {
    const params = new URLSearchParams(searchParams)
    params.set("active", (!filterActive).toString())
    router.push(`/polls?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search polls..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button
        type="button"
        variant={filterActive ? "default" : "outline"}
        onClick={handleFilterToggle}
        className="flex items-center space-x-2"
      >
        <Filter className="h-4 w-4" />
        <span>{filterActive ? "Active Only" : "All Polls"}</span>
      </Button>
    </form>
  )
}
