import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom'

// Shared context type for child routes via useOutletContext
export interface DashboardOutletContext {
  topBarBalance: number | null
  refreshBalance: () => Promise<void>
}
import {
  Home, ShoppingBag, Wallet, HelpCircle, BookOpen,
  HeadphonesIcon, UserCircle, LogOut, Menu, X, Sun, Moon,
  ChevronDown, Shield, Send,
} from 'lucide-react'
import Logo from './Logo'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

const HOW_TO_LOGIN_URL = 'https://drive.google.com/drive/folders/1fuS7l45QWGCzp7CIqHPofiy4L28lsEua'

/* ─── Draggable Telegram Button ─── */
function DraggableTelegramButton() {
  const btnRef = useRef<HTMLAnchorElement>(null)
  const dragging = useRef(false)
  const hasMoved = useRef(false)
  const offset = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const [, forceRender] = useState(0)

  const clamp = useCallback((x: number, y: number) => {
    const size = 48
    return {
      x: Math.max(8, Math.min(window.innerWidth - size - 8, x)),
      y: Math.max(8, Math.min(window.innerHeight - size - 8, y)),
    }
  }, [])

  useEffect(() => {
    pos.current = clamp(window.innerWidth - 60, window.innerHeight - 60)
    forceRender((n) => n + 1)
  }, [clamp])

  const onStart = useCallback((clientX: number, clientY: number) => {
    dragging.current = true
    hasMoved.current = false
    offset.current = { x: clientX - pos.current.x, y: clientY - pos.current.y }
  }, [])

  const onMove = useCallback((clientX: number, clientY: number) => {
    if (!dragging.current) return
    hasMoved.current = true
    pos.current = clamp(clientX - offset.current.x, clientY - offset.current.y)
    if (btnRef.current) {
      btnRef.current.style.left = `${pos.current.x}px`
      btnRef.current.style.top = `${pos.current.y}px`
    }
  }, [clamp])

  const onEnd = useCallback(() => { dragging.current = false }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY)
    const handleTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return
      e.preventDefault()
      onMove(e.touches[0].clientX, e.touches[0].clientY)
    }
    const handleUp = () => onEnd()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleUp)
    }
  }, [onMove, onEnd])

  return (
    <a
      ref={btnRef}
      href="https://t.me/magic_malll"
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => { if (hasMoved.current) e.preventDefault() }}
      onMouseDown={(e) => { e.preventDefault(); onStart(e.clientX, e.clientY) }}
      onTouchStart={(e) => onStart(e.touches[0].clientX, e.touches[0].clientY)}
      className="fixed z-50 w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 cursor-grab active:cursor-grabbing select-none touch-none"
      style={{ left: pos.current.x, top: pos.current.y }}
    >
      <Send size={20} className="text-white -rotate-12 pointer-events-none" />
    </a>
  )
}

