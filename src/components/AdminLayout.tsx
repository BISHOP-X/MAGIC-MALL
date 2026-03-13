import { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom'
import {
  Home, FileText, Package, TrendingUp, Users,
  CreditCard, LogOut, Menu, X, Sun, Moon, LayoutGrid,
} from 'lucide-react'
import Logo from './Logo'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'

export default function AdminLayout() {
  const { dark, toggle } = useTheme()
  const { user, profile, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0c0f1a]">
        <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/signin" replace />
  if (profile?.role !== 'admin') return <Navigate to="/dashboard" replace />

  const sidebarMainLinks = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: FileText, label: 'Manage Logs', path: '/admin/logs' },
    { icon: Package, label: 'Orders', path: '/admin/orders' },
    { icon: TrendingUp, label: 'Manage Profit', path: '/admin/profit' },
    { icon: Users, label: 'Users', path: '/admin/users' },
  ]

  const accountLinks = [
    { icon: CreditCard, label: 'Payment Method', path: '/admin/payments' },
    { icon: LogOut, label: 'Sign Out', path: '/', danger: true },
  ]

  function isActive(path: string) {
    if (!path) return false
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const sidebarContent = (
    <div className="relative z-10 flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <Link to="/"><Logo size="sm" /></Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {sidebarMainLinks.map((link) => (
          <button
            key={link.label}
            onClick={() => { navigate(link.path); setSidebarOpen(false) }}
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
          </button>
        ))}

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

      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={() => { navigate('/dashboard'); setSidebarOpen(false) }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-bold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.98] transition-all duration-200"
        >
          <LayoutGrid size={16} />
          User Section
        </button>
      </div>
    </div>
  )

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
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-orange-500/5 dark:bg-orange-500/5 blur-3xl" />
        </div>
        {sidebarContent}
      </aside>

      <div className="flex-1 min-w-0 scrollbar-hide overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/70 dark:bg-[#0c0f1a]/70 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-700/20">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold tracking-wide shadow-lg shadow-red-500/20">
                ADMIN
              </span>
            </div>

            <div className="lg:hidden flex-1 flex justify-center mx-2">
              <Logo size="sm" />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={toggle} className="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all duration-300 hover:rotate-12">
                {dark ? <Sun size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
              </button>
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
