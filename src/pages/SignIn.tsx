import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Zap, Star, ArrowLeft, AlertCircle } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../hooks/useAuth'

const stats = [
  { icon: Shield, label: 'Secure Payments', value: '256-bit SSL' },
  { icon: Zap, label: 'Instant Delivery', value: '<5 min' },
  { icon: Star, label: 'Customer Rating', value: '4.9 / 5' },
]

export default function SignIn() {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { signIn, signInWithGoogle, user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && user) navigate('/dashboard', { replace: true })
  }, [authLoading, user, navigate])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0d14' }}>
        <div className="w-8 h-8 border-[3px] border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Email and password are required'); return }
    setLoading(true)
    const { error: authError } = await signIn(form.email, form.password)
    setLoading(false)
    if (authError) {
      const msg = authError.message.toLowerCase()
      if (msg.includes('invalid login')) setError('Invalid email or password')
      else if (msg.includes('email not confirmed')) setError('Please verify your email before signing in')
      else setError(authError.message)
      return
    }
    navigate('/dashboard')
  }

  const handleGoogleSignIn = async () => {
    setError('')
    const { error: oauthError } = await signInWithGoogle()
    if (oauthError) setError(oauthError.message)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white relative overflow-hidden p-4 sm:p-6"
      style={{
        background:
          'radial-gradient(ellipse at 20% 10%, rgba(220,38,38,0.22) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(244,63,94,0.18) 0%, transparent 55%), #0d0d14',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '-100px', left: '-100px', width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)',
          filter: 'blur(50px)', zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: '-80px', right: '-80px', width: '350px', height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,63,94,0.12) 0%, transparent 70%)',
          filter: 'blur(45px)', zIndex: 0,
        }}
      />

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

      {/* Glass card */}
      <div
        className="relative z-10 w-full max-w-[420px] rounded-2xl p-7 sm:p-9 auth-slide-up"
        style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-7">
          <Link to="/"><Logo size="lg" /></Link>
        </div>

        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Welcome back</h2>
          <p className="text-white/45 mt-1 text-sm">Sign in to your Magic Mall account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-xl text-sm text-red-300"
              style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.30)' }}
            >
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="auth-slide-up" style={{ animationDelay: '0.10s' }}>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-white/25 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(220,38,38,0.60)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
          </div>

          <div className="auth-slide-up" style={{ animationDelay: '0.18s' }}>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type={show ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl text-sm text-white placeholder:text-white/25 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(220,38,38,0.60)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-slide-up w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ animationDelay: '0.26s' }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Sign In <ArrowRight size={15} /></>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <span className="text-xs text-white/30 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-all hover:-translate-y-0.5"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        {/* Links */}
        <div className="flex items-center justify-between mt-6 text-sm">
          <Link to="/signup" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
            Create account
          </Link>
          <Link to="/forgot-password" className="text-white/35 hover:text-white/70 transition-colors">
            Forgot password?
          </Link>
        </div>

        {/* Stats strip */}
        <div
          className="grid grid-cols-3 gap-2 mt-6 pt-5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xs font-bold text-red-400">{s.value}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