/* Product category icons */
const productCategories = [
  {
    label: 'Facebook',
    color: 'bg-blue-50 dark:bg-blue-900/20',
    icon: () => (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="12" fill="#1877F2"/><path d="M16.5 12.05h-2.7v7.95h-3.3v-7.95H8.5V9.3h2v-1.6c0-2.7 1.1-4.2 3.8-4.2h2.3v2.8h-1.4c-1.1 0-1.4.5-1.4 1.3V9.3h2.8l-.6 2.75z" fill="white"/></svg>
    ),
  },
  {
    label: 'Instagram',
    color: 'bg-pink-50 dark:bg-pink-900/20',
    icon: () => (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="ig-mm" x1="0" y1="24" x2="24" y2="0"><stop offset="0%" stopColor="#feda75"/><stop offset="25%" stopColor="#fa7e1e"/><stop offset="50%" stopColor="#d62976"/><stop offset="75%" stopColor="#962fbf"/><stop offset="100%" stopColor="#4f5bd5"/></linearGradient></defs><rect width="24" height="24" rx="12" fill="url(#ig-mm)"/><circle cx="12" cy="12" r="3.5" stroke="white" strokeWidth="1.5" fill="none"/><rect x="5" y="5" width="14" height="14" rx="4" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="17.5" cy="6.5" r="1" fill="white"/></svg>
    ),
  },
  {
    label: 'TikTok',
    color: 'bg-gray-100 dark:bg-gray-800',
    icon: () => (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="12" fill="#010101"/><path d="M16.6 8.2c-.9-.6-1.5-1.6-1.6-2.7h-2.5v10.3c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3 1-2.3 2.3-2.3c.2 0 .5 0 .7.1v-2.6c-.2 0-.5-.1-.7-.1-2.7 0-4.8 2.2-4.8 4.8s2.2 4.8 4.8 4.8 4.8-2.2 4.8-4.8V10c.9.7 2 1 3.2 1V8.5c-.6 0-1.1-.1-1.6-.3z" fill="#25F4EE"/><path d="M17.2 8.2c-.9-.6-1.5-1.6-1.6-2.7h-2v10.3c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3 1-2.3 2.3-2.3c.2 0 .5 0 .7.1v-2.6c-.2 0-.5-.1-.7-.1-2.7 0-4.8 2.2-4.8 4.8s2.2 4.8 4.8 4.8 4.8-2.2 4.8-4.8V10c.9.7 2 1 3.2 1V8.5c-.6 0-1.2-.1-1.7-.3z" fill="#FE2C55"/></svg>
    ),
  },
  {
    label: 'Twitter',
    color: 'bg-sky-50 dark:bg-sky-900/20',
    icon: () => (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="12" fill="#000"/><path d="M13.3 10.8L18.2 5h-1.2l-4.2 4.9L9.3 5H5l5.1 7.4L5 19h1.2l4.5-5.2 3.5 5.2H19l-5.3-7.8.6-.4zm-1.5 1.8l-.5-.7L7 6h1.8l3.4 4.8.5.7L17 18.1H15.2l-3.4-5.1v-.4z" fill="white"/></svg>
    ),
  },
  {
    label: 'Telegram',
    color: 'bg-blue-50 dark:bg-blue-900/20',
    icon: () => (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="12" fill="#229ED9"/><path d="M7.5 12.3l2.3.8 1 3c.1.2.3.3.5.2l1.4-1.2 2.7 2c.3.1.5 0 .6-.3l1.9-9.3c.1-.3-.2-.6-.5-.5l-11.2 4.3c-.3.1-.3.5 0 .6l1.3.4z" fill="white"/></svg>
    ),
  },
  {
    label: 'Web Development',
    color: 'bg-teal-50 dark:bg-teal-900/20',
    icon: () => (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="12" fill="#0D9488"/><path d="M12 4a8 8 0 100 16 8 8 0 000-16zm0 1.5c.5 0 1.2.7 1.7 2.1.2.7.4 1.5.5 2.4H9.8c.1-.9.3-1.7.5-2.4.5-1.4 1.2-2.1 1.7-2.1zM9.6 7c-.3.6-.5 1.3-.6 2H7.2A6.5 6.5 0 019.6 7zm-2.4 3.5h2c0 .5-.1 1-.1 1.5s0 1 .1 1.5h-2a6.4 6.4 0 010-3zm.1 4.5H9c.1.7.3 1.4.6 2a6.5 6.5 0 01-2.4-2zm2.5 0h4.4c-.1.9-.3 1.7-.5 2.4-.5 1.4-1.2 2.1-1.7 2.1s-1.2-.7-1.7-2.1c-.2-.7-.4-1.5-.5-2.4zm4.6 0h1.8a6.5 6.5 0 01-2.4 2c.3-.6.5-1.3.6-2zm2-1.5h-2c0-.5.1-1 .1-1.5s0-1-.1-1.5h2a6.4 6.4 0 010 3zm0-4.5h-1.8c-.1-.7-.3-1.4-.6-2a6.5 6.5 0 012.4 2z" fill="white"/></svg>
    ),
  },
  {
    label: 'VPN',
    color: 'bg-indigo-50 dark:bg-indigo-900/20',
    icon: () => (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="12" fill="#6366F1"/><path d="M12 5C8.7 5 6 7.7 6 11v2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2v-2c0-3.3-2.7-6-6-6zm0 2c2.2 0 4 1.8 4 4v2H8v-2c0-2.2 1.8-4 4-4zm0 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="white"/></svg>
    ),
  },
  {
    label: 'Mails',
    color: 'bg-red-50 dark:bg-red-900/20',
    icon: () => (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="12" fill="#EA4335"/><path d="M5 8l7 5 7-5v8c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1V8zm0-1c0-.6.4-1 1-1h12c.6 0 1 .4 1 1l-7 5-7-5z" fill="white"/></svg>
    ),
  },
  {
    label: 'Movies',
    color: 'bg-amber-50 dark:bg-amber-900/20',
    icon: () => (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="12" fill="#F59E0B"/><path d="M7 6h10c.6 0 1 .4 1 1v10c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1zm0 2v2h2V8H7zm8 0v2h2V8h-2zM7 12v2h2v-2H7zm8 0v2h2v-2h-2zM7 16h2v-1H7v1zm8 0h2v-1h-2v1zm-5-8v8h4V8h-4z" fill="white"/></svg>
    ),
  },
]

