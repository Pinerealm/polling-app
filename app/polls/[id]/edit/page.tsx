import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { EditPollForm } from "@/components/forms/edit-poll-form"
import ProtectedRoute from "@/components/auth/protected-route"
import { PageHeader } from "@/components/navigation/page-header"

interface EditPollPageProps {
  params: {
    id: string
  }
}

export default async function EditPollPage({ params }: EditPollPageProps) {
  const supabase = await createClient()
  const { id } = await params
  
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect("/login")
  }

  // Fetch the poll with its options
  const { data: poll, error } = await supabase
    .from("polls")
    .select(`
      *,
      poll_options (*)
    `)
    .eq("id", id)
    .single()

  if (error || !poll) {
    notFound()
  }

  // Check if user owns this poll
  if (poll.created_by !== user.id) {
    redirect("/dashboard")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader 
            title="Edit Poll"
            description={`Edit "${poll.title}"`}
            backHref="/dashboard"
            backLabel="Back to Dashboard"
          />
          
          <div className="flex justify-center">
            <EditPollForm poll={poll} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
