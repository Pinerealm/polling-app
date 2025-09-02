import { CreatePollForm } from "@/components/forms/create-poll-form"
import ProtectedRoute from "@/components/auth/protected-route"
import { PageHeader } from "@/components/navigation/page-header"

export default function CreatePollPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader 
            title="Create New Poll"
            description="Create engaging polls for your community to vote on"
            backHref="/dashboard"
            backLabel="Back to Dashboard"
          />
          
          <div className="flex justify-center">
            <CreatePollForm />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
