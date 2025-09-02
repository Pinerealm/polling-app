"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSupabase } from '@/components/providers/supabase-provider'
import { createAuthRedirectUrl } from '@/lib/utils/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  fallback = null,
  redirectTo = '/dashboard'
}: ProtectedRouteProps) {
  const { user, loading } = useSupabase()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      // Create redirect URL to come back to this page after login
      const authUrl = createAuthRedirectUrl(pathname, '/login')
      router.push(authUrl)
    }
  }, [user, loading, router, pathname])

  // Show loading state while checking authentication
  if (loading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render children (will redirect)
  if (!user) {
    return fallback || null
  }

  // User is authenticated, render the protected content
  return <>{children}</>
}
