import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../hooks/useAuth'

const benefits = [
  'Access 30,000+ verified social media accounts',
  'Instant delivery within minutes',
  '24/7 dedicated customer support',
  'Secure payment with buyer protection',
]

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { signUp, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      setError('All fields are required')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match")
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const { error: authError } = await signUp(form.email, form.password, form.username)
      setLoading(false)
      if (authError) {
        const msg = authError.message.toLowerCase()
        if (msg.includes('already registered') || msg.includes('already been registered')) {
          setError('This email is already registered. Please sign in instead.')
        } else if (msg.includes('username already exists')) {
          setError('Username already exists. Please choose a different one.')
        } else {
          setError(authError.message)
        }
        return
      }
      navigate('/dashboard')
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.')
      console.error('Signup error:', err)
    }
  }

  const handleGoogleSignUp = async () => {
    setError('')
    const { error: oauthError } = await signInWithGoogle()
    if (oauthError) {
      setError(oauthError.message)
    }
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

      {/* Left panel — image + branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=1600&fit=crop&q=80"
          alt="Team working"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/85 to-indigo-900/90" />

        {/* Floating shapes */}
        <div className="absolute top-20 left-16 w-32 h-32 rounded-full bg-white/10 animate-float-slow" />
        <div className="absolute bottom-32 right-20 w-24 h-24 rounded-full bg-white/5 animate-float-delayed" />
        <div className="absolute top-1/2 left-10 w-16 h-16 rounded-xl bg-white/10 rotate-45 animate-float-slow" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 text-white w-full">
          <div>
            <Link to="/">
              <Logo variant="full" size="lg" className="[&_img]:brightness-0 [&_img]:invert" />
            </Link>
          </div>

          <div className="auth-slide-up" style={{ animationDelay: '0.3s' }}>
            <h1 className="text-3xl xl:text-4xl font-bold leading-tight mb-6">
              Start your journey with<br />
              <span className="text-blue-200">Active Store</span> today
            </h1>
            <ul className="space-y-3">
              {benefits.map((b, i) => (
                <li
                  key={b}
                  className="flex items-center gap-3 text-white/90 auth-slide-up"
                  style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                >
                  <CheckCircle2 size={18} className="text-blue-300 shrink-0" />
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial card */}
          <div className="glass-auth rounded-2xl p-5 auth-slide-up" style={{ animationDelay: '0.9s' }}>
            <p className="text-sm text-white/90 italic leading-relaxed">
              "Active Store completely transformed how I manage my social media presence.
              Best platform I've used in years!"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80"
                alt="Customer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30"
              />
              <div>
                <p className="text-sm font-semibold">James Okonkwo</p>
                <p className="text-xs text-white/60">Digital Marketer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
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
              Create an account
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs sm:text-sm">
              Get started in less than a minute
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
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Choose a username"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="auth-slide-up" style={{ animationDelay: '0.2s' }}>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
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

            <div className="auth-slide-up" style={{ animationDelay: '0.25s' }}>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-slide-up" style={{ animationDelay: '0.3s' }}>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-slide-up w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-0.5 btn-glow text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ animationDelay: '0.35s' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign Up
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4 auth-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Google OAuth */}
          <button onClick={handleGoogleSignUp} className="auth-slide-up w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:shadow-md hover:-translate-y-0.5 text-sm font-medium text-gray-700 dark:text-gray-300" style={{ animationDelay: '0.45s' }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-5 auth-fade-in" style={{ animationDelay: '0.55s' }}>
            Already a member?{' '}
            <Link to="/signin" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
