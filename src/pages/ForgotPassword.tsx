import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../hooks/useAuth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setError('')
    setLoading(true)
    const { error: resetError } = await resetPassword(email)
    setLoading(false)
    if (resetError) {
      setError(resetError.message)
      return
    }
    setSubmitted(true)
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

        {!submitted ? (
          <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30 rounded-3xl p-6 sm:p-8 shadow-sm auth-slide-up">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center">
              Forgot Password?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-xs sm:text-sm text-center leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-0.5 btn-glow text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-5">
              Remember your password?{' '}
              <Link to="/signin" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30 rounded-3xl p-8 sm:p-10 shadow-sm text-center auth-slide-up">
            <div className="w-16 h-16 mx-auto mb-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
              We've sent a password reset link to <span className="font-semibold text-gray-700 dark:text-gray-300">{email}</span>. Check your inbox and follow the instructions.
            </p>
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-600/25 hover:shadow-xl hover:-translate-y-0.5"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
