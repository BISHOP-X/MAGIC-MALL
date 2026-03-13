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
      setError('All fields are required'); return
    }
    if (form.password !== form.confirmPassword) { setError("Passwords don't match"); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const { error: authError } = await signUp(form.email, form.password, form.username)
      setLoading(false)
      if (authError) {
        const msg = authError.message.toLowerCase()
        if (msg.includes('already registered') || msg.includes('already been registered'))
          setError('This email is already registered. Please sign in instead.')
        else if (msg.includes('username already exists'))
          setError('Username already exists. Please choose a different one.')
        else setError(authError.message)
        return
      }
      navigate('/dashboard')
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.')
    }
  }

  const handleGoogleSignUp = async () => {
    setError('')
    const { error: oauthError } = await signInWithGoogle()
    if (oauthError) setError(oauthError.message)
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
  }
  const focusBorder = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = 'rgba(220,38,38,0.55)')
  const blurBorder = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')

  return (
    <div className="min-h-screen flex text-white" style={{ background: '#0d0d14' }}>
      {/* Back button */}
      <Link
        to="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white transition-all"
        style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <ArrowLeft size={15} />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {/* ── Left panel: branding ── */}
      <div
        className="hidden lg:flex lg:w-5/12 xl:w-[44%] relative overflow-hidden flex-col"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(220,38,38,0.28) 0%, transparent 60%), radial-gradient(ellipse at 80% 88%, rgba(244,63,94,0.20) 0%, transparent 55%), #10080a',
        }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        {/* Floating shapes */}
        <div className="absolute top-20 left-14 w-28 h-28 rounded-full animate-float-slow" style={{ background: 'rgba(220,38,38,0.10)', filter: 'blur(1px)' }} />
        <div className="absolute bottom-32 right-10 w-20 h-20 rounded-full animate-float-delayed" style={{ background: 'rgba(244,63,94,0.08)' }} />
        <div className="absolute top-1/2 left-6 w-12 h-12 rounded-xl rotate-45 animate-float-slow" style={{ background: 'rgba(220,38,38,0.07)', animationDelay: '1.5s' }} />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 h-full">
          {/* Logo */}
          <div className="auth-fade-in">
            <Link to="/"><Logo size="lg" /></Link>
          </div>

          {/* Headline + benefits */}
          <div className="auth-slide-up" style={{ animationDelay: '0.25s' }}>
            <h1 className="text-3xl xl:text-4xl font-bold leading-tight mb-6">
              Your gateway to<br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #fb7185 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                premium accounts
              </span>
            </h1>
            <ul className="space-y-3">
              {benefits.map((b, i) => (
                <li
                  key={b}
                  className="flex items-center gap-3 text-white/75 auth-slide-up"
                  style={{ animationDelay: `${0.40 + i * 0.10}s` }}
                >
                  <CheckCircle2 size={17} className="text-red-400 shrink-0" />
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          <div className="glass-auth rounded-2xl p-5 auth-slide-up" style={{ animationDelay: '0.85s' }}>
            <p className="text-sm text-white/75 italic leading-relaxed">
              "Magic Mall is the go-to place for premium digital accounts. Fast, reliable, and the support team is outstanding."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #dc2626, #f43f5e)' }}
              >
                CK
              </div>
              <div>
                <p className="text-sm font-semibold">Chidi Kamara</p>
                <p className="text-xs text-white/35">Social Media Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div
        className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10"
        style={{ background: 'rgba(255,255,255,0.015)' }}
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-6 auth-fade-in">
            <Link to="/"><Logo size="default" /></Link>
          </div>

          <div className="auth-slide-up mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Create an account</h2>
            <p className="text-white/40 mt-1 text-sm">Get started in less than a minute</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div
                className="flex items-center gap-2 p-3 rounded-xl text-sm text-red-300"
                style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.30)' }}
              >
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Username */}
            <div className="auth-slide-up" style={{ animationDelay: '0.10s' }}>
              <label className="block text-xs font-medium text-white/55 mb-1.5">Username</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Choose a username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-white/20 outline-none transition-all"
                  style={inputStyle}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
              </div>
            </div>

            {/* Email */}
            <div className="auth-slide-up" style={{ animationDelay: '0.17s' }}>
              <label className="block text-xs font-medium text-white/55 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-white/20 outline-none transition-all"
                  style={inputStyle}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-slide-up" style={{ animationDelay: '0.24s' }}>
              <label className="block text-xs font-medium text-white/55 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl text-sm text-white placeholder:text-white/20 outline-none transition-all"
                  style={inputStyle}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="auth-slide-up" style={{ animationDelay: '0.31s' }}>
              <label className="block text-xs font-medium text-white/55 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl text-sm text-white placeholder:text-white/20 outline-none transition-all"
                  style={inputStyle}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-slide-up w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ animationDelay: '0.38s' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-xs text-white/25 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/65 hover:text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Already have account */}
          <p className="text-center mt-5 text-sm text-white/35">
            Already have an account?{' '}
            <Link to="/signin" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
