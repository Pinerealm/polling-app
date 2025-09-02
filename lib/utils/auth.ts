import { redirect } from 'next/navigation'

/**
 * Creates a redirect URL for authentication pages
 * @param path - The path to redirect to after authentication
 * @param baseUrl - The base URL for the auth page (default: '/login')
 * @returns The complete redirect URL
 */
export function createAuthRedirectUrl(path: string, baseUrl: string = '/login'): string {
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  
  const url = new URL(baseUrl, 'http://localhost')
  url.searchParams.set('redirectTo', path)
  
  return `${url.pathname}${url.search}`
}

/**
 * Safely validates a redirect URL
 * @param url - The URL to validate
 * @returns Whether the URL is safe to redirect to
 */
export function isValidRedirectUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  
  // Must start with / and not contain protocol or external domains
  if (!url.startsWith('/') || url.includes('://') || url.includes('//')) {
    return false
  }
  
  // Prevent redirect to auth pages to avoid loops
  if (url.startsWith('/login') || url.startsWith('/signup')) {
    return false
  }
  
  return true
}

/**
 * Gets the default redirect path based on user role or preferences
 * @param user - The authenticated user object
 * @returns The default redirect path
 */
export function getDefaultRedirectPath(user?: any): string {
  // You can add logic here to determine default redirect based on user role
  // For now, we'll use a simple dashboard redirect
  return '/dashboard'
}
