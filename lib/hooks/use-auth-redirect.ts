"use client"

import { useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSupabase } from '@/components/providers/supabase-provider'

export function useAuthRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useSupabase()

  const redirectAfterAuth = useCallback((fallbackPath: string = '/dashboard') => {
    if (!user || loading) return

    // Check if there's a redirect URL in the search params
    const redirectTo = searchParams.get('redirectTo')
    
    if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
      // Ensure the redirect URL is safe (starts with / and doesn't contain protocol)
      router.replace(redirectTo)
    } else {
      // Default redirect
      router.replace(fallbackPath)
    }
  }, [user, loading, searchParams, router])

  const getRedirectUrl = useCallback((fallbackPath: string = '/dashboard') => {
    const redirectTo = searchParams.get('redirectTo')
    
    if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
      return redirectTo
    }
    
    return fallbackPath
  }, [searchParams])

  return {
    redirectAfterAuth,
    getRedirectUrl,
    user,
    loading
  }
}
