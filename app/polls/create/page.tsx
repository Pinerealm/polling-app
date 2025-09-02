import { CreatePollForm } from "@/components/forms/create-poll-form"
import ProtectedRoute from "@/components/auth/protected-route"

export default function CreatePollPage() {
  const handleCreatePoll = async (data: any) => {
    // TODO: Implement poll creation logic
    console.log("Creating poll:", data)
    
    // Here you would typically:
    // 1. Send data to your API
    // 2. Handle success/error responses
    // 3. Redirect to the new poll or polls list
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Poll</h1>
            <p className="mt-2 text-gray-700">
              Create engaging polls for your community to vote on
            </p>
          </div>
          
          <div className="flex justify-center">
            <CreatePollForm onSubmit={handleCreatePoll} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
