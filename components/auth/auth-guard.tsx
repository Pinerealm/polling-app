"use client"

import { ReactNode } from 'react'
import { useSupabase } from '@/components/providers/supabase-provider'
import { createAuthRedirectUrl } from '@/lib/utils/auth'
import { useRouter, usePathname } from 'next/navigation'

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export default function AuthGuard({ 
  children, 
  fallback = null,
  requireAuth = true,
  redirectTo = '/dashboard'
}: AuthGuardProps) {
  const { user, loading } = useSupabase()
  const router = useRouter()
  const pathname = usePathname()

  const handleAuthRedirect = () => {
    if (requireAuth && !user && !loading) {
      const authUrl = createAuthRedirectUrl(pathname, '/login')
      router.push(authUrl)
    }
  }

  // Show loading state while checking authentication
  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !user) {
    handleAuthRedirect()
    return fallback || null
  }

  // If authentication is not required and user is authenticated, redirect to dashboard
  if (!requireAuth && user) {
    router.push(redirectTo)
    return fallback || null
  }

  // Render children based on authentication requirements
  return <>{children}</>
}
