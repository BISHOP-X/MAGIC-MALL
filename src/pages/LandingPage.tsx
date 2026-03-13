import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, ShoppingBag, Users, Shield, Zap } from 'lucide-react'
import Logo from '@/components/Logo'

/* ─── Platform SVG Icons ─── */
const FacebookIcon = ({ className = 'w-10 h-10' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#1877F2" />
    <path d="M16.5 12.05h-2.7v7.95h-3.3v-7.95H8.5V9.3h2v-1.6c0-2.7 1.1-4.2 3.8-4.2h2.3v2.8h-1.4c-1.1 0-1.4.5-1.4 1.3V9.3h2.8l-.6 2.75z" fill="white" />
  </svg>
)

const InstagramIcon = ({ className = 'w-10 h-10' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="ig-land" x1="0" y1="24" x2="24" y2="0">
        <stop offset="0%" stopColor="#feda75" />
        <stop offset="25%" stopColor="#fa7e1e" />
        <stop offset="50%" stopColor="#d62976" />
        <stop offset="75%" stopColor="#962fbf" />
        <stop offset="100%" stopColor="#4f5bd5" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#ig-land)" />
    <circle cx="12" cy="12" r="3.5" stroke="white" strokeWidth="1.5" fill="none" />
    <rect x="5" y="5" width="14" height="14" rx="4" stroke="white" strokeWidth="1.5" fill="none" />
    <circle cx="17.5" cy="6.5" r="1" fill="white" />
  </svg>
)

const TwitterIcon = ({ className = 'w-10 h-10' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#000" />
    <path d="M13.3 10.8L18.2 5h-1.2l-4.2 4.9L9.3 5H5l5.1 7.4L5 19h1.2l4.5-5.2 3.5 5.2H19l-5.3-7.8.6-.4zm-1.5 1.8l-.5-.7L7 6h1.8l3.4 4.8.5.7L17 18.1H15.2l-3.4-5.1v-.4z" fill="white" />
  </svg>
)

const GmailIcon = ({ className = 'w-10 h-10' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#EA4335" />
    <path d="M5 8l7 5 7-5v8c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1V8zm0-1c0-.6.4-1 1-1h12c.6 0 1 .4 1 1l-7 5-7-5z" fill="white" />
  </svg>
)

const TikTokIcon = ({ className = 'w-10 h-10' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#010101" />
    <path d="M16.6 8.2c-.9-.6-1.5-1.6-1.6-2.7h-2.5v10.3c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3 1-2.3 2.3-2.3c.2 0 .5 0 .7.1v-2.6c-.2 0-.5-.1-.7-.1-2.7 0-4.8 2.2-4.8 4.8s2.2 4.8 4.8 4.8 4.8-2.2 4.8-4.8V10c.9.7 2 1 3.2 1V8.5c-.6 0-1.1-.1-1.6-.3z" fill="#25F4EE" />
    <path d="M17.2 8.2c-.9-.6-1.5-1.6-1.6-2.7h-2v10.3c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3 1-2.3 2.3-2.3c.2 0 .5 0 .7.1v-2.6c-.2 0-.5-.1-.7-.1-2.7 0-4.8 2.2-4.8 4.8s2.2 4.8 4.8 4.8 4.8-2.2 4.8-4.8V10c.9.7 2 1 3.2 1V8.5c-.6 0-1.2-.1-1.7-.3z" fill="#FE2C55" />
  </svg>
)

const VpnIcon = ({ className = 'w-10 h-10' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#6366F1" />
    <path d="M12 5C8.7 5 6 7.7 6 11v2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2v-2c0-3.3-2.7-6-6-6zm0 2c2.2 0 4 1.8 4 4v2H8v-2c0-2.2 1.8-4 4-4zm0 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="white" />
  </svg>
)

type Category = { name: string; Icon: React.FC<{ className?: string }>; count: string; iconBg: string }

const categories: Category[] = [
  { name: 'Facebook', Icon: FacebookIcon, count: '500+ accounts', iconBg: 'rgba(24,119,242,0.15)' },
  { name: 'Instagram', Icon: InstagramIcon, count: '300+ accounts', iconBg: 'rgba(214,41,118,0.15)' },
  { name: 'Twitter / X', Icon: TwitterIcon, count: '200+ accounts', iconBg: 'rgba(255,255,255,0.08)' },
  { name: 'Gmail', Icon: GmailIcon, count: '400+ accounts', iconBg: 'rgba(234,67,53,0.15)' },
  { name: 'TikTok', Icon: TikTokIcon, count: '150+ accounts', iconBg: 'rgba(254,44,85,0.12)' },
  { name: 'VPN & Tools', Icon: VpnIcon, count: '50+ tools', iconBg: 'rgba(99,102,241,0.15)' },
]

const features = [
  { icon: Shield, title: 'Verified Accounts', desc: 'Every account is tested and verified before listing.' },
  { icon: Zap, title: 'Instant Delivery', desc: 'Credentials delivered instantly after payment confirmation.' },
  { icon: Users, title: '10,000+ Customers', desc: 'Trusted by thousands of happy buyers worldwide.' },
  { icon: ShoppingBag, title: 'Wide Selection', desc: 'Hundreds of digital accounts across dozens of platforms.' },
]

const glassCard = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.13)',
  borderRadius: '1rem',
}

const glassCardDark = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '1rem',
}

export default function LandingPage() {
  return (
    <div
      className="min-h-screen text-white relative overflow-x-hidden"
      style={{
        background: 'radial-gradient(ellipse at 20% 10%, rgba(220,38,38,0.25) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(244,63,94,0.20) 0%, transparent 55%), #0d0d14',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '-120px', left: '-120px', width: '480px', height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220,38,38,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: '-100px', right: '-100px', width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />

      {/* Navbar */}
      <nav
        className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 mx-3 sm:mx-8 mt-3 sm:mt-4 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        <Logo size="default" />
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/signin"
            className="hidden sm:block px-4 py-2 rounded-xl text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signin"
            className="sm:hidden px-3 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-lg shadow-red-500/30 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Sign Up</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-4 pt-14 pb-12 sm:pt-28 sm:pb-24 max-w-4xl mx-auto">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 sm:mb-6"
          style={{
            background: 'rgba(220,38,38,0.15)',
            border: '1px solid rgba(220,38,38,0.30)',
            color: '#fca5a5',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          Premium Digital Accounts Marketplace
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-5 sm:mb-6 leading-tight">
          Buy Premium
          <span
            className="block"
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #fb7185 50%, #f43f5e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
            }}
          >
            Digital Accounts
          </span>
          <span className="text-white/90">Instantly</span>
        </h1>

        <p className="text-base sm:text-xl text-white/60 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
          Access verified social media accounts, emails, and digital tools. Secure checkout, instant delivery, and 24/7 support.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-2 sm:px-0">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
          >
            Create Free Account
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/signin"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-medium text-white/80 hover:text-white transition-colors"
            style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            Sign In
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 text-xs sm:text-sm text-white/50">
          {['Instant Delivery', 'Verified Accounts', 'Secure Payments', '24/7 Support'].map(badge => (
            <span key={badge} className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-red-400" />
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="relative z-10 px-4 py-12 sm:py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-3">Browse Categories</h2>
        <p className="text-white/50 text-center mb-8 sm:mb-10 text-sm sm:text-base">Hundreds of accounts across popular platforms</p>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map(cat => (
            <Link
              to="/signup"
              key={cat.name}
              className="flex flex-col items-center gap-2.5 p-3 sm:p-5 text-center hover:scale-[1.04] active:scale-[0.97] transition-all duration-200 group"
              style={glassCard}
            >
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                style={{ background: cat.iconBg }}
              >
                <cat.Icon className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-white/90 leading-tight group-hover:text-white transition-colors">{cat.name}</span>
              <span className="text-[10px] sm:text-xs text-red-400 font-medium">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-4 py-12 sm:py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-3">Why Magic Mall?</h2>
        <p className="text-white/50 text-center mb-8 sm:mb-10 text-sm sm:text-base">Built for speed, security, and reliability</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {features.map(f => (
            <div key={f.title} className="p-5 sm:p-6" style={glassCardDark}>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.30), rgba(244,63,94,0.20))' }}
              >
                <f.icon size={22} className="text-red-400" />
              </div>
              <h3 className="font-semibold text-white mb-1.5">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 py-12 sm:py-20 max-w-3xl mx-auto text-center">
        <div
          className="p-6 sm:p-10 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(220,38,38,0.18) 0%, rgba(244,63,94,0.12) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(220,38,38,0.25)',
          }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to get started?</h2>
          <p className="text-white/60 mb-8">
            Create a free account and start browsing premium digital accounts today.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-xl shadow-red-500/30 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Create Free Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Magic Mall. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