export default function DashboardLayout() {
  const { dark, toggle } = useTheme()
  const { user, profile, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [productsExpanded, setProductsExpanded] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [topBarBalance, setTopBarBalance] = useState<number | null>(null)

  const refreshBalance = useCallback(async () => {
    const MAX_RETRIES = 3
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const { data } = await supabase.functions.invoke('wallet', { method: 'GET' })
        if (data?.success) {
          setTopBarBalance(data.wallet?.balance ?? 0)
          return
        }
      } catch {
        // will retry
      }
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, 1500 * Math.pow(2, attempt - 1)))
      }
    }
  }, [])

  useEffect(() => {
    if (!user) return
    refreshBalance()
  }, [user, refreshBalance])

  const onProductsPage = location.pathname.startsWith('/dashboard/products')

  useEffect(() => {
    if (onProductsPage && !productsExpanded) setProductsExpanded(true)
  }, [onProductsPage]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0c0f1a]">
        <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/signin" replace />

  const sidebarMainLinks = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: ShoppingBag, label: 'Products', expandable: true, expandKey: 'products', path: '' },
    { icon: ShoppingBag, label: 'My Orders', path: '/dashboard/orders' },
    { icon: Wallet, label: 'Add Funds', path: '/dashboard/add-funds' },
    { icon: HelpCircle, label: 'How to Login', path: '', external: HOW_TO_LOGIN_URL },
    { icon: BookOpen, label: 'Rules', path: '/dashboard/rules' },
    { icon: HeadphonesIcon, label: 'Customer Care', path: '/dashboard/support' },
  ]

  const accountLinks = [
    { icon: UserCircle, label: 'Profile', path: '/dashboard/profile' },
    { icon: LogOut, label: 'Sign Out', path: '/', danger: true },
  ]

  function isActive(path: string) {
    if (!path) return false
    if (path === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(path)
  }

  function handleNavClick(link: typeof sidebarMainLinks[0]) {
    if (link.external) {
      window.open(link.external, '_blank', 'noopener,noreferrer')
      return
    }
    if (link.expandable) {
      setProductsExpanded(!productsExpanded)
      return
    }
    if (link.path) {
      navigate(link.path)
      setSidebarOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c0f1a] flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-[fadeIn_0.2s_ease-out]" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-72
        bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl
        border-r border-gray-200/80 dark:border-gray-700/30
        transform transition-transform duration-300 ease-in-out
        scrollbar-hide overflow-y-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-red-500/5 dark:bg-red-500/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-rose-500/5 dark:bg-rose-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <Link to="/"><Logo size="sm" /></Link>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-0.5">
            {sidebarMainLinks.map((link) => (
              <div key={link.label}>
                <button
                  onClick={() => handleNavClick(link)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 text-red-700 dark:text-red-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-colors ${isActive(link.path) ? 'bg-red-100 dark:bg-red-900/40' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <link.icon size={16} />
                  </div>
                  {link.label}
                  {link.expandable && (
                    <ChevronDown size={14} className={`ml-auto transition-transform duration-300 ${productsExpanded ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {link.expandable && (
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${productsExpanded ? 'max-h-[600px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                    <div className="ml-2 space-y-0.5">
                      {productCategories.map((cat) => (
                        <button
                          key={cat.label}
                          onClick={() => { navigate(`/dashboard/products?cat=${cat.label.toLowerCase().replace(' ', '-')}`); setSidebarOpen(false) }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white transition-all ${cat.color} bg-opacity-50`}
                        >
                          <cat.icon />
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {profile?.role === 'admin' && (
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => { navigate('/admin'); setSidebarOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 text-red-700 dark:text-red-400 hover:shadow-sm"
                >
                  <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/40">
                    <Shield size={16} />
                  </div>
                  Admin Panel
                </button>
              </div>
            )}

            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-2 px-3">Account</p>
              {accountLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    if (link.danger) {
                      signOut().then(() => navigate('/'))
                    } else {
                      navigate(link.path)
                    }
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    link.danger
                      ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10'
                      : isActive(link.path)
                        ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 text-red-700 dark:text-red-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${link.danger ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <link.icon size={16} />
                  </div>
                  {link.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </aside>

      <div className="flex-1 min-w-0 scrollbar-hide overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/70 dark:bg-[#0c0f1a]/70 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-700/20">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-[11px] sm:text-sm font-bold shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 active:scale-95 transition-all duration-200"
                >
                  <span className="hidden xs:inline">Select a category</span>
                  <span className="xs:hidden">Category</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${categoryOpen ? 'rotate-180' : ''}`} />
                </button>

                {categoryOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setCategoryOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden animate-[fadeSlideUp_0.2s_ease-out]">
                      <div className="max-h-[70vh] overflow-y-auto scrollbar-hide py-1">
                        {productCategories.map((cat) => (
                          <button
                            key={cat.label}
                            onClick={() => { navigate(`/dashboard/products?cat=${cat.label.toLowerCase().replace(' ', '-')}`); setCategoryOpen(false) }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all duration-150 group"
                          >
                            <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                              <cat.icon />
                            </div>
                            <span className="flex-1 text-left">{cat.label}</span>
                            <ChevronDown size={14} className="-rotate-90 text-gray-400 group-hover:text-red-500 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="lg:hidden flex-1 flex justify-center mx-2">
              <Logo size="sm" />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={toggle} className="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all duration-300 hover:rotate-12">
                {dark ? <Sun size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
              </button>
              <div className="hidden sm:flex items-center gap-2 text-sm bg-gray-100/80 dark:bg-gray-800/80 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/30">
                <span className="text-gray-500 dark:text-gray-400">Balance:</span>
                <span className="font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  {topBarBalance === null ? '—' : `NGN ${(topBarBalance / 100).toLocaleString()}`}
                </span>
              </div>
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 max-w-6xl mx-auto">
          <Outlet context={{ topBarBalance, refreshBalance } satisfies DashboardOutletContext} />
        </main>
      </div>

      <DraggableTelegramButton />
    </div>
  )
}
