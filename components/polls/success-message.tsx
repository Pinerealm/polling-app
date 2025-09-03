"use client"

import { useEffect } from "react"
import { CheckCircle } from "lucide-react"

export function SuccessMessage() {
  useEffect(() => {
    // Remove the query parameter from URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.delete('created')
    window.history.replaceState({}, '', url.toString())
  }, [])

  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-3">
      <CheckCircle className="h-5 w-5 text-green-600" />
      <div>
        <p className="text-sm font-medium text-green-800">Poll created successfully!</p>
        <p className="text-sm text-green-600">Your poll is now live and ready for votes.</p>
      </div>
    </div>
  )
}
