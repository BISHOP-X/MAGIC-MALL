import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthApiError } from '@supabase/supabase-js'
import type { Session, User, AuthError } from '@supabase/supabase-js'

/* ─── Types ─── */
export interface Profile {
  id: string
  username: string
  role: 'user' | 'admin'
  provider: string
  old_mongo_id: string | null
  created_at: string
  withdrawal_password: string | null
}

interface AuthState {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>
  signUp: (email: string, password: string, username: string) => Promise<{ error: AuthError | Error | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>
  refreshProfile: () => Promise<void>
}

// Persist the context across Vite HMR reloads so "useAuth must be used within AuthProvider" doesn't fire on hot updates.
const AUTH_CTX_KEY = '__magic_mall_auth_ctx__' as const
const AuthContext: React.Context<AuthContextType | undefined> =
  (globalThis as Record<string, unknown>)[AUTH_CTX_KEY] as React.Context<AuthContextType | undefined>
  ?? ((globalThis as Record<string, unknown>)[AUTH_CTX_KEY] = createContext<AuthContextType | undefined>(undefined))

/* ─── Provider ─── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    loading: true,
  })

  /* ── Fetch profile from profiles table ── */
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles2')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Failed to fetch profile:', error.message)
        return null
      }
      return data as Profile
    } catch (err) {
      // Prevent unhandled promise rejections (e.g., fetch AbortError) from breaking auth flows.
      console.error('Failed to fetch profile:', err)
      return null
    }
  }, [])

  /* ── Initialize auth on mount ── */
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // Set user immediately so auth gates unblock, then load profile in background
        setState({ session, user: session.user, profile: null, loading: false })
        const profile = await fetchProfile(session.user.id)
        setState(prev => prev.user?.id === session.user.id ? { ...prev, profile } : prev)
      } else {
        setState({ session: null, user: null, profile: null, loading: false })
      }
    })

    // Listen for auth changes — MUST NOT be async so it doesn't block signIn/signUp callers.
    // Supabase's _notifyAllSubscribers awaits async callbacks, which would block signInWithPassword().
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Set user/session synchronously first so navigation works immediately
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          // Clear profile when signing out
          profile: session?.user ? prev.profile : null,
          loading: false,
        }))

        // Load profile in the background (non-blocking)
        if (session?.user) {
          fetchProfile(session.user.id).then(profile => {
            setState(prev => prev.user?.id === session.user.id ? { ...prev, profile } : prev)
          })
        }

        // On password recovery event, nothing extra needed — PasswordReset page handles it
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  /* ── Sign in with email/password ── */
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })
    return { error }
  }, [])

  /* ── Sign up with email/password + username ── */
  const signUp = useCallback(async (email: string, password: string, username: string) => {
    try {
      const signUpPromise = supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            username: username.toLowerCase().trim(),
          },
        },
      })

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Signup request timed out. Please check your connection and try again.')), 15000)
      })

      const { error } = await Promise.race([signUpPromise, timeoutPromise])
      return { error }
    } catch (err) {
      console.error('signUp threw:', err)
      return { error: err instanceof Error ? err : new Error('Signup failed') }
    }
  }, [])

  /* ── Google OAuth (GSI ID-token flow — shows activestore.org, not supabase URL) ── */
  const signInWithGoogle = useCallback(async (): Promise<{ error: AuthError | null }> => {
    const g = (window as any).google
    if (!g?.accounts?.id) {
      return { error: new AuthApiError('Google Sign-In is loading. Please try again in a moment.', 0, 'unexpected_failure') }
    }

    return new Promise((resolve) => {
      g.accounts.id.initialize({
        client_id: '326287299202-k9c28499mr8d26p3fb7k7sgpv84f5ta4.apps.googleusercontent.com',
        callback: async (response: { credential: string }) => {
          try {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
            })
            if (!error) {
              window.location.href = '/dashboard'
            }
            resolve({ error })
          } catch (err) {
            const msg = err instanceof Error ? err.message : 'Google sign-in failed'
            resolve({ error: new AuthApiError(msg, 0, 'unexpected_failure') })
          }
        },
        auto_select: false,
      })

      // Render a hidden Google button and click it to open the full account chooser
      let container = document.getElementById('__gsi_hidden')
      if (!container) {
        container = document.createElement('div')
        container.id = '__gsi_hidden'
        container.style.position = 'fixed'
        container.style.top = '-9999px'
        container.style.left = '-9999px'
        container.style.opacity = '0'
        container.style.pointerEvents = 'none'
        document.body.appendChild(container)
      }
      container.innerHTML = ''

      g.accounts.id.renderButton(container, {
        type: 'icon',
        size: 'large',
      })

      // Wait for Google to render, then click
      requestAnimationFrame(() => {
        setTimeout(() => {
          const btn = container!.querySelector('[role="button"]') as HTMLElement
            || container!.querySelector('div[tabindex]') as HTMLElement
            || container!.firstElementChild as HTMLElement
          if (btn) {
            btn.click()
          } else {
            // Fallback: use One Tap prompt
            g.accounts.id.prompt()
          }
        }, 100)
      })
    })
  }, [])

  /* ── Sign out ── */
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      // Even if the network call fails, clear local state so UI unblocks.
      console.error('signOut threw:', err)
    } finally {
      setState({ session: null, user: null, profile: null, loading: false })
    }
  }, [])

  /* ── Reset password ── */
  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.toLowerCase().trim(),
      { redirectTo: `${window.location.origin}/password-reset?token=recovery` }
    )
    return { error }
  }, [])

  /* ── Update password (after recovery) ── */
  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    return { error }
  }, [])

  /* ── Refresh profile manually ── */
  const refreshProfile = useCallback(async () => {
    if (state.user) {
      const profile = await fetchProfile(state.user.id)
      setState(prev => ({ ...prev, profile }))
    }
  }, [state.user, fetchProfile])

  return (
    <AuthContext.Provider value={{
      ...state,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      resetPassword,
      updatePassword,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

/* ─── Hook ─── */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

