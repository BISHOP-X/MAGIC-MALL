import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Zap, Star, ArrowLeft, AlertCircle } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../hooks/useAuth'

const stats = [
  { icon: Shield, label: 'Secure Payments', value: '256-bit SSL' },
  { icon: Zap, label: 'Instant Delivery', value: '<5 minutes' },
  { icon: Star, label: 'Customer Rating', value: '4.9/5.0' },
]

export default function SignIn() {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { signIn, signInWithGoogle, user, loading: authLoading } = useAuth()

  // If the user already has a live session, skip the form entirely
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [authLoading, user, navigate])

  // Show a neutral spinner while the session check is in flight
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="w-8 h-8 border-[3px] border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Email and password are required')
      return
    }
    setLoading(true)
    const { error: authError } = await signIn(form.email, form.password)
    setLoading(false)
    if (authError) {
      const msg = authError.message.toLowerCase()
      if (msg.includes('invalid login')) {
        setError('Invalid email or password')
      } else if (msg.includes('email not confirmed')) {
        setError('Please verify your email before signing in')
      } else {
        setError(authError.message)
      }
      return
    }
    navigate('/dashboard')
  }

  const handleGoogleSignIn = async () => {
    setError('')
    const { error: oauthError } = await signInWithGoogle()
    if (oauthError) {
      setError(oauthError.message)
    }
    // Redirect happens automatically via Supabase OAuth flow
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      {/* Back button - visible on all screens */}
      <Link
        to="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-md"
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Back</span>
      </Link>

      {/* Left panel — form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-4 auth-fade-in">
            <Link to="/">
              <Logo size="default" />
            </Link>
          </div>

          <div className="auth-slide-up">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs sm:text-sm">
              Sign in to access your Active Store account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 auth-slide-up">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}
            <div className="auth-slide-up" style={{ animationDelay: '0.15s' }}>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="auth-slide-up" style={{ animationDelay: '0.2s' }}>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-slide-up w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-0.5 btn-glow text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ animationDelay: '0.3s' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4 auth-slide-up" style={{ animationDelay: '0.35s' }}>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Google OAuth */}
          <button onClick={handleGoogleSignIn} className="auth-slide-up w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:shadow-md hover:-translate-y-0.5 text-sm font-medium text-gray-700 dark:text-gray-300" style={{ animationDelay: '0.4s' }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Bottom links */}
          <div className="flex items-center justify-between mt-5 auth-fade-in" style={{ animationDelay: '0.5s' }}>
            <Link to="/signup" className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Register
            </Link>
            <Link to="/forgot-password" className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>

      {/* Right panel — image + branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1200&h=1600&fit=crop&q=80"
          alt="Modern workspace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-bl from-indigo-900/90 via-primary-700/85 to-primary-600/90" />

        {/* Floating shapes */}
        <div className="absolute top-32 right-16 w-28 h-28 rounded-full bg-white/10 animate-float-slow" />
        <div className="absolute bottom-40 left-14 w-20 h-20 rounded-full bg-white/5 animate-float-delayed" />
        <div className="absolute top-1/3 right-10 w-14 h-14 rounded-lg bg-white/10 rotate-12 animate-float-slow" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 text-white w-full">
          <div className="auth-slide-up">
            <Link to="/">
              <Logo variant="full" size="lg" className="[&_img]:brightness-0 [&_img]:invert" />
            </Link>
          </div>

          <div className="auth-slide-up" style={{ animationDelay: '0.3s' }}>
            <h1 className="text-3xl xl:text-4xl font-bold leading-tight mb-4">
              Your digital growth<br />
              <span className="text-blue-200">starts here</span>
            </h1>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm">
              Access premium social media accounts, growing tools, and digital services trusted by thousands worldwide.
            </p>
          </div>

          {/* Stats cards */}
          <div className="space-y-3">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="glass-auth rounded-xl p-4 flex items-center gap-4 auth-slide-up"
                style={{ animationDelay: `${0.5 + i * 0.12}s` }}
              >
                <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <s.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">{s.value}</p>
                  <p className="text-xs text-white/60">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
