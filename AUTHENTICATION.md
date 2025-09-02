# Authentication System

This document describes the authentication system implemented in the polling app, including how to use the various components and utilities for handling user authentication and route protection.

## Overview

The authentication system is built on top of Supabase Auth and provides:
- User registration and login
- Route protection
- Automatic redirects after authentication
- Support for redirecting to originally requested protected routes

## Components

### 1. AuthUI Component

The main authentication UI component that handles login and signup forms.

```tsx
import AuthUI from "@/components/auth/auth-ui"

// Basic usage
<AuthUI />
```

**Features:**
- Automatic redirect handling after successful authentication
- Support for redirect URLs via query parameters
- Styled with the app's design system
- Handles both login and signup views

### 2. ProtectedRoute Component

A wrapper component that protects routes from unauthenticated access.

```tsx
import ProtectedRoute from "@/components/auth/protected-route"

// Protect a page
<ProtectedRoute>
  <YourProtectedPage />
</ProtectedRoute>

// With custom fallback
<ProtectedRoute fallback={<LoadingSpinner />}>
  <YourProtectedPage />
</ProtectedRoute>
```

**Features:**
- Automatically redirects unauthenticated users to login
- Preserves the current URL for post-authentication redirect
- Shows loading state while checking authentication
- Customizable fallback content

### 3. AuthGuard Component

A flexible component for conditional rendering based on authentication status.

```tsx
import AuthGuard from "@/components/auth/auth-guard"

// Require authentication
<AuthGuard requireAuth={true}>
  <ProtectedContent />
</AuthGuard>

// Require no authentication (redirect authenticated users)
<AuthGuard requireAuth={false} redirectTo="/dashboard">
  <PublicContent />
</AuthGuard>
```

**Features:**
- Flexible authentication requirements
- Conditional rendering based on auth status
- Automatic redirects
- Customizable fallback content

## Hooks

### useAuthRedirect Hook

Custom hook for handling authentication redirects.

```tsx
import { useAuthRedirect } from "@/lib/hooks/use-auth-redirect"

function MyComponent() {
  const { redirectAfterAuth, getRedirectUrl, user, loading } = useAuthRedirect()
  
  // Redirect after successful authentication
  const handleLogin = () => {
    // ... login logic
    redirectAfterAuth('/dashboard')
  }
  
  // Get the current redirect URL
  const redirectUrl = getRedirectUrl('/dashboard')
  
  return <div>...</div>
}
```

**Returns:**
- `redirectAfterAuth(fallbackPath)`: Redirects user after authentication
- `getRedirectUrl(fallbackPath)`: Gets the current redirect URL
- `user`: Current user object
- `loading`: Authentication loading state

## Utilities

### Authentication Utilities

```tsx
import { 
  createAuthRedirectUrl, 
  isValidRedirectUrl, 
  getDefaultRedirectPath 
} from "@/lib/utils/auth"

// Create a redirect URL for authentication
const authUrl = createAuthRedirectUrl('/dashboard', '/login')
// Result: /login?redirectTo=/dashboard

// Validate a redirect URL
const isValid = isValidRedirectUrl('/dashboard')
// Result: true

// Get default redirect path
const defaultPath = getDefaultRedirectPath(user)
// Result: /dashboard
```

## Route Protection

### 1. Using ProtectedRoute Component

Wrap any page component that requires authentication:

```tsx
// app/protected-page/page.tsx
import ProtectedRoute from "@/components/auth/protected-route"

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is protected</div>
    </ProtectedRoute>
  )
}
```

### 2. Using AuthGuard Component

For more flexible authentication control:

```tsx
// app/conditional-page/page.tsx
import AuthGuard from "@/components/auth/auth-guard"

export default function ConditionalPage() {
  return (
    <div>
      <h1>Welcome to our app</h1>
      
      <AuthGuard requireAuth={true}>
        <div>Authenticated users see this</div>
      </AuthGuard>
      
      <AuthGuard requireAuth={false}>
        <div>Non-authenticated users see this</div>
      </AuthGuard>
    </div>
  )
}
```

### 3. Middleware Protection

The middleware automatically protects routes and handles redirects:

- Unauthenticated users trying to access protected routes are redirected to `/login`
- The original requested URL is preserved in the `redirectTo` query parameter
- After successful authentication, users are redirected to the originally requested URL
- Authenticated users trying to access auth pages are redirected to `/dashboard`

## Redirect Flow

### 1. User tries to access protected route
```
User visits /polls/create (protected)
↓
Middleware redirects to /login?redirectTo=/polls/create
```

### 2. User authenticates
```
User logs in successfully
↓
AuthUI detects successful authentication
↓
useAuthRedirect hook processes redirect
↓
User is redirected to /polls/create (original destination)
```

### 3. Fallback redirect
```
If no redirectTo parameter or invalid URL
↓
User is redirected to /dashboard (default)
```

## Security Features

- **URL Validation**: All redirect URLs are validated to prevent open redirects
- **Path Restrictions**: Redirects are limited to internal paths only
- **Loop Prevention**: Prevents redirects to authentication pages
- **Query Parameter Sanitization**: Ensures redirectTo parameter is safe

## Best Practices

1. **Always use ProtectedRoute for sensitive pages**: Don't rely solely on middleware
2. **Provide meaningful fallbacks**: Show loading states and error messages
3. **Handle edge cases**: Consider what happens if authentication fails
4. **Test redirect flows**: Ensure users end up where they expect
5. **Use appropriate authentication levels**: Not all content needs the same level of protection

## Example Implementation

Here's a complete example of a protected page:

```tsx
// app/admin/page.tsx
import ProtectedRoute from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  return (
    <ProtectedRoute 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Welcome to the admin area. This content is protected.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
```

This implementation ensures that:
- Only authenticated users can access the page
- Unauthenticated users are redirected to login
- After login, users return to the admin page
- A loading state is shown during authentication checks
