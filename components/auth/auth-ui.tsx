"use client"

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabase } from '@/components/providers/supabase-provider'

export default function AuthUI() {
  const { supabase } = useSupabase()

  return (
    <div className="w-full max-w-md">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#2563eb',
                brandAccent: '#1d4ed8',
                brandButtonText: '#ffffff',
                defaultButtonBackground: '#ffffff',
                defaultButtonBackgroundHover: '#f8fafc',
                defaultButtonBorder: '#e2e8f0',
                defaultButtonText: '#171717',
                dividerBackground: '#e2e8f0',
                inputBackground: '#ffffff',
                inputBorder: '#e2e8f0',
                inputBorderHover: '#cbd5e1',
                inputBorderFocus: '#2563eb',
                inputText: '#171717',
                inputLabelText: '#374151',
                inputPlaceholder: '#9ca3af',
                messageText: '#374151',
                messageTextDanger: '#dc2626',
                anchorTextColor: '#2563eb',
                anchorTextHoverColor: '#1d4ed8',
              },
              space: {
                inputPadding: '12px',
                buttonPadding: '12px 24px',
                inputLabelMargin: '0 0 8px 0',
                messageMargin: '8px 0 0 0',
                anchorMargin: '16px 0 0 0',
              },
              fontSizes: {
                baseBodySize: '14px',
                baseInputSize: '14px',
                baseLabelSize: '14px',
                baseButtonSize: '14px',
              },
              fonts: {
                bodyFontFamily: 'var(--font-geist-sans), Arial, sans-serif',
                buttonFontFamily: 'var(--font-geist-sans), Arial, sans-serif',
                inputFontFamily: 'var(--font-geist-sans), Arial, sans-serif',
                labelFontFamily: 'var(--font-geist-sans), Arial, sans-serif',
              },
              borderWidths: {
                buttonBorderWidth: '1px',
                inputBorderWidth: '1px',
              },
              radii: {
                borderRadiusButton: '6px',
                buttonBorderRadius: '6px',
                inputBorderRadius: '6px',
              },
            },
          },
        }}
        providers={[]}
        redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard`}
        showLinks={true}
        view="sign_in"
        localization={{
          variables: {
            sign_in: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign In',
              loading_button_label: 'Signing In...',
              social_provider_text: 'Sign in with {{provider}}',
              link_text: 'Already have an account? Sign in',
            },
            sign_up: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign Up',
              loading_button_label: 'Signing Up...',
              social_provider_text: 'Sign up with {{provider}}',
              link_text: 'Don\'t have an account? Sign up',
            },
            forgotten_password: {
              email_label: 'Email',
              button_label: 'Send Reset Instructions',
              loading_button_label: 'Sending Reset Instructions...',
              link_text: 'Forgot your password?',
            },
            update_password: {
              password_label: 'New Password',
              button_label: 'Update Password',
              loading_button_label: 'Updating Password...',
            },
          },
        }}
      />
    </div>
  )
}
