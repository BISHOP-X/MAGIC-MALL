import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export default function PasswordReset() {
  const navigate = useNavigate()
  const { updatePassword } = useAuth()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [hasSession, setHasSession] = useState<boolean | null>(null)

  // Check if we arrived via Supabase password recovery link
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setHasSession(true)
      }
    })

    // Also check current session (user may already be authenticated via recovery)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setHasSession(true)
      } else {
        // Give a brief moment for the PASSWORD_RECOVERY event
        setTimeout(() => {
          setHasSession(prev => prev === null ? false : prev)
        }, 2000)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!password || !confirmPassword) {
      setError('Both fields are required.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    const { error: updateError } = await updatePassword(password)
    setLoading(false)
    if (updateError) {
      setError(updateError.message)
      return
    }
    setSuccess(true)
  }

  // Still loading — checking session
  if (hasSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
        <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // No valid session → invalid/expired link
  if (!hasSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 auth-fade-in">
            <Link to="/">
              <Logo size="default" className="mx-auto" />
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30 rounded-3xl p-6 sm:p-8 shadow-sm auth-slide-up">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invalid Reset Link</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              to="/forgot-password"
              className="mt-6 inline-block w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold text-center text-sm hover:shadow-lg transition-all"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
      {/* Back button */}
      <Link
        to="/signin"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-md"
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Back to Login</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-6 auth-fade-in">
          <Link to="/">
            <Logo size="default" className="mx-auto" />
          </Link>
        </div>

        {!success ? (
          <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30 rounded-3xl p-6 sm:p-8 shadow-sm auth-slide-up">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center">
              Reset Your Password
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-xs sm:text-sm text-center leading-relaxed">
              Enter your new password below.
            </p>

            {error && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-primary-500/20 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30 rounded-3xl p-6 sm:p-8 shadow-sm auth-slide-up text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Password Updated!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <button
              onClick={() => navigate('/signin')}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg transition-all"
            >
              Go to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
